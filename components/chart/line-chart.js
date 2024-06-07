import { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";

export default function LineChart({ labels, label, data }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      const context = chartRef.current.getContext("2d");

      const newChart = new Chart(context, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label,
              data,
              fill: false,
              backgroundColor: "rgba(75, 192, 192, 0.8)",
              borderColor: "rgb(75, 192, 192, 1)",
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: "linear",
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      chartRef.current.chart = newChart;
    }
  }, [labels, label, data]);

  return (
    <div style={{ position: "relative", width: "90vw", height: "80vh" }}>
      <canvas ref={chartRef} />
    </div>
  );
}
