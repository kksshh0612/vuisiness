"use client";

import { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ChartDataLabels);

// 막대 그래프
export default function BarChart({
  labels,
  label,
  data,
  setSelectedGraphBarIdx,
}) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      const context = chartRef.current.getContext("2d");

      const newChart = new Chart(context, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: label,
              data: data,
              backgroundColor: "rgba(75, 192, 192, 0.8)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
              barThickness: 18,
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
          onClick: async (event, elements) => {
            if (elements.length > 0) {
              const elementIndex = elements[0].index;
              setSelectedGraphBarIdx(elementIndex);
            }
          },
          // 차트 위 텍스트 스타일 관련
          plugins: {
            datalabels: {
              font: {
                size: 10,
              },
              color: "#fff",
              anchor: "end",
              align: "end",
              offset: -10,
              borderRadius: 8,
              backgroundColor: function (context) {
                return context.dataset.backgroundColor;
              },
              formatter: (value, context) => {
                return `${Math.floor(value)}`;
              },
            },
          },
        },
      });

      chartRef.current.chart = newChart;
    }
  }, [labels, label, data, setSelectedGraphBarIdx]);

  return (
    <div className={"w-full"}>
      <canvas className={"w-full"} ref={chartRef} />
    </div>
  );
}
