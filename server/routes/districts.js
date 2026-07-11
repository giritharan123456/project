const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const { protect, admin } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const {
  getAllDistricts,
  getDistrictById,
  createDistrict,
  updateDistrict,
  deleteDistrict
} = require('../controllers/districtController');

router.get('/', getAllDistricts);
router.get('/:id', param('id').isMongoId().withMessage('Invalid ID format'), handleValidationErrors, getDistrictById);
router.post('/', protect, admin, createDistrict);
router.put('/:id', protect, admin, param('id').isMongoId().withMessage('Invalid ID format'), handleValidationErrors, updateDistrict);
router.delete('/:id', protect, admin, param('id').isMongoId().withMessage('Invalid ID format'), handleValidationErrors, deleteDistrict);

module.exports = router;
