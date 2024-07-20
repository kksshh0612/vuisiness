"use client";

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  centerPositionState,
  hangjeongDongState,
  selectedAgeIdxState,
  selectedGenderIdxState,
  selectedHourIdxState,
} from "@/recoil/atoms";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import useKakaoLoader from "@/components/kakao-loader/use-kakao-loader";
import { nearbyStoresSelector } from "@/recoil/selector";
import { useEffect } from "react";
import { getKakaoCoordsToDistrict } from "../region-info/get-coords2district";

// 카카오맵
export default function KakaoMap() {
  useKakaoLoader();

  const markerItems = useRecoilValue(nearbyStoresSelector);
  const [centerPosition, setCenterPosition] =
    useRecoilState(centerPositionState);
  const [hangjeongDong, setHangjeongDong] = useRecoilState(hangjeongDongState);
  const setSelectedHourIdx = useSetRecoilState(selectedHourIdxState);
  const setSelectedAgeIdx = useSetRecoilState(selectedAgeIdxState);
  const setSelectedGenderIdx = useSetRecoilState(selectedGenderIdxState);

  // 현재 위치 받아옴
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenterPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error obtaining location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [setCenterPosition]);

  // 중심 위치가 변경될 때마다 행정동 정보 받아옴
  useEffect(() => {
    if (centerPosition.lat !== null && centerPosition.lng !== null) {
      (async () => {
        const { data: regionMetaData, error } = await getKakaoCoordsToDistrict(
          centerPosition
        );
        if (regionMetaData) {
          const newHangjeongDong = regionMetaData.documents[1];
          // 기존 hangjeongDong 값과 비교하여 값이 변경되었을 때만 업데이트
          if (!hangjeongDong || hangjeongDong.code !== newHangjeongDong.code) {
            setHangjeongDong(newHangjeongDong);
            setSelectedHourIdx(null);
            setSelectedAgeIdx(null);
            setSelectedGenderIdx(null);
          }
        } else {
          console.error(error);
        }
      })();
    }
  }, [
    centerPosition,
    hangjeongDong,
    setHangjeongDong,
    setSelectedHourIdx,
    setSelectedAgeIdx,
    setSelectedGenderIdx,
  ]);

  return (
    <Map
      id="map"
      center={centerPosition}
      style={{
        width: "100%",
        height: "100vh",
      }}
      level={3}
      onClick={(_, mouseEvent) => {
        const latlng = mouseEvent.latLng;
        setCenterPosition({
          lat: latlng.getLat(),
          lng: latlng.getLng(),
        });
      }}
    >
      <MapMarker position={centerPosition} />
      {markerItems.map((markerItem, index) => {
        return (
          <MapMarker
            key={`${markerItem.location}-${index}`}
            position={{
              lat: markerItem.location[1],
              lng: markerItem.location[0],
            }} // 마커를 표시할 위치
            image={{
              src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png", // 마커이미지의 주소입니다
              size: {
                width: 21,
                height: 30,
              }, // 마커이미지의 크기입니다
            }}
            title={markerItem.storeName} // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          />
        );
      })}
    </Map>
  );
}
