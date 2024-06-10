"use server";

import connectDB from "@/config/database";
import { PipelineStage } from "mongoose";
import PopulationModel from "@/models/population-model";

// 주말 생활 인구 밀집 지역 내 특정 상권 데이터 불러오는 함수
export async function getWeekendsPopularAreasByComDistrict(
  commercialDistrict: string
) {
  try {
    await connectDB();

    const pipeline: PipelineStage[] = [
      {
        $facet: {
          weekdays: [
            {
              $match: {
                요일: {
                  $in: ["월", "화", "수", "목", "금"],
                },
              },
            },
            {
              $group: {
                _id: "$행정동코드",
                averageWeekdayPopulation: {
                  $avg: "$총생활인구수",
                },
              },
            },
          ],
          weekends: [
            {
              $match: {
                요일: {
                  $in: ["토", "일"],
                },
              },
            },
            {
              $group: {
                _id: "$행정동코드",
                averageWeekendPopulation: {
                  $avg: "$총생활인구수",
                },
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$weekdays",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          weekdays: 1,
          matchingWeekend: {
            $filter: {
              input: "$weekends",
              as: "weekend",
              cond: {
                $eq: ["$$weekend._id", "$weekdays._id"],
              },
            },
          },
        },
      },
      {
        $project: {
          administrativeCode: "$weekdays._id",
          weekdaysAveragePopulation: "$weekdays.averageWeekdayPopulation",
          weekendAveragePopulation: {
            $arrayElemAt: ["$matchingWeekend.averageWeekendPopulation", 0],
          },
        },
      },
      {
        $project: {
          administrativeCode: 1,
          weekdaysAveragePopulation: 1,
          weekendAveragePopulation: 1,
          populationDifference: {
            $abs: {
              $subtract: [
                "$weekdaysAveragePopulation",
                "$weekendAveragePopulation",
              ],
            },
          },
        },
      },
      {
        $sort: {
          populationDifference: -1,
        },
      },
      {
        $limit: 3,
      },
      {
        $lookup: {
          from: "commercialdistricts",
          let: {
            administrativeCode: "$administrativeCode",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$상권업종대분류명", commercialDistrict] },
                    { $eq: ["$행정동코드", "$$administrativeCode"] },
                  ],
                },
              },
            },
          ],
          as: "matchingDistricts",
        },
      },
      {
        $unwind: {
          path: "$matchingDistricts",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: {
            administrativeCode: "$administrativeCode",
            smallCategory: "$matchingDistricts.상권업종소분류명",
          },
          populationDifference: { $first: "$populationDifference" },
          cityName: { $first: "$matchingDistricts.시도명" },
          provinceName: { $first: "$matchingDistricts.시군구명" },
          administrativeCodeName: { $first: "$matchingDistricts.행정동명" },
          stayCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          stayCount: -1,
        },
      },
      {
        $group: {
          _id: "$_id.administrativeCode",
          populationDifference: { $first: "$populationDifference" },
          cityName: { $first: "$cityName" },
          provinceName: { $first: "$provinceName" },
          administrativeCodeName: { $first: "$administrativeCodeName" },
          stay: {
            $push: {
              smallCategory: "$_id.smallCategory",
              stayCount: "$stayCount",
            },
          },
        },
      },
      {
        $sort: {
          populationDifference: -1,
        },
      },
    ];

    const data = await PopulationModel.aggregate(pipeline);
    return { data };
  } catch (error) {
    return { errMsg: error.message };
  }
}
