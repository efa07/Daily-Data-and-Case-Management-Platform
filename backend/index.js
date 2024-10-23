const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Make sure this path is correct
const app = express();

// Load environment variables
dotenv.config();

// Connect to the database
connectDB(); // Moved this to the beginning for clarity

// Middleware
app.use(cors());
app.use(express.json());

// Sample route for the API
app.get('/', (req, res) => {
  res.send('Welcome to Comprehensive Data and Case Management API');
});

// Placeholder routes (will expand with actual logic later)
const caseRoutes = require('./routes/caseRoutes');
app.use('/api/cases', caseRoutes);

// Server configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
