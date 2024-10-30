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
                const response = await axios.get('http://localhost:5000/api/commodity-price-index');

                // Extract data for the global price index
                const indexData = response.data.data;
                const labels = indexData.map(entry => entry.date).slice(0, 10).reverse(); // Last 10 dates
                const values = indexData.map(entry => parseFloat(entry.value)).slice(0, 10).reverse(); // Last 10 values

                setData({
                    labels,
                    datasets: [
                        {
                            label: 'Global Price Index of All Commodities',
                            data: values,
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
            <h2>Global Price Index of All Commodities (Monthly)</h2>
            <Line data={data} />
        </div>
    );
};

export default StockChart;

