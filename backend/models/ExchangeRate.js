// models/ExchangeRate.js
import mongoose from 'mongoose';

const exchangeRateSchema = new mongoose.Schema({
    date: { type: String, required: true },
    open: { type: Number, required: true },
    high: { type: Number, required: true },
    low: { type: Number, required: true },
    close: { type: Number, required: true },
});

const ExchangeRate = mongoose.model('ExchangeRate', exchangeRateSchema);
export default ExchangeRate;
