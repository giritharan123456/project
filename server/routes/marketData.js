const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const { protect, admin } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const {
  getMarketData,
  getMarketDataByArea,
  getMarketDataByDistrict,
  updateMarketData
} = require('../controllers/marketDataController');

router.get('/', getMarketData);
router.get('/area/:areaId', param('areaId').isMongoId().withMessage('Invalid ID format'), handleValidationErrors, getMarketDataByArea);
router.get('/district/:districtId', param('districtId').isMongoId().withMessage('Invalid ID format'), handleValidationErrors, getMarketDataByDistrict);
router.put('/area/:areaId', protect, admin, param('areaId').isMongoId().withMessage('Invalid ID format'), handleValidationErrors, updateMarketData);

module.exports = router;
