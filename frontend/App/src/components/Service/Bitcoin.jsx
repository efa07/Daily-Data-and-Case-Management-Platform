import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import "./bitcon.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [prevPrice, setPrevPrice] = useState(null);
  const [dataFetched, setDataFetched] = useState(false); // Flag to track if data has been fetched

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/bitcoin/market_chart');
        const data = await response.json();
        const labels = data.prices.map(item => new Date(item[0]).toLocaleTimeString());
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
    <div style={{ width: '100%',height: "260px" }}>
      <Line data={chartData}  />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </div>
  );
};

export default BitcoinChart;
