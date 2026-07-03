const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getAllDistricts,
  getDistrictById,
  createDistrict,
  updateDistrict,
  deleteDistrict
} = require('../controllers/districtController');

router.get('/', getAllDistricts);
router.get('/:id', getDistrictById);
router.post('/', protect, admin, createDistrict);
router.put('/:id', protect, admin, updateDistrict);
router.delete('/:id', protect, admin, deleteDistrict);

module.exports = router;
