import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
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
import "./financial.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale);

const FinancialInfo = () => {
    const [financialData, setFinancialData] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
    
            // Check if the data structure is valid
            if (!data.timestamp || !data.closePrices || data.closePrices.length === 0) {
                throw new Error('Stock not found or invalid data structure');
            }
    
            // Prepare the latest data for display
            const latestPrice = data.closePrices[data.closePrices.length - 1];
            const latestTimestamp = data.timestamp[data.timestamp.length - 1];
    
            setFinancialData({
                name: symbol,
                symbol: symbol,
                current_price: latestPrice.toFixed(2),
                date: new Date(latestTimestamp * 1000).toLocaleDateString(),
            });
    
            // Prepare chart data for the past month
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
    

    const handleSearch = (event) => {
        event.preventDefault();
        if (searchTerm) {
            fetchFinancialData(searchTerm.toUpperCase());
        }
    };

    return (
        <div className="financial-container">
            <h1>Financial Information</h1>
            
            <div className="search-section">
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Enter stock symbol (e.g., AAPL, MSFT, TSLA)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-button">Search</button>
                </form>
                
                <div className="available-symbols">
                    <h3>Available Symbols:</h3>
                    <div className="symbols-grid">
                        {Object.entries(stockSymbols).map(([symbol, name]) => (
                            <div key={symbol} className="symbol-item">
                                {symbol}: {name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error">{error}</div>}

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
                                fill: false,
                                borderColor: '#3498db',
                                tension: 0.1,
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
        </div>
    );
};

export default FinancialInfo;
