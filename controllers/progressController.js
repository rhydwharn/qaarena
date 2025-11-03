const Progress = require('../models/Progress');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.getProgress = async (req, res, next) => {
  try {
    let progress = await Progress.findOne({ user: req.user.id });

    if (!progress) {
      // Create initial progress if it doesn't exist
      progress = await Progress.create({ user: req.user.id });
    }

    res.status(200).json({ 
      success: true, 
      data: { progress } 
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategoryProgress = async (req, res, next) => {
  try {
    let progress = await Progress.findOne({ user: req.user.id });

    if (!progress) {
      // Create initial progress if it doesn't exist
      progress = await Progress.create({ user: req.user.id });
    }

    res.status(200).json({
      success: true,
      message: progress.categoryProgress.length > 0 ? 'Category progress retrieved successfully' : 'No category progress yet. Start taking quizzes to track your progress!',
      data: { categoryProgress: progress.categoryProgress }
    });
  } catch (error) {
    next(error);
  }
};

exports.getWeakAreas = async (req, res, next) => {
  try {
    let progress = await Progress.findOne({ user: req.user.id });

    if (!progress) {
      // Create initial progress if it doesn't exist
      progress = await Progress.create({ user: req.user.id });
    }

    progress.updateAreas();
    await progress.save();

    const hasData = progress.weakAreas.length > 0 || progress.strongAreas.length > 0;

    res.status(200).json({
      success: true,
      message: hasData ? 'Areas analysis retrieved successfully' : 'Complete more quizzes to get personalized weak and strong areas analysis',
      data: { weakAreas: progress.weakAreas, strongAreas: progress.strongAreas }
    });
  } catch (error) {
    next(error);
  }
};

exports.getStudyStreak = async (req, res, next) => {
  try {
    let progress = await Progress.findOne({ user: req.user.id });

    if (!progress) {
      // Create initial progress if it doesn't exist
      progress = await Progress.create({ user: req.user.id });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastStudy = progress.studyStreak.lastStudyDate;
    if (lastStudy) {
      const lastStudyDate = new Date(lastStudy);
      lastStudyDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((today - lastStudyDate) / (1000 * 60 * 60 * 24));

      if (daysDiff === 0) {
        // Already studied today
      } else if (daysDiff === 1) {
        progress.studyStreak.current += 1;
        if (progress.studyStreak.current > progress.studyStreak.longest) {
          progress.studyStreak.longest = progress.studyStreak.current;
        }
        progress.studyStreak.lastStudyDate = today;
        await progress.save();
      } else {
        progress.studyStreak.current = 1;
        progress.studyStreak.lastStudyDate = today;
        await progress.save();
      }
    } else {
      progress.studyStreak.current = 1;
      progress.studyStreak.longest = 1;
      progress.studyStreak.lastStudyDate = today;
      await progress.save();
    }

    res.status(200).json({
      success: true,
      message: progress.studyStreak.current > 0 ? `Great! You're on a ${progress.studyStreak.current}-day streak!` : 'Start studying today to begin your streak!',
      data: { studyStreak: progress.studyStreak }
    });
  } catch (error) {
    next(error);
  }
};

exports.getRecentActivity = async (req, res, next) => {
  try {
    let progress = await Progress.findOne({ user: req.user.id });

    if (!progress) {
      // Create initial progress if it doesn't exist
      progress = await Progress.create({ user: req.user.id });
    }

    const recentActivity = progress.recentActivity.slice(0, 10);

    res.status(200).json({
      success: true,
      message: recentActivity.length > 0 ? 'Recent activity retrieved successfully' : 'No recent activity. Start taking quizzes to see your activity here!',
      data: { recentActivity }
    });
  } catch (error) {
    next(error);
  }
};