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

// Auth limiter configuration (can be tuned/disabled via env)
const rawAuthWindow = parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS, 10);
const rawAuthMax = parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS, 10);
const authLimitDisabled = process.env.AUTH_RATE_LIMIT_DISABLED === 'true';

const authWindowMs = Number.isNaN(rawAuthWindow)
  ? (isProd ? 15 * 60 * 1000 : 60 * 1000)
  : rawAuthWindow;

const authMax = Number.isNaN(rawAuthMax)
  ? (isProd ? 5 : 1000)
  : rawAuthMax;

exports.authLimiter = authLimitDisabled
  ? (req, res, next) => next()
  : rateLimit({
      windowMs: authWindowMs,
      max: authMax,
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