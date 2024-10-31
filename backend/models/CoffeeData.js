// models/CoffeeData.js
import mongoose from "mongoose";

const CoffeeDataSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Store date as a string
  value: { type: Number, required: true }, // Store price as a number
});

export default mongoose.model('CoffeeData', CoffeeDataSchema);
