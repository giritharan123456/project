const express = require('express');
const passport = require('passport');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { registerValidation, loginValidation, forgotPasswordValidation, resetPasswordValidation, updateProfileValidation } = require('../middleware/validation');
const logger = require('../utils/logger');
const {
  registerUser,
  loginUser,
  guestLogin,
  refreshAccessToken,
  logoutUser,
  logoutAllDevices,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

const getSafeRedirect = (redirect) => {
  if (typeof redirect !== 'string') {
    return '';
  }

  try {
    const decoded = decodeURIComponent(redirect);
    return decoded.startsWith('/') && !decoded.startsWith('//') ? decoded : '';
  } catch {
    return redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '';
  }
};

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.post('/guest', guestLogin);

// Token management
router.post('/refresh', refreshAccessToken);
router.post('/logout', protect, logoutUser);
router.post('/logout-all', protect, logoutAllDevices);

// Password reset routes
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/reset-password/:token', resetPasswordValidation, resetPassword);

// Google OAuth routes
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(500).json({ 
      success: false, 
      message: 'Google OAuth is not configured. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env file' 
    });
  }
  const redirect = getSafeRedirect(req.query.redirect);
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    ...(redirect && { state: encodeURIComponent(redirect) })
  })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(500).send('Google OAuth is not configured');
  }
  passport.authenticate('google', { failureRedirect: '/login?error=google_auth_failed' }, async (err, user, info) => {
    if (err) {
      logger.error('Google OAuth Error:', err.message);
      return res.redirect('/login?error=oauth_error');
    }
    if (!user) {
      logger.error('Google OAuth No User:', info ? info.message : 'unknown');
      return res.redirect('/login?error=oauth_failed');
    }
    try {
      const { generateAccessToken, generateRefreshToken } = require('../controllers/authController');
      const accessToken = generateAccessToken(user._id);
      const refreshToken = await generateRefreshToken(user._id, req.get('user-agent'), req.ip);
      
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      const redirect = getSafeRedirect(req.query.state);
      const redirectParam = redirect ? `&redirect=${encodeURIComponent(redirect)}` : '';
      res.redirect(`/login?token=${encodeURIComponent(accessToken)}${redirectParam}`);
    } catch (error) {
      logger.error('Token generation error:', error.message);
      res.redirect('/login?error=server_error');
    }
  })(req, res, next);
});

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
