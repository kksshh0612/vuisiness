import { useEffect, useState } from "react";
import PieChart from "@/components/chart/pie-chart";
import { getWeekendsPopularAreasByComDistrict } from "@/_actions/getWeekendsPopularAreasByComDistrict";

// 주말 생활 인구 밀집 지역 내 특정 상권 통계를 보여주는 차트
export default function WeekendsPopularAreasByComDistrictChart() {
  const [popularAreas, setPopularAreas] = useState([]);
  const [commercialDistrict, setCommercialDistrict] = useState("숙박");

  useEffect(() => {
    (async () => {
      if (commercialDistrict) {
        const { data: popularAreasData, error } =
          await getWeekendsPopularAreasByComDistrict(commercialDistrict);
        setPopularAreas(popularAreasData);
      }
    })();
  }, [commercialDistrict]);

  return (
    <>
      <section className={"PopulationChartWrapper my-6 w-full overflow-auto"}>
        <h1 className={"font-semibold my-[2rem] text-[1.2rem]"}>
          주말 인기 지역 {commercialDistrict}업 추천
        </h1>
        <div className={"w-full flex flex-row overflow-auto"}>
          {popularAreas.map((area, idx) => (
            <div key={idx} className="flex flex-col w-full">
              <label className="font-semibold">
                {idx + 1}위 {area.provinceName}
              </label>
              <PieChart
                labels={area.stay.map((s) => s.smallCategory)}
                label={"갯수"}
                data={area.stay.map((s) => s.stayCount)}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
