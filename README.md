# Vuisiness

상권 분석 서비스

## Getting Started

```bash
    # 의존성 설치
    npm install
    or
    yarn install
    # 실행
    npm run dev
    or
    yarn dev
```

# 자영업을 위한 인구 + 상권 + 소비 분석 
<br/> 

## 행정동 내 상권 구성 파악  
| 행정동 내 상권들을 대분류, 소분류 별로 세분화  
<br/> 
![image](https://github.com/wonil-programmer/vuisiness/assets/74577811/4285fc6a-c9ac-4da8-a485-5945a9d0c98f)  

<details>
  <summary>Query</summary>

  ```sql
  
  db.commercialdistricts.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [127.4584, 36.63273],  //중문 삼춘네 삼겹살 경도, 위도
          },
          distanceField: "distance",
          maxDistance: 100,
          spherical: true,
        }
      },
      {
        $group: {
          _id: {
            largeCategory: "$상권업종대분류명",
            smallCategory: "$상권업종소분류명",
          },
          stores: {
            $push: {
              storeName: "$상호명",
              provinceName: "$시도명",
              cityCode: "$시군구코드",
              cityName: "$시군구명",
              administrativeDistrictCode: "$행정동코드",
              administrativeDistrictName: "$행정동명",
              roadAddress: "$도로명주소",
              location: "$location.coordinates",
              distance: "$distance",
            }
          }
        }
      },
      {
        $group: {
          _id: "$_id.largeCategory",
          smallCategories: {
            $push: {
              smallCategory: "$_id.smallCategory",
              stores: "$stores",
            }
          }
        }
      }
    ]);
```
</details>

## 행정동 내 시간대별 인구
| 해당 행정구역 내 요일별 시간대별(0시~23시) 생활 인구 수 변화 분석  
<br/> 

![image](https://s6.ezgif.com/tmp/ezgif-6-83a93ed66b.gif)  
![image](https://github.com/wonil-programmer/vuisiness/assets/74577811/a92e626d-3de8-4a5d-be7a-2a3740840c0f)  


<details>
  <summary>Query</summary>

  ```sql
  
  db.populations.aggregate([
  {
    $match: {
      요일: "화",
      행정동코드: 11410620  
    }
  },
  {
    //0시~23시 총 생활 인구 수 통계
    $group: {
      _id: {
        timeZone: "$시간대구분",
        administrativeCode: "$행정동코드"
      },
      totalPeople: {
        $avg: {
          $trunc: "$총생활인구수"
        }
      },
      date: {
        $first: "$기준일"
      },
      day: {
        $first: "$요일"
      }
    }
  },
  {
    $sort: {
      _id: 1 //timeZone 0~23시 정렬
    }
  },
  {
    $group: {
      _id: {
        administrativeCode:
          "$_id.administrativeCode",
        provinceName: "$provinceName",
        cityName: "$cityName",
        administrativeDistrictName:
          "$administrativeDistrictName",
        date: "$date",
        day: "$day"
      },
      population: {
        $push: {
          timeZone: "$_id.timeZone",
          totalPeople: "$totalPeople"
        }
      }
    }
  }
]);
```
</details>

## 행정동 내 성별 및 연령대별 인구 변화
| 해당 행정구역 내 특정 요일, 시간대 기준 생활 인구 수 변화 분석  
<br/> 

![image](https://s6.ezgif.com/tmp/ezgif-6-0fac8245d4.gif)  
![image](https://github.com/wonil-programmer/vuisiness/assets/74577811/fb477ed7-bce7-40ed-9743-2146e2835491)


<details>
  <summary>Query</summary>

  ```sql
  
  db.populations.aggregate([
  {
    $match: {
      행정동코드: 11590630,  //행정동코드
      시간대구분: 1 //시간대
    }
  },
  {
    //0시~23시 총 생활 인구 수 통계
    $group: {
      _id: {
        timeZone: "$시간대구분",
        administrativeCode: "$행정동코드"
      },
      totalPeople: {
        $avg: {
          $trunc: "$총생활인구수"
        }
      },
      male0To9: {
        $avg: {
          $trunc: "$남자0세부터9세생활인구수"
        }
      },
      male10To19: {
        $avg: {
          $trunc: "$남자10세부터19세생활인구수"
        }
      },
      male20To29: {
        $avg: {
          $trunc: "$남자20세부터29세생활인구수"
        }
      },
      male30To39: {
        $avg: {
          $trunc: "$남자30세부터39세생활인구수"
        }
      },
      male40To49: {
        $avg: {
          $trunc: "$남자40세부터49세생활인구수"
        }
      },
      male50To59: {
        $avg: {
          $trunc: "$남자50세부터59세생활인구수"
        }
      },
      male60To69: {
        $avg: {
          $trunc: "$남자60세부터69세생활인구수"
        }
      },
      male70To: {
        $avg: {
          $trunc: "$남자70세이상생활인구수"
        }
      },
      female0To9: {
        $avg: {
          $trunc: "$여자0세부터9세생활인구수"
        }
      },
      female10To19: {
        $avg: {
          $trunc: "$여자10세부터19세생활인구수"
        }
      },
      female20To29: {
        $avg: {
          $trunc: "$여자20세부터29세생활인구수"
        }
      },
      female30To39: {
        $avg: {
          $trunc: "$여자30세부터39세생활인구수"
        }
      },
      female40To49: {
        $avg: {
          $trunc: "$여자40세부터49세생활인구수"
        }
      },
      female50To59: {
        $avg: {
          $trunc: "$여자50세부터59세생활인구수"
        }
      },
      female60To69: {
        $avg: {
          $trunc: "$여자60세부터69세생활인구수"
        }
      },
      female70To: {
        $avg: {
          $trunc: "$여자70세이상생활인구수"
        }
      }
    }
  },
  {
    $addFields: {
      male: [
        "$male0To9",
        "$male10To19",
        "$male20To29",
        "$male30To39",
        "$male40To49",
        "$male50To59",
        "$male60To69",
        "$male70To"
      ],
      female: [
        "$female0To9",
        "$female10To19",
        "$female20To29",
        "$female30To39",
        "$female40To49",
        "$female50To59",
        "$female60To69",
        "$female70To"
      ],
      label: [
        "0~9세",
        "10~19세",
        "20~29세",
        "30~39세",
        "40~49세",
        "50~59세",
        "60~69세",
        "70세이상"
      ]
    }
  },
  {
    $project: {
      _id: 1,
      totalPeople: 1,
      male: 1,
      female: 1,
      label: 1
    }
  }
]);
```
</details>

## 시군구내 연령대별 소비 선호도 분석
| 해당 시군구 내 특정 성별, 연령대 별 카드 사용 금액 상위 분류 파악 및 비교 
<br/> 

![image](https://s6.ezgif.com/tmp/ezgif-6-5d858f3d4e.gif)  
![image](https://github.com/wonil-programmer/vuisiness/assets/74577811/d86aaf3b-5773-47fd-984b-b621708745c4)


<details>
  <summary>Query</summary>

  ```sql
  
  db.consumptiontrends.aggregate([
  {
    $match: {
      성별코드: 2,
      //genderCode
      연령대코드: 20,
      //ageCode
      광역시도명: "서울특별시",
      //cityName
      시군구명: "마포구" //provinceName
    }
  },
  {
    $group: {
      _id: {
        largeCategory: "$가맹점업종분류명_대",
        smallCategory: "$가맹점업종분류명",
        genderCode: "$성별코드",
        ageCode: "$연령대코드"
      },
      sumOfConsumption: {
        $sum: "$금액지표"
      },
      countOfConsumption: {
        $sum: "$건수지표"
      },
      cityName: {
        $first: "$광역시도명"
      },
      provinceName: {
        $first: "$시군구명"
      }
    }
  },
  {
    $sort: {
      //총 사용금액 많은 순서대로 출력
      sumOfConsumption: -1
    }
  },
  {
    $limit: 10
  }
] );
```
</details>


## 시군구 내 인기 업종 분석
| 해당 시군구 내 업종 별 상가 수 파악을 통한 인기 업종 추론  
<br/> 

![image](https://s6.ezgif.com/tmp/ezgif-6-fea3064910.gif)  
![image](https://github.com/wonil-programmer/vuisiness/assets/74577811/272196bf-680e-4963-b830-72f9ec8b2cbe)


<details>
  <summary>Query</summary>

  ```sql
  
  db.commercialdistricts.aggregate([
  {
    $match: { 행정동코드: 27290625 } // 특정 행정동 코드로 필터링
  },
  {
    $group: {
      _id: "$표준산업분류명", // 표준산업분류명별로 그룹화
      count: { $sum: 1 },
      행정동코드: { $first: "$행정동코드" },
      상권업종대분류명: { $first: "$상권업종대분류명" },
      상권업종소분류명: { $first: "$상권업종소분류명" },
      시도명: { $first: "$시도명" },
      시군구명: { $first: "$시군구명" },
      행정동명: { $first: "$행정동명" }
    }
  },
  {
    $project: {
      _id: 0,
      standardCategory: "$_id",
      count: 1,
      administrativeDistrictCode: "$행정동코드",
      largeCategory: "$상권업종대분류명",
      smallCategory: "$상권업종소분류명",
      cityName: "$시도명",
      provinceName: "$시군구명",
      administrativeDistrictName: "$행정동명"
    }
  },
  {
    $sort: { count: -1 }
  },
  {
    $limit: 10
  }
]);
```
</details>


## 평일 점심 인기 식당 기회 분석
| 해당 행정구역 내 평일 점심 가장 많은 생활인구의 카드 매출을 바탕으로 인기가 많을 것으로 예상되는 식당 추론  
<br/> 

![image](https://s6.ezgif.com/tmp/ezgif-6-f0fd07b0ba.gif)  
![image](https://github.com/wonil-programmer/vuisiness/assets/74577811/f2b9ced6-4f4a-4f19-9bba-d7b6826930f5)


<details>
  <summary>Query</summary>

  ```sql
  
  db.populations.aggregate([
  {
    $match: {
      행정동코드: 11650621,
      요일: {
        $in: ["월", "화", "수", "목", "금"]
      },
      시간대구분: {
        $gte: 11,
        $lte: 14
      }
    }
  },
  {
    $group: {
      _id: "$행정동코드",
      male0To9: {
        $avg: {
          $trunc: "$남자0세부터9세생활인구수"
        }
      },
      male10To19: {
        $avg: {
          $trunc: "$남자10세부터19세생활인구수"
        }
      },
      male20To29: {
        $avg: {
          $trunc: "$남자20세부터29세생활인구수"
        }
      },
      male30To39: {
        $avg: {
          $trunc: "$남자30세부터39세생활인구수"
        }
      },
      male40To49: {
        $avg: {
          $trunc: "$남자40세부터49세생활인구수"
        }
      },
      male50To59: {
        $avg: {
          $trunc: "$남자50세부터59세생활인구수"
        }
      },
      male60To69: {
        $avg: {
          $trunc: "$남자60세부터69세생활인구수"
        }
      },
      male70To: {
        $avg: {
          $trunc: "$남자70세이상생활인구수"
        }
      },
      female0To9: {
        $avg: {
          $trunc: "$여자0세부터9세생활인구수"
        }
      },
      female10To19: {
        $avg: {
          $trunc: "$여자10세부터19세생활인구수"
        }
      },
      female20To29: {
        $avg: {
          $trunc: "$여자20세부터29세생활인구수"
        }
      },
      female30To39: {
        $avg: {
          $trunc: "$여자30세부터39세생활인구수"
        }
      },
      female40To49: {
        $avg: {
          $trunc: "$여자40세부터49세생활인구수"
        }
      },
      female50To59: {
        $avg: {
          $trunc: "$여자50세부터59세생활인구수"
        }
      },
      female60To69: {
        $avg: {
          $trunc: "$여자60세부터69세생활인구수"
        }
      },
      female70To: {
        $avg: {
          $trunc: "$여자70세이상생활인구수"
        }
      }
    }
  },
  {
    $project: {
      maxPopulationFields: {
        $concatArrays: [
          [
            {
              ageCode: 0,
              genderCode: 1,
              population: "$male0To9"
            },
            {
              ageCode: 10,
              genderCode: 1,
              population: "$male10To19"
            },
            {
              ageCode: 20,
              genderCode: 1,
              population: "$male20To29"
            },
            {
              ageCode: 30,
              genderCode: 1,
              population: "$male30To39"
            },
            {
              ageCode: 40,
              genderCode: 1,
              population: "$male40To49"
            },
            {
              ageCode: 50,
              genderCode: 1,
              population: "$male50To59"
            },
            {
              ageCode: 60,
              genderCode: 1,
              population: "$male60To69"
            },
            {
              ageCode: 70,
              genderCode: 1,
              population: "$male70To"
            },
            {
              ageCode: 0,
              genderCode: 2,
              population: "$female0To9"
            },
            {
              ageCode: 10,
              genderCode: 2,
              population: "$female10To19"
            },
            {
              ageCode: 20,
              genderCode: 2,
              population: "$female20To29"
            },
            {
              ageCode: 30,
              genderCode: 2,
              population: "$female30To39"
            },
            {
              ageCode: 40,
              genderCode: 2,
              population: "$female40To49"
            },
            {
              ageCode: 50,
              genderCode: 2,
              population: "$female50To59"
            },
            {
              ageCode: 60,
              genderCode: 2,
              population: "$female60To69"
            },
            {
              ageCode: 70,
              genderCode: 2,
              population: "$female70To"
            }
          ]
        ]
      }
    }
  },
  {
    $unwind: {
      path: "$maxPopulationFields",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $sort: {
      "maxPopulationFields.population": -1
    }
  },
  {
    $limit: 1
  },
  {
    $lookup: {
      //여러 연령대가 나오는 경우의 쿼리 수정 v필요
      from: "consumptiontrends",
      let: {
        ageCode: "$maxPopulationFields.ageCode",
        genderCode:
          "$maxPopulationFields.genderCode"
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: [
                    "$연령대코드",
                    "$$ageCode"
                  ]
                },
                {
                  $eq: [
                    "$성별코드",
                    "$$genderCode"
                  ]
                },
                {
                  $eq: [
                    "$가맹점업종분류명_대",
                    "음식"
                  ]
                }
              ]
            }
          }
        }
      ],
      as: "consumptions"
    }
  },
  {
    $unwind: {
      path: "$consumptions",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $group: {
      _id: "$consumptions.가맹점업종분류명",
      ageCode: {
        $first: "$maxPopulationFields.ageCode"
      },
      genderCode: {
        $first: "$maxPopulationFields.genderCode"
      },
      count: {
        $sum: "$consumptions.금액지표"
      },
      administrativeCode: {
        $first: "$_id"
      }
    }
  },
  {
    $sort: {
      count: -1
    }
  },
  {
    $limit: 10
  },
  {
    $lookup: {
      from: "commercialdistricts",
      let: {
        searchId: "$_id",
        administrativeCode: "$administrativeCode"
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: [
                    "$행정동코드",
                    "$$administrativeCode"
                  ]
                },
                {
                  $or: [
                    {
                      $regexMatch: {
                        input: "$표준산업분류명",
                        regex: "$$searchId",
                        options: "i"
                      }
                    },
                    {
                      $regexMatch: {
                        input: "$상호명",
                        regex: "$$searchId",
                        options: "i"
                      }
                    },
                    {
                      $regexMatch: {
                        input:
                          "$상권업종소분류명",
                        regex: "$$searchId",
                        options: "i"
                      }
                    }
                  ]
                }
              ]
            }
          }
        },
        {
          // 필요한 필드만 선택
          $project: {
ageCode:1,
        genderCode:1,
            행정동코드: 1,
            상권업종소분류명: 1,
            표준산업분류명: 1
          }
        }
      ],
      as: "matchingDistricts"
    }
  }
]);
```
</details>

## 주말 인기 지역에서의 숙박업 기회 분석
| 평일 대비 주말 생활 인구 변화폭이 큰 행정동 내 숙박업 현황 분석  
<br/> 

![image](https://s6.ezgif.com/tmp/ezgif-6-4c6972241e.gif)  
![image](https://github.com/wonil-programmer/vuisiness/assets/74577811/43020e7a-597c-4fe7-a33a-ba1824bc103b)



<details>
  <summary>Query</summary>

  ```sql
  
  db.populations.aggregate([
  {
    $facet: {
      weekdays: [
        {
          $match: {
            요일: {
              $in: ["월", "화", "수", "목", "금"]
            }
          }
        },
        {
          $group: {
            _id: "$행정동코드",
            averageWeekdayPopulation: {
              $avg: "$총생활인구수"
            }
          }
        }
      ],
      weekends: [
        {
          $match: {
            요일: {
              $in: ["토", "일"]
            }
          }
        },
        {
          $group: {
            _id: "$행정동코드",
            averageWeekendPopulation: {
              $avg: "$총생활인구수"
            }
          }
        }
      ]
    }
  },
  {
    $unwind: {
      path: "$weekdays",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $project: {
      weekdays: 1,
      matchingWeekend: {
        $filter: {
          input: "$weekends",
          as: "weekend",
          cond: {
            $eq: [
              "$$weekend._id",
              "$weekdays._id"
            ]
          }
        }
      }
    }
  },
  {
    $project: {
      administrativeCode: "$weekdays._id",
      weekdaysAveragePopulation:
        "$weekdays.averageWeekdayPopulation",
      weekendAveragePopulation: {
        $arrayElemAt: [
          "$matchingWeekend.averageWeekendPopulation",
          0
        ]
      }
    }
  },
  {
    $project: {
      administrativeCode: 1,
      weekdaysAveragePopulation: 1,
      weekendAveragePopulation: 1,
      populationDifference: {
        $subtract: [
          "$weekendAveragePopulation",
          "$weekdaysAveragePopulation"
        ]
      }
    }
  },
  {
    $sort: {
      populationDifference: -1
    }
  },
  {
    $limit: 3
  },
  {
    $lookup: {
      from: "commercialdistricts",
      let: {
        administrativeCode: "$administrativeCode"
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: [
                    "$상권업종대분류명",
                    "숙박"
                  ]
                },
                {
                  $eq: [
                    "$행정동코드",
                    "$$administrativeCode"
                  ]
                }
              ]
            }
          }
        }
      ],
      as: "matchingDistricts"
    }
  },
  {
    $unwind: {
      path: "$matchingDistricts",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $group: {
      _id: {
        administrativeCode: "$administrativeCode",
        smallCategory:
          "$matchingDistricts.상권업종소분류명"
      },
      populationDifference: {
        $first: "$populationDifference"
      },
      cityName: {
        $first: "$matchingDistricts.시도명"
      },
      provinceName: {
        $first: "$matchingDistricts.시군구명"
      },
      administrativeCode: {
        $first: "$matchingDistricts.행정동명"
      },
      stayCount: {
        $sum: 1
      }
    }
  },
  {
    $sort: {
      stayCount: -1
    }
  },
  {
    $group: {
      _id: "$_id.administrativeCode",
      populationDifference: {
        $first: "$populationDifference"
      },
      cityName: {
        $first: "$cityName"
      },
      provinceName: {
        $first: "$provinceName"
      },
      administrativeCode: {
        $first: "$administrativeCode"
      },
      stay: {
        $push: {
          smallCategory: "$_id.smallCategory",
          stayCount: "$stayCount"
        }
      }
    }
  },
  {
    $sort: {
      populationDifference: -1
    }
  }
]);
```
</details>

## 시군구 내 식당 경쟁분석 및 기회 포착
| 해당 시군구 내 식당 소비 데이터와 상권 데이터 분석을 바탕으로 어떤 종류의 식당이 높은 매출을 올리는지 파악  
<br/> 
![image](https://s6.ezgif.com/tmp/ezgif-6-fb63539b8d.gif)  
![image](https://github.com/wonil-programmer/vuisiness/assets/74577811/4dd005c7-83e1-42ef-88a3-9259ffecf2ac)


#
<details>
  <summary>Query</summary>

  ```sql
  
  db.consumptiontrends.aggregate([
  {
    $match: {
      광역시도명: "서울",
      시군구명: "마포구",
      가맹점업종분류명_대: "음식"
    }
  },
  {
    $group: {
      _id: "$가맹점업종분류명_소",
      avgConsumption: {
        $avg: "$금액지표"
      },
      provinceName: {
        $first: "$시군구명"
      }
    }
  },
  {
    $lookup: {
      from: "commercialdistricts",
      let: {
        searchId: "$_id",
        provinceName: "$provinceName"
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                {
                  $and: [
                    {
                      $eq: [
                        "$시도명",
                        "서울특별시"
                      ]
                    },
                    {
                      $eq: [
                        "$시군구명",
                        "$$provinceName"
                      ]
                    },
                    {
                      $and: [
                        {
                          $eq: [
                            {
                              $type:
                                "$상권업종소분류명"
                            },
                            "string"
                          ]
                        },
                        {
                          $regexMatch: {
                            input:
                              "$상권업종소분류명",
                            regex: "$$searchId",
                            options: "i"
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          }
        }
      ],
      as: "matchingDistricts"
    }
  },
  {
    $project: {
      avgConsumption: 1,
      //평균 카드 지출
      provinceName: 1,
      itemSize: {
        //상가 갯수
        $size: "$matchingDistricts"
      },
      "matchingDistricts.상호명": 1
    }
  }
]);
```
</details> 

<br/>  

## 최적화 - Indexing

- db.populations.createIndex({행정동코드:1, 요일:1, 시간대구분:1});
- db.populations.createIndex({행정동코드:1, 시간대구분:1});
- db.commercialdistricts.createIndex({행정동코드:1});
- db.consumptiontrends.createIndex({광역시도명:1, 시군구명:1, 가맹점업종분류명_대:1})
- db.commercialdistricts.createIndex({시도명:1, 시군구명:1});

![image](https://github.com/wonil-programmer/vuisiness/assets/74577811/415720d1-358e-4f1a-9a5c-0f524cf93959)

<br/>  
✨ 쿼리 실행시간, 검사된 문서 수 감소 -> 성능 향상 !! ✨

<br/>
