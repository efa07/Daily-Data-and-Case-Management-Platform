import express from 'express';
import request from 'request';
import 'dotenv/config';

const router = express.Router();
const API_KEY = process.env.API_KEY;
const url = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=EUR&to_symbol=USD&apikey=${API_KEY}`;

router.get('/financial-data', (req, res) => {
  request.get({ url, json: true }, (err, _, data) => {
    if (err) return res.status(500).send({ error: 'Failed to fetch data' });
    res.send(data);
    console.log("Data fetched successfully");
    console.log(response.data);

  });
});

export default router;
