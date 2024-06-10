"use server";

import connectDB from "@/config/database";
import { PipelineStage } from "mongoose";
import PopulationModel from "@/models/population-model";

// 생활 인구 통계를 불러옴
interface IGetActivePopulationsProps {
  hangjeongDongCode: number;
  day: string;
}
export async function getActivePopulations({
  hangjeongDongCode,
  day,
}: IGetActivePopulationsProps) {
  try {
    await connectDB();

    const pipeline: PipelineStage[] = [
      {
        $match: {
          요일: day,
          행정동코드: hangjeongDongCode,
        },
      },
      {
        $group: {
          _id: {
            timeZone: "$시간대구분",
            administrativeCode: "$행정동코드",
          },
          totalPeople: {
            $avg: {
              $trunc: "$총생활인구수",
            },
          },
          date: {
            $first: "$기준일",
          },
          day: {
            $first: "$요일",
          },
        },
      },
      {
        $sort: {
          "_id.timeZone": 1, // 시간대구분 기준으로 정렬
        },
      },
      {
        $group: {
          _id: {
            administrativeCode: "$_id.administrativeCode",
            provinceName: "$provinceName",
            cityName: "$cityName",
            administrativeDistrictName: "$administrativeDistrictName",
            date: "$date",
            day: "$day",
          },
          population: {
            $push: {
              timeZone: "$_id.timeZone",
              totalPeople: "$totalPeople",
            },
          },
        },
      },
    ];

    const data = await PopulationModel.aggregate(pipeline);

    return { data };
  } catch (error) {
    return { errMsg: error.message };
  }
}
