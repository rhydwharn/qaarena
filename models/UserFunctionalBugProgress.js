const mongoose = require('mongoose');

const userFunctionalBugProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bugId: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true,
    enum: ['fintech', 'ecommerce', 'ordering', 'grading']
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  attempts: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number,
    default: 0
    // in seconds
  },
  hintsUsed: {
    type: Number,
    default: 0
  },
  identifiedCorrectly: {
    type: Boolean,
    default: false
  },
  userAnswer: {
    bugType: String,
    description: String,
    confidence: Number,
    submittedAt: Date
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries and uniqueness
userFunctionalBugProgressSchema.index({ user: 1, bugId: 1 }, { unique: true });
userFunctionalBugProgressSchema.index({ user: 1, domain: 1 });
userFunctionalBugProgressSchema.index({ user: 1, completed: 1 });

module.exports = mongoose.model('UserFunctionalBugProgress', userFunctionalBugProgressSchema);
