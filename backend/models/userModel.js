import mongoose from 'mongoose';

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

const User = mongoose.model('User', userSchema);

export default User;
