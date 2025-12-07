const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllUsers,
  updateUserRole,
  deactivateUser,
  getFlaggedQuestions,
  reviewQuestion,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  getSiteVisitStats
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/deactivate', deactivateUser);
router.get('/questions/flagged', getFlaggedQuestions);
router.put('/questions/:id/review', reviewQuestion);
router.post('/achievements', createAchievement);
router.put('/achievements/:id', updateAchievement);
router.delete('/achievements/:id', deleteAchievement);
router.get('/site-visits', getSiteVisitStats);

module.exports = router;