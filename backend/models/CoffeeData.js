// models/CoffeeData.js
import mongoose from "mongoose";

const CoffeeDataSchema = new mongoose.Schema({
  date: { type: String, required: true },
  value: { type: Number, required: true },
});

export default mongoose.model('CoffeeData', CoffeeDataSchema);
