const mongoose = require('mongoose');

const functionalBugSchema = new mongoose.Schema({
  bugId: {
    type: String,
    required: true,
    unique: true,
    // Format: FB001, FB002, etc.
  },
  domain: {
    type: String,
    required: true,
    enum: ['fintech', 'ecommerce', 'ordering', 'grading', 'authentication']
  },
  title: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical']
  },
  category: {
    type: String,
    required: true,
    // Business Logic, Calculation Error, Validation Error, etc.
  },
  scenario: {
    description: String,
    steps: [String],
    initialState: mongoose.Schema.Types.Mixed,
    // Initial state for the simulator
  },
  expected: {
    type: String,
    required: true
  },
  actual: {
    type: String,
    required: true
  },
  bugType: {
    type: String,
    required: true
  },
  rootCause: {
    type: String,
    required: true
  },
  fix: {
    type: String,
    required: true
  },
  preventionTips: [String],
  testingTips: [String],
  points: {
    type: Number,
    default: 100
  },
  hints: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
functionalBugSchema.index({ domain: 1, difficulty: 1 });
functionalBugSchema.index({ isActive: 1 });
functionalBugSchema.index({ bugId: 1 });

// Update timestamp on save
functionalBugSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('FunctionalBug', functionalBugSchema);
