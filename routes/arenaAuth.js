const express = require('express');
const router = express.Router();
const arenaAuthController = require('../controllers/arenaAuthController');

// POST /api/arena-auth/signup
router.post('/signup', arenaAuthController.signup);

// POST /api/arena-auth/verify-otp
router.post('/verify-otp', arenaAuthController.verifyOTP);

// POST /api/arena-auth/verify-token
router.post('/verify-token', arenaAuthController.verifyToken);

// POST /api/arena-auth/signin
router.post('/signin', arenaAuthController.signin);

module.exports = router;
