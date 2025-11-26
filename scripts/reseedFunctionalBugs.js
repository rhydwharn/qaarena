require('dotenv').config();
const mongoose = require('mongoose');
const FunctionalBug = require('../models/FunctionalBug');
const FunctionalBugStats = require('../models/FunctionalBugStats');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const reseedBugs = async () => {
  try {
    await connectDB();
    
    console.log('🗑️  Deleting existing functional bugs...');
    const deletedBugs = await FunctionalBug.deleteMany({});
    const deletedStats = await FunctionalBugStats.deleteMany({});
    console.log(`✅ Deleted ${deletedBugs.deletedCount} bugs and ${deletedStats.deletedCount} stats`);
    
    console.log('\n📦 Now run: node scripts/seedFunctionalBugs.js');
    console.log('   to seed the new bugs with simulators!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

reseedBugs();
