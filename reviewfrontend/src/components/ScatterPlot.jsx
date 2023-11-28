import React from 'react';
import { Scatter } from 'react-chartjs-2';
import 'chart.js/auto';

const ScatterPlot = ({ clusterData }) => {
  // Generate random colors for each cluster
  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 0.5)`;
  };

  // Prepare the data for the Scatter plot
  const data = {
        datasets: clusterData.map((cluster) => ({
            label: `Cluster ${cluster.id}`,
            data: cluster.points,
            backgroundColor: generateRandomColor(),
            hoverBackgroundColor: generateRandomColor(),
        })),
    };

  // Options for the Scatter plot
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Cluster Visualization',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'X Coordinate',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Y Coordinate',
        },
      },
    },
  };

  return <Scatter data={data} options={options} />;
};

export default ScatterPlot;
