const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const {
  getForecastData,
  getForecastByArea,
  getForecastByDistrict
} = require('../controllers/forecastingController');

router.get('/', getForecastData);
router.get('/area/:areaId', param('areaId').isMongoId().withMessage('Invalid ID format'), handleValidationErrors, getForecastByArea);
router.get('/district/:districtId', param('districtId').isMongoId().withMessage('Invalid ID format'), handleValidationErrors, getForecastByDistrict);

module.exports = router;
