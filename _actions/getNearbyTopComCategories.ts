"use server";

import connectDB from "@/config/database";
import { PipelineStage } from "mongoose";
import CommercialDistrictModel from "@/models/commercial_district-model";

// 특정 위치 주변 많은 상권 종류들을 불러옴
export async function getNearbyTopComCategories(hangjeongDongCode: number) {
  try {
    await connectDB();

    const pipeline: PipelineStage[] = [
      {
        // 특정 행정동 코드로 필터링
        $match: { 행정동코드: hangjeongDongCode },
      },
      {
        $group: {
          // 표준산업분류명별로 그룹화
          _id: "$표준산업분류명",
          count: { $sum: 1 },
          행정동코드: { $first: "$행정동코드" },
          상권업종대분류명: { $first: "$상권업종대분류명" },
          상권업종소분류명: { $first: "$상권업종소분류명" },
          시도명: { $first: "$시도명" },
          시군구명: { $first: "$시군구명" },
          행정동명: { $first: "$행정동명" },
        },
      },
      {
        $project: {
          _id: 0,
          standardCategory: "$_id",
          count: 1,
          administrativeDistrictCode: "$행정동코드",
          largeCategory: "$상권업종대분류명",
          smallCategory: "$상권업종소분류명",
          cityName: "$시도명",
          provinceName: "$시군구명",
          administrativeDistrictName: "$행정동명",
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 8,
      },
    ];

    const data = await CommercialDistrictModel.aggregate(pipeline);

    return { data };
  } catch (error) {
    return { errMsg: error.message };
  }
}
