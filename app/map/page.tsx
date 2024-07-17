"use client";

import KakaoMap from "@/components/kakaomap/kakao-map";
import TopCommercialDistrictChart from "../../components/top-commercial-district-chart";
import { useRecoilValue } from "recoil";
import { hangjeongDongState } from "@/recoil/atoms";
import CategoryList from "../../components/category-list/category-list";
import PopulationChart from "@/components/population-chart";
import SalesByDemographicsChart from "@/components/sales-by-demographics-chart";
import PopulationRestaurantsChart from "@/components/popular-restaurants-chart";
import WeekendsPopularAreasByComDistrictChart from "../../components/weekends-popular-areas-by-commercial-district";
import RestaurantCountSalesCorrelationChart from "@/components/restaurant-count-sales-correlation-chart";

// 지도상 현위치 기반 상권 분석 페이지
export default function MapPage() {
  const hangjeongDong = useRecoilValue(hangjeongDongState);
  // const [selectedAgeIdx, setSelectedAgeIdx] = useState();
  // const [selectedGenderIdx, setSelectedGenderIdx] = useState();

  return (
    <>
      {/* 지도 표시 영역 */}
      <KakaoMap />
      <div
        className={
          "ContentWrapper bg-white p-4 absolute bottom-0 z-20 w-full h-[20rem]"
        }
      >
        <CategoryList />
        {hangjeongDong && <TopCommercialDistrictChart />}
        {/* <PopulationRestaurantsChart /> */}
        {/* <WeekendsPopularAreasByComDistrictChart />
          <PopulationChart
            setSelectedAgeIdx={setSelectedAgeIdx}
            setSelectedGenderIdx={setSelectedGenderIdx}
          />
          <SalesByDemographicsChart
            selectedAgeIdx={selectedAgeIdx}
            selectedGenderIdx={selectedGenderIdx}
          />
          <RestaurantCountSalesCorrelationChart /> */}
      </div>
    </>
  );
}
