import { getNearbyComDistrict } from "@/_actions/getNearbyComDistrict";
import { centerPositionState, nearbyComDistrictState } from "@/recoil/atoms";
import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

// Component: 근처 상점 데이터를 대분류명, 소분류명으로 분류
export default function CategoryList() {
  const nearbyComDistrict = useRecoilValue(nearbyComDistrictState);
  const [selectedLargeCategory, setSelectedLargeCategory] = useState();
  const [selectedSmallCategory, setSelectedSmallCategory] = useState();
  const centerPosition = useRecoilValue(centerPositionState);
  const setNearbyComDistrict = useSetRecoilState(nearbyComDistrictState);
  const [isLoading, setIsLoading] = useState(false);

  // 중심 위치가 변경될 때마다 주변 상권 정보 가져옴
  useEffect(() => {
    if (centerPosition.lat !== null && centerPosition.lng !== null) {
      (async () => {
        setIsLoading(true);
        const { data: nearbyComDistrictData, errMsg } =
          await getNearbyComDistrict(centerPosition);
        if (nearbyComDistrictData) {
          setNearbyComDistrict(nearbyComDistrictData);
          setIsLoading(false);
        } else {
          console.error(errMsg);
        }
      })();
    }
  }, [centerPosition, setNearbyComDistrict]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* 현위치 상권 정보 */}
      <div className={"w-full mb-3"}>
        <h1 className={"font-semibold mb-2 text-[1.2rem]"}>현위치 상권 정보</h1>
        {/* 대분류 */}
        <label className={"w-full mb-3 font-semibold"}>대분류</label>
        <div className={"w-full h-[4rem] overflow-x-auto"}>
          <div className={"flex flex-row gap-2"}>
            {nearbyComDistrict?.map((nearbyComDistrictItem, idx) => {
              const isSelected =
                selectedLargeCategory?._id === nearbyComDistrictItem._id;
              return (
                <div
                  className={`cursor-pointer min-w-fit p-[0.7rem] h-10 flex flex-row justify-center items-center bg-white border-2 rounded-2xl
                    ${
                      isSelected
                        ? "text-white font-semibold border-primary bg-primary"
                        : "border-primary hover:text-white hover:font-semibold hover:bg-primary hover:border-2"
                    }`}
                  key={idx}
                  onClick={() => {
                    console.log(
                      // "🚀 ~ {nearbyComDistrict?.map ~ nearbyComDistrictItem:",
                      nearbyComDistrictItem
                    );
                    setSelectedLargeCategory(nearbyComDistrictItem);
                  }}
                >
                  {nearbyComDistrictItem._id}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* 소분류 */}
      {selectedLargeCategory && (
        <div className={"w-full mb-3"}>
          <label className={"w-full mb-3 font-semibold"}>소분류</label>
          <div className={"w-full h-[4rem] overflow-auto"}>
            <div className={"flex flex-row gap-2"}>
              {selectedLargeCategory.smallCategories?.map(
                (smallCategoryItem) => {
                  const isSelected =
                    selectedSmallCategory?.smallCategory ===
                    smallCategoryItem.smallCategory;
                  return (
                    <div
                      className={`cursor-pointer min-w-fit p-[0.7rem] h-10 flex flex-row justify-center items-center bg-white border-2 rounded-2xl
                        ${
                          isSelected
                            ? "text-white font-semibold border-primary bg-primary"
                            : "border-primary hover:text-white hover:font-semibold hover:bg-primary hover:border-2"
                        }`}
                      key={smallCategoryItem.smallCategory}
                      onClick={() => {
                        setSelectedSmallCategory(smallCategoryItem);
                      }}
                    >
                      {smallCategoryItem.smallCategory}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}
      {/* 소분류에 해당하는 상가명 */}
      {selectedSmallCategory && (
        <div className={"w-full mb-3"}>
          <label className={"w-full mb-3 font-semibold"}>상가명</label>
          <div className={"w-full h-[4rem] overflow-auto"}>
            <div className={"flex flex-row gap-2"}>
              {selectedSmallCategory.stores?.map((storeItem, idx) => (
                <div
                  className={
                    "cursor-pointer hover:text-white hover:font-semibold hover:bg-primary hover:border-2 min-w-fit p-[0.7rem] h-10 flex flex-row justify-center items-center bg-white border-2 border-primary rounded-2xl"
                  }
                  key={idx}
                >
                  {storeItem.storeName}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
