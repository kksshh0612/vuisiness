"use server";

import CommercialDistrictModel from "@/models/commercial_district-model";
import connectDB from "@/config/database";
import { ILocation } from "@/types/commercial_district";
import { PipelineStage } from "mongoose";

// 주변 상권 정보를 불러옴
export async function getNearbyComDistrict({ lng, lat }: ILocation) {
  try {
    await connectDB();

    const pipeline: PipelineStage[] = [
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat],
          },
          distanceField: "distance",
          maxDistance: 100,
          spherical: true,
        },
      },
      {
        $group: {
          _id: {
            largeCategory: "$상권업종대분류명",
            smallCategory: "$상권업종소분류명",
          },
          stores: {
            $push: {
              storeName: "$상호명",
              provinceName: "$시도명",
              cityCode: "$시군구코드",
              cityName: "$시군구명",
              administrativeDistrictCode: "$행정동코드",
              administrativeDistrictName: "$행정동명",
              roadAddress: "$도로명주소",
              location: "$location.coordinates",
              distance: "$distance",
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id.largeCategory",
          smallCategories: {
            $push: {
              smallCategory: "$_id.smallCategory",
              stores: "$stores",
            },
          },
        },
      },
    ] as PipelineStage[];

    const data = await CommercialDistrictModel.aggregate(pipeline);
    return { data };
  } catch (error) {
    return { errMsg: error.message };
  }
}
