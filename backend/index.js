import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import connectDB from "./config/db.js";
import FinancialData from "./models/FinancialData.js";
import Commodity from "./models/Comodities.js";
import CryptoData from "./models/CryptoData.js";
import StockData from "./models/StockData.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY;

// Connect to the INSA database
connectDB("INSA");

// Middleware
app.use(cors());
app.use(express.json());

// Sample route for the API
app.get('/', (req, res) => {
  res.send('Welcome to Comprehensive Data and Case Management API');
});

app.get('/api/financial/:symbol', async (req, res) => {
  const { symbol } = req.params;

  try {
      const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1mo&interval=1d`);
      console.log(response.data);  // Log the API response data here for inspection
      
      const data = response.data;

      // Check if the data structure is valid
      if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
          return res.status(404).json({ error: 'Stock not found or invalid data structure' });
      }

      const result = data.chart.result[0];

      if (!result.indicators || !result.indicators.quote || result.indicators.quote.length === 0) {
          return res.status(404).json({ error: 'No price data available for this stock' });
      }

      const stockData = {
          timestamp: result.timestamp,
          closePrices: result.indicators.quote[0].close,
          symbol: symbol,
      };

      res.json(stockData);
  } catch (error) {
      console.error("Error fetching stock data:", error.message);
      res.status(500).json({ error: 'Error fetching stock data' });
  }
});

// Financial data route - Fetch, store, and then retrieve from MongoDB
app.get('/api/financial-data', async (req, res) => {
  try {
    const url = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=EUR&apikey=demo`;
    const { data } = await axios.get(url);

    // Save to FinancialData collection
    const financialData = new FinancialData({ symbol: 'EUR/ETB', data });
    await financialData.save();

    res.send(data);
    console.log("Financial data fetched and stored successfully");
  } catch (error) {
    console.error("Error fetching or saving data:", error);
    res.status(500).send({ error: 'Failed to fetch or store data' });
  }
});

// Retrieve stored financial data from MongoDB
app.get('/api/stored-financial-data', async (req, res) => {
  try {
    const storedData = await FinancialData.find({});
    res.send(storedData);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).send({ error: 'Failed to fetch stored data' });
  }
});

// Crypto data route - Fetch, store, and then retrieve from MongoDB
app.get('/api/bitcoin/market_chart', async (req, res) => {
  try {
    const { data } = await axios.get('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1');

    // Save to CryptoData collection
    const cryptoData = new CryptoData({ symbol: 'BTC/USD', data });
    await cryptoData.save();

    res.json(data);
    console.log("Bitcoin market chart data fetched and stored successfully");
  } catch (error) {
    console.error("Error fetching or storing Bitcoin data:", error);
    res.status(500).send({ error: 'Failed to fetch or store data' });
  }
});

// Stock data route - Fetch, store, and then retrieve from MongoDB
app.get('/api/stock', async (req, res) => {
  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=IBM&apikey=${API_KEY}`;
    const { data } = await axios.get(url);

    // Save to StockData collection
    const stockData = new StockData({ symbol: 'IBM', data });
    await stockData.save();

    res.send(data);
    console.log("Stock data fetched and stored successfully");
  } catch (error) {
    console.error("Error fetching or storing stock data:", error);
    res.status(500).send({ error: 'Failed to fetch or store data' });
  }
});

// // Commodity data route - Fetch, store, and then retrieve from MongoDB
// app.get('/api/commodities/wti', async (req, res) => {
//   const url = `https://www.alphavantage.co/query?function=ALL_COMMODITIES&interval=monthly&apikey=demo`;

//   try {
//     const { data: apiData } = await axios.get(url);

//     if (!apiData['data'] || !Array.isArray(apiData['data'])) {
//       return res.status(500).json({ error: 'Unexpected data format from API' });
//     }

//     // Format the data for MongoDB schema
//     const formattedData = {
//       name: 'Crude Oil Prices WTI',
//       interval: 'monthly',
//       unit: 'dollars per barrel',
//       data: apiData['data'].map(entry => ({
//         date: new Date(entry['date']),
//         value: parseFloat(entry['value']),
//       })),
//     };

//     // Store or update commodity data in MongoDB
//     const result = await Commodity.findOneAndUpdate(
//       { name: 'Crude Oil Prices WTI', interval: 'monthly' },
//       formattedData,
//       { upsert: true, new: true }
//     );

//     res.status(200).json({ message: 'Data successfully stored', data: result });
//   } catch (error) {
//     console.error('Error fetching or storing data:', error);
//     res.status(500).json({ error: 'Failed to fetch and store data' });
//   }
// });

app.get('/api/commodity/:symbol', async (req, res) => {
  const symbol = req.params.symbol;
  try {
      const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=30d&interval=1d`);
      res.json(response.data);
  } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: 'Error fetching data from Yahoo Finance' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
