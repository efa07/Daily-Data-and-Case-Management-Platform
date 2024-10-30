// models/StockData.js
import mongoose from 'mongoose';

const stockDataSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  data: { type: Object, required: true },
  fetchedAt: { type: Date, default: Date.now }
});

export default mongoose.model('StockData', stockDataSchema);
