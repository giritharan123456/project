const express = require('express');
const router = express.Router();
const { getAnalyticsOverview, getDistrictAnalytics } = require('../controllers/analyticsController');

router.get('/overview', getAnalyticsOverview);
router.get('/district/:districtId', getDistrictAnalytics);

module.exports = router;
