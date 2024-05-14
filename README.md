<div align="center">
<img src="https://github.com/user-attachments/assets/e05c8ab9-1df0-4a08-83df-ab0850363706" width="112px"/>
</div>

<div align="center">
<h2>
Vuisiness
</h2>
<h5>
사용자의 주변 상권과 관련한 통계 데이터를 보여주는 서비스
</h5>
<a href="https://youtube.com/shorts/6wWa0688CdI">시연 영상</a>
<br />
<small>
2024.04~2024.06
</small>
</div>

###### 개발 배경

평소 주변에서 어느 위치에서 어떤 사업이 잘 되는지에 관심이 많았습니다. 사업의 흥망은 지리적 위치, 유동 인구 등 여러 요인들이 결정한다고 생각했고, 이를 분석한 데이터를 보여주는 서비스를 제작하고자 했습니다.

###### 사용 기술

<div>
<img src="https://img.shields.io/badge/Tailwind%20Css-06B6D4?style=for-the-badge&logo=TailwindCSS&logoColor=white">
<img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white">
<img src="https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white">
<img src="https://img.shields.io/badge/Next.JS-black?style=for-the-badge&logo=next.js&logoColor=white">
<img src="https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white">
<img src="https://img.shields.io/badge/recoil-3578E5?style=for-the-badge&logo=recoil&logoColor=white">
<img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white">
</div>

###### 협업 도구

<img src="https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white">

###### 공공 빅데이터 출처

[소상공인시장진흥공단\_상가(상권)정보 - 공공데이터포털](https://www.data.go.kr/data/15083033/fileData.do)
<br />
[행정동 단위 서울 생활인구(내국인) - 서울 열린데이터 광장](https://data.seoul.go.kr/dataList/OA-14991/S/1/datasetView.do)
<br />
[성별/연령대 별 BC카드 결제 금액 통계 데이터 - KT 통신 빅데이터 플랫폼](https://www.bigdata-telecom.kr/invoke/SOKBP0000/?ver=3.0)

###### 시작 가이드

```bash
    npm install
    npm run dev
```

---

### ✨ 주요 기능

#### 지도 상권 표시 📍

<p align="center">
<img src="https://github.com/user-attachments/assets/2d93c9f7-04e7-4fbc-a2cb-875a5a2a9332" width="420px">
</p>

- [카카오 지도 api](https://apis.map.kakao.com/web/)와 [카카오 로컬 api](https://developers.kakao.com/docs/latest/ko/local/dev-guide#coord-to-district)를 활용해 지도에 상권 위치를 표시하고 대/중/소 분류로 나누어 보여주는 기능
  - MongoDB의 [GeoJSON](https://www.mongodb.com/ko-kr/docs/manual/reference/geojson/)으로 반경 N미터의 데이터만 가져오게 구현
  - Recoil로 상권과 행정동 정보를 전역 상태로 관리해 Props Drilling 방지

#### 통계 차트 📊

##### 공통

- React memo 사용해 차트 리렌더링 방지

<br />

##### 행정동 내 인기 업종 분석

<p align="center">
<img src="https://github.com/user-attachments/assets/753a30d3-3082-4e6a-9c9b-23572b9a3509" width="420px" />
</p>

- Chart.js의 [Doughnut Chart](https://www.chartjs.org/docs/latest/charts/doughnut.html)를 활용해 행정구역 내 업종별 상권 수 파악을 통한 인기 업종 비율 제공

<br />

##### 행정동 내 시간대별 인구 변화 > 성별 및 연령대별 인구 변화

<p align="center">
<img src="https://github.com/user-attachments/assets/7932762f-35c7-4308-a0ef-c604db2bc54c" width="420px" />
</p>
<p align="center">
<img src="https://github.com/user-attachments/assets/fbe9c233-000d-41bb-acd4-fc91356ff849" width="420px" />
</p>

- Chart.js의 [Bar Chart](https://www.chartjs.org/docs/latest/charts/bar.html)를 활용해
  - 해당 행정구역 내 특정 요일의 시간대별(0시~23시) 생활 인구 수 변화추이를 제공
  - 특정 요일과 시간대 기준 생활 남녀 비율을 제공

<br />

##### 행정동 내 연령대별 소비 선호도 분석

<p align="center">
<img src="https://github.com/user-attachments/assets/6d4a5058-78c0-4d69-a237-9504877da8d7" width="420px" />
</p>

- Chart.js의 [Polar Area Chart](https://www.chartjs.org/docs/latest/charts/polar.html)를 활용해 해당 행정구역 내 특정 성별, 연령대 별 카드 사용 금액 상위 분류를 제공

<br />

##### 행정동 내 주중 점심 인기 식당

<p align="center">
<img src="https://github.com/user-attachments/assets/7959d114-004f-4acf-8fd2-2efe94cb3f64" width="420px" />
</p>

- Chart.js의 [Radar Chart](https://www.chartjs.org/docs/latest/charts/radar.html)를 활용해 해당 행정구역 내 주중 점심의 가장 많은 생활인구를 파악한 후, 해당 생활인구의 카드 매출을 바탕으로 인기 식당 분류를 제공

<br />

##### 행정동 내 식당 개수과 매출 상관관계

<p align="center">
<img src="https://github.com/user-attachments/assets/658c4d38-1b42-4d9c-aa47-ce777ccbab33" />
</p>

- Chart.js의 [Scatter Chart](https://www.chartjs.org/docs/latest/charts/scatter.html)를 활용해 행정구역 내 식당 개수과 매출 상관관계를 제공

<br />

##### 주말 생활 인구가 많은 지역에서의 인기 숙박업

<p align="center">
<img src="https://github.com/user-attachments/assets/1fa0a921-93d0-40e5-b9c3-7ffa8c671c5d" />
</p>

- Chart.js의 [Pie Chart](https://www.chartjs.org/docs/latest/charts/doughnut.html)를 활용해 주중 대비 주말 생활 인구 변화폭이 큰 행정동 내 숙박업 현황 제공

---

### 🤝 팀원 소개

| 담당       | 이름   | GitHub 아이디                               |
| ---------- | ------ | ------------------------------------------- |
| DB 관리    | 김민주 | [alswnsp411](https://github.com/alswnsp411) |
| 프론트엔드 | 허원일 | [wonza-hub](https://github.com/wonza-hub)   |
