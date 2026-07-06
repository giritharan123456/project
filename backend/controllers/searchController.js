const Area = require('../models/Area');

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
      .populate('district', 'name')
      .limit(parseInt(limit) || 20);
      
    res.json({
      success: true,
      count: areas.length,
      data: areas
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Search by pincode
// @route   GET /api/search/pincode/:pincode
// @access  Public
const searchByPincode = async (req, res) => {
  try {
    const area = await Area.findOne({ pincode: req.params.pincode }).populate('district', 'name');
    
    if (area) {
      res.json({
        success: true,
        data: area
      });
    } else {
      res.status(404).json({ success: false, message: 'Area not found with this pincode' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Search by name
// @route   GET /api/search/name/:name
// @access  Public
const searchByName = async (req, res) => {
  try {
    const areas = await Area.find({ 
      name: { $regex: req.params.name, $options: 'i' } 
    }).populate('district', 'name');
      
    res.json({
      success: true,
      count: areas.length,
      data: areas
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get search suggestions
// @route   GET /api/search/suggestions
// @access  Public
const getSearchSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.json({ success: true, data: [] });
    }

    const suggestions = await Area.find({
      $or: [
        { name: { $regex: escapeRegex(query), $options: 'i' } },
        { pincode: { $regex: escapeRegex(query), $options: 'i' } }
     ]
   })
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
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  searchAreas,
  searchByPincode,
  searchByName,
  getSearchSuggestions
};
