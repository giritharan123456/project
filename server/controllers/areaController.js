const Area = require('../models/Area');
const District = require('../models/District');
const { createNotification } = require('./notificationController');
const calculateScores = require('../utils/calculateScores');

// @desc    Get area by pincode
// @route   GET /api/areas/pincode/:pincode
// @access  Public
const getAreaByPincode = async (req, res) => {
  try {
    const { pincode } = req.params;
    
    const area = await Area.findOne({ pincode }).populate('district', 'name');
    
    if (!area) {
      return res.status(404).json({ 
        success: false, 
        message: `No area found for pincode ${pincode}` 
      });
    }

    // Create a notification for the authenticated user when new area data is fetched
    res.json({
      success: true,
      data: area
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all areas
// @route   GET /api/areas
// @access  Public
const getAllAreas = async (req, res) => {
  try {
    const { district, limit, search, page } = req.query;
    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit) || 50, 1), 100);
    const skip = (pageNum - 1) * limitNum;
    let query = {};
    
    if (district) {
      query.district = district;
    }
    if (search) {
      const safeSearch = escapeRegex(search);
      const districtMatches = await District.find({ name: { $regex: safeSearch, $options: 'i' } }).select('_id');
      const districtIds = districtMatches.map(d => d._id);
      query.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { pincode: { $regex: safeSearch, $options: 'i' } },
        ...(districtIds.length > 0 ? [{ district: { $in: districtIds } }] : []),
      ];
    }

    const [areas, total] = await Promise.all([
      Area.find(query)
        .populate('district', 'name')
        .sort({ name: 1 })
        .skip(skip)
        .limit(limitNum),
      Area.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      count: areas.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: areas
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single area
// @route   GET /api/areas/:id
// @access  Public
const getAreaById = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id).populate('district', 'name');
    if (area) {
      res.json({
        success: true,
        data: area
      });
    } else {
      res.status(404).json({ success: false, message: 'Area not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get areas by district
// @route   GET /api/areas/district/:districtId
// @access  Public
const getAreasByDistrict = async (req, res) => {
  try {
    const areas = await Area.find({ district: req.params.districtId })
      .populate('district', 'name');
      
    res.json({
      success: true,
      count: areas.length,
      data: areas
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new area
// @route   POST /api/areas
// @access  Private/Admin
const createArea = async (req, res) => {
  try {
    const area = new Area(req.body);
    calculateScores(area);
    await area.save();
    res.status(201).json({
      success: true,
      message: 'Area created successfully',
      data: area
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update area
// @route   PUT /api/areas/:id
// @access  Private/Admin
const updateArea = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);
    if (area) {
      const allowed = ['name', 'pincode', 'population', 'competitors', 'demandScores', 'marketGapScores', 'searchTrends', 'district'];
      for (const key of allowed) {
        if (req.body[key] !== undefined) {
          area[key] = req.body[key];
        }
      }
      calculateScores(area);
      await area.save();
      res.json({
        success: true,
        message: 'Area updated successfully',
        data: area
      });
    } else {
      res.status(404).json({ success: false, message: 'Area not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete area
// @route   DELETE /api/areas/:id
// @access  Private/Admin
const deleteArea = async (req, res) => {
  try {
    const area = await Area.findByIdAndDelete(req.params.id);
    if (area) {
      res.json({
        success: true,
        message: 'Area deleted successfully'
      });
    } else {
      res.status(404).json({ success: false, message: 'Area not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllAreas,
  getAreaById,
  getAreaByPincode,
  getAreasByDistrict,
  createArea,
  updateArea,
  deleteArea
};
