const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const {
  createShare,
  getShareByToken,
  getShares,
  deleteShare
} = require('../controllers/shareController');

router.post('/', protect, createShare);
router.get('/my', protect, getShares);
router.delete('/:id', protect, param('id').isMongoId().withMessage('Invalid ID format'), handleValidationErrors, deleteShare);
router.get('/:token', getShareByToken);

module.exports = router;
