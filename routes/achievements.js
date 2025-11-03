const express = require('express');
const router = express.Router();
const {
  getAllAchievements,
  getUserAchievements,
  checkAchievements
} = require('../controllers/achievementController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAllAchievements);
router.get('/user', protect, getUserAchievements);
router.post('/check', protect, checkAchievements);

module.exports = router;