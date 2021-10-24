import React, { useEffect } from "react";
import { Line } from "react-chartjs-2";

const MoneyChart = (props) => {
  const data = {
    labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Million",
        data: [12, 19, 3, 5, 2, 3],
        fill: true,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  useEffect(() => {
    props.setTitle("Money Chart");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded mt-3">
      <div className="header">
        <h1 className="title">Revenue 2021</h1>
      </div>
      <Line data={data} options={options} />
    </div>
  );
};

export default MoneyChart;
