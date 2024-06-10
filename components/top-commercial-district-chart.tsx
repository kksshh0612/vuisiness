"use client";

import DoughnutChart from "@/components/chart/doughnut-chart";
import { hangjeongDongState } from "@/atoms";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { getNearbyTopComCategories } from "@/_actions/getNearbyTopComCategories";
import { sliceHangjeongDongCode } from "@/utils/slice-hangjeong-dong-code";
import { concatHangjeongDongName } from "@/utils/concat-hangjeong-dong-name";
import { ITopCommercialDistrict } from "@/types/commercial_district";

// 인기 업종 차트 섹션
export default function TopCommercialDistrictChart() {
  const hangjeongDong = useRecoilValue(hangjeongDongState);
  const [topComDistrictCategories, setTopComDistrictCategories] = useState<
    ITopCommercialDistrict[]
  >([]);

  // 중심 위치가 변경될 때마다 상위 상권 분류 정보 받아옴
  useEffect(() => {
    if (hangjeongDong) {
      (async () => {
        const { data, error } = await getNearbyTopComCategories(
          sliceHangjeongDongCode(hangjeongDong?.code)
        );
        if (data) {
          setTopComDistrictCategories(data);
        } else {
          console.error(error);
        }
      })();
    }
  }, [hangjeongDong]);

  return (
    <section className={"PopulationChartWrapper w-full overflow-auto"}>
      <label className={"my-4 font-semibold text-[1.2rem]"}>
        {concatHangjeongDongName(hangjeongDong)}의 인기 업종
      </label>
      <div className="w-full flex flex-col items-center gap-1">
        <DoughnutChart
          label={"상가 갯수"}
          labels={topComDistrictCategories.map(
            (category) => category.standardCategory
          )}
          data={topComDistrictCategories.map((category) => category.count)}
          unit={"개"}
        />
      </div>
    </section>
  );
}
