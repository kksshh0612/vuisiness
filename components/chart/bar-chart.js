// import { useRef, useEffect } from "react";
// import { Chart } from "chart.js/auto";

// export default function BarChart() {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     if (chartRef.current) {
//       if (chartRef.current.chart) {
//         chartRef.current.chart.destroy();
//       }

//       const context = chartRef.current.getContext("2d");

//       const newChart = new Chart(context, {
//         type: "bar",
//         data: {
//           // 라벨 지정을 직접할 수도 있고, datasets 내부의 data에서 명시할 수도 있음
//           // labels: ["John", "Jane", "Doe"],
//           datasets: [
//             {
//               label: "Info",
//               // data: [34, 64, 23],
//               // data: [
//               // data 명시
//               // // 1. 기본
//               // { x: "John", y: 25 },
//               // { x: "Jane", y: 36 },
//               // { x: "Doe", y: 77 },
//               // 2. 키 지정
//               // // option에서 parsing으로 키를 지정해야 함
//               // { name: "John", age: 25 },
//               // { name: "Jane", age: 36 },
//               // { name: "Doe", age: 77 },
//               // ],
//               // 3. 객체
//               data: {
//                 John: 25,
//                 Jane: 36,
//                 Doe: 77,
//               },
//               backgroundColor: [
//                 "rgba(255, 99, 132, 0.2)",
//                 "rgba(255, 159, 64, 0.2)",
//                 "rgba(255, 205, 86, 0.2)",
//                 "rgba(75, 192, 192, 0.2)",
//                 "rgba(54, 162, 235, 0.2)",
//                 "rgba(153, 102, 255, 0.2)",
//                 "rgba(201, 203, 207, 0.2)",
//               ],
//               borderColor: [
//                 "rgba(255, 99, 132, 0.2)",
//                 "rgba(255, 159, 64, 0.2)",
//                 "rgba(255, 205, 86, 0.2)",
//                 "rgba(75, 192, 192, 0.2)",
//                 "rgba(54, 162, 235, 0.2)",
//                 "rgba(153, 102, 255, 0.2)",
//                 "rgba(201, 203, 207, 0.2)",
//               ],
//               borderWidth: 1,
//             },
//           ],
//         },
//         options: {
//           // parsing: {
//           //   xAxisKey: "name",
//           //   yAxisKey: "age",
//           // },
//           responsive: true,
//           scales: {
//             x: {
//               type: "category",
//             },
//             y: {
//               beginAtZero: true,
//             },
//           },
//         },
//       });

//       chartRef.current.chart = newChart;
//     }
//   }, []);

//   return (
//     <div style={{ position: "relative", width: "90vw", height: "80vh" }}>
//       <canvas ref={chartRef} />
//     </div>
//   );
// }

import { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";

export default function BarChart({ chartData }) {
  console.log(chartData);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      const context = chartRef.current.getContext("2d");
      const {
        _id: { administrativeDistrictName },
        population,
      } = chartData;

      const newChart = new Chart(context, {
        type: "bar",
        data: {
          labels: population.map((p) => p.timeZone + "시"),
          datasets: [
            {
              label: administrativeDistrictName,
              data: population.map((p) => p.totalPeople),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: "category",
            },
            y: {
              beginAtZero: false,
            },
          },
        },
      });

      chartRef.current.chart = newChart;
    }
  }, [chartData]);

  return (
    <div style={{ position: "relative", width: "45%", margin: "2.5%" }}>
      <canvas ref={chartRef} />
    </div>
  );
}
