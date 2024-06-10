import { ILocation } from "@/types/commercial_district";
import axios from "axios";

// 좌표 바탕 지역 정보 받아오는 함수
export async function getKakaoCoordsToDistrict({ lng: x, lat: y }: ILocation) {
  if (!x || !y) {
    return {
      error: "좌표가 필요합니다.",
    };
  }

  try {
    const response = await axios.get(
      "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json",
      {
        params: { x: x.toString(), y: y.toString() },
        headers: {
          Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_APP_REST_API_KEY}`,
        },
      }
    );

    return { data: response.data };
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
}
