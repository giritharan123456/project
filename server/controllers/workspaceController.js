const User = require('../models/User');
const Area = require('../models/Area');
const logger = require('../utils/logger');

// @desc    Get authenticated user's workspace profile
// @route   GET /api/workspace/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favoriteAreas', 'name pincode district marketGapScores')
      .select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Count saved comparisons and recent searches
    const savedComparisonsCount = user.savedComparisons ? user.savedComparisons.length : 0;
    const recentSearchesCount = user.recentSearches ? user.recentSearches.length : 0;
    const favoritesCount = user.favoriteAreas ? user.favoriteAreas.length : 0;

    // Format member since date
    const memberSince = user.createdAt
      ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
      : 'Unknown';

    // Generate avatar initials from name
    const nameParts = (user.name || 'User').split(' ');
    const avatar = nameParts.map(p => p[0]).join('').toUpperCase().slice(0, 2);

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isGuest: user.isGuest,
        avatar,
        memberSince,
        plan: user.role === 'admin' ? 'Admin' : user.isGuest ? 'Guest' : 'Pro',
        stats: {
          savedAreas: favoritesCount,
          savedComparisons: savedComparisonsCount,
          recentSearches: recentSearchesCount
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Get user's favorite areas with full market data
// @route   GET /api/workspace/favorites
// @access  Private
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('favoriteAreas');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Populate full area details for each favorite
    const favoriteAreas = await Area.find({ _id: { $in: user.favoriteAreas } })
      .populate('district', 'name');

    const formatted = favoriteAreas.map(area => {
      const gapScores = area.marketGapScores ? Object.fromEntries(area.marketGapScores) : {};
      const values = Object.values(gapScores).map(v => Number(v) || 0);
      const avgScore = values.length > 0
        ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
        : 0;

      return {
        id: area._id,
        name: area.name,
        pincode: area.pincode,
        district: area.district?.name || '',
        score: avgScore,
        population: area.population,
        incomeLevel: area.incomeLevel,
        populationGrowth: area.populationGrowth
      };
    });

    res.json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Add area to favorites
// @route   POST /api/workspace/favorites
// @access  Private
const addFavorite = async (req, res) => {
  try {
    const { areaId } = req.body;
    if (!areaId) {
      return res.status(400).json({ success: false, message: 'areaId is required' });
    }

    const [area, user] = await Promise.all([
      Area.findById(areaId),
      User.findByIdAndUpdate(req.user._id, { $addToSet: { favoriteAreas: areaId } }, { new: true })
    ]);
    if (!area) return res.status(404).json({ success: false, message: 'Area not found' });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, message: 'Area added to favorites' });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Remove area from favorites
// @route   DELETE /api/workspace/favorites/:areaId
// @access  Private
const removeFavorite = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { favoriteAreas: req.params.areaId } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'Area removed from favorites' });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Get user's recent searches
// @route   GET /api/workspace/search-history
// @access  Private
const getSearchHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('recentSearches');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Enrich each pincode with area name if available
    const pincodes = (user.recentSearches || []).slice(0, 20);
    const areas = await Area.find({ pincode: { $in: pincodes } })
      .populate('district', 'name')
      .select('name pincode district');
    const areaMap = new Map(areas.map(a => [a.pincode, a]));

    const enriched = pincodes.map((pincode, idx) => {
      const area = areaMap.get(pincode);
      return {
        id: idx + 1,
        pincode,
        areaName: area?.name || pincode,
        district: area?.district?.name || ''
      };
    });

    res.json({
      success: true,
      count: enriched.length,
      data: enriched
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Add a pincode to user's recent searches
// @route   POST /api/workspace/search-history
// @access  Private
const addSearchHistory = async (req, res) => {
  try {
    const { pincode } = req.body;
    if (!pincode) {
      return res.status(400).json({ success: false, message: 'pincode is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Remove duplicate, then push to front, keep max 20
    user.recentSearches = [
      pincode,
      ...(user.recentSearches || []).filter(p => p !== pincode)
    ].slice(0, 20);

    await user.save();

    res.json({ success: true, message: 'Search history updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Clear all recent searches
// @route   DELETE /api/workspace/search-history
// @access  Private
const clearSearchHistory = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { recentSearches: [] });
    res.json({ success: true, message: 'Search history cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

module.exports = {
  getProfile,
  getFavorites,
  addFavorite,
  removeFavorite,
  getSearchHistory,
  addSearchHistory,
  clearSearchHistory
};
