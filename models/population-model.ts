import mongoose, { model, models } from "mongoose";

// 전국 생활 인구 데이터 스키마
const populationSchema = new mongoose.Schema({
  시간대구분: Number,
  행정동코드: Number,
  총생활인구수: Number,
  기준일: Date,
  남자0세부터9세생활인구수: Number,
  남자10세부터19세생활인구수: Number,
  남자20세부터29세생활인구수: Number,
  남자30세부터39세생활인구수: Number,
  남자40세부터49세생활인구수: Number,
  남자50세부터59세생활인구수: Number,
  남자60세부터69세생활인구수: Number,
  남자70세이상생활인구수: Number,
  여자0세부터9세생활인구수: Number,
  여자10세부터19세생활인구수: Number,
  여자20세부터29세생활인구수: Number,
  여자30세부터39세생활인구수: Number,
  여자40세부터49세생활인구수: Number,
  여자50세부터59세생활인구수: Number,
  여자60세부터69세생활인구수: Number,
  여자70세이상생활인구수: Number,
  요일: String,
});

const PopulationModel =
  models.Population || model("Population", populationSchema, "populations");

export default PopulationModel;
