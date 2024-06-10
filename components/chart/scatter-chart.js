import { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ChartDataLabels);

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
                label: labels[index],
              })),
              backgroundColor: "rgb(255, 99, 132)",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            datalabels: {
              align: "end",
              anchor: "end",
              formatter: (value, context) =>
                context.dataset.data[context.dataIndex].label,
            },
          },
          scales: {
            x: {
              type: "linear",
              title: {
                display: true,
                text: "식당 갯수",
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "매출",
              },
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
