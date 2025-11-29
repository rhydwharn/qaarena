// MySQL Models
const { Progress, CategoryProgress, DifficultyProgress, RecentActivity, User } = require('../models/mysql');
const { sequelize } = require('../config/mysqlDatabase');
const ErrorResponse = require('../utils/errorResponse');
const { Op } = require('sequelize');

exports.getProgress = async (req, res, next) => {
  try {
    let progress = await Progress.findOne({ 
      where: { userId: req.user.id },
      include: [
        { model: CategoryProgress, as: 'categoryProgress' },
        { model: DifficultyProgress, as: 'difficultyProgress' },
        { model: RecentActivity, as: 'recentActivity', limit: 10, order: [['activityDate', 'DESC']] }
      ]
    });

    if (!progress) {
      // Create initial progress if it doesn't exist
      progress = await Progress.create({ userId: req.user.id });
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
    let progress = await Progress.findOne({ 
      where: { userId: req.user.id },
      include: [{ model: CategoryProgress, as: 'categoryProgress' }]
    });

    if (!progress) {
      // Create initial progress if it doesn't exist
      progress = await Progress.create({ userId: req.user.id });
    }

    const categoryProgress = progress.categoryProgress || [];

    res.status(200).json({
      success: true,
      message: categoryProgress.length > 0 ? 'Category progress retrieved successfully' : 'No category progress yet. Start taking quizzes to track your progress!',
      data: { categoryProgress }
    });
  } catch (error) {
    next(error);
  }
};

exports.getWeakAreas = async (req, res, next) => {
  try {
    let progress = await Progress.findOne({ 
      where: { userId: req.user.id },
      include: [{ model: CategoryProgress, as: 'categoryProgress' }]
    });

    if (!progress) {
      // Create initial progress if it doesn't exist
      progress = await Progress.create({ userId: req.user.id });
    }

    // Calculate weak and strong areas from category progress
    const categoryProgress = progress.categoryProgress || [];
    
    const weakAreas = categoryProgress
      .filter(cp => cp.averageScore < 60 && cp.questionsAttempted >= 5)
      .map(cp => ({ 
        category: cp.category, 
        successRate: cp.averageScore, 
        needsImprovement: true 
      }))
      .sort((a, b) => a.successRate - b.successRate);

    const strongAreas = categoryProgress
      .filter(cp => cp.averageScore >= 80 && cp.questionsAttempted >= 5)
      .map(cp => ({ 
        category: cp.category, 
        successRate: cp.averageScore 
      }))
      .sort((a, b) => b.successRate - a.successRate);

    const hasData = weakAreas.length > 0 || strongAreas.length > 0;

    res.status(200).json({
      success: true,
      message: hasData ? 'Areas analysis retrieved successfully' : 'Complete more quizzes to get personalized weak and strong areas analysis',
      data: { weakAreas, strongAreas }
    });
  } catch (error) {
    next(error);
  }
};

exports.getStudyStreak = async (req, res, next) => {
  try {
    let progress = await Progress.findOne({ where: { userId: req.user.id } });

    if (!progress) {
      // Create initial progress if it doesn't exist
      progress = await Progress.create({ userId: req.user.id });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastStudy = progress.lastStudyDate;
    if (lastStudy) {
      const lastStudyDate = new Date(lastStudy);
      lastStudyDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((today - lastStudyDate) / (1000 * 60 * 60 * 24));

      if (daysDiff === 0) {
        // Already studied today
      } else if (daysDiff === 1) {
        progress.currentStreak += 1;
        if (progress.currentStreak > progress.longestStreak) {
          progress.longestStreak = progress.currentStreak;
        }
        progress.lastStudyDate = today;
        await progress.save();
      } else {
        progress.currentStreak = 1;
        progress.lastStudyDate = today;
        await progress.save();
      }
    } else {
      progress.currentStreak = 1;
      progress.longestStreak = 1;
      progress.lastStudyDate = today;
      await progress.save();
    }

    const studyStreak = {
      current: progress.currentStreak,
      longest: progress.longestStreak,
      lastStudyDate: progress.lastStudyDate
    };

    res.status(200).json({
      success: true,
      message: progress.currentStreak > 0 ? `Great! You're on a ${progress.currentStreak}-day streak!` : 'Start studying today to begin your streak!',
      data: { studyStreak }
    });
  } catch (error) {
    next(error);
  }
};

exports.getRecentActivity = async (req, res, next) => {
  try {
    let progress = await Progress.findOne({ 
      where: { userId: req.user.id },
      include: [{
        model: RecentActivity,
        as: 'recentActivity',
        limit: 10,
        order: [['activityDate', 'DESC']]
      }]
    });

    if (!progress) {
      // Create initial progress if it doesn't exist
      progress = await Progress.create({ userId: req.user.id });
    }

    const recentActivity = progress.recentActivity || [];

    res.status(200).json({
      success: true,
      message: recentActivity.length > 0 ? 'Recent activity retrieved successfully' : 'No recent activity. Start taking quizzes to see your activity here!',
      data: { recentActivity }
    });
  } catch (error) {
    next(error);
  }
};