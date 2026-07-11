const Favorite = require('../models/Favorite');
const logger = require('../utils/logger');

exports.addFavorite = async (req, res) => {
  try {
    const { itemType, itemId, itemData } = req.body;

    const existing = await Favorite.findOne({
      user: req.user._id,
      itemType,
      itemId
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Already in favorites' });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      itemType,
      itemId,
      itemData
    });

    res.status(201).json({ success: true, data: favorite });
  } catch (error) {
    logger.error('Add favorite error:', error);
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { itemType, itemId } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      itemType,
      itemId
    });

    if (!favorite) {
      return res.status(404).json({ success: false, message: 'Favorite not found' });
    }

    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    logger.error('Remove favorite error:', error);
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const { itemType } = req.query;
    const query = { user: req.user._id };
    if (itemType) query.itemType = itemType;

    const favorites = await Favorite.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: favorites, count: favorites.length });
  } catch (error) {
    logger.error('Get favorites error:', error);
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

exports.checkFavorite = async (req, res) => {
  try {
    const { itemType, itemId } = req.query;

    const favorite = await Favorite.findOne({
      user: req.user._id,
      itemType,
      itemId
    });

    res.json({ success: true, isFavorite: !!favorite });
  } catch (error) {
    logger.error('Check favorite error:', error);
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};
