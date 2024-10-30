import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const BitcoinChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Bitcoin Price (USD)',
      data: [],
      borderColor: 'rgba(75,192,192,1)',
      backgroundColor: 'rgba(75,192,192,0.2)',
      pointRadius: 0,
      fill: true,
      borderWidth: 2,
    }],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/bitcoin/market_chart');
        const data = await response.json();
        const labels = data.prices.map(item => new Date(item[0]).toLocaleTimeString());
        const prices = data.prices.map(item => item[1]);

        setChartData({
          labels,
          datasets: [{
            ...chartData.datasets[0],
            data: prices,
          }],
        });
      } catch (error) {
        console.error('Error fetching Bitcoin data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Line data={chartData} options={{
        responsive: true,
        plugins: {
          legend: { display: true },
        },
        scales: {
          x: {
            type: 'category',
            title: { display: true, text: 'Time' },
          },
          y: {
            title: { display: true, text: 'Price (USD)' },
            beginAtZero: false,
          },
        },
      }} />
    </div>
  );
};

export default BitcoinChart;
