"use client";

import { getSalesByDemographics } from "@/_actions/getSalesByDemographics";
import { hangjeongDongState } from "@/atoms";
import {
  concatHangjeongDongName,
  extractSiGunGuName,
} from "@/utils/concat-hangjeong-dong-name";
import { translateGender2Code } from "@/utils/translate-gender-to-code";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import PolarAreaChart from "@/components/chart/polararea-chart";

// 행정동 내 특정 성별, 나이 카드사용 통계 차트
interface ISalesByDemographicsChartProps {
  selectedAgeIdx: number;
  selectedGenderIdx: string;
}
export default function SalesByDemographicsChart({
  selectedAgeIdx,
  selectedGenderIdx,
}: ISalesByDemographicsChartProps) {
  const [age, setAge] = useState<number>();
  const [gender, setGender] = useState<number>();
  const [salesByDemographics, setSalesByDemographics] = useState([]);
  const hangjeongDong = useRecoilValue(hangjeongDongState);

  useEffect(() => {
    setAge(selectedAgeIdx * 10);
    setGender(translateGender2Code(selectedGenderIdx));
    (async () => {
      if (selectedAgeIdx && selectedGenderIdx) {
        const { data: salesByDemographicsData, error } =
          await getSalesByDemographics({
            siGunGuName: extractSiGunGuName(hangjeongDong),
            genderCode: gender,
            ageCode: age,
          });
        setSalesByDemographics(salesByDemographicsData);
      }
    })();
  }, [hangjeongDong, selectedAgeIdx, selectedGenderIdx, age, gender]);

  return (
    <section className={"SalesChartWrapper w-full overflow-auto"}>
      <label className={"font-semibold my-[2rem] text-[1.2rem]"}>
        {concatHangjeongDongName(hangjeongDong)}의 {age}대 {selectedGenderIdx}의
        카드 사용 금액 상위
      </label>
      <div className="w-full">
        <PolarAreaChart
          labels={salesByDemographics?.map((sales) => sales._id.smallCategory)}
          label={"카드 사용금액 합계"}
          data={salesByDemographics?.map((sales) => sales.sumOfConsumption)}
        />
      </div>
    </section>
  );
}
