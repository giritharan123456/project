const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getProfile,
  getFavorites,
  addFavorite,
  removeFavorite,
  getSearchHistory,
  addSearchHistory,
  clearSearchHistory
} = require('../controllers/workspaceController');

// All workspace routes require authentication
router.use(protect);

router.get('/profile', getProfile);

router.get('/favorites', getFavorites);
router.post('/favorites', addFavorite);
router.delete('/favorites/:areaId', removeFavorite);

router.get('/search-history', getSearchHistory);
router.post('/search-history', addSearchHistory);
router.delete('/search-history', clearSearchHistory);

module.exports = router;
