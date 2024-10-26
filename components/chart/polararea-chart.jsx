import { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ChartDataLabels);

// PolarArea 그래프
export default function PolarAreaChart({ labels, label, data }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      const context = chartRef.current.getContext("2d");

      const newChart = new Chart(context, {
        type: "polarArea",
        data: {
          labels: labels,
          datasets: [
            {
              label: label,
              data: data,
              backgroundColor: [
                "rgba(255, 99, 132, 0.8)",
                "rgba(255, 159, 64, 0.8)",
                "rgba(255, 205, 86, 0.8)",
                "rgba(75, 192, 192, 0.8)",
                "rgba(54, 162, 235, 0.8)",
                "rgba(153, 102, 255, 0.8)",
                "rgba(201, 203, 207, 0.8)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(255, 205, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(201, 203, 207, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            datalabels: {
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
