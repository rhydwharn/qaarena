const express = require('express');
const router = express.Router();
const {
  getGlobalLeaderboard,
  getCategoryLeaderboard,
  getUserRank
} = require('../controllers/leaderboardController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/global', optionalAuth, getGlobalLeaderboard);
router.get('/category/:category', optionalAuth, getCategoryLeaderboard);
router.get('/rank', protect, getUserRank);

module.exports = router;