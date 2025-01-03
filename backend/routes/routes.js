// routes.js
import express from 'express';
import Commodity from '../models/Comodities.js';

const router = express.Router();

// Endpoint to get all commodities
router.get('/api/commodities', async (req, res) => {
  try {
    const commodities = await Commodity.find(); 
    res.json(commodities); 
  } catch (error) {
    console.error('Error fetching commodities:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
