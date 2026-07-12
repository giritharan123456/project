const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const { handleValidationErrors, areaSearchValidation } = require('../middleware/validation');
const {
  searchAreas,
  searchByPincode,
  searchByName,
  getSearchSuggestions
} = require('../controllers/searchController');

router.get('/areas', areaSearchValidation, searchAreas);
router.get('/pincode/:pincode', param('pincode').matches(/^\d{6}$/).withMessage('Valid 6-digit pincode required'), handleValidationErrors, searchByPincode);
router.get('/name/:name', searchByName);
router.get('/suggestions', getSearchSuggestions);

module.exports = router;
