const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.getGlobalLeaderboard = async (req, res, next) => {
  try {
    const { period = 'all', limit = 50 } = req.query;

    // Validate limit
    const parsedLimit = parseInt(limit);
    if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
      return next(new ErrorResponse('Limit must be a number between 1 and 100', 400));
    }

    const users = await User.find({ isActive: true })
      .select('username role profile.country stats')
      .sort({ 'stats.averageScore': -1, 'stats.totalQuizzes': -1 })
      .limit(parsedLimit);

    if (users.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No users on the leaderboard yet. Be the first!',
        data: { leaderboard: [] }
      });
    }

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      role: user.role,
      country: user.profile.country,
      totalScore: user.stats.totalScore,
      averageScore: user.stats.averageScore,
      totalQuizzes: user.stats.totalQuizzes,
      correctAnswers: user.stats.correctAnswers
    }));

    res.status(200).json({
      success: true,
      message: 'Global leaderboard retrieved successfully',
      data: { leaderboard }
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategoryLeaderboard = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { limit = 50 } = req.query;

    // Validate category
    const validCategories = ['fundamentals', 'test-design', 'test-management', 'test-tools', 'agile'];
    if (!validCategories.includes(category)) {
      return next(new ErrorResponse(`Invalid category. Must be one of: ${validCategories.join(', ')}`, 400));
    }

    // Validate limit
    const parsedLimit = parseInt(limit);
    if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
      return next(new ErrorResponse('Limit must be a number between 1 and 100', 400));
    }

    const users = await User.find({ isActive: true })
      .select('username role profile.country stats')
      .sort({ 'stats.averageScore': -1, 'stats.totalQuizzes': -1 })
      .limit(parsedLimit);

    if (users.length === 0) {
      return res.status(200).json({
        success: true,
        message: `No users on the ${category} leaderboard yet. Be the first!`,
        data: { category, leaderboard: [] }
      });
    }

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      role: user.role,
      country: user.profile.country,
      totalScore: user.stats.totalScore,
      averageScore: user.stats.averageScore,
      totalQuizzes: user.stats.totalQuizzes,
      correctAnswers: user.stats.correctAnswers
    }));

    res.status(200).json({
      success: true,
      message: `${category.charAt(0).toUpperCase() + category.slice(1)} leaderboard retrieved successfully`,
      data: { category, leaderboard }
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserRank = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Exclude admins from ranking if user is not an admin
    const rankQuery = {
      isActive: true,
      $or: [
        { 'stats.averageScore': { $gt: user.stats.averageScore } },
        { 
          'stats.averageScore': user.stats.averageScore,
          'stats.totalQuizzes': { $gt: user.stats.totalQuizzes }
        }
      ]
    };
    
    const totalUsersQuery = { isActive: true };
    
    // If user is not admin, exclude admins from ranking
    if (user.role !== 'admin') {
      rankQuery.role = { $ne: 'admin' };
      totalUsersQuery.role = { $ne: 'admin' };
    }
    
    const rank = await User.countDocuments(rankQuery) + 1;
    const totalUsers = await User.countDocuments(totalUsersQuery);

    if (totalUsers === 0) {
      return res.status(200).json({
        success: true,
        message: 'You are the first user! Start taking quizzes to establish your rank.',
        data: { rank: 1, totalUsers: 1, percentile: 100 }
      });
    }

    const percentile = Math.round(((totalUsers - rank) / totalUsers) * 100);

    res.status(200).json({
      success: true,
      message: `You are ranked #${rank} out of ${totalUsers} users (Top ${100 - percentile}%)`,
      data: {
        rank,
        totalUsers,
        percentile,
        totalScore: user.stats.totalScore,
        averageScore: user.stats.averageScore
      }
    });
  } catch (error) {
    next(error);
  }
};