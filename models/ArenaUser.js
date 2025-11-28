const mongoose = require('mongoose');

const ArenaUserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  authMode: {
    type: String,
    enum: ['otp', 'token'],
    required: true,
    default: 'otp'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationOTP: String,
  verificationToken: String,
  verificationExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ArenaUser', ArenaUserSchema);
