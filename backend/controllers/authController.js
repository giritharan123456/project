const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

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

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

    // Generate token
    const token = generateToken(guestUser._id);

    res.status(201).json({
      success: true,
      message: 'Guest access granted',
      token,
      user: {
        id: guestUser._id,
        name: guestUser.name,
        email: guestUser.email,
        role: guestUser.role,
        isGuest: true
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
const googleCallback = (req, res) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3002';

    if (!req.user) {
      return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }

    // Generate token
    const token = generateToken(req.user._id);

    // Redirect to frontend with token
    res.redirect(`${frontendUrl}/login?token=${token}`);
  } catch (error) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3002';
    res.redirect(`${frontendUrl}/login?error=server_error`);
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
    res.status(500).json({ success: false, message: error.message });
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
        user.password = req.body.password;
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
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  guestLogin,
  googleCallback,
  getUserProfile,
  updateUserProfile
};
