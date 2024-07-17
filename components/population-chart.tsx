import { getActivePopulations } from "@/_actions/getActivePopulations";
import BarChart from "./chart/bar-chart";
import DoubleBarChart from "./chart/double-bar-chart";
import { SetStateAction, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { hangjeongDongState } from "@/recoil/atoms";
import { sliceHangjeongDongCode } from "@/utils/slice-hangjeong-dong-code";
import { concatHangjeongDongName } from "@/utils/concat-hangjeong-dong-name";
import { getPopulationByGenderAge } from "@/_actions/getPopulationByGenderAge";

// 행정동 내 0~24시의 생활인구 차트
interface IPopulationChartProps {
  setSelectedAgeIdx: React.Dispatch<SetStateAction<number>>;
  setSelectedGenderIdx: React.Dispatch<SetStateAction<string>>;
}
export default function PopulationChart({
  setSelectedAgeIdx,
  setSelectedGenderIdx,
}: IPopulationChartProps) {
  const [activePopulation, setActivePopulation] = useState();
  const [selectedTimeZoneIdx, setSelectedTimeZoneIdx] = useState();
  const [populationByGenderAge, setPopulationByGenderAge] = useState();
  const hangjeongDong = useRecoilValue(hangjeongDongState);
  const [day, setDay] = useState("금");

  // 중심 위치가 변경될 때, 생활 인구 정보 받아옴
  useEffect(() => {
    if (hangjeongDong) {
      (async () => {
        const { data: activePopulationData, error } =
          await getActivePopulations({
            hangjeongDongCode: sliceHangjeongDongCode(hangjeongDong?.code),
            day,
          });
        if (activePopulationData) {
          setActivePopulation(activePopulationData);
        } else {
          console.error(error);
        }
      })();
    }
  }, [hangjeongDong, day]);

  // 생활 인구 그래프 특정 시간대 bar 요소 클릭시, 해당 시간대 나이대별 남녀 비율
  useEffect(() => {
    (async () => {
      if (selectedTimeZoneIdx) {
        const { data: populationByGenderAgeData, error } =
          await getPopulationByGenderAge(
            sliceHangjeongDongCode(hangjeongDong?.code),
            selectedTimeZoneIdx
          );
        setPopulationByGenderAge(populationByGenderAgeData);
      }
    })();
  }, [selectedTimeZoneIdx, hangjeongDong]);

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
                    setSelectedGraphBarIdx={setSelectedTimeZoneIdx}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {populationByGenderAge ? (
        <section className={"PopulationChartWrapper my-6 w-full overflow-auto"}>
          <label className={"font-semibold mt-[2rem] text-[1.2rem]"}>
            {concatHangjeongDongName(hangjeongDong)} {day}요일{" "}
            {selectedTimeZoneIdx}~{selectedTimeZoneIdx + 1}시의 생활 인구의 남녀
            비율
          </label>
          <div className={"w-full overflow-auto"}>
            <div className={"flex flex-row gap-2"}>
              <div className={"min-w-full sm:min-w-full"}>
                <DoubleBarChart
                  labels={populationByGenderAge.labels}
                  label={["남성", "여성"]}
                  firstData={populationByGenderAge.male}
                  secondData={populationByGenderAge.female}
                  setSelectedGraphBarIdx={setSelectedAgeIdx}
                  setSelectedGraphBarLabel={setSelectedGenderIdx}
                  unit={"명"}
                />
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
