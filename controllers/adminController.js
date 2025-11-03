const User = require('../models/User');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const Achievement = require('../models/Achievement');
const ErrorResponse = require('../utils/errorResponse');
const mongoose = require('mongoose');

exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalQuestions = await Question.countDocuments();
    const publishedQuestions = await Question.countDocuments({ status: 'published' });
    const totalQuizzes = await Quiz.countDocuments();
    const completedQuizzes = await Quiz.countDocuments({ status: 'completed' });

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

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

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

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Invalid user ID format', 400));
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse('User not found. Please check the user ID and try again.', 404));
    }

    // Prevent self-role modification
    if (user._id.toString() === req.user.id) {
      return next(new ErrorResponse('You cannot modify your own role', 403));
    }

    user.role = role;
    await user.save();

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
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Invalid user ID format', 400));
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse('User not found. Please check the user ID and try again.', 404));
    }

    // Prevent self-deactivation
    if (user._id.toString() === req.user.id) {
      return next(new ErrorResponse('You cannot deactivate your own account', 403));
    }

    user.isActive = false;
    await user.save();

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
    const questions = await Question.find({ status: 'flagged' })
      .populate('createdBy', 'username')
      .populate('flags.user', 'username');

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

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Invalid question ID format', 400));
    }

    const question = await Question.findById(req.params.id);

    if (!question) {
      return next(new ErrorResponse('Question not found. It may have been deleted.', 404));
    }

    question.status = status;
    question.flags = [];
    await question.save();

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

    const achievement = await Achievement.create(req.body);

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
    const achievement = await Achievement.findById(req.params.id);
    
    if (!achievement) {
      return next(new ErrorResponse(`Achievement not found with id of ${req.params.id}`, 404));
    }

    Object.assign(achievement, req.body);
    await achievement.save();

    res.status(200).json({
      success: true,
      data: achievement,
      message: `Successfully updated achievement ${achievement._id}`
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteAchievement = async (req, res, next) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Invalid achievement ID format', 400));
    }

    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return next(new ErrorResponse('Achievement not found. It may have been already deleted.', 404));
    }

    await achievement.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Achievement deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};