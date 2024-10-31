import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const ExchangeRateChart = () => {
  const [exchangeRateData, setExchangeRateData] = useState([]);

  useEffect(() => {
    const fetchExchangeRateData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/exchange-rate');
        setExchangeRateData(response.data);
      } catch (error) {
        console.error('Error fetching exchange rate data:', error);
      }
    };

    fetchExchangeRateData();
  }, []);

  const chartData = {
    labels: exchangeRateData.map(data => data.date),
    datasets: [
      {
        label: 'EUR to USD',
        data: exchangeRateData.map(data => data.close),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div>
      <h2 style={{color:"#333"}}>EUR to USD Exchange Rate</h2>
      <Line data={chartData} />
    </div>
  );
};

export default ExchangeRateChart;
