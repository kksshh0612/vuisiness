"use server";

import connectDB from "@/config/database";
import { PipelineStage } from "mongoose";
import PopulationModel from "@/models/population-model";

// 특정 행정동 코드, 시간대에 대한 생활 인구 성별, 나이대를 불러옴
export async function getPopulationByGenderAge(
  administrativeCode: number,
  timeZone: number
) {
  try {
    await connectDB();

    const pipeline: PipelineStage[] = [
      {
        $match: {
          행정동코드: administrativeCode,
          시간대구분: timeZone,
        },
      },
      {
        // 0시~23시 총 생활 인구 수 통계
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
          male0To9: {
            $avg: {
              $trunc: "$남자0세부터9세생활인구수",
            },
          },
          male10To19: {
            $avg: {
              $trunc: "$남자10세부터19세생활인구수",
            },
          },
          male20To29: {
            $avg: {
              $trunc: "$남자20세부터29세생활인구수",
            },
          },
          male30To39: {
            $avg: {
              $trunc: "$남자30세부터39세생활인구수",
            },
          },
          male40To49: {
            $avg: {
              $trunc: "$남자40세부터49세생활인구수",
            },
          },
          male50To59: {
            $avg: {
              $trunc: "$남자50세부터59세생활인구수",
            },
          },
          male60To69: {
            $avg: {
              $trunc: "$남자60세부터69세생활인구수",
            },
          },
          male70To: {
            $avg: {
              $trunc: "$남자70세이상생활인구수",
            },
          },
          female0To9: {
            $avg: {
              $trunc: "$여자0세부터9세생활인구수",
            },
          },
          female10To19: {
            $avg: {
              $trunc: "$여자10세부터19세생활인구수",
            },
          },
          female20To29: {
            $avg: {
              $trunc: "$여자20세부터29세생활인구수",
            },
          },
          female30To39: {
            $avg: {
              $trunc: "$여자30세부터39세생활인구수",
            },
          },
          female40To49: {
            $avg: {
              $trunc: "$여자40세부터49세생활인구수",
            },
          },
          female50To59: {
            $avg: {
              $trunc: "$여자50세부터59세생활인구수",
            },
          },
          female60To69: {
            $avg: {
              $trunc: "$여자60세부터69세생활인구수",
            },
          },
          female70To: {
            $avg: {
              $trunc: "$여자70세이상생활인구수",
            },
          },
        },
      },
      {
        $addFields: {
          male: [
            "$male0To9",
            "$male10To19",
            "$male20To29",
            "$male30To39",
            "$male40To49",
            "$male50To59",
            "$male60To69",
            "$male70To",
          ],
          female: [
            "$female0To9",
            "$female10To19",
            "$female20To29",
            "$female30To39",
            "$female40To49",
            "$female50To59",
            "$female60To69",
            "$female70To",
          ],
          labels: [
            "0~9세",
            "10~19세",
            "20~29세",
            "30~39세",
            "40~49세",
            "50~59세",
            "60~69세",
            "70세이상",
          ],
        },
      },
      {
        $project: {
          _id: 1,
          totalPeople: 1,
          male: 1,
          female: 1,
          labels: 1,
        },
      },
    ];

    const [data] = await PopulationModel.aggregate(pipeline);

    return { data };
  } catch (error) {
    return { errMsg: error.message };
  }
}
