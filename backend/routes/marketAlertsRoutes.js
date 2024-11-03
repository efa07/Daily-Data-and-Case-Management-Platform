// routes/marketAlertsRoutes.js

import express from 'express';
import MarketAlert from '../models/MarketAlert.js';

const router = express.Router();

// Create a new market alert
router.post('/', async (req, res) => {
    const { userId, assetSymbol, threshold, alertType } = req.body;
    const newAlert = new MarketAlert({ userId, assetSymbol, threshold, alertType });
    try {
        await newAlert.save();
        res.status(201).json(newAlert);
    } catch (error) {
        console.error('Error creating market alert:', error); // Log the error details
        res.status(500).json({ error: 'Failed to create market alert' });
    }
});


// Get all alerts for a user
router.get('/:userId', async (req, res) => {
    try {
        const alerts = await MarketAlert.find({ userId: req.params.userId });
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch market alerts' });
    }
});

export default router;
