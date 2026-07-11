const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const {
  compareAreas,
  saveComparison,
  getSavedComparisons,
  deleteComparison
} = require('../controllers/comparisonController');

router.post('/compare', protect, compareAreas);
router.post('/save', protect, saveComparison);
router.get('/saved', protect, getSavedComparisons);
router.delete('/:id', protect, param('id').isMongoId().withMessage('Invalid ID format'), handleValidationErrors, deleteComparison);

module.exports = router;
