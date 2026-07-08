const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  // District management
  getAllDistricts,
  createDistrict,
  updateDistrict,
  deleteDistrict,
  
  // Area management
  getAllAreas,
  getAreasByDistrict,
  createArea,
  updateArea,
  deleteArea,
  
  // Business category management
  getAllBusinessCategories,
  createBusinessCategory,
  updateBusinessCategory,
  deleteBusinessCategory,
  
  // User management
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  
  // Dashboard stats
  getDashboardStats
} = require('../controllers/adminController');

// Dashboard stats
router.get('/stats', protect, admin, getDashboardStats);

// District routes
router.get('/districts', protect, admin, getAllDistricts);
router.post('/districts', protect, admin, createDistrict);
router.put('/districts/:id', protect, admin, updateDistrict);
router.delete('/districts/:id', protect, admin, deleteDistrict);

// Area routes
router.get('/areas', protect, admin, getAllAreas);
router.get('/areas/district/:districtId', protect, admin, getAreasByDistrict);
router.post('/areas', protect, admin, createArea);
router.put('/areas/:id', protect, admin, updateArea);
router.delete('/areas/:id', protect, admin, deleteArea);

// Business category routes
router.get('/business-categories', protect, admin, getAllBusinessCategories);
router.post('/business-categories', protect, admin, createBusinessCategory);
router.put('/business-categories/:id', protect, admin, updateBusinessCategory);
router.delete('/business-categories/:id', protect, admin, deleteBusinessCategory);

// User management routes
router.get('/users', protect, admin, getAllUsers);
router.get('/users/:id', protect, admin, getUserById);
router.put('/users/:id', protect, admin, updateUser);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;
