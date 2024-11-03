// src/components/CoffeeChart.js
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import "./coffee.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CoffeeChart = () => {
  const [coffeeData, setCoffeeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/coffee-data');
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
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div>
      <h2 className='ch2'>Global Price of Coffee</h2>
      <Bar 
        data={chartData} 
        options={{
          plugins: {
            legend: {
              labels: {
                color: "#333",
              }
            }
          },
          scales: {
            x: {
              grid: {
                color: "rgba(200, 200, 200, 0.3)", 
              },
              title: {
                display: true,
                text: "Date",
                color: "#666",
              }
            },
            y: {
              grid: {
                color: "rgba(200, 200, 200, 0.3)", 
              },
              title: {
                display: true,
                text: "Price (cents)",
                color: "#666",
              },
              beginAtZero: true,
            },
          },
        }} 
      />
    </div>
  );
};

export default CoffeeChart;
