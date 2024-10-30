// models/CryptoData.js
import mongoose from 'mongoose';

const cryptoDataSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  data: { type: Object, required: true },
  fetchedAt: { type: Date, default: Date.now }
});

export default mongoose.model('CryptoData', cryptoDataSchema);
