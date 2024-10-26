import { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ChartDataLabels);

export default function RadarChart({ labels, label, data }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      const context = chartRef.current.getContext("2d");

      const newChart = new Chart(context, {
        type: "radar",
        data: {
          labels,
          datasets: [
            {
              label,
              data,
              fill: true,
              backgroundColor: "rgba(255, 99, 132, 0.8)",
              borderColor: "rgb(255, 99, 132, 1)",
              pointBackgroundColor: "rgb(255, 99, 132)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgb(255, 99, 132)",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            datalabels: {
              font: {
                size: 16,
              },
              color: "#fff",
              anchor: "center",
              align: "end",
              offset: 5,
              borderRadius: 8,
              backgroundColor: function (context) {
                return context.dataset.backgroundColor;
              },
              formatter: (value, context) => {
                return `${
                  context.chart.data.labels[context.dataIndex]
                }: ${value}`;
              },
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
