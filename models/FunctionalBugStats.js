const mongoose = require('mongoose');

const functionalBugStatsSchema = new mongoose.Schema({
  bugId: {
    type: String,
    required: true,
    unique: true
  },
  totalAttempts: {
    type: Number,
    default: 0
  },
  totalCompletions: {
    type: Number,
    default: 0
  },
  correctIdentifications: {
    type: Number,
    default: 0
  },
  averageTimeSpent: {
    type: Number,
    default: 0
  },
  averageHintsUsed: {
    type: Number,
    default: 0
  },
  successRate: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Method to update stats
functionalBugStatsSchema.methods.updateStats = async function(isCorrect, timeSpent, hintsUsed) {
  this.totalAttempts += 1;
  this.totalCompletions += 1;
  
  if (isCorrect) {
    this.correctIdentifications += 1;
  }
  
  // Update averages
  this.averageTimeSpent = ((this.averageTimeSpent * (this.totalCompletions - 1)) + timeSpent) / this.totalCompletions;
  this.averageHintsUsed = ((this.averageHintsUsed * (this.totalCompletions - 1)) + hintsUsed) / this.totalCompletions;
  this.successRate = (this.correctIdentifications / this.totalCompletions) * 100;
  this.updatedAt = Date.now();
  
  await this.save();
};

module.exports = mongoose.model('FunctionalBugStats', functionalBugStatsSchema);
