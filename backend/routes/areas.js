const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');
const {
  getAllAreas,
  getAreaById,
  getAreaByPincode,
  getAreasByDistrict,
  createArea,
  updateArea,
  deleteArea
} = require('../controllers/areaController');

// Optional auth — populates req.user if a valid Bearer token is present,
// but does NOT block the request if there is no token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    }
  } catch (_) {
    // Invalid token — proceed as unauthenticated, no error thrown
  }
  next();
};

router.get('/', getAllAreas);
router.get('/:id', getAreaById);
router.get('/pincode/:pincode', optionalAuth, getAreaByPincode);
router.get('/district/:districtId', getAreasByDistrict);
router.post('/', protect, admin, createArea);
router.put('/:id', protect, admin, updateArea);
router.delete('/:id', protect, admin, deleteArea);

module.exports = router;
