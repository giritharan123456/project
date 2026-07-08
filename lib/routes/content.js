const express = require('express');
const router = express.Router();
const { 
  getLandingContent, 
  updateLandingContent,
  getAboutContent,
  updateAboutContent,
  getAnalysisContent,
  updateAnalysisContent,
  getHomeContent,
  updateHomeContent
} = require('../controllers/contentController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/landing', getLandingContent);
router.get('/about', getAboutContent);
router.get('/analysis', getAnalysisContent);
router.get('/home', getHomeContent);

// Admin routes
router.put('/landing', protect, admin, updateLandingContent);
router.put('/about', protect, admin, updateAboutContent);
router.put('/analysis', protect, admin, updateAnalysisContent);
router.put('/home', protect, admin, updateHomeContent);

module.exports = router;
