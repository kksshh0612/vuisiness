import { hangjeongDongState, nearbyStoresState } from "@/atoms";
import { concatHangjeongDongName } from "@/utils/concat-hangjeong-dong-name";
import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";

// 근처 상점 데이터를 props로 받아서 대분류명, 소분류명을 보여주는 컴포넌트
export default function CategoryList({ nearbyComDistrict }) {
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedSmallCategory, setSelectedSmallCategory] = useState();

  return (
    <>
      {/* 현위치 상권 정보 */}
      <div className={"w-full mb-3"}>
        <h1 className={"font-semibold mb-2 text-[1.2rem]"}>현위치 상권 정보</h1>
        {/* 대분류 */}
        <label className={"w-full mb-3 font-semibold"}>대분류</label>
        <div className={"w-full h-[4rem] overflow-x-auto"}>
          <div className={"flex flex-row gap-2"}>
            {nearbyComDistrict?.map((nearbyComDistrictItem, idx) => (
              <div
                className={
                  "hover:text-white cursor-pointer hover:font-semibold hover:bg-primary hover:border-2 min-w-fit p-[0.7rem] h-10 flex flex-row justify-center items-center bg-white border-2 border-primary rounded-2xl"
                }
                key={idx}
                onClick={() => {
                  console.log(nearbyComDistrictItem);
                  setSelectedCategory(nearbyComDistrictItem);
                }}
              >
                {nearbyComDistrictItem._id}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* 소분류 */}
      {selectedCategory && (
        <div className={"w-full mb-3"}>
          <label className={"w-full mb-3 font-semibold"}>소분류</label>
          <div className={"w-full h-[4rem] overflow-auto"}>
            <div className={"flex flex-row gap-2"}>
              {selectedCategory.smallCategories?.map((smallCategoryItem) => (
                <div
                  className={
                    "cursor-pointer hover:text-white hover:font-semibold hover:bg-primary hover:border-2 min-w-fit p-[0.7rem] h-10 flex flex-row justify-center items-center bg-white border-2 border-primary rounded-2xl"
                  }
                  key={smallCategoryItem.smallCategory}
                  onClick={() => {
                    setSelectedSmallCategory(smallCategoryItem);
                  }}
                >
                  {smallCategoryItem.smallCategory}
                </div>
              ))}
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
