const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  categoryProgress: [{
    category: { type: String, required: true },
    questionsAttempted: { type: Number, default: 0 },
    questionsCorrect: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    lastAttempted: Date
  }],
  difficultyProgress: [{
    difficulty: { type: String, required: true },
    questionsAttempted: { type: Number, default: 0 },
    questionsCorrect: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 }
  }],
  weakAreas: [{
    category: String,
    successRate: Number,
    needsImprovement: Boolean
  }],
  strongAreas: [{
    category: String,
    successRate: Number
  }],
  studyStreak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastStudyDate: Date
  },
  milestones: [{
    type: { type: String, required: true },
    achieved: { type: Boolean, default: false },
    achievedAt: Date,
    value: Number
  }],
  recentActivity: [{
    date: { type: Date, default: Date.now },
    questionsAnswered: Number,
    score: Number,
    timeSpent: Number
  }],
  totalTimeSpent: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

progressSchema.methods.updateAreas = function() {
  this.weakAreas = this.categoryProgress
    .filter(cp => cp.averageScore < 60 && cp.questionsAttempted >= 5)
    .map(cp => ({ category: cp.category, successRate: cp.averageScore, needsImprovement: true }))
    .sort((a, b) => a.successRate - b.successRate);

  this.strongAreas = this.categoryProgress
    .filter(cp => cp.averageScore >= 80 && cp.questionsAttempted >= 5)
    .map(cp => ({ category: cp.category, successRate: cp.averageScore }))
    .sort((a, b) => b.successRate - a.successRate);
};

module.exports = mongoose.model('Progress', progressSchema);