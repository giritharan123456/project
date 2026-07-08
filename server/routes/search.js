const express = require('express');
const router = express.Router();
const {
  searchAreas,
  searchByPincode,
  searchByName,
  getSearchSuggestions
} = require('../controllers/searchController');

router.get('/areas', searchAreas);
router.get('/pincode/:pincode', searchByPincode);
router.get('/name/:name', searchByName);
router.get('/suggestions', getSearchSuggestions);

module.exports = router;
