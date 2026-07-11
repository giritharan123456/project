const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const { protect, admin, optionalAuth } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const {
  getAllAreas,
  getAreaById,
  getAreaByPincode,
  getAreasByDistrict,
  createArea,
  updateArea,
  deleteArea
} = require('../controllers/areaController');

router.get('/', getAllAreas);
router.get('/pincode/:pincode', optionalAuth, getAreaByPincode);
router.get('/district/:districtId', param('districtId').isMongoId().withMessage('Invalid ID format'), handleValidationErrors, getAreasByDistrict);
router.get('/:id', param('id').isMongoId().withMessage('Invalid ID format'), handleValidationErrors, getAreaById);
router.post('/', protect, admin, createArea);
router.put('/:id', protect, admin, param('id').isMongoId().withMessage('Invalid ID format'), handleValidationErrors, updateArea);
router.delete('/:id', protect, admin, param('id').isMongoId().withMessage('Invalid ID format'), handleValidationErrors, deleteArea);

module.exports = router;
