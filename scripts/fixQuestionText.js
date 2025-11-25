#!/usr/bin/env node
/**
 * Fix Question Text Structure
 * Ensures all questions have proper questionText format
 */

const mongoose = require('mongoose');
const Question = require('../models/Question');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/qa_exam_prep';

async function fixQuestionText() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🔍 Finding questions with text issues...');
    const questions = await Question.find();
    
    let fixed = 0;
    for (const question of questions) {
      let needsUpdate = false;
      const updates = {};

      // Fix questionText
      if (!question.questionText) {
        console.log(`   ❌ Question ${question._id} has no questionText`);
        needsUpdate = true;
        updates.questionText = { en: 'Question text missing' };
      } else if (typeof question.questionText === 'string') {
        // Already a string, convert to object format
        updates.questionText = { en: question.questionText };
        needsUpdate = true;
      } else if (typeof question.questionText === 'object' && !question.questionText.en) {
        // Object but no 'en' field
        updates.questionText = { en: question.questionText.toString() };
        needsUpdate = true;
      }

      // Fix options text
      if (question.options && Array.isArray(question.options)) {
        const fixedOptions = question.options.map(opt => {
          if (typeof opt.text === 'string') {
            return { ...opt.toObject(), text: { en: opt.text } };
          } else if (typeof opt.text === 'object' && !opt.text.en) {
            return { ...opt.toObject(), text: { en: opt.text.toString() } };
          }
          return opt;
        });
        
        // Check if any option was modified
        const optionsChanged = fixedOptions.some((opt, idx) => {
          const original = question.options[idx];
          return JSON.stringify(opt.text) !== JSON.stringify(original.text);
        });

        if (optionsChanged) {
          updates.options = fixedOptions;
          needsUpdate = true;
        }
      }

      // Fix explanation
      if (question.explanation) {
        if (typeof question.explanation === 'string') {
          updates.explanation = { en: question.explanation };
          needsUpdate = true;
        } else if (typeof question.explanation === 'object' && !question.explanation.en) {
          updates.explanation = { en: question.explanation.toString() };
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        await Question.findByIdAndUpdate(question._id, updates);
        fixed++;
        console.log(`   ✅ Fixed question ${question._id}`);
      }
    }

    console.log(`\n✅ Fixed ${fixed} out of ${questions.length} questions`);

    // Verify
    console.log('\n🔍 Verifying fixes...');
    const sampleQuestion = await Question.findOne({ status: 'published' });
    if (sampleQuestion) {
      console.log('Sample question structure:');
      console.log(`   questionText type: ${typeof sampleQuestion.questionText}`);
      console.log(`   questionText.en exists: ${!!sampleQuestion.questionText?.en}`);
      console.log(`   First option text type: ${typeof sampleQuestion.options?.[0]?.text}`);
      console.log(`   First option text.en exists: ${!!sampleQuestion.options?.[0]?.text?.en}`);
    }

    console.log('\n✅ All done!');

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
  fixQuestionText();
}

module.exports = fixQuestionText;
