"use client";

import { getSalesByDemographics } from "@/_actions/getSalesByDemographics";
import {
  hangjeongDongState,
  selectedAgeIdxState,
  selectedGenderIdxState,
  selectedHourIdxState,
} from "@/recoil/atoms";
import {
  concatHangjeongDongName,
  extractSiGunGuName,
} from "@/utils/concat-hangjeong-dong-name";
import { translateGender2Code } from "@/utils/translate-gender-to-code";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import PolarAreaChart from "@/components/chart/polararea-chart";

// // 행정동 내 특정 성별, 나이 카드사용 통계 차트
// interface ISalesByDemographicsChartProps {
//   selectedAgeIdx: number;
//   selectedGenderIdx: string;
// }
export default function SalesByDemographicsChart() {
  const selectedAgeIdx = useRecoilValue(selectedAgeIdxState);
  const selectedGenderIdx = useRecoilValue(selectedGenderIdxState);
  const [salesByDemographics, setSalesByDemographics] = useState([]);
  const hangjeongDong = useRecoilValue(hangjeongDongState);

  useEffect(() => {
    (async () => {
      if (selectedAgeIdx && selectedGenderIdx) {
        const { data: salesByDemographicsData, error } =
          await getSalesByDemographics({
            siGunGuName: extractSiGunGuName(hangjeongDong),
            genderCode: translateGender2Code(selectedGenderIdx),
            ageCode: selectedAgeIdx * 10,
          });
        setSalesByDemographics(salesByDemographicsData);
      }
    })();
  }, [hangjeongDong, selectedAgeIdx, selectedGenderIdx]);

  return (
    <section className={"SalesChartWrapper w-full overflow-auto"}>
      {selectedAgeIdx && selectedGenderIdx && (
        <>
          <label className={"font-semibold my-[2rem] text-[1.2rem]"}>
            {concatHangjeongDongName(hangjeongDong)}의 {selectedAgeIdx * 10}대
            {selectedGenderIdx}의 카드 사용 금액 상위
          </label>
          <div className="w-full">
            <PolarAreaChart
              labels={salesByDemographics?.map(
                (sales) => sales._id.smallCategory
              )}
              label={"카드 사용금액 합계"}
              data={salesByDemographics?.map((sales) => sales.sumOfConsumption)}
            />
          </div>
        </>
      )}
    </section>
  );
}
