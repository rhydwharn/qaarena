#!/usr/bin/env node
/**
 * Fix Nested Maps Issue
 * The questionText Map has nested Map as value instead of string
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/qa_exam_prep';

async function fixNestedMaps() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🔍 Finding and fixing nested Map issues...\n');
    
    const db = mongoose.connection.db;
    const questionsCollection = db.collection('questions');
    
    const questions = await questionsCollection.find({}).toArray();
    console.log(`Found ${questions.length} questions to check\n`);
    
    let fixed = 0;
    
    for (const question of questions) {
      const updates = {};
      let needsUpdate = false;
      
      // Fix questionText
      if (question.questionText) {
        let text = null;
        
        // If it's an object with 'en' key
        if (typeof question.questionText === 'object' && question.questionText.en) {
          // Check if en value is also an object
          if (typeof question.questionText.en === 'object' && question.questionText.en.en) {
            text = question.questionText.en.en;
          } else if (typeof question.questionText.en === 'string') {
            text = question.questionText.en;
          } else {
            text = String(question.questionText.en);
          }
          
          if (text && text !== question.questionText.en) {
            updates.questionText = { en: text };
            needsUpdate = true;
          }
        }
      }
      
      // Fix options
      if (question.options && Array.isArray(question.options)) {
        const fixedOptions = question.options.map(opt => {
          if (opt.text && typeof opt.text === 'object' && opt.text.en) {
            let optText = null;
            
            if (typeof opt.text.en === 'object' && opt.text.en.en) {
              optText = opt.text.en.en;
            } else if (typeof opt.text.en === 'string') {
              optText = opt.text.en;
            } else {
              optText = String(opt.text.en);
            }
            
            return {
              text: { en: optText },
              isCorrect: opt.isCorrect
            };
          }
          return opt;
        });
        
        const optionsChanged = JSON.stringify(fixedOptions) !== JSON.stringify(question.options);
        if (optionsChanged) {
          updates.options = fixedOptions;
          needsUpdate = true;
        }
      }
      
      // Fix explanation
      if (question.explanation && typeof question.explanation === 'object' && question.explanation.en) {
        let expText = null;
        
        if (typeof question.explanation.en === 'object' && question.explanation.en.en) {
          expText = question.explanation.en.en;
        } else if (typeof question.explanation.en === 'string') {
          expText = question.explanation.en;
        } else {
          expText = String(question.explanation.en);
        }
        
        if (expText && expText !== question.explanation.en) {
          updates.explanation = { en: expText };
          needsUpdate = true;
        }
      }
      
      if (needsUpdate) {
        await questionsCollection.updateOne(
          { _id: question._id },
          { $set: updates }
        );
        fixed++;
        console.log(`✅ Fixed question ${question._id}`);
      }
    }
    
    console.log(`\n✅ Fixed ${fixed} out of ${questions.length} questions`);
    
    // Test a sample
    console.log('\n🔍 Testing sample question...');
    const Question = require('../models/Question');
    const sample = await Question.findOne({ status: 'published' });
    
    if (sample) {
      const text = sample.questionText instanceof Map 
        ? sample.questionText.get('en') 
        : sample.questionText?.en || sample.questionText;
      
      console.log(`Sample text: ${text}`);
      console.log(`Text type: ${typeof text}`);
      console.log(`Is string: ${typeof text === 'string'}`);
      
      if (typeof text === 'string') {
        console.log('✅ Question text is now a proper string!');
      } else {
        console.log('⚠️  Still not a string, may need manual intervention');
      }
    }

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
  fixNestedMaps();
}

module.exports = fixNestedMaps;
