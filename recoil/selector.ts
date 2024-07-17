import { selector } from "recoil";
import { nearbyComDistrictState, hangjeongDongState } from "./atoms";

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
  key: "hangjeongdongSelector",
  get: ({ get }) => {
    const hangjeongDong = get(hangjeongDongState);

    return Number(hangjeongDong.code?.slice(0, -2));
  },
});
