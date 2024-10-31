import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const StockChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/stock');
        const data = await response.json();

        // Get the last 6 months of data
        const recentData = data.data.slice(0, 6).reverse(); // Adjust the slice number as needed
        
        // Extract dates and values for the filtered data
        const dates = recentData.map(entry => entry.date);
        const values = recentData.map(entry => parseFloat(entry.value));
        
        setChartData({
          labels: dates,
          datasets: [
            {
              label: `${data.name} (${data.unit})`,
              data: values,
              fill: false,
              borderColor: 'rgba(75,192,192,1)',
              tension: 0.1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchStockData();
  }, []);

  return (
    <div>
      {chartData ? (
        <Line data={chartData} options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Recent Stock Price Details',
            },
            legend: {
              position: 'top',
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Date',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Price (USD)',
              },
            },
          },
        }} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default StockChart;
