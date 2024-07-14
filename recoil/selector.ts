import { selector } from "recoil";
import { nearbyComDistrictState } from "./atoms";

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
