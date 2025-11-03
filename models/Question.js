const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: Map,
    of: String,
    required: [true, 'Question text is required']
  },
  type: {
    type: String,
    enum: ['single-choice', 'multiple-choice', 'true-false'],
    required: [true, 'Question type is required']
  },
  options: [{
    text: { type: Map, of: String, required: true },
    isCorrect: { type: Boolean, required: true }
  }],
  explanation: { type: Map, of: String },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['fundamentals', 'testing-throughout-sdlc', 'static-testing', 'test-techniques', 'test-management', 'tool-support', 'agile-testing', 'test-automation']
  },
  difficulty: {
    type: String,
    enum: ['foundation', 'advanced', 'expert'],
    default: 'foundation'
  },
  syllabus: { type: String, default: 'ISTQB-CTFL-2018' },
  tags: [String],
  points: { type: Number, default: 1, min: 1, max: 10 },
  statistics: {
    timesAnswered: { type: Number, default: 0 },
    timesCorrect: { type: Number, default: 0 },
    averageTime: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'flagged'],
    default: 'published'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contributors: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    contribution: String,
    date: { type: Date, default: Date.now }
  }],
  flags: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: String,
    date: { type: Date, default: Date.now }
  }],
  votes: {
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 }
  }
}, { timestamps: true });

questionSchema.index({ category: 1, difficulty: 1, status: 1 });
questionSchema.index({ createdBy: 1 });
questionSchema.index({ tags: 1 });

questionSchema.virtual('successRate').get(function() {
  if (this.statistics.timesAnswered === 0) return 0;
  return Math.round((this.statistics.timesCorrect / this.statistics.timesAnswered) * 100);
});

module.exports = mongoose.model('Question', questionSchema);