import { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ChartDataLabels);

export default function DoughnutChart({ labels, label, data, unit }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      const context = chartRef.current.getContext("2d");

      const newChart = new Chart(context, {
        type: "doughnut",
        data: {
          labels,
          datasets: [
            {
              label,
              data,
              backgroundColor: [
                "rgba(255, 0, 0, 0.8)",
                "rgba(255, 125, 32, 0.8)",
                "rgba(255, 205, 86, 0.8)",
                "rgba(25, 159, 64, 0.8)",
                "rgba(0, 0, 255, 0.8)",
                "rgba(153, 102, 255, 0.8)",
                "rgba(201, 203, 207, 0.8)",
                "rgba(75, 192, 192, 0.8)",
                "rgba(255, 9, 132, 0.8)",
                "rgba(255, 105, 86, 0.8)",
                "rgba(75, 92, 192, 0.8)",
                "rgba(200, 62, 135, 0.8)",
                "rgba(153, 102, 155, 0.8)",
                "rgba(201, 203, 107, 0.8)",
              ],
              borderColor: [
                "rgba(255, 0, 0, 1)",
                "rgba(255, 125, 32, 1)",
                "rgba(255, 205, 86, 1)",
                "rgba(25, 159, 64, 1)",
                "rgba(0, 0, 255, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(201, 203, 207, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(255, 9, 132, 1)",
                "rgba(255, 105, 86, 1)",
                "rgba(75, 92, 192, 1)",
                "rgba(200, 62, 135, 1)",
                "rgba(153, 102, 155, 1)",
                "rgba(201, 203, 107, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        // 차트 위 텍스트 관련 설정
        options: {
          responsive: true,
          plugins: {
            datalabels: {
              font: {
                size: 16,
              },
              color: "#fff",
              anchor: "middle",
              align: "middle",
              offset: 5,
              borderRadius: 8,
              backgroundColor: function (context) {
                return context.dataset.backgroundColor;
              },
              formatter: (value, context) => {
                return `${
                  context.chart.data.labels[context.dataIndex]
                }: ${value} ${unit}`;
              },
            },
          },
        },
      });

      chartRef.current.chart = newChart;
    }
  }, [label, labels, data, unit]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas ref={chartRef} />
    </div>
  );
}
