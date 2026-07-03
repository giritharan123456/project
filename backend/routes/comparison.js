const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  compareAreas,
  saveComparison,
  getSavedComparisons,
  deleteComparison
} = require('../controllers/comparisonController');

router.post('/compare', protect, compareAreas);
router.post('/save', protect, saveComparison);
router.get('/saved', protect, getSavedComparisons);
router.delete('/:id', protect, deleteComparison);

module.exports = router;
