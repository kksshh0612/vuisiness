"use server";

import connectDB from "@/config/database";
import { PipelineStage } from "mongoose";
import PopulationModel from "@/models/population-model";

export async function getPopularRestaurants(administrativeCode: number) {
  try {
    await connectDB();

    const pipeline: PipelineStage[] = [
      {
        $match: {
          행정동코드: administrativeCode,
          요일: {
            $in: ["월", "화", "수", "목", "금"],
          },
          시간대구분: {
            $gte: 11,
            $lte: 14,
          },
        },
      },
      {
        $group: {
          _id: "$행정동코드",
          male0To9: { $avg: { $trunc: "$남자0세부터9세생활인구수" } },
          male10To19: { $avg: { $trunc: "$남자10세부터19세생활인구수" } },
          male20To29: { $avg: { $trunc: "$남자20세부터29세생활인구수" } },
          male30To39: { $avg: { $trunc: "$남자30세부터39세생활인구수" } },
          male40To49: { $avg: { $trunc: "$남자40세부터49세생활인구수" } },
          male50To59: { $avg: { $trunc: "$남자50세부터59세생활인구수" } },
          male60To69: { $avg: { $trunc: "$남자60세부터69세생활인구수" } },
          male70To: { $avg: { $trunc: "$남자70세이상생활인구수" } },
          female0To9: { $avg: { $trunc: "$여자0세부터9세생활인구수" } },
          female10To19: { $avg: { $trunc: "$여자10세부터19세생활인구수" } },
          female20To29: { $avg: { $trunc: "$여자20세부터29세생활인구수" } },
          female30To39: { $avg: { $trunc: "$여자30세부터39세생활인구수" } },
          female40To49: { $avg: { $trunc: "$여자40세부터49세생활인구수" } },
          female50To59: { $avg: { $trunc: "$여자50세부터59세생활인구수" } },
          female60To69: { $avg: { $trunc: "$여자60세부터69세생활인구수" } },
          female70To: { $avg: { $trunc: "$여자70세이상생활인구수" } },
        },
      },
      {
        $project: {
          maxPopulationFields: {
            $concatArrays: [
              [
                { ageCode: 0, genderCode: 1, population: "$male0To9" },
                { ageCode: 10, genderCode: 1, population: "$male10To19" },
                { ageCode: 20, genderCode: 1, population: "$male20To29" },
                { ageCode: 30, genderCode: 1, population: "$male30To39" },
                { ageCode: 40, genderCode: 1, population: "$male40To49" },
                { ageCode: 50, genderCode: 1, population: "$male50To59" },
                { ageCode: 60, genderCode: 1, population: "$male60To69" },
                { ageCode: 70, genderCode: 1, population: "$male70To" },
                { ageCode: 0, genderCode: 2, population: "$female0To9" },
                { ageCode: 10, genderCode: 2, population: "$female10To19" },
                { ageCode: 20, genderCode: 2, population: "$female20To29" },
                { ageCode: 30, genderCode: 2, population: "$female30To39" },
                { ageCode: 40, genderCode: 2, population: "$female40To49" },
                { ageCode: 50, genderCode: 2, population: "$female50To59" },
                { ageCode: 60, genderCode: 2, population: "$female60To69" },
                { ageCode: 70, genderCode: 2, population: "$female70To" },
              ],
            ],
          },
        },
      },
      {
        $unwind: {
          path: "$maxPopulationFields",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          "maxPopulationFields.population": -1,
        },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: "consumptiontrends",
          let: {
            ageCode: "$maxPopulationFields.ageCode",
            genderCode: "$maxPopulationFields.genderCode",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$연령대코드", "$$ageCode"] },
                    { $eq: ["$성별코드", "$$genderCode"] },
                    { $eq: ["$가맹점업종분류명_대", "음식"] },
                  ],
                },
              },
            },
          ],
          as: "consumptions",
        },
      },
      {
        $unwind: {
          path: "$consumptions",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$consumptions.가맹점업종분류명",
          ageCode: { $first: "$maxPopulationFields.ageCode" },
          genderCode: { $first: "$maxPopulationFields.genderCode" },
          count: { $sum: "$consumptions.금액지표" },
          administrativeCode: { $first: "$_id" },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 6,
      },
      {
        $lookup: {
          from: "commercialdistricts",
          let: {
            searchId: "$_id",
            administrativeCode: "$administrativeCode",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$행정동코드", "$$administrativeCode"] },
                    {
                      $or: [
                        {
                          $regexMatch: {
                            input: "$표준산업분류명",
                            regex: "$$searchId",
                            options: "i",
                          },
                        },
                        {
                          $regexMatch: {
                            input: "$상호명",
                            regex: "$$searchId",
                            options: "i",
                          },
                        },
                        {
                          $regexMatch: {
                            input: "$상권업종소분류명",
                            regex: "$$searchId",
                            options: "i",
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                ageCode: 1,
                genderCode: 1,
                행정동코드: 1,
                상권업종소분류명: 1,
                표준산업분류명: 1,
              },
            },
          ],
          as: "matchingDistricts",
        },
      },
    ];

    const data = await PopulationModel.aggregate(pipeline);
    return { data };
  } catch (error) {
    return { errMsg: error.message };
  }
}
