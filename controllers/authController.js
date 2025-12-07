const jwt = require('jsonwebtoken');
// MySQL Models
const { User, Progress } = require('../models/mysql');
const { sequelize } = require('../config/mysqlDatabase');
const ErrorResponse = require('../utils/errorResponse');
const { Op } = require('sequelize');

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not configured');
  }
  return process.env.JWT_SECRET;
};

const generateToken = (id) => {
  return jwt.sign({ id }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, firstName, lastName, country, preferredLanguage } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });
    if (existingUser) {
      if (existingUser.email === email) {
        return next(new ErrorResponse('An account with this email already exists', 400));
      }
      if (existingUser.username === username) {
        return next(new ErrorResponse('This username is already taken', 400));
      }
    }

    // Create user and progress in a transaction
    const result = await sequelize.transaction(async (t) => {
      const user = await User.create({
        username,
        email,
        password,
        firstName,
        lastName,
        country,
        preferredLanguage: preferredLanguage || 'en'
      }, { transaction: t });

      await Progress.create({ userId: user.id }, { transaction: t });

      return user;
    });

    const token = generateToken(result.id);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: result.id,
          username: result.username,
          email: result.email,
          role: result.role,
          firstName: result.firstName,
          lastName: result.lastName,
          country: result.country,
          preferredLanguage: result.preferredLanguage
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Please provide email and password' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'No account found with this email address. Please check your email or sign up.' 
      });
    }

    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Incorrect password. Please try again.' 
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user.id);

    res.status(200).json({
      status: 'success',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          country: user.country,
          preferredLanguage: user.preferredLanguage,
          totalQuizzes: user.totalQuizzes,
          totalQuestions: user.totalQuestions,
          correctAnswers: user.correctAnswers,
          totalScore: user.totalScore,
          averageScore: user.averageScore,
          streak: user.streak
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const { User: UserModel, Achievement, UserAchievement } = require('../models/mysql');
    const user = await UserModel.findByPk(req.user.id, {
      include: [{
        model: Achievement,
        as: 'achievements',
        through: { attributes: ['unlockedAt'] }
      }]
    });
    res.status(200).json({ status: 'success', data: { user } });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, country, preferredLanguage } = req.body;

    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    await user.update({
      firstName,
      lastName,
      country,
      preferredLanguage
    });

    res.status(200).json({ status: 'success', data: { user } });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ status: 'error', message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ status: 'success', message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Private
exports.refreshToken = async (req, res, next) => {
  try {
    const user = req.user; // From auth middleware
    
    // Generate new token with same expiration as original
    const newToken = generateToken(user.id);
    
    res.status(200).json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: {
        token: newToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          totalScore: user.totalScore
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Extend token expiration (for active quiz sessions)
// @route   POST /api/auth/extend
// @access  Private
exports.extendToken = async (req, res, next) => {
  try {
    const user = req.user;
    
    // Generate new token with extended expiration (2 hours)
    const extendedToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    
    res.status(200).json({
      status: 'success',
      message: 'Token extended successfully',
      data: {
        token: extendedToken
      }
    });
  } catch (error) {
    next(error);
  }
};