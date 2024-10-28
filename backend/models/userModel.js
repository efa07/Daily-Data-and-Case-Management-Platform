const mongoose = require('mongoose');

// Define the schema for Users
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'analyst', 'support staff'], required: true },
  profile_settings: {
    dashboard_preferences: { type: Object, default: {} },
    notification_preferences: { type: Object, default: {} }
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Create the model
const User = mongoose.model('User', userSchema);

module.exports = User;
