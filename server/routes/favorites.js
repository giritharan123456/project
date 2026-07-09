const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  addFavorite,
  removeFavorite,
  getFavorites,
  checkFavorite
} = require('../controllers/favoriteController');

router.use(protect);

router.post('/', addFavorite);
router.get('/', getFavorites);
router.get('/check', checkFavorite);
router.delete('/:itemType/:itemId', removeFavorite);

module.exports = router;
