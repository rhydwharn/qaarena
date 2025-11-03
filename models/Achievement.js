const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: { type: Map, of: String, required: true },
  description: { type: Map, of: String, required: true },
  icon: { type: String, required: true },
  type: {
    type: String,
    enum: ['quiz', 'streak', 'score', 'category', 'special'],
    required: true
  },
  criteria: {
    metric: { type: String, required: true },
    threshold: { type: Number, required: true },
    category: String
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  points: { type: Number, default: 10 },
  isActive: { type: Boolean, default: true },
  unlockedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);