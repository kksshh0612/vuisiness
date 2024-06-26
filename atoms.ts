import { atom } from "recoil";

// 중심 마커 위치
export const centerPositionState = atom({
  key: "centerPositionState",
  default: { lat: 37.5665, lng: 126.978 }, // 초기값 설정 (서울의 좌표)
});

// 행정동
export const hangjeongDongState = atom({
  key: "hangjeongDongState",
  default: null,
});

// 근처 상점
export const nearbyStoresState = atom({
  key: "nearbyStoresState",
  default: null,
});

export const selectedCategoryState = atom({
  key: "selectedCategoryState",
  default: null,
});

export const topComDistrictCategoriesState = atom({
  key: "topComDistrictCategoriesState",
  default: [],
});
