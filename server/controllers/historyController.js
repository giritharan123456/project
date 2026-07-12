const SearchHistory = require('../models/SearchHistory');
const logger = require('../utils/logger');

exports.getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
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
    logger.error('Get history error:', err);
    res.status(500).json({ success: false, message: logger.getClientMessage(err) });
  }
};

exports.addHistory = async (req, res) => {
  try {
    const { query, type, resultCount, areaId, pincode, district, category } = req.body;
    if (!query || !query.trim()) return res.status(400).json({ success: false, message: 'Query is required' });

    const validTypes = ['pincode', 'district', 'category', 'general'];
    const entry = await SearchHistory.create({
      userId: req.user._id,
      query: query.trim(),
      type: validTypes.includes(type) ? type : 'general',
      resultCount: Math.max(0, parseInt(resultCount, 10) || 0),
      areaId: areaId || undefined,
      pincode: pincode || undefined,
      district: district || undefined,
      category: category || undefined,
    });

    res.status(201).json({ success: true, data: entry });
  } catch (err) {
    logger.error('Add history error:', err);
    res.status(500).json({ success: false, message: logger.getClientMessage(err) });
  }
};

exports.clearHistory = async (req, res) => {
  try {
    await SearchHistory.deleteMany({ userId: req.user._id });
    res.json({ success: true, message: 'History cleared' });
  } catch (err) {
    logger.error('Clear history error:', err);
    res.status(500).json({ success: false, message: logger.getClientMessage(err) });
  }
};
