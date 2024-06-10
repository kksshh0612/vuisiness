"use server";

import connectDB from "@/config/database";
import ConsumptionTrendModel from "@/models/consumption_trend-model";
import { PipelineStage } from "mongoose";

interface ISalesProps {
  siGunGuName: string;
  genderCode: number;
  ageCode: number;
}
// 해당 행정동 내 특정 연령, 성별의 카드 매출을 불러옴
export async function getSalesByDemographics({
  siGunGuName,
  genderCode,
  ageCode,
}: ISalesProps) {
  try {
    await connectDB();

    const pipeline: PipelineStage[] = [
      {
        $match: {
          시군구명: siGunGuName,
          성별코드: genderCode,
          연령대코드: ageCode,
        },
      },
      {
        $group: {
          _id: {
            largeCategory: "$가맹점업종분류명_대",
            smallCategory: "$가맹점업종분류명",
            genderCode: "$성별코드",
            ageCode: "$연령대코드",
          },
          sumOfConsumption: {
            $sum: "$금액지표",
          },
          countOfConsumption: {
            $sum: "$건수지표",
          },
          cityName: {
            $first: "$광역시도명",
          },
          provinceName: {
            $first: "$시군구명",
          },
        },
      },
      {
        $sort: {
          sumOfConsumption: -1, // 총 사용금액 많은 순서대로 출력
        },
      },
      {
        $limit: 6,
      },
    ];

    const data = await ConsumptionTrendModel.aggregate(pipeline);

    return { data };
  } catch (error) {
    return { errMsg: error.message };
  }
}
