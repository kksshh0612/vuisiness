"use client";

import { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";

// 산점도 차트
export default function ScatterChart({ labels, label, data }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      const context = chartRef.current.getContext("2d");

      const newChart = new Chart(context, {
        type: "scatter",
        data: {
          datasets: [
            {
              label,
              data: data.map((point, index) => ({
                x: point.x,
                y: point.y,
                customLabel: labels[index], // 레이블을 데이터에 추가
              })),
              backgroundColor: "rgb(255, 99, 132)",
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: "linear",
              title: {
                display: true,
                text: "식당 개수",
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "카드 매출량",
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  return context.raw.customLabel; // 호버 시 레이블 표시
                },
              },
            },
            datalabels: {
              display: false, // 기본적으로 데이터 레이블을 표시하지 않음
            },
          },
        },
      });

      chartRef.current.chart = newChart;
    }
  }, [data, labels, label]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas ref={chartRef} />
    </div>
  );
}
