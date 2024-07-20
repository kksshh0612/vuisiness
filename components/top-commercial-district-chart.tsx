"use client";

import DoughnutChart from "@/components/chart/doughnut-chart";
import { useEffect, useState, memo } from "react";
import { useRecoilValue } from "recoil";
import { getNearbyTopComCategories } from "@/_actions/getNearbyTopComCategories";
import { ITopCommercialDistrict } from "@/types/commercial_district";
import {
  hangjeongDongCodeSelector,
  hangjeongDongNameSelector,
} from "@/recoil/selector";

// 인기 업종 차트 섹션
export default memo(function TopCommercialDistrictChart() {
  const hangjeongDongCode = useRecoilValue(hangjeongDongCodeSelector);
  const hangjeongDongName = useRecoilValue(hangjeongDongNameSelector);
  const [topComDistrictCategories, setTopComDistrictCategories] = useState<
    ITopCommercialDistrict[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  console.log("dd");
  // 행정동 코드가 변경될 때마다 상위 상권 분류 정보 받아옴
  useEffect(() => {
    if (hangjeongDongCode) {
      (async () => {
        setIsLoading(true);
        const { data, error } = await getNearbyTopComCategories(
          hangjeongDongCode
        );
        if (data) {
          setTopComDistrictCategories(data);
          setIsLoading(false);
        } else {
          console.error(error);
        }
      })();
    }
  }, [hangjeongDongCode]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className={"PopulationChartWrapper w-full overflow-auto"}>
      {hangjeongDongCode && topComDistrictCategories && (
        <>
          <label className={"my-4 font-semibold text-[1.2rem]"}>
            {hangjeongDongName}의 인기 업종
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
        </>
      )}
    </section>
  );
});
