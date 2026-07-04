const express = require('express');
const router = express.Router();
const SearchHistory = require('../models/SearchHistory');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [history, total] = await Promise.all([
      SearchHistory.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      SearchHistory.countDocuments({ userId: req.user._id }),
    ]);

    res.json({ success: true, data: history, pagination: { total, page, limit } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load history' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { query, type, resultCount, areaId, pincode, district, category } = req.body;
    if (!query) return res.status(400).json({ success: false, message: 'Query is required' });

    const entry = await SearchHistory.create({
      userId: req.user._id,
      query,
      type: type || 'general',
      resultCount: resultCount || 0,
      areaId,
      pincode,
      district,
      category,
    });

    res.status(201).json({ success: true, data: entry });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to save search' });
  }
});

router.delete('/', protect, async (req, res) => {
  try {
    await SearchHistory.deleteMany({ userId: req.user._id });
    res.json({ success: true, message: 'History cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to clear history' });
  }
});

module.exports = router;
