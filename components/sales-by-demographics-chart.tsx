"use client";

import { getSalesByDemographics } from "@/_actions/getSalesByDemographics";
import {
  hangjeongDongState,
  selectedAgeIdxState,
  selectedGenderIdxState,
} from "@/recoil/atoms";
import { translateGender2Code } from "@/utils/translate-gender-to-code";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import PolarAreaChart from "@/components/chart/polararea-chart";
import {
  hangjeongDongNameSelector,
  SiGunGuNameSelector,
} from "@/recoil/selector";

// 특정 성별, 나이의 카드 사용 금액 차트
export default function SalesByDemographicsChart() {
  const selectedAgeIdx = useRecoilValue(selectedAgeIdxState);
  const selectedGenderIdx = useRecoilValue(selectedGenderIdxState);
  const [salesByDemographics, setSalesByDemographics] = useState([]);
  const hangjeongDongName = useRecoilValue(hangjeongDongNameSelector);
  const siGunGuName = useRecoilValue(SiGunGuNameSelector);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (selectedAgeIdx && selectedGenderIdx) {
        setIsLoading(true);
        const { data: salesByDemographicsData, error } =
          await getSalesByDemographics({
            siGunGuName: siGunGuName,
            genderCode: translateGender2Code(selectedGenderIdx),
            ageCode: selectedAgeIdx * 10,
          });
        setSalesByDemographics(salesByDemographicsData);
        setIsLoading(false);
      }
    })();
  }, [siGunGuName, selectedAgeIdx, selectedGenderIdx]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className={"SalesChartWrapper w-full overflow-auto"}>
      {selectedAgeIdx && selectedGenderIdx && (
        <>
          <label className={"font-semibold my-[2rem] text-[1.2rem]"}>
            {hangjeongDongName}의 {selectedAgeIdx * 10}대{selectedGenderIdx}의
            카드 사용 금액 상위
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
