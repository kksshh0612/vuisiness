import { useEffect, useState } from "react";
import DoubleBarChart from "../chart/double-bar-chart";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  selectedAgeIdxState,
  selectedGenderIdxState,
  selectedHourIdxState,
} from "@/recoil/atoms";
import { getPopulationByGenderAge } from "@/_actions/getPopulationByGenderAge";
import { hangjeongDongCodeSelector } from "@/recoil/selector";
import { concatHangjeongDongName } from "@/utils/concat-hangjeong-dong-name";

export default function PopulationInnerHour() {
  const selectedHourIdx = useRecoilValue(selectedHourIdxState);
  const setSelectedAgeIdx = useSetRecoilState(selectedAgeIdxState);
  const setSelectedGenderIdx = useSetRecoilState(selectedGenderIdxState);
  const hangjeongDongCode = useRecoilValue(hangjeongDongCodeSelector);
  const [populationByGenderAge, setPopulationByGenderAge] = useState();

  // 생활 인구 그래프 특정 시간대 bar 요소 클릭시, 해당 시간대 나이대별 남녀 비율
  useEffect(() => {
    (async () => {
      if (selectedHourIdx) {
        const { data: populationByGenderAgeData, error } =
          await getPopulationByGenderAge(hangjeongDongCode, selectedHourIdx);
        setPopulationByGenderAge(populationByGenderAgeData);
      }
    })();
  }, [selectedHourIdx, hangjeongDongCode]);

  return (
    <>
      {populationByGenderAge ? (
        <section className={"PopulationChartWrapper my-6 w-full overflow-auto"}>
          <label className={"font-semibold mt-[2rem] text-[1.2rem]"}>
            {/* {concatHangjeongDongName(hangjeongDong)} {day}요일  */}
            {selectedHourIdx}~{selectedHourIdx + 1}시의 생활 인구의 남녀 비율
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
