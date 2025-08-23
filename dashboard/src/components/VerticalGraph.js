// import React from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Bar } from "react-chartjs-2";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// export const options = {
//   responsive: true,
//   plugins: {
//     legend: {
//       position: "top",
//     },
//     title: {
//       display: true,
//       text: "Holdings",
//     },
//   },
// };

// export function VerticalGraph({ data }) {
//   return <Bar options={options} data={data} />;
// }

// dashboard/src/components/VerticalGraph.js
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function VerticalGraph({ holdings }) {
  if (!holdings || holdings.length === 0) {
    return <p>No holdings data available to display chart.</p>;
  }

  const labels = holdings.map((h) => h.stockSymbol);
  const investedData = holdings.map((h) => h.quantity * h.avgPrice);
  const currentData = holdings.map((h) => h.quantity * h.currentPrice);

  const data = {
    labels,
    datasets: [
      {
        label: "Invested Value",
        data: investedData,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Current Value",
        data: currentData,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Holdings Performance" },
    },
  };

  return <Bar data={data} options={options} />;
}

export default VerticalGraph;
