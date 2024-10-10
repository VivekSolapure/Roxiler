import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Barchart = ({ statistics }) => {
  // Example price range categories (adjust based on actual statistics if necessary)
  const priceRanges = [
    { label: '0-100', min: 0, max: 100 },
    { label: '101-200', min: 101, max: 500 },
    { label: '201-300', min: 101, max: 500 },
    { label: '301-400', min: 101, max: 500 },
    { label: '401-500', min: 101, max: 500 },
    { label: '501-600', min: 101, max: 500 },
    { label: '601-700', min: 101, max: 500 },
    { label: '701-800', min: 101, max: 500 },
    { label: '801-900', min: 101, max: 500 },
    { label: '901-1000', min: 101, max: 500 }

  ];

  // Example data (you can replace this with actual data from `statistics`)
  const data = {
    labels: priceRanges.map(range => range.label),  // Properly assign price range labels
    datasets: [
      {
        label: 'Items Sold',  // Label for the chart
        data: [statistics.totalSoldItem],  // Example data points (replace with actual data)
        backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Bar colors
        borderColor: 'rgba(75, 192, 192, 1)',  // Bar border colors
        borderWidth: 1,
      },
      {
        label: 'Items Sold',  // Label for the chart
        data: [statistics.totalNotSoldItem],  // Example data points (replace with actual data)
        backgroundColor: 'rgba(7, 19, 19, 0.2)',  // Bar colors
        borderColor: 'rgba(7, 192, 192, 1)',  // Bar border colors
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales by Price Range',
      },
    },
  };

  return (
    <div className="bar-chart-page" style={{ width: '80%', height: '400px', margin: 'auto' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Barchart;
