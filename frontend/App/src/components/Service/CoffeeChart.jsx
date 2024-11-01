// src/components/CoffeeChart.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import "./coffee.css";

const CoffeeChart = () => {
  const [coffeeData, setCoffeeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch coffee data from your own API endpoint
        const response = await axios.get('http://localhost:5000/api/coffee-data');
        console.log('Coffee Data from MongoDB:', response.data); // Log the data
        setCoffeeData(response.data);
      } catch (error) {
        console.error('Error fetching coffee data:', error);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: coffeeData.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Coffee Prices (cents per pound)',
        data: coffeeData.map(item => item.value),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.4)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1, // Set this to a lower value for a thinner line
        tension: 0.3, // Optional: add curvature to the line
      },
    ],
  };

  return (
    <div>
      <h2 className='ch2'>Global Price of Coffee</h2>
      <Line data={chartData} />
    </div>
  );
};

export default CoffeeChart;
