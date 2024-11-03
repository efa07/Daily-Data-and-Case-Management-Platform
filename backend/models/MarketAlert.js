// models/MarketAlert.js

import mongoose from 'mongoose';

const marketAlertSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    assetSymbol: { type: String, required: true },  
    threshold: { type: Number, required: true },  
    alertType: { type: String, enum: ['above', 'below'], required: true },
    createdAt: { type: Date, default: Date.now },
});

const MarketAlert = mongoose.model('MarketAlert', marketAlertSchema);

export default MarketAlert;
