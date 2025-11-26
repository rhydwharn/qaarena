const express = require('express');
const router = express.Router();
const {
  getAllBugs,
  getBugById,
  startBugScenario,
  getHint,
  submitAnswer,
  getUserProgress,
  getLeaderboard,
  getBugStats,
  createBug,
  updateBug,
  deleteBug
} = require('../controllers/functionalBugController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllBugs);
router.get('/leaderboard', getLeaderboard);
router.get('/:bugId', getBugById);
router.get('/:bugId/stats', getBugStats);

// Protected routes (require authentication)
router.post('/:bugId/start', protect, startBugScenario);
router.post('/:bugId/hint', protect, getHint);
router.post('/:bugId/submit', protect, submitAnswer);
router.get('/user/progress', protect, getUserProgress);

// Admin routes
router.post('/', protect, authorize('admin', 'moderator'), createBug);
router.put('/:bugId', protect, authorize('admin', 'moderator'), updateBug);
router.delete('/:bugId', protect, authorize('admin'), deleteBug);

module.exports = router;
