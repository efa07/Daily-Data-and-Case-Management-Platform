// src/StockChart.jsx
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Register necessary components with ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StockChart = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=IBM&apikey=demo'
                );

                // Extract time series data
                const timeSeries = response.data['Time Series (Daily)'];
                const labels = Object.keys(timeSeries).slice(0, 10); // Get the last 10 days
                const closingPrices = labels.map(date => parseFloat(timeSeries[date]['4. close']));

                setData({
                    labels: labels.reverse(), // Reverse for chronological order
                    datasets: [
                        {
                            label: 'IBM Stock Price',
                            data: closingPrices.reverse(), // Reverse for chronological order
                            fill: false,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 2,
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>IBM Daily Adjusted Stock Prices</h2>
            <Line data={data} key={JSON.stringify(data)} />
        </div>
    );
};

export default StockChart;
