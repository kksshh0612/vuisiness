import { getActivePopulations } from "@/_actions/getActivePopulations";
import BarChart from "../chart/bar-chart";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { selectedHourIdxState } from "@/recoil/atoms";
import {
  hangjeongDongCodeSelector,
  hangjeongDongNameSelector,
} from "@/recoil/selector";

// 행정동 내 0~24시의 생활인구 차트
export default function PopulationByHourChart() {
  const setSelectedHourIdx = useSetRecoilState(selectedHourIdxState);
  const hangjeongDongCode = useRecoilValue(hangjeongDongCodeSelector);
  const hangjeongDongName = useRecoilValue(hangjeongDongNameSelector);
  const [activePopulation, setActivePopulation] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [day, setDay] = useState("금");

  // 중심 위치가 변경될 때, 생활 인구 정보 받아옴
  useEffect(() => {
    if (hangjeongDongCode) {
      (async () => {
        setIsLoading(true);
        const { data: activePopulationData, error } =
          await getActivePopulations({
            hangjeongDongCode,
            day,
          });
        if (activePopulationData) {
          setActivePopulation(activePopulationData);
          setIsLoading(false);
        } else {
          console.error(error);
        }
      })();
    }
  }, [hangjeongDongCode, day]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <section className={"PopulationChartWrapper w-full overflow-auto"}>
        {activePopulation?.length !== 0 ? (
          <>
            <label className={"font-semibold mt-[2rem] text-[1.2rem]"}>
              {hangjeongDongName}의 {day}요일 생활 인구
            </label>
            <div className={"w-full overflow-auto"}>
              <div className={"flex flex-row gap-2"}>
                {activePopulation?.map((activePopulationItem, index) => {
                  const { population } = activePopulationItem;

                  return (
                    <div key={index} className={"min-w-full sm:min-w-full"}>
                      <BarChart
                        key={index}
                        labels={population.map((p) => p.timeZone + "시")}
                        label={hangjeongDongName}
                        data={population.map((p) => p.totalPeople)}
                        setSelectedGraphBarIdx={setSelectedHourIdx}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : null}
      </section>
    </>
  );
}
