"use client";

import { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ChartDataLabels);

// 이중 막대 그래프
export default function DoubleBarChart({
  labels,
  label,
  firstData,
  secondData,
  setSelectedGraphBarIdx,
  setSelectedGraphBarLabel,
  unit,
}) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      const context = chartRef.current.getContext("2d");
      const [firstLabel, secondLabel] = label;
      const newChart = new Chart(context, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: firstLabel,
              data: firstData,
              backgroundColor: "rgba(54, 162, 235, 0.8)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
            {
              label: secondLabel,
              data: secondData,
              backgroundColor: "rgba(255, 99, 132, 0.8)",
              borderColor: "rgba(255, 99, 132, 1)",
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
              beginAtZero: true,
            },
          },
          onClick: async (event, elements) => {
            if (elements.length > 0) {
              const elementIndex = elements[0].index;
              const elementLabel =
                elements[0].element.$datalabels[0].$context.dataset.label;
              setSelectedGraphBarIdx(elementIndex);
              setSelectedGraphBarLabel(elementLabel);
            }
          },
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
  }, [
    labels,
    label,
    firstData,
    secondData,
    setSelectedGraphBarIdx,
    setSelectedGraphBarLabel,
  ]);

  return (
    <div className={"w-full"}>
      <canvas className={"w-full"} ref={chartRef} />
    </div>
  );
}
