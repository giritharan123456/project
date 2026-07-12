const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
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
router.delete('/:itemType/:itemId', param('itemType').isIn(['area', 'business', 'comparison']).withMessage('Invalid item type'), param('itemId').isMongoId().withMessage('Invalid ID format'), handleValidationErrors, removeFavorite);

module.exports = router;
