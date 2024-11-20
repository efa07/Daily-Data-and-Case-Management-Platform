import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import MarketAlertForm from './MarketAlertForm';
import 'chartjs-adapter-date-fns';
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
import "./crypto.css"

// register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale);

const CryptoCurrencyInfo = () => {
    const [coinData, setCoinData] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const userId  = "123"

    const fetchCoinData = async (coin) => {
        setLoading(true);
        setError(null); 
        try {
            const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
                params: {
                    vs_currency: 'usd',
                    ids: coin,
                    order: 'market_cap_desc',
                    per_page: 1,
                    page: 1,
                    sparkline: false,
                },
            });
            if (data.length === 0) {
                throw new Error('Coin not found');
            }
            setCoinData(data[0]);
            fetchChartData(coin);
        } catch (error) {
            console.error("Error fetching coin data:", error);
            setError(error.message); 
        } finally {
            setLoading(false);
        }
    };

    const fetchChartData = async (coin) => {
        try {
            const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart`, {
                params: {
                    vs_currency: 'usd',
                    days: '30', // Last 30 days data
                },
            });
            const prices = data.prices.map(price => ({
                x: new Date(price[0]), // Convert timestamp to Date object
                y: price[1],
            }));
            setChartData(prices);
        } catch (error) {
            console.error("Error fetching chart data:", error);
            setError(error.message); 
        }
    };

    const handleSearch = (event) => {
        event.preventDefault();
        if (searchTerm) {
            fetchCoinData(searchTerm.toLowerCase());
        }
    };

    return (
        <div className="container">
            <h1 className="text-center">Cryptocurrency Information</h1>
            
            <form onSubmit={handleSearch} className="mb-4">
                <input
                    type="text"
                    placeholder="Search for a cryptocurrency(ex-Bitcoin)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input"
                />
                <button type="submit" className="btn btn-primary mt-2">Search</button>
            </form>

            {loading && <p>Loading...</p>}
            {error && <p className="text-danger">{error}</p>} 
            {coinData && !loading && (
                <div className="card mb-4">
                    <div className="card-body">
                        <h2>{coinData.name} ({coinData.symbol.toUpperCase()})</h2>
                        <p>Current Price: ${coinData.current_price}</p>
                        <p>Market Cap: ${coinData.market_cap}</p>
                        <p>24h Change: {coinData.price_change_percentage_24h}%</p>
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
                                borderColor: 'rgba(75,192,192,1)',
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
                                        tooltipFormat: 'll',
                                        displayFormats: {
                                            day: 'MMM d', 
                                        },
                                    },
                                },
                                y: {
                                    beginAtZero: false,
                                },
                            },
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'top',
                                },
                            },
                        }}
                    />
                </div>
            )}

<MarketAlertForm userId={userId} />
        </div>
    );
};

export default CryptoCurrencyInfo;
