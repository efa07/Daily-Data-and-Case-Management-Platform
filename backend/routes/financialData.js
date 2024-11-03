import express from 'express';
import axios from 'axios';
const router = express.Router();

router.get('/api/financial/:symbol', async (req, res) => {
    const { symbol } = req.params;

    try {
        // Fetch stock data from Yahoo Finance
        const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1mo&interval=1d`);
        const data = response.data;

        // Check if the data structure is valid
        if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
            return res.status(404).json({ error: 'Stock not found or invalid data structure' });
        }

        const result = data.chart.result[0];
        
        // Ensure indicators and quote data are available
        if (!result.indicators || !result.indicators.quote || result.indicators.quote.length === 0) {
            return res.status(404).json({ error: 'No price data available for this stock' });
        }

        // Extract the relevant data
        const stockData = {
            timestamp: result.timestamp,
            closePrices: result.indicators.quote[0].close,
            symbol: symbol,
        };

        res.json(stockData);
    } catch (error) {
        console.error("Error fetching stock data:", error);
        res.status(500).json({ error: 'Error fetching stock data' });
    }
});



export default router;