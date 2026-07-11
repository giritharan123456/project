const Area = require('../models/Area');
const District = require('../models/District');
const logger = require('../utils/logger');

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @desc    Search areas
// @route   GET /api/search/areas
// @access  Public
const searchAreas = async (req, res) => {
  try {
    const { query, district, limit } = req.query;
    let searchQuery = {};
    
    if (query) {
      const safeQuery = escapeRegex(query);
      searchQuery.$or = [
        { name: { $regex: safeQuery, $options: 'i' } },
        { pincode: { $regex: safeQuery, $options: 'i' } }
      ];
    }
    
    if (district) {
      searchQuery.district = district;
    }

    const areas = await Area.find(searchQuery)
      .lean()
      .populate('district', 'name')
      .limit(Math.min(parseInt(limit) || 20, 100));
      
    res.json({
      success: true,
      count: areas.length,
      data: areas
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Search by pincode
// @route   GET /api/search/pincode/:pincode
// @access  Public
const searchByPincode = async (req, res) => {
  try {
    const area = await Area.findOne({ pincode: req.params.pincode }).lean().populate('district', 'name');
    
    if (area) {
      res.json({
        success: true,
        data: area
      });
    } else {
      res.status(404).json({ success: false, message: 'Area not found with this pincode' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Search by name
// @route   GET /api/search/name/:name
// @access  Public
const searchByName = async (req, res) => {
  try {
    const escapedName = req.params.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const areas = await Area.find({ 
      name: { $regex: escapedName, $options: 'i' } 
    }).lean().populate('district', 'name');
      
    res.json({
      success: true,
      count: areas.length,
      data: areas
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Get search suggestions
// @route   GET /api/search/suggestions
// @access  Public
const getSearchSuggestions = async (req, res) => {
  try {
    const { query, district } = req.query;
    
    if (!query) {
      return res.json({ success: true, data: [] });
    }

    const filter = {
      $or: [
        { name: { $regex: escapeRegex(query), $options: 'i' } },
        { pincode: { $regex: escapeRegex(query), $options: 'i' } }
      ]
    };

    if (district) {
      const districtDoc = await District.findOne({ name: { $regex: `^${escapeRegex(district)}$`, $options: 'i' } }).lean().select('_id');
      if (districtDoc) {
        filter.district = districtDoc._id;
      }
    }

    const suggestions = await Area.find(filter)
      .lean()
      .select('name pincode district')
      .populate('district', 'name')
      .limit(10);
      
    res.json({
      success: true,
      data: suggestions.map(s => ({
        id: s._id,
        name: s.name,
        pincode: s.pincode,
        district: s.district?.name || 'Unknown'
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

module.exports = {
  searchAreas,
  searchByPincode,
  searchByName,
  getSearchSuggestions
};
