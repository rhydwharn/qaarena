const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mode: {
    type: String,
    enum: ['practice', 'exam', 'timed', 'category'],
    required: true
  },
  questions: [{
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    userAnswer: [{ type: Number }],
    isCorrect: Boolean,
    timeSpent: { type: Number, default: 0 },
    answeredAt: Date
  }],
  settings: {
    language: { type: String, default: 'en' },
    category: String,
    difficulty: String,
    numberOfQuestions: Number,
    timeLimit: Number,
    randomOrder: { type: Boolean, default: true }
  },
  score: {
    correct: { type: Number, default: 0 },
    incorrect: { type: Number, default: 0 },
    unanswered: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },
  startedAt: { type: Date, default: Date.now },
  completedAt: Date,
  totalTime: { type: Number, default: 0 }
}, { timestamps: true });

quizSchema.index({ user: 1, status: 1 });
quizSchema.index({ createdAt: -1 });

quizSchema.pre('save', function(next) {
  if (this.status === 'completed') {
    const totalQuestions = this.questions.length;
    this.score.correct = this.questions.filter(q => q.isCorrect === true).length;
    this.score.incorrect = this.questions.filter(q => q.isCorrect === false).length;
    this.score.unanswered = this.questions.filter(q => q.isCorrect === undefined).length;
    if (totalQuestions > 0) {
      this.score.percentage = Math.round((this.score.correct / totalQuestions) * 100);
    }
  }
  next();
});

module.exports = mongoose.model('Quiz', quizSchema);