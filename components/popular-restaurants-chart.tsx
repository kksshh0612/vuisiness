import { getPopularRestaurants } from "@/_actions/getPopularRestaurants";
import { hangjeongDongState } from "@/atoms";
import { concatHangjeongDongName } from "@/utils/concat-hangjeong-dong-name";
import { sliceHangjeongDongCode } from "@/utils/slice-hangjeong-dong-code";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import RadarChart from "@/components/chart/radar-chart";

// 평일 점심 인기 식당 정보 차트
export default function PopulationRestaurantsChart() {
  const hangjeongDong = useRecoilValue(hangjeongDongState);
  const [popularRestaurants, setPopularRestaurants] = useState([]);
  useEffect(() => {
    (async () => {
      if (hangjeongDong) {
        const { data: popularRestaurants, error } = await getPopularRestaurants(
          sliceHangjeongDongCode(hangjeongDong?.code)
          // 11650621
        );
        setPopularRestaurants(popularRestaurants);
      }
    })();
  }, [hangjeongDong]);

  return (
    <>
      <section className={"PopulationChartWrapper w-full overflow-auto"}>
        <label className={"font-semibold my-[3rem] text-[1.1rem]"}>
          평일 점심 인기 식당
          <div className="text-[0.9rem]">
            {concatHangjeongDongName(hangjeongDong)}
          </div>
        </label>
        <div className={"w-full overflow-auto"}>
          <div className={"flex flex-row gap-2"}>
            <RadarChart
              labels={popularRestaurants?.map((restaurant) => restaurant._id)}
              label={"상가 갯수"}
              data={popularRestaurants?.map(
                (restaurant) => restaurant.matchingDistricts.length
              )}
            />
          </div>
        </div>
      </section>
    </>
  );
}
