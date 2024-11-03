import express from 'express';
import Notification from '../models/Notification.js';

const router = express.Router();

// Endpoint to create a notification
router.post('/', async (req, res) => {
  const { title, message, userId } = req.body; 
  try {
    // Save the notification to MongoDB
    const newNotification = new Notification({ title, message, userId });
    await newNotification.save();

    // Broadcast to all connected WebSocket clients
    global.websocketClients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({
          type: 'notification',
          data: newNotification,
        }));
      }
    });

    res.status(201).json(newNotification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: 'Error creating notification' });
  }
});

export default router;
