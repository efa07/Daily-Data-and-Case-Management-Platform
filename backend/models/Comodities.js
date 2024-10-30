// models/commodity.js
import mongoose from 'mongoose';

const commoditySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  interval: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  data: [
    {
      date: {
        type: String,
        required: true,
      },
      value: {
        type: String, 
        required: true,
      },
    },
  ],
});

// Create the model
const Commodity = mongoose.model('Commodity', commoditySchema);

export default Commodity; // Export the model for use in other files
