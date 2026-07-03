const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getMarketData,
  getMarketDataByArea,
  getMarketDataByDistrict,
  updateMarketData
} = require('../controllers/marketDataController');

router.get('/', getMarketData);
router.get('/area/:areaId', getMarketDataByArea);
router.get('/district/:districtId', getMarketDataByDistrict);
router.put('/area/:areaId', protect, admin, updateMarketData);

module.exports = router;
