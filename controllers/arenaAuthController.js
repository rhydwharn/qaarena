const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const ArenaUser = require('../models/ArenaUser');
const { sendOTPEmail, sendTokenEmail } = require('../services/arenaEmailService');

/**
 * Generate 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate secure authorization token
 */
const generateAuthToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Sign Up - Create user and send verification (OTP or Token)
 */
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, authMode } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !authMode) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    if (!['otp', 'token'].includes(authMode)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid authentication mode'
      });
    }

    // Check if user exists
    const existingUser = await ArenaUser.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      // If user exists but is not verified, resend verification
      if (!existingUser.isVerified) {
        // Generate new verification based on auth mode
        let verificationOTP = null;
        let verificationToken = null;
        const verificationExpiry = new Date(Date.now() + (authMode === 'otp' ? 10 * 60 * 1000 : 24 * 60 * 60 * 1000));

        if (authMode === 'otp') {
          verificationOTP = generateOTP();
          existingUser.verificationOTP = verificationOTP;
        } else {
          verificationToken = generateAuthToken();
          existingUser.verificationToken = verificationToken;
        }

        existingUser.verificationExpiry = verificationExpiry;
        existingUser.authMode = authMode; // Update auth mode in case they changed it
        await existingUser.save();

        // Resend verification email
        if (authMode === 'otp') {
          await sendOTPEmail(email, existingUser.firstName, verificationOTP);
        } else {
          await sendTokenEmail(email, existingUser.firstName, verificationToken);
        }

        return res.status(200).json({
          success: true,
          resent: true,
          message: authMode === 'otp'
            ? 'We will send a new OTP to your email. Please check your inbox.'
            : 'We will send a new verification link to your email. Please check your inbox.',
          data: {
            email: existingUser.email,
            firstName: existingUser.firstName,
            authMode: existingUser.authMode
          }
        });
      }

      // User exists and is already verified
      return res.status(400).json({
        success: false,
        message: 'Email already registered and verified. Please sign in.'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification based on auth mode
    let verificationOTP = null;
    let verificationToken = null;
    const verificationExpiry = new Date(Date.now() + (authMode === 'otp' ? 10 * 60 * 1000 : 24 * 60 * 60 * 1000)); // 10 min for OTP, 24h for token

    if (authMode === 'otp') {
      verificationOTP = generateOTP();
    } else {
      verificationToken = generateAuthToken();
    }

    // Create user
    const user = await ArenaUser.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      authMode,
      verificationOTP,
      verificationToken,
      verificationExpiry,
      isVerified: false
    });

    // Send appropriate email
    if (authMode === 'otp') {
      await sendOTPEmail(email, firstName, verificationOTP);
    } else {
      await sendTokenEmail(email, firstName, verificationToken);
    }

    res.status(201).json({
      success: true,
      message: authMode === 'otp' 
        ? 'Account created! Check your email for OTP.' 
        : 'Account created! Check your email for verification link.',
      data: {
        email: user.email,
        firstName: user.firstName,
        authMode: user.authMode
      }
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during signup'
    });
  }
};

/**
 * Verify OTP
 */
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Find user with matching OTP
    const user = await ArenaUser.findOne({
      email: email.toLowerCase(),
      verificationOTP: otp,
      verificationExpiry: { $gt: Date.now() },
      authMode: 'otp'
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Update user
    user.isVerified = true;
    user.verificationOTP = undefined;
    user.verificationExpiry = undefined;
    await user.save();

    // Generate JWT for login
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'arena-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'OTP verified successfully!',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during verification'
    });
  }
};

/**
 * Verify Authorization Token (from email link)
 */
exports.verifyToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    // Find user with matching token
    const user = await ArenaUser.findOne({
      verificationToken: token,
      verificationExpiry: { $gt: Date.now() },
      authMode: 'token'
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Update user
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpiry = undefined;
    await user.save();

    // Generate JWT for login
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'arena-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Account verified successfully!',
      token: jwtToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during verification'
    });
  }
};

/**
 * Sign In
 */
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await ArenaUser.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before signing in'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'arena-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Sign in successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during sign in'
    });
  }
};
