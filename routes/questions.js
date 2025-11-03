const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  voteQuestion,
  flagQuestion
} = require('../controllers/questionController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, getQuestions);
router.get('/:id', getQuestion);
router.post('/', protect, authorize('admin', 'moderator'), createQuestion);
router.put('/:id', protect, updateQuestion);
router.delete('/:id', protect, deleteQuestion);
router.post('/:id/vote', protect, voteQuestion);
router.post('/:id/flag', protect, flagQuestion);

module.exports = router;