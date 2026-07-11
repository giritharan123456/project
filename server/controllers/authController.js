const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const logger = require('../utils/logger');

// Create nodemailer transport
const createTransport = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: parseInt(process.env.SMTP_PORT || '587') === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
};

// Clean up old guest users (called periodically)
const cleanupGuestUsers = async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const result = await User.deleteMany({
      isGuest: true,
      createdAt: { $lt: twentyFourHoursAgo }
    });
    if (result.deletedCount > 0) {
      logger.info(`Cleaned up ${result.deletedCount} old guest users`);
    }
  } catch (error) {
    logger.error('Guest cleanup error:', error.message);
  }
};

// Generate JWT Access Token (short-lived: 15 min)
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '15m'
  });
};

// Generate Refresh Token (long-lived: 30 days, stored in DB)
const generateRefreshToken = async (userId, userAgent, ip) => {
  const token = crypto.randomBytes(64).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await RefreshToken.create({
    user: userId,
    token,
    expiresAt,
    userAgent,
    ip
  });

  return token;
};

// Revoke a specific refresh token
const revokeRefreshToken = async (token) => {
  await RefreshToken.findOneAndUpdate({ token }, { revoked: true });
};

// Revoke all refresh tokens for a user
const revokeAllUserRefreshTokens = async (userId) => {
  await RefreshToken.updateMany({ user: userId }, { revoked: true });
};

// Verify refresh token
const verifyRefreshToken = async (token) => {
  const refreshTokenDoc = await RefreshToken.findOne({ token, revoked: false });
  if (!refreshTokenDoc) return null;
  if (refreshTokenDoc.expiresAt < new Date()) return null;
  return refreshTokenDoc.user;
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    // Password strength validation
    const passwordErrors = [];
    if (password.length < 8) passwordErrors.push('at least 8 characters');
    if (!/[A-Z]/.test(password)) passwordErrors.push('one uppercase letter');
    if (!/[a-z]/.test(password)) passwordErrors.push('one lowercase letter');
    if (!/[0-9]/.test(password)) passwordErrors.push('one number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) passwordErrors.push('one special character');

    if (passwordErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Password must contain: ${passwordErrors.join(', ')}`
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      isGuest: false
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id, req.get('user-agent'), req.ip);

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id, req.get('user-agent'), req.ip);

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.json({
      success: true,
      message: 'Login successful',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public (uses refresh token cookie)
const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    const userId = await verifyRefreshToken(refreshToken);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    // Rotate refresh token (revoke old, create new)
    await revokeRefreshToken(refreshToken);
    const newRefreshToken = await generateRefreshToken(userId, req.get('user-agent'), req.ip);
    const accessToken = generateAccessToken(userId);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.json({ success: true, accessToken });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Logout from all devices
// @route   POST /api/auth/logout-all
// @access  Private
const logoutAllDevices = async (req, res) => {
  try {
    await revokeAllUserRefreshTokens(req.user._id);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    res.json({ success: true, message: 'Logged out from all devices' });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Guest login
// @route   POST /api/auth/guest
// @access  Public
const guestLogin = async (req, res) => {
  try {
    // Create a temporary guest user
    const guestUser = await User.create({
      name: 'Guest User',
      email: `guest_${Date.now()}@temp.com`,
      password: 'guest_temp_password',
      role: 'guest',
      isGuest: true
    });

    // Generate tokens
    const accessToken = generateAccessToken(guestUser._id);
    const refreshToken = await generateRefreshToken(guestUser._id, req.get('user-agent'), req.ip);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      message: 'Guest access granted',
      accessToken,
      user: {
        id: guestUser._id,
        name: guestUser.name,
        email: guestUser.email,
        role: guestUser.role,
        isGuest: true
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          isGuest: user.isGuest,
          savedComparisons: user.savedComparisons,
          recentSearches: user.recentSearches,
          favoriteAreas: user.favoriteAreas
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        // Validate new password strength
        const password = req.body.password;
        const passwordErrors = [];
        if (password.length < 8) passwordErrors.push('at least 8 characters');
        if (!/[A-Z]/.test(password)) passwordErrors.push('one uppercase letter');
        if (!/[a-z]/.test(password)) passwordErrors.push('one lowercase letter');
        if (!/[0-9]/.test(password)) passwordErrors.push('one number');
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) passwordErrors.push('one special character');

        if (passwordErrors.length > 0) {
          return res.status(400).json({
            success: false,
            message: `Password must contain: ${passwordErrors.join(', ')}`
          });
        }
        user.password = password;
      }
      if (req.body.recentSearches) {
        user.recentSearches = req.body.recentSearches;
      }
      if (req.body.favoriteAreas) {
        user.favoriteAreas = req.body.favoriteAreas;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          avatar: updatedUser.avatar,
          savedComparisons: updatedUser.savedComparisons,
          recentSearches: updatedUser.recentSearches,
          favoriteAreas: updatedUser.favoriteAreas
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Forgot password - generate reset token
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ success: true, message: 'If an account exists, a reset email has been sent.' });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    const transport = createTransport();
    if (transport) {
      try {
        await transport.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: user.email,
          subject: 'MarketVision AI - Password Reset Request',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Password Reset Request</h2>
              <p>Hello ${user.name},</p>
              <p>You requested a password reset for your MarketVision AI account.</p>
              <p>Click the button below to reset your password. This link expires in 10 minutes.</p>
              <a href="${resetUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Reset Password</a>
              <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
              <p style="color: #999; font-size: 12px;">MarketVision AI - Market Intelligence Platform</p>
            </div>
          `,
        });
        logger.info(`Password reset email sent to ${user.email}`);
      } catch (emailError) {
        logger.error('Failed to send reset email:', emailError.message);
        // Still return success to not reveal whether email exists
      }
      transport.close();
    }

    // Always return success message (don't reveal whether email exists)
    res.json({
      success: true,
      message: 'If that email is registered, a password reset link has been sent.',
      // Include resetUrl in dev mode for testing
      ...(process.env.NODE_ENV !== 'production' && { resetToken, resetUrl })
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    // Validate new password strength
    const password = req.body.password;
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }
    const passwordErrors = [];
    if (password.length < 8) passwordErrors.push('at least 8 characters');
    if (!/[A-Z]/.test(password)) passwordErrors.push('one uppercase letter');
    if (!/[a-z]/.test(password)) passwordErrors.push('one lowercase letter');
    if (!/[0-9]/.test(password)) passwordErrors.push('one number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) passwordErrors.push('one special character');

    if (passwordErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Password must contain: ${passwordErrors.join(', ')}`
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Revoke all existing refresh tokens (force re-login)
    await revokeAllUserRefreshTokens(user._id);

    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id, 'password-reset', 'reset');

    res.json({
      success: true,
      message: 'Password reset successful',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

module.exports = {
  registerUser,
  loginUser,
  guestLogin,
  refreshAccessToken,
  logoutUser,
  logoutAllDevices,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  cleanupGuestUsers,
  generateAccessToken,
  generateRefreshToken
};