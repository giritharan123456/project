const crypto = require('crypto');
const Share = require('../models/Share');
const logger = require('../utils/logger');

exports.createShare = async (req, res) => {
  try {
    const { itemType, itemId, itemData } = req.body;

    const existing = await Share.findOne({
      user: req.user._id,
      itemType,
      itemId
    }).lean();

    if (existing) {
      return res.json({ success: true, data: existing });
    }

    const shareToken = crypto.randomBytes(32).toString('hex');

    const share = await Share.create({
      user: req.user._id,
      shareToken,
      itemType,
      itemId,
      itemData
    });

    res.status(201).json({ success: true, data: share });
  } catch (error) {
    logger.error('Create share error:', error);
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

exports.getShareByToken = async (req, res) => {
  try {
    const { token } = req.params;

    const share = await Share.findOne({
      shareToken: token,
      expiresAt: { $gt: new Date() }
    }).lean();

    if (!share) {
      return res.status(404).json({ success: false, message: 'Share link expired or invalid' });
    }

    await Share.findOneAndUpdate({ _id: share._id }, { $inc: { accessCount: 1 } });

    res.json({ success: true, data: share });
  } catch (error) {
    logger.error('Get share error:', error);
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

exports.getShares = async (req, res) => {
  try {
    const shares = await Share.find({ user: req.user._id })
      .lean()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, data: shares, count: shares.length });
  } catch (error) {
    logger.error('Get shares error:', error);
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

exports.deleteShare = async (req, res) => {
  try {
    const share = await Share.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!share) {
      return res.status(404).json({ success: false, message: 'Share not found' });
    }

    res.json({ success: true, message: 'Share deleted' });
  } catch (error) {
    logger.error('Delete share error:', error);
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};
