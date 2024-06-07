import mongoose, { model, models } from "mongoose";

// 전국 최근 BC 카드 지출 내역 데이터 스키마
const consumptionTrendSchema = new mongoose.Schema({
  가맹점업종분류명_대: String,
  가맹점업종분류명: String,
  연령대코드: Number,
  성별코드: Number,
  광역시도명: String,
  시군구명: String,
  금액지표: Number,
  건수지표: Number,
});

const ConsumptionTrendModel =
  models.ConsumptionTrend || model("consumptionTrend", consumptionTrendSchema);

export default ConsumptionTrendModel;