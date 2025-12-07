const rateLimit = require('express-rate-limit');

const isProd = process.env.NODE_ENV === 'production';

exports.apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

exports.authLimiter = rateLimit({
  windowMs: isProd ? 15 * 60 * 1000 : 60 * 1000,
  max: isProd ? 5 : 100,
  message: {
    status: 'error',
    message: 'Too many authentication attempts, please try again later'
  },
  skipSuccessfulRequests: true,
});

exports.quizLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100, // Increased for testing
  message: {
    status: 'error',
    message: 'Too many quiz submissions, please slow down'
  },
});