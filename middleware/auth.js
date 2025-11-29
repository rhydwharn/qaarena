const jwt = require('jsonwebtoken');
// MySQL Model
const { User } = require('../models/mysql');

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ status: 'error', message: 'Not authorized to access this route' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findByPk(decoded.id);

      if (!req.user) {
        return res.status(401).json({ status: 'error', message: 'User not found' });
      }

      if (!req.user.isActive) {
        return res.status(401).json({ status: 'error', message: 'User account is deactivated' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ status: 'error', message: 'Token is invalid or expired' });
    }
  } catch (error) {
    next(error);
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

exports.optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findByPk(decoded.id);
      } catch (err) {
        req.user = null;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};