import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import request from "request";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY;
const url = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=EUR&to_symbol=USD&apikey=${API_KEY}`;

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Sample route for the API
app.get('/', (req, res) => {
  res.send('Welcome to Comprehensive Data and Case Management API');
});

// Financial Data route
app.get('/api/financial-data', (req, res) => {
  request.get({ url, json: true }, (err, _, data) => {
    if (err) return res.status(500).send({ error: 'Failed to fetch data' });
    res.send(data);
    console.log("Data fetched successfully");
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
