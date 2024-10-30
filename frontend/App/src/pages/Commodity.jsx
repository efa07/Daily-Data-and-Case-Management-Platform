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
import "./commodity.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale);

const CommodityInfo = () => {
    const [commodityData, setCommodityData] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const commoditySymbols = {
        'CL=F': 'WTI Crude Oil',
        'BZ=F': 'Brent Crude Oil',
        'NG=F': 'Natural Gas',
        'HG=F': 'Copper',
        'AL=F': 'Aluminum',
        'W=F': 'Wheat',
        'C=F': 'Corn',
        'CT=F': 'Cotton',
        'SB=F': 'Sugar',
        'KC=F': 'Coffee'
    };

    const fetchCommodityData = async (symbol) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:5000/api/commodity/${symbol}`);
            const data = response.data;
    
            // Check if the data structure is valid
            if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
                throw new Error('Commodity not found or invalid data structure');
            }
    
            const result = data.chart.result[0];
    
            // Check if indicators and quote data exist
            if (!result.indicators || !result.indicators.quote || result.indicators.quote.length === 0) {
                throw new Error('No price data available for this commodity');
            }
    
            const latestData = result.indicators.quote[0].close[result.indicators.quote[0].close.length - 1];
    
            setCommodityData({
                name: commoditySymbols[symbol] || symbol,
                symbol: symbol,
                current_price: latestData.toFixed(2),
                date: new Date(result.timestamp[result.timestamp.length - 1] * 1000).toLocaleDateString()
            });
    
            // Prepare chart data - last 30 days
            const chartPoints = result.timestamp.map((time, index) => ({
                x: new Date(time * 1000),
                y: result.indicators.quote[0].close[index]
            })).filter(point => point.y !== null);
    
            setChartData(chartPoints.reverse());
    
        } catch (error) {
            console.error("Error fetching commodity data:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (event) => {
        event.preventDefault();
        if (searchTerm) {
            fetchCommodityData(searchTerm.toUpperCase());
        }
    };

    return (
        <div className="commodity-container">
            <h1>Commodity Information</h1>
            
            <div className="search-section">
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Enter commodity symbol (e.g., CL=F, BZ=F, HG=F)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-button">Search</button>
                </form>
                
                <div className="available-symbols">
                    <h3>Available Symbols:</h3>
                    <div className="symbols-grid">
                        {Object.entries(commoditySymbols).map(([symbol, name]) => (
                            <div key={symbol} className="symbol-item">
                                {symbol}: {name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error">{error}</div>}

            {commodityData && !loading && (
                <div className="commodity-card">
                    <h2>{commodityData.name}</h2>
                    <div className="commodity-details">
                        <div className="detail-item">
                            <span>Current Price:</span>
                            <span>${commodityData.current_price}</span>
                        </div>
                        <div className="detail-item">
                            <span>Last Updated:</span>
                            <span>{commodityData.date}</span>
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
                                borderColor: '#2ecc71',
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

export default CommodityInfo;