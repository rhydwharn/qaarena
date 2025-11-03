const mongoose = require('mongoose');
const Achievement = require('./models/Achievement');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const achievements = [
  {
    name: { en: 'First Steps' },
    description: { en: 'Complete your first quiz' },
    icon: 'trophy',
    type: 'quiz',
    criteria: { metric: 'totalQuizzes', threshold: 1 },
    rarity: 'common',
    points: 10
  },
  {
    name: { en: 'Getting Started' },
    description: { en: 'Complete 5 quizzes' },
    icon: 'star',
    type: 'quiz',
    criteria: { metric: 'totalQuizzes', threshold: 5 },
    rarity: 'common',
    points: 25
  },
  {
    name: { en: 'Point Collector' },
    description: { en: 'Earn a total of 300 points' },
    icon: 'award',
    type: 'score',
    criteria: { metric: 'totalScore', threshold: 300 },
    rarity: 'rare',
    points: 60
  }
];

async function seedAchievements() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/istqb_practice';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB Connected');

    // Clear existing achievements
    await Achievement.deleteMany({});
    console.log('🗑️  Cleared existing achievements');

    // Insert new achievements
    await Achievement.insertMany(achievements);
    console.log(`✅ Added ${achievements.length} achievements`);

    console.log('\n📋 Achievements created:');
    achievements.forEach(a => {
      console.log(`  - ${a.name.en}: ${a.description.en}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedAchievements();
