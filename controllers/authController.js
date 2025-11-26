const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Progress = require('../models/Progress');
const ErrorResponse = require('../utils/errorResponse');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
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
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return next(new ErrorResponse('An account with this email already exists', 400));
      }
      if (existingUser.username === username) {
        return next(new ErrorResponse('This username is already taken', 400));
      }
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      profile: { firstName, lastName, country, preferredLanguage: preferredLanguage || 'en' }
    });

    await Progress.create({ user: user._id });

    const token = generateToken(user._id);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          profile: user.profile
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

    const user = await User.findOne({ email }).select('+password');

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

    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      status: 'success',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          profile: user.profile,
          stats: user.stats
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('achievements');
    res.status(200).json({ status: 'success', data: { user } });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, country, preferredLanguage } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profile: { firstName, lastName, country, preferredLanguage } },
      { new: true, runValidators: true }
    );

    res.status(200).json({ status: 'success', data: { user } });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

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