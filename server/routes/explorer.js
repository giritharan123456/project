const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { getCategoryExplorer, getLeaderboard, getMatrix, getInvestmentEstimate, getPincodeShops, recalculateScores } = require('../controllers/explorerController');

router.get('/categories', getCategoryExplorer);
router.get('/leaderboard', getLeaderboard);
router.get('/matrix', getMatrix);
router.get('/estimate', getInvestmentEstimate);
router.get('/pincode-shops', getPincodeShops);
router.post('/recalculate', protect, admin, recalculateScores);

module.exports = router;
