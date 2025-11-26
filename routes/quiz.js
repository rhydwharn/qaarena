const express = require('express');
const router = express.Router();
const {
  startQuiz,
  answerQuestion,
  completeQuiz,
  getQuiz,
  getUserQuizzes,
  getInProgressQuiz
} = require('../controllers/quizController');
const { protect } = require('../middleware/auth');
const { quizLimiter } = require('../middleware/rateLimiter');

router.post('/start', protect, startQuiz);
router.post('/answer', protect, quizLimiter, answerQuestion);
router.post('/:id/complete', protect, completeQuiz);
router.get('/in-progress', protect, getInProgressQuiz);
router.get('/:id', protect, getQuiz);
router.get('/user/history', protect, getUserQuizzes);

module.exports = router;