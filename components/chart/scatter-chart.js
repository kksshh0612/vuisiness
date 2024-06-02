import { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";

export default function ScatterChart() {
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
          labels: ["1", "2", "3"],
          datasets: [
            {
              label: "Info",
              data: [34, 64, 23],
              backgroundColor: ["rgba(255, 99, 132, 0.2)"],
              borderColor: ["rgba(201, 203, 207, 0.2)"],
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
        },
      });

      chartRef.current.chart = newChart;
    }
  }, []);

  return (
    <div style={{ position: "relative", width: "90vw", height: "80vh" }}>
      <canvas ref={chartRef} />
    </div>
  );
}
