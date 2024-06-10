"use client";

import { useRecoilState } from "recoil";
import { centerPositionState } from "@/atoms";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import useKakaoLoader from "@/components/kakao-loader/use-kakao-loader";

export default function KakaoMap({ markerItems }) {
  useKakaoLoader();
  const [centerPosition, setCenterPosition] =
    useRecoilState(centerPositionState);

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
