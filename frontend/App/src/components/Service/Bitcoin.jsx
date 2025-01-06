import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./bitcon.css";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

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
  const [prevPrice, setPrevPrice] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bitcoin/market_chart');
        const data = response.data;
        const labels = data.prices.map(item => new Date(item[0]).toLocaleDateString());
        const prices = data.prices.map(item => item[1]);
        const latestPrice = prices[prices.length - 1];

        // Set chart data
        setChartData({
          labels,
          datasets: [{
            ...chartData.datasets[0],
            data: prices,
          }],
        });

        // Check for significant change
        if (prevPrice && Math.abs((latestPrice - prevPrice) / prevPrice) > 0.05) { // e.g., 5% threshold
          toast.info(`Significant price change detected! New Price: $${latestPrice.toFixed(2)}`);
        }

        // Update previous price
        setPrevPrice(latestPrice);
        setDataFetched(true);

      } catch (error) {
        console.error('Error fetching Bitcoin data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Title for the chart */}
      <h2 className='ch2'>Bitcoin Price Chart</h2>

      {/* Chart */}
      <Line 
        data={chartData} 
        options={{
          plugins: {
            legend: {
              labels: {
                color: "#333", // Legend text color
              }
            }
          },
          scales: {
            x: {
              grid: {
                color: "rgba(200, 200, 200, 0.3)", // Light gray grid lines
              },
              title: {
                display: true,
                text: "Date",
                color: "#666", // Axis title color
              }
            },
            y: {
              grid: {
                color: "rgba(200, 200, 200, 0.3)", // Light gray grid lines
              },
              title: {
                display: true,
                text: "Price (USD)",
                color: "#666", // Axis title color
              },
              beginAtZero: false, // Allow the y-axis to start from the minimum value
            },
          },
        }} 
      />

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </div>
  );
};

export default BitcoinChart;