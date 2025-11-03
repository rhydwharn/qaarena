const { body } = require('express-validator');

exports.questionValidation = [
  body('questionText').notEmpty().withMessage('Question text is required'),
  body('type').isIn(['single-choice', 'multiple-choice', 'true-false']).withMessage('Invalid question type'),
  body('options').isArray({ min: 2 }).withMessage('At least 2 options are required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('difficulty').optional().isIn(['foundation', 'advanced', 'expert']).withMessage('Invalid difficulty')
];

exports.quizValidation = [
  body('mode').isIn(['practice', 'exam', 'timed', 'category']).withMessage('Invalid quiz mode'),
  body('numberOfQuestions').optional().isInt({ min: 1, max: 100 }).withMessage('Number of questions must be between 1 and 100')
];

exports.achievementValidation = [
  body('name').notEmpty().withMessage('Achievement name is required'),
  body('description').notEmpty().withMessage('Achievement description is required'),
  body('type').isIn(['quiz', 'streak', 'score', 'category', 'special']).withMessage('Invalid achievement type'),
  body('criteria.metric').notEmpty().withMessage('Achievement metric is required'),
  body('criteria.threshold').isNumeric().withMessage('Threshold must be a number')
];