const express = require('express');
const router = express.Router();

// Sample route to get cases
router.get('/', (req, res) => {
  res.json({ message: 'List of cases' });
});

// Route to create a case
router.post('/', (req, res) => {
  const { title, description } = req.body;
  // Add your logic to create a case
  res.json({ message: 'Case created', case: { title, description } });
});

module.exports = router;

