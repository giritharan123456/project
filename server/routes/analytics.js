const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');
const { getAnalyticsOverview, getDistrictAnalytics } = require('../controllers/analyticsController');

router.get('/overview', getAnalyticsOverview);
router.get('/district/:districtId', param('districtId').isMongoId().withMessage('Invalid ID format'), handleValidationErrors, getDistrictAnalytics);

module.exports = router;
