"use client";

import ScatterChart from "@/components/chart/scatter-chart";
import { hangjeongDongState } from "@/atoms";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { getRestaurantCountSales } from "@/_actions/getRestaurantCountSales";

// 식당 갯수 매출 상관관계 차트 섹션
export default function RestaurantCountSalesCorrelationChart() {
  const hangjeongDong = useRecoilValue(hangjeongDongState);
  const [restaurantCountSales, setRestaurantCountSales] = useState([]);

  // 중심 위치가 변경될 때마다 상위 상권 분류 정보 받아옴
  useEffect(() => {
    if (hangjeongDong) {
      (async () => {
        const { data: restaurantCountSalesData, error } =
          await getRestaurantCountSales("마포구");
        if (restaurantCountSalesData) {
          setRestaurantCountSales(restaurantCountSalesData);
        } else {
          console.error(error);
        }
      })();
    }
  }, [hangjeongDong]);

  const labels = restaurantCountSales.map((restaurant) => restaurant._id);
  const data = restaurantCountSales.map((restaurant) => ({
    x: restaurant.itemSize,
    y: restaurant.avgConsumption,
  }));

  return (
    <section className={"PopulationChartWrapper w-full overflow-auto"}>
      <label className={"my-4 font-semibold text-[1.2rem]"}>
        마포구의 식당 개수와 카드 매출 상관관계
      </label>
      <div className="w-full flex flex-col items-center gap-1">
        <ScatterChart label={"업종"} labels={labels} data={data} />
      </div>
    </section>
  );
}
