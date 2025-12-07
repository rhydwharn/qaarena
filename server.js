require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const { testConnection } = require('./config/mysqlDatabase');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const quizRoutes = require('./routes/quiz');
const progressRoutes = require('./routes/progress');
const leaderboardRoutes = require('./routes/leaderboard');
const achievementRoutes = require('./routes/achievements');
const adminRoutes = require('./routes/admin');
const functionalBugRoutes = require('./routes/functionalBugs');
const questionUploadRoutes = require('./routes/questionUpload');
const arenaAuthRoutes = require('./routes/arenaAuth');
const analyticsRoutes = require('./routes/analytics');

const app = express();

// Only connect to DB if not in test mode (tests handle their own connection)
if (process.env.NODE_ENV !== 'test') {
  testConnection();
}

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Support both with and without /qaarena prefix
const basePath = process.env.BASE_PATH || '';

app.get(`${basePath}/api/health`, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'ISTQB Practice API is running',
    timestamp: new Date().toISOString()
  });
});

app.use(`${basePath}/api/auth`, authRoutes);
app.use(`${basePath}/api/questions`, questionRoutes);
app.use(`${basePath}/api/quiz`, quizRoutes);
app.use(`${basePath}/api/progress`, progressRoutes);
app.use(`${basePath}/api/leaderboard`, leaderboardRoutes);
app.use(`${basePath}/api/achievements`, achievementRoutes);
app.use(`${basePath}/api/admin`, adminRoutes);
app.use(`${basePath}/api/functional-bugs`, functionalBugRoutes);
app.use(`${basePath}/api/questions-upload`, questionUploadRoutes);
app.use(`${basePath}/api/arena-auth`, arenaAuthRoutes);
app.use(`${basePath}/api/analytics`, analyticsRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });

  // Handle port already in use error
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use. Please kill the existing process or use a different port.`);
      console.error(`   Run: lsof -ti:${PORT} | xargs kill -9`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });

  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
  });
}

module.exports = app;