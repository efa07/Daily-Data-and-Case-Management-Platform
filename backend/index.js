import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import request from "request";
import axios from "axios"
import connectDB from "./config/db.js";
import FinancialData from "./models/FinancialData.js";
import routes from "./routes/routes.js"
import Commodity from "./models/Comodities.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY;
const url = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=EUR&to_symbol=ETB&apikey=${API_KEY}`;

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(routes);

// Sample route for the API
app.get('/', (req, res) => {
  res.send('Welcome to Comprehensive Data and Case Management API');
});

// Fetch and store financial data from API
app.get('/api/financial-data', (req, res) => {
  request.get({ url, json: true }, async (err, _, data) => {
    if (err) return res.status(500).send({ error: 'Failed to fetch data' });

    try {
      // Save the data to MongoDB
      const financialData = new FinancialData({
        symbol: 'EUR/ETB',
        data: data,
      });
      await financialData.save();

      res.send(data);
      console.log("Data fetched and stored successfully");
    } catch (saveError) {
      console.error("Error saving data:", saveError);
      res.status(500).send({ error: 'Failed to save data to MongoDB' });
    }
  });
});

// Retrieve stored financial data from MongoDB
app.get('/api/stored-financial-data', async (req, res) => {
  try {
    const storedData = await FinancialData.find({});
    res.send(storedData);
  } catch (fetchError) {
    console.error("Error retrieving data:", fetchError);
    res.status(500).send({ error: 'Failed to fetch stored data' });
  }
});



// Crypto data route
app.get('/api/bitcoin/market_chart', async (req, res) => {
  try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1');
      res.json(response.data);
  } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
  }
});
// Stock data route
app.get('/api/stock', (req,res) => {
  request.get({ url: `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=IBM&apikey=demo`, json: true }, (err, _, data) => {
    if (err) return res.status(500).send({ error: 'Failed to fetch data' });
    res.send(data);
    console.log("Stock data fetched successfully");
  });
});



app.get('/api/commodities/wti', async (req, res) => {
  const apiKey = 'demo'; // Replace with your actual API key
  const url = `https://www.alphavantage.co/query?function=WTI&interval=monthly&apikey=${apiKey}`;

  try {
    // Fetch data from Alpha Vantage API
    const response = await axios.get(url);
    const apiData = response.data;

    // Ensure data is in expected format
    if (!apiData['data'] || !Array.isArray(apiData['data'])) {
      return res.status(500).json({ error: 'Unexpected data format from API' });
    }

    // Format the data for MongoDB schema
    const formattedData = {
      name: 'Crude Oil Prices WTI',
      interval: 'monthly',
      unit: 'dollars per barrel',
      data: apiData['data'].map(entry => ({
        date: new Date(entry['date']),
        value: parseFloat(entry['value']),
      })),
    };

    // Store or update commodity data in MongoDB
    const result = await Commodity.findOneAndUpdate(
      { name: 'Crude Oil Prices WTI', interval: 'monthly' },
      formattedData,
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Data successfully stored', data: result });
  } catch (error) {
    console.error('Error fetching or storing data:', error);
    res.status(500).json({ error: 'Failed to fetch and store data' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// import express from "express";
// import mongoose from "mongoose";
// import axios from "axios";

// const app = express();
// app.use(cors());

// const PORT = process.env.PORT || 5000;
// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/INSA', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.log(err));

// // Define a schema and model
// const dataSchema = new mongoose.Schema({
//     date: String,
//     value: Number,
// });

// const Data = mongoose.model('Data', dataSchema);

// // Endpoint to fetch and store data
// app.get('/fetch-data', async (req, res) => {
//     try {
//         const response = await axios.get('https://www.alphavantage.co/query?function=WTI&interval=monthly&apikey=demo');
        
//         // Check if the expected data exists
//         if (!response.data || !Array.isArray(response.data.data)) {
//             return res.status(400).json({ error: 'Invalid response from API' });
//         }
        
//         const dataToStore = response.data.data.map(item => ({
//             date: item.date,
//             value: parseFloat(item.value), // Ensure value is a number
//         }));

//         // Store data in MongoDB
//         await Data.deleteMany(); // Optional: clear previous data
//         await Data.insertMany(dataToStore);

//         res.status(200).json({ message: 'Data fetched and stored successfully' });
//     } catch (error) {
//         console.error('Error fetching data from Alpha Vantage:', error.message);
//         res.status(500).json({ error: 'Failed to fetch and store data', details: error.message });
//     }
// });

// // Endpoint to get data from MongoDB
// app.get('/data', async (req, res) => {
//     try {
//         const data = await Data.find({});
//         res.status(200).json(data);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to retrieve data' });
//     }
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
