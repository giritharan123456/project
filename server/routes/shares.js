const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createShare,
  getShareByToken,
  getShares,
  deleteShare
} = require('../controllers/shareController');

router.post('/', protect, createShare);
router.get('/my', protect, getShares);
router.delete('/:id', protect, deleteShare);
router.get('/:token', getShareByToken);

module.exports = router;
