import express from 'express';
import CaseNotification from '../models/CaseNotification.js';

const router = express.Router();

// Create a new case notification
router.post('/', async (req, res) => {
    const { userId, caseId, message, status } = req.body;
    const newNotification = new CaseNotification({ userId, caseId, message, status });
    try {
        await newNotification.save();
        res.status(201).json(newNotification);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create case notification' });
    }
});

// Get all notifications for a user
router.get('/:userId', async (req, res) => {
    try {
        const notifications = await CaseNotification.find({ userId: req.params.userId });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch case notifications' });
    }
});

export default router;


