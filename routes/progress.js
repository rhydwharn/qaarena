const express = require('express');
const router = express.Router();
const {
  getProgress,
  getCategoryProgress,
  getWeakAreas,
  getStudyStreak,
  getRecentActivity
} = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getProgress);
router.get('/categories', protect, getCategoryProgress);
router.get('/weak-areas', protect, getWeakAreas);
router.get('/streak', protect, getStudyStreak);
router.get('/activity', protect, getRecentActivity);

module.exports = router;