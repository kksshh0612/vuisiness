import { getActivePopulations } from "@/_actions/getActivePopulations";
import BarChart from "../chart/bar-chart";
import DoubleBarChart from "../chart/double-bar-chart";
import { SetStateAction, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  hangjeongDongState,
  selectedAgeIdxState,
  selectedGenderIdxState,
  selectedHourIdxState,
} from "@/recoil/atoms";
import { concatHangjeongDongName } from "@/utils/concat-hangjeong-dong-name";
import { getPopulationByGenderAge } from "@/_actions/getPopulationByGenderAge";
import { hangjeongDongCodeSelector } from "@/recoil/selector";

// 행정동 내 0~24시의 생활인구 차트
interface IPopulationChartProps {
  setSelectedAgeIdx: React.Dispatch<SetStateAction<number>>;
  setSelectedGenderIdx: React.Dispatch<SetStateAction<string>>;
}
export default function PopulationByHourChart() {
  const [activePopulation, setActivePopulation] = useState();
  const setSelectedHourIdx = useSetRecoilState(selectedHourIdxState);
  const hangjeongDong = useRecoilValue(hangjeongDongState);
  const hangjeongDongCode = useRecoilValue(hangjeongDongCodeSelector);

  const [day, setDay] = useState("금");

  // 중심 위치가 변경될 때, 생활 인구 정보 받아옴
  useEffect(() => {
    if (hangjeongDongCode) {
      (async () => {
        const { data: activePopulationData, error } =
          await getActivePopulations({
            hangjeongDongCode,
            day,
          });
        if (activePopulationData) {
          setActivePopulation(activePopulationData);
        } else {
          console.error(error);
        }
      })();
    }
  }, [hangjeongDongCode, day]);

  return (
    <>
      <section className={"PopulationChartWrapper w-full overflow-auto"}>
        <label className={"font-semibold mt-[2rem] text-[1.2rem]"}>
          {concatHangjeongDongName(hangjeongDong)}의 {day}요일 생활 인구
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
                    label={concatHangjeongDongName(hangjeongDong)}
                    data={population.map((p) => p.totalPeople)}
                    setSelectedGraphBarIdx={setSelectedHourIdx}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
