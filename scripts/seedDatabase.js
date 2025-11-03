require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Question = require('../models/Question');
const Achievement = require('../models/Achievement');
const Progress = require('../models/Progress');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Question.deleteMany({});
    await Achievement.deleteMany({});
    await Progress.deleteMany({});

    console.log('🗑️  Cleared existing data');

    const admin = await User.create({
      username: 'admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
      profile: {
        firstName: 'Admin',
        lastName: 'User',
        preferredLanguage: 'en'
      }
    });

    const testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test123!',
      role: 'user',
      profile: {
        firstName: 'Test',
        lastName: 'User',
        country: 'USA',
        preferredLanguage: 'en'
      }
    });

    await Progress.create({ user: admin._id });
    await Progress.create({ user: testUser._id });

    console.log('✅ Created users');

    const sampleQuestions = [
      // Fundamentals of Testing
      {
        questionText: new Map([['en', 'What does ISTQB stand for?']]),
        type: 'single-choice',
        options: [
          { text: new Map([['en', 'International Software Testing Qualifications Board']]), isCorrect: true },
          { text: new Map([['en', 'International System Testing Quality Board']]), isCorrect: false },
          { text: new Map([['en', 'International Software Technical Quality Board']]), isCorrect: false },
          { text: new Map([['en', 'International Standards Testing Qualifications Board']]), isCorrect: false }
        ],
        explanation: new Map([['en', 'ISTQB stands for International Software Testing Qualifications Board, which provides standardized software testing certifications.']]),
        category: 'fundamentals',
        difficulty: 'foundation',
        tags: ['istqb', 'basics'],
        createdBy: admin._id,
        status: 'published'
      },
      {
        questionText: new Map([['en', 'Which of the following are the seven testing principles according to ISTQB?']]),
        type: 'single-choice',
        options: [
          { text: new Map([['en', 'Testing shows the presence of defects, not their absence']]), isCorrect: true },
          { text: new Map([['en', 'Testing guarantees bug-free software']]), isCorrect: false },
          { text: new Map([['en', 'Testing should be done only at the end of development']]), isCorrect: false },
          { text: new Map([['en', 'Testing is the responsibility of developers only']]), isCorrect: false }
        ],
        explanation: new Map([['en', 'One of the seven testing principles is that testing shows the presence of defects but cannot prove their absence.']]),
        category: 'fundamentals',
        difficulty: 'foundation',
        tags: ['principles', 'theory'],
        createdBy: admin._id,
        status: 'published'
      },
      {
        questionText: new Map([['en', 'What is the primary objective of testing?']]),
        type: 'single-choice',
        options: [
          { text: new Map([['en', 'To prove that the software has no defects']]), isCorrect: false },
          { text: new Map([['en', 'To find as many defects as possible']]), isCorrect: false },
          { text: new Map([['en', 'To gain confidence in the level of quality and provide information']]), isCorrect: true },
          { text: new Map([['en', 'To verify that all requirements are implemented']]), isCorrect: false }
        ],
        explanation: new Map([['en', 'The primary objective of testing is to gain confidence in the level of quality and provide information to stakeholders for decision-making.']]),
        category: 'fundamentals',
        difficulty: 'foundation',
        tags: ['objectives', 'theory'],
        createdBy: admin._id,
        status: 'published'
      },

      // Test Design Techniques
      {
        questionText: new Map([['en', 'Which of the following is a white-box testing technique?']]),
        type: 'single-choice',
        options: [
          { text: new Map([['en', 'Equivalence Partitioning']]), isCorrect: false },
          { text: new Map([['en', 'Boundary Value Analysis']]), isCorrect: false },
          { text: new Map([['en', 'Statement Coverage']]), isCorrect: true },
          { text: new Map([['en', 'Use Case Testing']]), isCorrect: false }
        ],
        explanation: new Map([['en', 'Statement Coverage is a white-box (structure-based) testing technique that measures the percentage of executable statements covered by tests.']]),
        category: 'test-techniques',
        difficulty: 'foundation',
        tags: ['white-box', 'coverage'],
        createdBy: admin._id,
        status: 'published'
      },
      {
        questionText: new Map([['en', 'In Equivalence Partitioning, what is the goal?']]),
        type: 'single-choice',
        options: [
          { text: new Map([['en', 'To test all possible input values']]), isCorrect: false },
          { text: new Map([['en', 'To divide inputs into groups that are expected to exhibit similar behavior']]), isCorrect: true },
          { text: new Map([['en', 'To test only boundary values']]), isCorrect: false },
          { text: new Map([['en', 'To test the internal structure of the code']]), isCorrect: false }
        ],
        explanation: new Map([['en', 'Equivalence Partitioning divides input data into partitions where all members are expected to be processed in the same way, reducing the number of test cases needed.']]),
        category: 'test-techniques',
        difficulty: 'foundation',
        tags: ['black-box', 'equivalence-partitioning'],
        createdBy: admin._id,
        status: 'published'
      },
      {
        questionText: new Map([['en', 'What does Boundary Value Analysis focus on?']]),
        type: 'single-choice',
        options: [
          { text: new Map([['en', 'Testing values at the edges of equivalence partitions']]), isCorrect: true },
          { text: new Map([['en', 'Testing all possible combinations of inputs']]), isCorrect: false },
          { text: new Map([['en', 'Testing the middle values of input ranges']]), isCorrect: false },
          { text: new Map([['en', 'Testing code coverage']]), isCorrect: false }
        ],
        explanation: new Map([['en', 'Boundary Value Analysis focuses on testing at the boundaries between partitions, as defects tend to occur at the edges of input ranges.']]),
        category: 'test-techniques',
        difficulty: 'foundation',
        tags: ['black-box', 'boundary-value'],
        createdBy: admin._id,
        status: 'published'
      },

      // Testing Throughout SDLC
      {
        questionText: new Map([['en', 'Testing activities should start in the requirements phase.']]),
        type: 'true-false',
        options: [
          { text: new Map([['en', 'True']]), isCorrect: true },
          { text: new Map([['en', 'False']]), isCorrect: false }
        ],
        explanation: new Map([['en', 'Testing should start as early as possible in the SDLC. Early testing helps identify defects when they are cheaper to fix.']]),
        category: 'testing-throughout-sdlc',
        difficulty: 'foundation',
        tags: ['sdlc', 'early-testing'],
        createdBy: admin._id,
        status: 'published'
      },
      {
        questionText: new Map([['en', 'Which test level focuses on testing interactions between components or systems?']]),
        type: 'single-choice',
        options: [
          { text: new Map([['en', 'Unit Testing']]), isCorrect: false },
          { text: new Map([['en', 'Integration Testing']]), isCorrect: true },
          { text: new Map([['en', 'System Testing']]), isCorrect: false },
          { text: new Map([['en', 'Acceptance Testing']]), isCorrect: false }
        ],
        explanation: new Map([['en', 'Integration Testing focuses on testing the interfaces and interactions between integrated components or systems.']]),
        category: 'testing-throughout-sdlc',
        difficulty: 'foundation',
        tags: ['test-levels', 'integration'],
        createdBy: admin._id,
        status: 'published'
      },

      // Static Testing
      {
        questionText: new Map([['en', 'Which of the following are static testing techniques?']]),
        type: 'multiple-choice',
        options: [
          { text: new Map([['en', 'Code Review']]), isCorrect: true },
          { text: new Map([['en', 'Walkthrough']]), isCorrect: true },
          { text: new Map([['en', 'Unit Testing']]), isCorrect: false },
          { text: new Map([['en', 'Integration Testing']]), isCorrect: false }
        ],
        explanation: new Map([['en', 'Code reviews and walkthroughs are static testing techniques that examine work products without executing the code.']]),
        category: 'static-testing',
        difficulty: 'foundation',
        tags: ['static', 'reviews'],
        createdBy: admin._id,
        status: 'published'
      },
      {
        questionText: new Map([['en', 'What is the main benefit of static testing?']]),
        type: 'single-choice',
        options: [
          { text: new Map([['en', 'It requires code execution']]), isCorrect: false },
          { text: new Map([['en', 'It can find defects early before code execution']]), isCorrect: true },
          { text: new Map([['en', 'It replaces dynamic testing']]), isCorrect: false },
          { text: new Map([['en', 'It only works on completed code']]), isCorrect: false }
        ],
        explanation: new Map([['en', 'Static testing can find defects early in the development lifecycle, even before code is executed, making it cost-effective.']]),
        category: 'static-testing',
        difficulty: 'foundation',
        tags: ['static', 'benefits'],
        createdBy: admin._id,
        status: 'published'
      },

      // Test Management
      {
        questionText: new Map([['en', 'What is the main purpose of test management?']]),
        type: 'single-choice',
        options: [
          { text: new Map([['en', 'To write test cases']]), isCorrect: false },
          { text: new Map([['en', 'To plan, monitor, and control testing activities']]), isCorrect: true },
          { text: new Map([['en', 'To execute automated tests']]), isCorrect: false },
          { text: new Map([['en', 'To find defects']]), isCorrect: false }
        ],
        explanation: new Map([['en', 'Test management involves planning, monitoring, and controlling all testing activities to ensure testing objectives are met.']]),
        category: 'test-management',
        difficulty: 'foundation',
        tags: ['management', 'planning'],
        createdBy: admin._id,
        status: 'published'
      },
      {
        questionText: new Map([['en', 'What is a test plan?']]),
        type: 'single-choice',
        options: [
          { text: new Map([['en', 'A document describing test cases']]), isCorrect: false },
          { text: new Map([['en', 'A document describing the scope, approach, resources, and schedule of testing activities']]), isCorrect: true },
          { text: new Map([['en', 'A list of defects found during testing']]), isCorrect: false },
          { text: new Map([['en', 'A tool for test automation']]), isCorrect: false }
        ],
        explanation: new Map([['en', 'A test plan is a document that describes the scope, approach, resources, and schedule of intended test activities.']]),
        category: 'test-management',
        difficulty: 'foundation',
        tags: ['test-plan', 'documentation'],
        createdBy: admin._id,
        status: 'published'
      },

      // Defect Management
      {
        questionText: new Map([['en', 'What information should a good defect report contain?']]),
        type: 'multiple-choice',
        options: [
          { text: new Map([['en', 'Steps to reproduce']]), isCorrect: true },
          { text: new Map([['en', 'Expected and actual results']]), isCorrect: true },
          { text: new Map([['en', 'Personal opinions about the developer']]), isCorrect: false },
          { text: new Map([['en', 'Severity and priority']]), isCorrect: true }
        ],
        explanation: new Map([['en', 'A good defect report should include steps to reproduce, expected vs actual results, severity, priority, and other relevant technical information.']]),
        category: 'test-management',
        difficulty: 'foundation',
        tags: ['defects', 'reporting'],
        createdBy: admin._id,
        status: 'published'
      },

      // Tool Support
      {
        questionText: new Map([['en', 'What is the primary benefit of test automation?']]),
        type: 'single-choice',
        options: [
          { text: new Map([['en', 'It eliminates the need for manual testing']]), isCorrect: false },
          { text: new Map([['en', 'It finds more defects than manual testing']]), isCorrect: false },
          { text: new Map([['en', 'It enables faster regression testing and repeatability']]), isCorrect: true },
          { text: new Map([['en', 'It requires no maintenance']]), isCorrect: false }
        ],
        explanation: new Map([['en', 'Test automation enables faster execution of repetitive tests, especially for regression testing, and ensures consistency in test execution.']]),
        category: 'tool-support',
        difficulty: 'foundation',
        tags: ['automation', 'tools'],
        createdBy: admin._id,
        status: 'published'
      },

      // Advanced Question
      {
        questionText: new Map([['en', 'Which of the following statements about regression testing are true?']]),
        type: 'multiple-choice',
        options: [
          { text: new Map([['en', 'It verifies that previously working functionality still works after changes']]), isCorrect: true },
          { text: new Map([['en', 'It should be performed only once at the end of the project']]), isCorrect: false },
          { text: new Map([['en', 'It is a good candidate for test automation']]), isCorrect: true },
          { text: new Map([['en', 'It only tests new features']]), isCorrect: false }
        ],
        explanation: new Map([['en', 'Regression testing ensures that changes have not adversely affected existing functionality. It is repetitive and therefore a good candidate for automation.']]),
        category: 'test-techniques',
        difficulty: 'advanced',
        tags: ['regression', 'automation'],
        createdBy: admin._id,
        status: 'published'
      }
    ];

    // Generate 20 beginner questions for each ISTQB chapter
    const CHAPTERS = [
      { key: 'fundamentals', title: 'Fundamentals of Testing' },
      { key: 'testing-throughout-sdlc', title: 'Testing Throughout the SDLC' },
      { key: 'static-testing', title: 'Static Testing' },
      { key: 'test-techniques', title: 'Test Design Techniques' },
      { key: 'test-management', title: 'Test Management' },
      { key: 'tool-support', title: 'Tool Support for Testing' },
      { key: 'agile-testing', title: 'Agile Testing' },
      { key: 'test-automation', title: 'Test Automation' }
    ];

    const beginnerQuestions = [];
    for (const ch of CHAPTERS) {
      for (let i = 0; i < 20; i++) {
        const n = i + 1;
        beginnerQuestions.push({
          questionText: new Map([[ 'en', `(${ch.title}) Beginner Q${n}: Choose the best answer.` ]]),
          type: 'single-choice',
          options: [
            { text: new Map([[ 'en', `Correct concept for ${ch.title} Q${n}` ]]), isCorrect: true },
            { text: new Map([[ 'en', `Unrelated statement for ${ch.title} Q${n}` ]]), isCorrect: false },
            { text: new Map([[ 'en', `Partially true but incorrect for ${ch.title} Q${n}` ]]), isCorrect: false },
            { text: new Map([[ 'en', `Common misconception for ${ch.title} Q${n}` ]]), isCorrect: false }
          ],
          explanation: new Map([[ 'en', `The correct option summarizes the beginner concept for ${ch.title}.` ]]),
          category: ch.key,
          difficulty: 'foundation',
          syllabus: 'ISTQB-CTFL-2018',
          tags: ['beginners', ch.key],
          points: 1,
          status: 'published',
          createdBy: admin._id
        });
      }
    }

    const allQuestions = [...sampleQuestions, ...beginnerQuestions];
    await Question.insertMany(allQuestions);
    console.log(`✅ Created ${allQuestions.length} questions (including ${beginnerQuestions.length} beginner questions)`);

    const achievements = [
      {
        name: new Map([['en', 'First Steps']]),
        description: new Map([['en', 'Complete your first quiz']]),
        icon: '🎯',
        type: 'quiz',
        criteria: { metric: 'totalQuizzes', threshold: 1 },
        rarity: 'common',
        points: 10
      },
      {
        name: new Map([['en', 'Quiz Master']]),
        description: new Map([['en', 'Complete 10 quizzes']]),
        icon: '🏆',
        type: 'quiz',
        criteria: { metric: 'totalQuizzes', threshold: 10 },
        rarity: 'rare',
        points: 50
      },
      {
        name: new Map([['en', 'Perfect Score']]),
        description: new Map([['en', 'Achieve 100% on a quiz']]),
        icon: '⭐',
        type: 'score',
        criteria: { metric: 'averageScore', threshold: 100 },
        rarity: 'epic',
        points: 100
      },
      {
        name: new Map([['en', 'Week Warrior']]),
        description: new Map([['en', 'Study for 7 consecutive days']]),
        icon: '🔥',
        type: 'streak',
        criteria: { metric: 'streak', threshold: 7 },
        rarity: 'rare',
        points: 75
      }
    ];

    await Achievement.insertMany(achievements);
    console.log('✅ Created achievements');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login credentials:');
    console.log('Test User: test@example.com / Test123!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error);
    process.exit(1);
  }
};

seedData();