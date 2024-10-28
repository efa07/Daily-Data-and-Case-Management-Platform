import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FinancialChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        borderColor: '',
        backgroundColor: '',
      },
    ],
  });
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/financial-data');
        const dailyData = response.data['Time Series FX (Daily)'];

        const dates = Object.keys(dailyData).sort();
        const closePrices = dates.map(date => parseFloat(dailyData[date]['4. close']));

        setChartData({
          labels: dates,
          datasets: [
            {
              label: 'EUR to USD Daily Closing Price',
              data: closePrices,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderWidth: 1,
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching financial data', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>EUR to USD Daily Closing Price</h2>
      <Line data={chartData} />
    </div>
  );
};

export default FinancialChart;
