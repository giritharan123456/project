const express = require('express');
const router = express.Router();
const { protect, admin, optionalAuth } = require('../middleware/auth');
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
router.get('/district/:districtId', getAreasByDistrict);
router.get('/:id', getAreaById);
router.post('/', protect, admin, createArea);
router.put('/:id', protect, admin, updateArea);
router.delete('/:id', protect, admin, deleteArea);

module.exports = router;
