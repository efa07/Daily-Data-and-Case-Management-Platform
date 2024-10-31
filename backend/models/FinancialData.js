// models/FinancialData.js
import mongoose from 'mongoose';

const financialDataSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  data: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

const FinancialData = mongoose.model('FinancialData', financialDataSchema);
export default FinancialData;


