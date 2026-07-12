const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getHistory, addHistory, clearHistory } = require('../controllers/historyController');

router.get('/', protect, getHistory);
router.post('/', protect, addHistory);
router.delete('/', protect, clearHistory);

module.exports = router;
