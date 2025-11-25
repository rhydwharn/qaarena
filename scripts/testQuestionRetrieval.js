#!/usr/bin/env node
/**
 * Test Question Retrieval
 * Verifies that questions can be retrieved and used properly
 */

const mongoose = require('mongoose');
const Question = require('../models/Question');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/qa_exam_prep';

async function testRetrieval() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📝 Testing Question Retrieval...\n');

    // Get a sample question
    const question = await Question.findOne({ status: 'published' });
    
    if (!question) {
      console.log('❌ No questions found!');
      return;
    }

    console.log('Sample Question Retrieved:');
    console.log('='.repeat(50));
    console.log(`ID: ${question._id}`);
    console.log(`Type: ${question.type}`);
    console.log(`Category: ${question.category}`);
    console.log(`Difficulty: ${question.difficulty}`);
    console.log(`Status: ${question.status}`);
    console.log('\nQuestion Text:');
    console.log(`  Raw type: ${typeof question.questionText}`);
    console.log(`  Is Map: ${question.questionText instanceof Map}`);
    
    // Test different access methods
    if (question.questionText instanceof Map) {
      console.log(`  Map.get('en'): ${question.questionText.get('en')}`);
      console.log(`  Map size: ${question.questionText.size}`);
      console.log(`  Map keys: ${Array.from(question.questionText.keys()).join(', ')}`);
    }
    
    // Test how it's accessed in code
    const textAccess1 = question.questionText?.en;
    const textAccess2 = question.questionText;
    const textAccess3 = question.questionText instanceof Map ? question.questionText.get('en') : question.questionText;
    
    console.log(`\nAccess Methods:`);
    console.log(`  questionText?.en: ${textAccess1}`);
    console.log(`  questionText: ${textAccess2}`);
    console.log(`  Map.get('en'): ${textAccess3}`);
    
    console.log('\nOptions:');
    question.options.forEach((opt, idx) => {
      console.log(`  ${idx + 1}. ${opt.text instanceof Map ? opt.text.get('en') : opt.text} [${opt.isCorrect ? 'CORRECT' : 'wrong'}]`);
    });

    if (question.explanation) {
      console.log(`\nExplanation: ${question.explanation instanceof Map ? question.explanation.get('en') : question.explanation}`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Question retrieval working correctly!');
    console.log('\n💡 Frontend should use:');
    console.log('   - For Map: questionText.get("en") || questionText');
    console.log('   - For Object: questionText?.en || questionText');
    console.log('   - Universal: Use both patterns with fallback');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  testRetrieval();
}

module.exports = testRetrieval;
