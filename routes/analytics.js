const express = require('express');
const router = express.Router();
const { recordVisit } = require('../controllers/analyticsController');
const { optionalAuth } = require('../middleware/auth');

// POST /api/analytics/visit
router.post('/visit', optionalAuth, recordVisit);

module.exports = router;
