import { useRecoilValue } from "recoil";
import SalesByDemographicsChart from "../sales-by-demographics-chart";
import {
  hangjeongDongState,
  selectedAgeIdxState,
  selectedGenderIdxState,
  selectedHourIdxState,
} from "@/recoil/atoms";
import PopulationByHourChart from "./population-by-hour-chart";
import PopulationInnerHour from "./population-inner-hour";

export default function PopulationRelatedStatistics() {
  const hangjeongDong = useRecoilValue(hangjeongDongState);

  if (!hangjeongDong) {
    return <h1>선택된 행정동이 없습니다. 지도 위에 마커를 표시해주세요.</h1>;
  }
  return (
    <>
      <PopulationByHourChart />
      <PopulationInnerHour />
      <SalesByDemographicsChart />
    </>
  );
}
