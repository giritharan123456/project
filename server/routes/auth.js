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
    return res.status(500).send('Google OAuth is not configured');
  }
  passport.authenticate('google', { failureRedirect: '/login?error=google_auth_failed' }, (err, user, info) => {
    if (err) {
      console.error('Google OAuth Error:', err.message);
      return res.redirect('/login?error=oauth_error');
    }
    if (!user) {
      console.error('Google OAuth No User:', info ? info.message : 'unknown');
      return res.redirect('/login?error=oauth_failed');
    }
    try {
      const token = generateToken(user._id);
      res.send(`<!DOCTYPE html><html><head><title>Redirecting...</title></head><body><script>window.location.href='/?token=${token}';</script><p>Redirecting...</p></body></html>`);
    } catch (error) {
      console.error('Token generation error:', error.message);
      res.redirect('/login?error=server_error');
    }
  })(req, res, next);
});

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
