import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import MarketAlertForm from './MarketAlertForm';
import SyncLoader from "react-spinners/SyncLoader";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    TimeScale,
} from 'chart.js';
import "./financial.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale);

const FinancialInfo = () => {
    const [financialData, setFinancialData] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.userId

    const stockSymbols = {
        'AAPL': 'Apple',
        'MSFT': 'Microsoft',
        'GOOGL': 'Alphabet',
        'AMZN': 'Amazon',
        'TSLA': 'Tesla',
        'FB': 'Meta Platforms',
        'NFLX': 'Netflix',
        'NVDA': 'NVIDIA',
        'JPM': 'JPMorgan Chase',
        'V': 'Visa'
    };

    const fetchFinancialData = async (symbol) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:5000/api/financial/${symbol}`);
            const data = response.data;

            if (!data.timestamp || !data.closePrices || data.closePrices.length === 0) {
                throw new Error('Stock not found or invalid data structure');
            }

            const latestPrice = data.closePrices[data.closePrices.length - 1];
            const latestTimestamp = data.timestamp[data.timestamp.length - 1];

            setFinancialData({
                name: stockSymbols[symbol] || symbol,
                symbol: symbol,
                current_price: latestPrice.toFixed(2),
                date: new Date(latestTimestamp * 1000).toLocaleDateString(),
            });

            const chartPoints = data.timestamp.map((time, index) => ({
                x: new Date(time * 1000),
                y: data.closePrices[index],
            })).filter(point => point.y !== null);

            setChartData(chartPoints.reverse());

        } catch (error) {
            console.error("Error fetching financial data:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="financial-container">
            <h1>Financial Information</h1>

            <div className="button-section">
                <h3>Select a Stock:</h3>
                <div className="symbols-grid">
                    {Object.entries(stockSymbols).map(([symbol, name]) => (
                        <button
                            key={symbol}
                            onClick={() => fetchFinancialData(symbol)}
                            className="symbol-button"
                        >
                            {name} ({symbol})
                        </button>
                    ))}
                </div>
            </div>

            {loading && <div className='loader' ><SyncLoader
                color="#6c5ce7"
                margin={5}
                size={25}
            /> </div>}            {error && <div className="error">{error}</div>}

            {financialData && !loading && (
                <div className="financial-card">
                    <h2>{financialData.name}</h2>
                    <div className="financial-details">
                        <div className="detail-item">
                            <span>Current Price:</span>
                            <span>${financialData.current_price}</span>
                        </div>
                        <div className="detail-item">
                            <span>Last Updated:</span>
                            <span>{financialData.date}</span>
                        </div>
                    </div>
                </div>
            )}

            {chartData && (
                <div className="chart-container">
                    <Line
                        data={{
                            datasets: [{
                                label: 'Price (USD)',
                                data: chartData,
                                borderColor: '#3498db',
                                tension: 0.1,
                                pointRadius: 0,
                                fill: true,
                                borderWidth: 2,
                            }],
                        }}
                        options={{
                            responsive: true,
                            scales: {
                                x: {
                                    type: 'time',
                                    time: {
                                        unit: 'day',
                                        tooltipFormat: 'PP',
                                        displayFormats: {
                                            day: 'MMM d'
                                        }
                                    },
                                    title: {
                                        display: true,
                                        text: 'Date'
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Price (USD)'
                                    }
                                }
                            },
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'top'
                                },
                                tooltip: {
                                    mode: 'index',
                                    intersect: false,
                                }
                            },
                        }}
                    />
                </div>
            )}
            <MarketAlertForm userId={userId} />

        </div>
    );
};

export default FinancialInfo;
