import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import connectDB from "./config/db.js";
import CryptoData from "./models/CryptoData.js";
import StockData from "./models/StockData.js";
import caseRoutes from './routes/caseRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { createClient } from 'redis';
import CoffeeData from './models/CoffeeData.js';
import ExchangeRate from './models/ExchangeRate.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from "./models/userModel.js";
import mongoose from 'mongoose';


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const API_KEY = process.env.API_KEY;

// Create and connect to Redis client
const client = createClient({
  socket: {
    port: REDIS_PORT,
    host: '127.0.0.1'
  }
});

client.on('error', (err) => console.error('Redis Client Error:', err));
await client.connect();

// Connect to the INSA database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/cases', caseRoutes);
app.use('/api/users', userRoutes);


// Sample route for the API
app.get('/', (req, res) => {
  res.send('Welcome to Comprehensive Data and Case Management API Server, developed by Efa Tariku');
});

// Financial Data Route with Redis Caching
app.get('/api/financial/:symbol', async (req, res) => {
  const { symbol } = req.params;

  try {
    // Check if data is in cache
    const cachedData = await client.get(symbol);

    if (cachedData) {
      console.log("Data retrieved from Redis cache");
      return res.json(JSON.parse(cachedData));
    }

    // Fetch data from external API if not in cache
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1mo&interval=1d`);
    const data = response.data;

    // Validate data structure
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

    // Store result in Redis cache with 1-hour expiration
    await client.setEx(symbol, 3600, JSON.stringify(stockData));

    res.json(stockData);
  } catch (error) {
    console.error("Error fetching stock data:", error.message);
    res.status(500).json({ error: 'Error fetching stock data' });
  }
});



// Crypto data route - Fetch, store, and retrieve from MongoDB
app.get('/api/bitcoin/market_chart', async (req, res) => {
  try {
    const { data } = await axios.get('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1');

    const cryptoData = new CryptoData({ symbol: 'BTC/USD', data });
    await cryptoData.save();

    res.json(data);
    console.log("Bitcoin market chart data fetched and stored successfully");
  } catch (error) {
    console.error("Error fetching or storing Bitcoin data:", error);
    res.status(500).send({ error: 'Failed to fetch or store data' });
  }
});

// Stock data route - Fetch, store, and retrieve from MongoDB
app.get('/api/stock', async (req, res) => {
  try {
    const url = `https://www.alphavantage.co/query?function=NATURAL_GAS&interval=monthly&apikey=${API_KEY}`;
    const { data } = await axios.get(url);

    const stockData = new StockData({ symbol: 'IBM', data });
    await stockData.save();

    res.send(data);
    console.log("Stock data fetched and stored successfully");
  } catch (error) {
    console.error("Error fetching or storing stock data:", error);
    res.status(500).send({ error: 'Failed to fetch or store data' });
  }
});

// Commodity data route with Redis caching
app.get('/api/commodity/:symbol', async (req, res) => {
  const symbol = req.params.symbol;

  try {
    // Check cache first
    const cachedData = await client.get(symbol);

    if (cachedData) {
      console.log("Data retrieved from Redis cache");
      return res.json(JSON.parse(cachedData));
    }

    // Fetch from external API if not cached
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=30d&interval=1d`);
    const data = response.data;

    // Cache the result
    await client.setEx(symbol, 3600, JSON.stringify(data)); // Cache for 1 hour

    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: 'Error fetching data from Yahoo Finance' });
  }
});


app.get('/api/fetch-coffee-data', async (req, res) => {
  try {
    const response = await axios.get('https://www.alphavantage.co/query?function=COFFEE&interval=monthly&apikey=demo');
    
    const coffeeDataArray = response.data.data; // Access the data field directly from the response

    // Save each coffee data point to MongoDB
    const coffeeDataDocuments = coffeeDataArray.map(item => ({
      date: item.date,
      value: parseFloat(item.value), // Ensure value is a number
    }));

    await CoffeeData.insertMany(coffeeDataDocuments); // Insert data into MongoDB
    res.status(200).json(coffeeDataDocuments); // Send back the saved data
  } catch (error) {
    console.error('Error fetching coffee data:', error);
    res.status(500).json({ error: 'Failed to fetch coffee data' });
  }
});

// Fetch stored coffee data
app.get('/api/coffee-data', async (req, res) => {
  try {
    // Check cache first
    const cachedData = await client.get('coffeeData');

    if (cachedData) {
      console.log("Coffee data retrieved from Redis cache");
      return res.status(200).json(JSON.parse(cachedData)); // Return cached data
    }

    // Fetch from MongoDB if not cached
    const coffeeData = await CoffeeData.find({});
    // Store fetched data in cache
    await client.setEx('coffeeData', 3600, JSON.stringify(coffeeData)); // Cache for 1 hour

    res.status(200).json(coffeeData);
  } catch (error) {
    console.error('Error fetching coffee data from MongoDB:', error);
    res.status(500).json({ error: 'Failed to fetch coffee data' });
  }
});

// Exchange Rate Data Route
app.get('/api/exchange-rate/EUR/USD', async (req, res) => {
  try {
      // Check if data is in cache
      const cachedData = await client.get('EUR/USD');

      if (cachedData) {
          console.log("Exchange rate data retrieved from Redis cache");
          return res.json(JSON.parse(cachedData));
      }

      // Fetch data from Alpha Vantage API
      const response = await axios.get(`https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=EUR&to_symbol=USD&apikey=${API_KEY}`);
      const timeSeries = response.data['Time Series FX (Daily)'];

      // Validate data structure
      if (!timeSeries) {
          return res.status(404).json({ error: 'Exchange rate data not found' });
      }

      const exchangeRateData = [];
      for (const [date, data] of Object.entries(timeSeries)) {
          const exchangeRate = {
              date,
              open: parseFloat(data['1. open']),
              high: parseFloat(data['2. high']),
              low: parseFloat(data['3. low']),
              close: parseFloat(data['4. close']),
          };

          // Upsert the exchange rate data in MongoDB
          await ExchangeRate.updateOne(
              { date }, // Match by date
              { $set: exchangeRate }, // Update the fields
              { upsert: true } // Insert if it doesn't exist
          );

          exchangeRateData.push(exchangeRate);
      }

      // Store data in Redis cache
      await client.setEx('EUR/USD', 3600, JSON.stringify(exchangeRateData)); // Cache for 1 hour

      res.json(exchangeRateData);
  } catch (error) {
      console.error("Error fetching exchange rate data:", error.message);
      res.status(500).json({ error: 'Error fetching exchange rate data' });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Gracefully shut down the Redis client on app exit
process.on('exit', () => {
  client.quit();
});