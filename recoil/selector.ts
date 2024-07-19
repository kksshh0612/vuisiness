import { selector } from "recoil";
import { nearbyComDistrictState, hangjeongDongState } from "./atoms";
import { removeSpaces } from "@/utils/remove-spaces";

// 근처 상권 가게 정보
export const nearbyStoresSelector = selector({
  key: "nearbyStoresSelector",
  get: ({ get }) => {
    const nearbyComDistrict = get(nearbyComDistrictState);

    return nearbyComDistrict.flatMap((category) =>
      category.smallCategories.flatMap((smallCategory) => smallCategory.stores)
    );
  },
});

// 행정동 코드 추출
export const hangjeongDongCodeSelector = selector({
  key: "hangjeongDongCodeSelector",
  get: ({ get }) => {
    const hangjeongDong = get(hangjeongDongState);

    return Number(hangjeongDong.code?.slice(0, -2));
  },
});

// 행정동 이름 결합
export const hangjeongDongNameSelector = selector({
  key: "hangjeongDongNameSelector",
  get: ({ get }) => {
    const hangjeongDong = get(hangjeongDongState);
    return `${hangjeongDong?.region_2depth_name} ${hangjeongDong?.region_3depth_name} ${hangjeongDong?.region_4depth_name}`;
  },
});

// 시군구 이름 추출
export const SiGunGuNameSelector = selector({
  key: "SiGunGuNameSelector",
  get: ({ get }) => {
    const hangjeongDong = get(hangjeongDongState);
    return removeSpaces(`${hangjeongDong?.region_2depth_name}`);
  },
});
