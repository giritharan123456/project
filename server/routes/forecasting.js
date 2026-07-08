const express = require('express');
const router = express.Router();
const {
  getForecastData,
  getForecastByArea,
  getForecastByDistrict
} = require('../controllers/forecastingController');

router.get('/', getForecastData);
router.get('/area/:areaId', getForecastByArea);
router.get('/district/:districtId', getForecastByDistrict);

module.exports = router;
