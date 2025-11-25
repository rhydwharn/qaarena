#!/usr/bin/env node
/**
 * Verify and Fix Database Script
 * Checks for common issues and fixes them
 */

const mongoose = require('mongoose');
const Question = require('../models/Question');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/qa_exam_prep';

async function verifyAndFix() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // 1. Check Questions
    console.log('📝 Checking Questions...');
    const totalQuestions = await Question.countDocuments();
    const publishedQuestions = await Question.countDocuments({ status: 'published' });
    const draftQuestions = await Question.countDocuments({ status: 'draft' });
    const archivedQuestions = await Question.countDocuments({ status: 'archived' });

    console.log(`   Total Questions: ${totalQuestions}`);
    console.log(`   Published: ${publishedQuestions}`);
    console.log(`   Draft: ${draftQuestions}`);
    console.log(`   Archived: ${archivedQuestions}`);

    if (totalQuestions === 0) {
      console.log('   ⚠️  WARNING: No questions in database!');
      console.log('   💡 Run: node scripts/seedDatabase.js');
    } else if (publishedQuestions === 0) {
      console.log('   ⚠️  WARNING: No published questions!');
      console.log('   🔧 Fixing: Publishing all questions...');
      const result = await Question.updateMany(
        { status: { $ne: 'published' } },
        { $set: { status: 'published' } }
      );
      console.log(`   ✅ Published ${result.modifiedCount} questions`);
    } else {
      console.log('   ✅ Questions OK');
    }

    // 2. Check Question Structure
    console.log('\n🔍 Checking Question Structure...');
    const sampleQuestion = await Question.findOne({ status: 'published' });
    if (sampleQuestion) {
      const hasOptions = sampleQuestion.options && sampleQuestion.options.length > 0;
      const hasCorrectAnswer = sampleQuestion.options?.some(opt => opt.isCorrect);
      const hasQuestionText = sampleQuestion.questionText && 
        (typeof sampleQuestion.questionText === 'string' || sampleQuestion.questionText.en);

      console.log(`   Has Options: ${hasOptions ? '✅' : '❌'}`);
      console.log(`   Has Correct Answer: ${hasCorrectAnswer ? '✅' : '❌'}`);
      console.log(`   Has Question Text: ${hasQuestionText ? '✅' : '❌'}`);

      if (!hasOptions || !hasCorrectAnswer || !hasQuestionText) {
        console.log('   ⚠️  WARNING: Some questions have structural issues!');
        console.log('   💡 Consider re-seeding the database');
      }
    }

    // 3. Check Categories
    console.log('\n📂 Checking Categories...');
    const categories = await Question.distinct('category', { status: 'published' });
    console.log(`   Available Categories: ${categories.length}`);
    categories.forEach(cat => {
      console.log(`   - ${cat}`);
    });

    // 4. Check Difficulties
    console.log('\n⚡ Checking Difficulties...');
    const difficulties = await Question.distinct('difficulty', { status: 'published' });
    console.log(`   Available Difficulties: ${difficulties.length}`);
    difficulties.forEach(diff => {
      console.log(`   - ${diff}`);
    });

    // 5. Check Users
    console.log('\n👥 Checking Users...');
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    console.log(`   Total Users: ${totalUsers}`);
    console.log(`   Admin Users: ${adminUsers}`);

    if (totalUsers === 0) {
      console.log('   ⚠️  WARNING: No users in database!');
      console.log('   💡 Register a user through the application');
    }

    // 6. Check Quizzes
    console.log('\n📊 Checking Quizzes...');
    const totalQuizzes = await Quiz.countDocuments();
    const inProgressQuizzes = await Quiz.countDocuments({ status: 'in-progress' });
    const completedQuizzes = await Quiz.countDocuments({ status: 'completed' });
    console.log(`   Total Quizzes: ${totalQuizzes}`);
    console.log(`   In Progress: ${inProgressQuizzes}`);
    console.log(`   Completed: ${completedQuizzes}`);

    // 7. Fix orphaned in-progress quizzes (older than 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const orphanedQuizzes = await Quiz.countDocuments({
      status: 'in-progress',
      createdAt: { $lt: oneDayAgo }
    });

    if (orphanedQuizzes > 0) {
      console.log(`\n🔧 Found ${orphanedQuizzes} orphaned quizzes (>24h old)`);
      console.log('   Marking as abandoned...');
      const result = await Quiz.updateMany(
        { status: 'in-progress', createdAt: { $lt: oneDayAgo } },
        { $set: { status: 'abandoned' } }
      );
      console.log(`   ✅ Marked ${result.modifiedCount} quizzes as abandoned`);
    }

    // 8. Summary
    console.log('\n' + '='.repeat(50));
    console.log('📋 SUMMARY');
    console.log('='.repeat(50));
    
    const issues = [];
    if (totalQuestions === 0) issues.push('No questions in database');
    if (publishedQuestions === 0 && totalQuestions > 0) issues.push('No published questions');
    if (totalUsers === 0) issues.push('No users registered');
    if (categories.length === 0) issues.push('No categories available');

    if (issues.length === 0) {
      console.log('✅ All checks passed! Database is healthy.');
    } else {
      console.log('⚠️  Issues found:');
      issues.forEach(issue => console.log(`   - ${issue}`));
      console.log('\n💡 Recommended actions:');
      if (totalQuestions === 0) {
        console.log('   1. Run: node scripts/seedDatabase.js');
      }
      if (totalUsers === 0) {
        console.log('   2. Register a user through the application');
      }
    }

    console.log('\n✅ Verification complete!');

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
  verifyAndFix();
}

module.exports = verifyAndFix;
