// MySQL Models
const { User, Question, Quiz, Achievement, AchievementTranslation } = require('../models/mysql');
const ErrorResponse = require('../utils/errorResponse');
const { Op } = require('sequelize');

exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { isActive: true } });
    const totalQuestions = await Question.count();
    const publishedQuestions = await Question.count({ where: { status: 'published' } });
    const totalQuizzes = await Quiz.count();
    const completedQuizzes = await Quiz.count({ where: { status: 'completed' } });

    res.status(200).json({
      status: 'success',
      data: {
        users: { total: totalUsers, active: activeUsers },
        questions: { total: totalQuestions, published: publishedQuestions },
        quizzes: { total: totalQuizzes, completed: completedQuizzes }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, isActive } = req.query;

    const where = {};
    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      data: {
        users,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    // Validate role
    if (!role) {
      return next(new ErrorResponse('Please provide a role', 400));
    }

    const validRoles = ['user', 'moderator', 'admin'];
    if (!validRoles.includes(role)) {
      return next(new ErrorResponse(`Invalid role. Must be one of: ${validRoles.join(', ')}`, 400));
    }

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return next(new ErrorResponse('User not found. Please check the user ID and try again.', 404));
    }

    // Prevent self-role modification
    if (user.id === req.user.id) {
      return next(new ErrorResponse('You cannot modify your own role', 403));
    }

    await user.update({ role });

    res.status(200).json({
      success: true,
      message: `User role successfully updated to ${role}`,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

exports.deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return next(new ErrorResponse('User not found. Please check the user ID and try again.', 404));
    }

    // Prevent self-deactivation
    if (user.id === req.user.id) {
      return next(new ErrorResponse('You cannot deactivate your own account', 403));
    }

    await user.update({ isActive: false });

    res.status(200).json({
      success: true,
      message: `User ${user.email} has been deactivated successfully`
    });
  } catch (error) {
    next(error);
  }
};

exports.getFlaggedQuestions = async (req, res, next) => {
  try {
    const questions = await Question.findAll({
      where: { status: 'flagged' },
      include: [{ model: User, as: 'creator', attributes: ['id', 'username'] }]
    });

    res.status(200).json({
      status: 'success',
      data: { questions }
    });
  } catch (error) {
    next(error);
  }
};

exports.reviewQuestion = async (req, res, next) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!status) {
      return next(new ErrorResponse('Please provide a status for the question', 400));
    }

    const validStatuses = ['published', 'draft', 'flagged', 'archived'];
    if (!validStatuses.includes(status)) {
      return next(new ErrorResponse(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400));
    }

    const question = await Question.findByPk(req.params.id);

    if (!question) {
      return next(new ErrorResponse('Question not found. It may have been deleted.', 404));
    }

    await question.update({ status });

    res.status(200).json({
      success: true,
      message: `Question has been ${status === 'published' ? 'approved and published' : 'updated to ' + status}`,
      data: { question }
    });
  } catch (error) {
    next(error);
  }
};

exports.createAchievement = async (req, res, next) => {
  try {
    const { name, description, criteria } = req.body;

    // Validate required fields
    if (!name || !description || !criteria) {
      return next(new ErrorResponse('Please provide name, description, and criteria for the achievement', 400));
    }

    // Create achievement with translations
    const achievement = await Achievement.create({
      icon: req.body.icon,
      type: req.body.type,
      criteriaMetric: req.body.criteria?.metric || 'totalScore',
      criteriaThreshold: req.body.criteria?.threshold || 0,
      rarity: req.body.rarity,
      points: req.body.points || 0,
      isActive: req.body.isActive !== false
    });

    // Create translations if provided
    if (req.body.name && typeof req.body.name === 'object') {
      for (const [lang, nameText] of Object.entries(req.body.name)) {
        await AchievementTranslation.create({
          achievementId: achievement.id,
          language: lang,
          name: nameText,
          description: req.body.description?.[lang] || ''
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Achievement created successfully',
      data: { achievement }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findByPk(req.params.id);
    
    if (!achievement) {
      return next(new ErrorResponse(`Achievement not found with id of ${req.params.id}`, 404));
    }

    await achievement.update({
      icon: req.body.icon || achievement.icon,
      type: req.body.type || achievement.type,
      criteriaMetric: req.body.criteria?.metric || achievement.criteriaMetric,
      criteriaThreshold: req.body.criteria?.threshold || achievement.criteriaThreshold,
      rarity: req.body.rarity || achievement.rarity,
      points: req.body.points || achievement.points,
      isActive: req.body.isActive !== undefined ? req.body.isActive : achievement.isActive
    });

    res.status(200).json({
      success: true,
      data: achievement,
      message: `Successfully updated achievement ${achievement.id}`
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findByPk(req.params.id);

    if (!achievement) {
      return next(new ErrorResponse('Achievement not found. It may have been already deleted.', 404));
    }

    await achievement.destroy();

    res.status(200).json({
      success: true,
      message: 'Achievement deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};