const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token for Arena Auth Simulator
 */
exports.verifyArenaToken = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                  req.header('x-auth-token');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
        expired: false
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'arena-secret-key');
    
    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    // Check if token is expired
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please sign in again.',
        expired: true
      });
    }

    // Invalid token
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      expired: false
    });
  }
};

/**
 * Verify token and return user info (for dashboard access)
 */
exports.verifyUser = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                  req.header('x-auth-token');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
        expired: false
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'arena-secret-key');
    
    res.json({
      success: true,
      user: {
        id: decoded.userId,
        email: decoded.email
      }
    });
  } catch (error) {
    // Check if token is expired
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please sign in again.',
        expired: true
      });
    }

    // Invalid token
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      expired: false
    });
  }
};
