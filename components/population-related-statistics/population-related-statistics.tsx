import { useRecoilValue } from "recoil";
import PopulationChart from "./population-by-hour-chart";
import SalesByDemographicsChart from "../sales-by-demographics-chart";
import { hangjeongDongState } from "@/recoil/atoms";
import PopulationByHourChart from "./population-by-hour-chart";
import PopulationInnerHour from "./population-inner-hour";

export default function PopulationRelatedStatistics() {
  const hangjeongDong = useRecoilValue(hangjeongDongState);

  return (
    <>
      {hangjeongDong && <PopulationByHourChart />}
      <PopulationInnerHour />
      <SalesByDemographicsChart />
    </>
  );
}
