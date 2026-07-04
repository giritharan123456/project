const express = require('express');
const passport = require('passport');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  registerUser,
  loginUser,
  guestLogin,
  googleCallback,
  generateToken,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/guest', guestLogin);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Google OAuth routes
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(500).json({ 
      success: false, 
      message: 'Google OAuth is not configured. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env file' 
    });
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_oauth_not_configured`);
  }
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  passport.authenticate('google', { failureRedirect: `${frontendUrl}/login?error=google_auth_failed` }, (err, user) => {
    if (err || !user) {
      return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }
    try {
      const token = generateToken(user._id);
      res.redirect(`${frontendUrl}/login?token=${token}`);
    } catch (error) {
      res.redirect(`${frontendUrl}/login?error=server_error`);
    }
  })(req, res, next);
});

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
