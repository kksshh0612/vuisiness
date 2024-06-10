"use client";

import KakaoMap from "@/components/kakaomap/kakao-map";
import { IStore } from "@/types/commercial_district";
import { getKakaoCoordsToDistrict } from "@/components/region-info/get-coords2district";
import { getNearbyComDistrict } from "@/_actions/commercial_district/getNearbyComDistrict";
import TopCommercialDistrictChart from "../../components/top-commercial-district-chart";
import PopulationChart from "@/components/population-chart";
import SalesByDemographicsChart from "@/components/sales-by-demographics-chart";
import { useRecoilState } from "recoil";
import { centerPositionState, hangjeongDongState } from "@/atoms";
import { useEffect, useState } from "react";
import CategoryList from "../../components/category-list/category-list";
import PopulationRestaurantsChart from "@/components/popular-restaurants-chart";
import WeekendsPopularAreasByComDistrictChart from "../../components/weekends-popular-areas-by-commercial-district";
import RestaurantCountSalesCorrelationChart from "@/components/restaurant-count-sales-correlation-chart";

export default function MapPage() {
  const [centerPosition, setCenterPosition] =
    useRecoilState(centerPositionState);
  const [hangjeongDong, setHangjeongDong] = useRecoilState(hangjeongDongState);
  const [nearbyComDistrict, setNearbyComDistrict] = useState([]);
  const [nearbyStores, setNearbyStores] = useState([]);
  const [selectedAgeIdx, setSelectedAgeIdx] = useState();
  const [selectedGenderIdx, setSelectedGenderIdx] = useState();

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
    if (centerPosition) {
      (async () => {
        const { data: regionMetaData, error } = await getKakaoCoordsToDistrict(
          centerPosition
        );
        if (regionMetaData) {
          setHangjeongDong(regionMetaData.documents[1]);
        } else {
          console.error(error);
        }
      })();
    }
  }, [centerPosition, setHangjeongDong]);

  // 중심 위치가 변경될 때마다 주변 상권 정보 가져옴
  useEffect(() => {
    if (centerPosition) {
      (async () => {
        const { data: nearbyComDistrictData, errMsg } =
          await getNearbyComDistrict(centerPosition);

        if (nearbyComDistrictData) {
          setNearbyComDistrict(nearbyComDistrictData);
          // 데이터를 평탄화(flatten)하여 저장
          const storesData: IStore[] = nearbyComDistrictData.flatMap(
            (category: any) =>
              category.smallCategories.flatMap(
                (smallCategory: any) => smallCategory.stores
              )
          );
          setNearbyStores(storesData);
        } else {
          console.error(errMsg);
        }
      })();
    }
  }, [centerPosition]);

  return (
    <>
      {/* 지도 표시 영역 */}
      <KakaoMap markerItems={nearbyStores} />
      {/* 통계 영역 */}
      <div
        className={
          "ContentWrapper bg-white p-4 absolute bottom-0 z-20 w-full h-[20rem]"
        }
      >
        <CategoryList nearbyComDistrict={nearbyComDistrict} />
        <WeekendsPopularAreasByComDistrictChart />
        <TopCommercialDistrictChart />
        <PopulationRestaurantsChart />
        <PopulationChart
          setSelectedAgeIdx={setSelectedAgeIdx}
          setSelectedGenderIdx={setSelectedGenderIdx}
        />
        <SalesByDemographicsChart
          selectedAgeIdx={selectedAgeIdx}
          selectedGenderIdx={selectedGenderIdx}
        />
        <RestaurantCountSalesCorrelationChart />
      </div>
    </>
  );
}
