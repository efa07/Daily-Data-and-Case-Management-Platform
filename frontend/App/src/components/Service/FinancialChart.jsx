import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const FinancialChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/financial-data');
        const dailyData = response.data['Time Series FX (Daily)'];

        const formattedData = Object.entries(dailyData)
          .map(([date, values]) => ({
            date,
            price: parseFloat(values['4. close'])
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setChartData(formattedData);
      } catch (error) {
        console.error('Error fetching financial data', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h3>EUR to ETB Daily Closing Price</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="price"
            name="EUR to USD"
            stroke="rgba(75, 192, 192, 1)"
            fill="rgba(75, 192, 192, 0.2)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialChart;