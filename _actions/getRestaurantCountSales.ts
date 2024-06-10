"use server";

import ConsumptionTrendModel from "@/models/consumption_trend-model";
import connectDB from "@/config/database";
import { PipelineStage } from "mongoose";

// 식당 갯수, 매출 상관관계
export async function getRestaurantCountSales(siGunGuName: string) {
  try {
    await connectDB();

    const pipeline: PipelineStage[] = [
      {
        $match: {
          광역시도명: "서울",
          시군구명: siGunGuName,
          가맹점업종분류명_대: "음식",
        },
      },
      {
        $group: {
          _id: "$가맹점업종분류명_소",
          avgConsumption: {
            $avg: "$금액지표",
          },
          provinceName: {
            $first: "$시군구명",
          },
        },
      },
      {
        $lookup: {
          from: "commercialdistricts",
          let: {
            searchId: "$_id",
            provinceName: "$provinceName",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $and: [
                        {
                          $eq: ["$시도명", "서울특별시"],
                        },
                        {
                          $eq: ["$시군구명", "$$provinceName"],
                        },
                        {
                          $and: [
                            {
                              $eq: [
                                {
                                  $type: "$상권업종소분류명",
                                },
                                "string",
                              ],
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
                  ],
                },
              },
            },
          ],
          as: "matchingDistricts",
        },
      },
      {
        $project: {
          avgConsumption: 1,
          //평균 카드 지출
          provinceName: 1,
          itemSize: {
            //상가 갯수
            $size: "$matchingDistricts",
          },
          // "matchingDistricts.상호명": 1,
        },
      },
    ];

    const data = await ConsumptionTrendModel.aggregate(pipeline);

    return { data };
  } catch (error) {
    return { errMsg: error.message };
  }
}
