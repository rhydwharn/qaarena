const User = require('../models/User');
const Progress = require('../models/Progress');
const ErrorResponse = require('../utils/errorResponse');

exports.getGlobalLeaderboard = async (req, res, next) => {
  try {
    const { period = 'all', limit = 50 } = req.query;

    // Validate limit
    const parsedLimit = parseInt(limit);
    if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
      return next(new ErrorResponse('Limit must be a number between 1 and 100', 400));
    }

    const users = await User.find({ isActive: true, role: { $ne: 'admin' } })
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

    // Calculate ranks with tie handling
    let currentRank = 1;
    const leaderboard = users.map((user, index) => {
      // Check if this user has same score as previous user
      if (index > 0) {
        const prevUser = users[index - 1];
        const sameScore = prevUser.stats.averageScore === user.stats.averageScore &&
                         prevUser.stats.totalQuizzes === user.stats.totalQuizzes;
        
        if (!sameScore) {
          // Different score, so rank is current position + 1
          currentRank = index + 1;
        }
        // If same score, keep currentRank (tie)
      }
      
      return {
        rank: currentRank,
        username: user.username,
        role: user.role,
        country: user.profile.country,
        totalScore: user.stats.totalScore,
        averageScore: user.stats.averageScore,
        totalQuizzes: user.stats.totalQuizzes,
        correctAnswers: user.stats.correctAnswers
      };
    });

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

    // Get all progress records that have activity in this category
    const progressRecords = await Progress.find({
      'categoryProgress': {
        $elemMatch: {
          category: category,
          questionsAttempted: { $gt: 0 }
        }
      }
    }).select('user categoryProgress');

    if (progressRecords.length === 0) {
      return res.status(200).json({
        success: true,
        message: `No users on the ${category} leaderboard yet. Be the first!`,
        data: { category, leaderboard: [] }
      });
    }

    // Get user IDs who have taken quizzes in this category
    const userIds = progressRecords.map(p => p.user);

    // Get users and populate with their category-specific stats
    const users = await User.find({ 
      _id: { $in: userIds },
      isActive: true, 
      role: { $ne: 'admin' } 
    }).select('username role profile.country stats');

    // Enrich users with category-specific data and sort
    const enrichedUsers = users.map(user => {
      const userProgress = progressRecords.find(p => p.user.toString() === user._id.toString());
      const categoryData = userProgress?.categoryProgress.find(cp => cp.category === category);
      
      return {
        user,
        categoryScore: categoryData?.averageScore || 0,
        categoryQuestions: categoryData?.questionsAttempted || 0,
        categoryCorrect: categoryData?.questionsCorrect || 0
      };
    })
    .sort((a, b) => {
      // Sort by category average score first, then by questions attempted
      if (b.categoryScore !== a.categoryScore) {
        return b.categoryScore - a.categoryScore;
      }
      return b.categoryQuestions - a.categoryQuestions;
    })
    .slice(0, parsedLimit);

    // Calculate ranks with tie handling
    let currentRank = 1;
    const leaderboard = enrichedUsers.map((item, index) => {
      // Check if this user has same score as previous user
      if (index > 0) {
        const prevItem = enrichedUsers[index - 1];
        const sameScore = prevItem.categoryScore === item.categoryScore &&
                         prevItem.categoryQuestions === item.categoryQuestions;
        
        if (!sameScore) {
          // Different score, so rank is current position + 1
          currentRank = index + 1;
        }
        // If same score, keep currentRank (tie)
      }
      
      return {
        rank: currentRank,
        username: item.user.username,
        role: item.user.role,
        country: item.user.profile.country,
        categoryScore: item.categoryScore,
        categoryQuestions: item.categoryQuestions,
        categoryCorrect: item.categoryCorrect,
        totalScore: item.user.stats.totalScore,
        averageScore: item.user.stats.averageScore,
        totalQuizzes: item.user.stats.totalQuizzes,
        correctAnswers: item.user.stats.correctAnswers
      };
    });

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

    // Admin users don't have a rank
    if (user.role === 'admin') {
      return res.status(200).json({
        success: true,
        message: 'Admin accounts are not ranked on the leaderboard',
        data: {
          totalScore: user.stats.totalScore,
          averageScore: user.stats.averageScore,
          isAdmin: true
        }
      });
    }

    // Always exclude admins from ranking
    const rankQuery = {
      isActive: true,
      role: { $ne: 'admin' },
      $or: [
        { 'stats.averageScore': { $gt: user.stats.averageScore } },
        { 
          'stats.averageScore': user.stats.averageScore,
          'stats.totalQuizzes': { $gt: user.stats.totalQuizzes }
        }
      ]
    };
    
    const totalUsersQuery = { isActive: true, role: { $ne: 'admin' } };
    
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