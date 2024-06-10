import mongoose, { model, models } from "mongoose";

// 전국 상권 정보 데이터 스키마
const commercialDistrictSchema = new mongoose.Schema({
  상호명: String,
  상권업종대분류명: String,
  상권업종중분류명: String,
  상권업종소분류명: String,
  표준산업분류명: String,
  시도명: String,
  시군구코드: Number,
  시군구명: String,
  행정동코드: Number,
  행정동명: String,
  도로명주소: String,
  location: {
    type: { type: String },
    coordinates: [Number],
  },
});

// geoNear 쿼리를 위한 인덱스 생성
commercialDistrictSchema.index({ location: "2dsphere" });
commercialDistrictSchema.index({ 행정동코드: 1 });
commercialDistrictSchema.index({ 시도명: 1, 시군구명: 1 });

const CommercialDistrictModel =
  models.CommercialDistrict ||
  model("CommercialDistrict", commercialDistrictSchema, "commercialdistricts");

export default CommercialDistrictModel;
