const Area = require('../models/Area');
const District = require('../models/District');
const dataFetcherService = require('../services/dataFetcherService');
const { createNotification } = require('./notificationController');

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const calculateScores = (area) => {
  const gaps = area.marketGapScores ? Object.fromEntries(area.marketGapScores) : {};
  const demands = area.demandScores ? Object.fromEntries(area.demandScores) : {};
  const gapValues = Object.values(gaps);
  const demandValues = Object.values(demands);
  const avgGap = gapValues.length ? gapValues.reduce((s, v) => s + v, 0) / gapValues.length : 0;
  const avgDemand = demandValues.length ? demandValues.reduce((s, v) => s + v, 0) / demandValues.length : 0;
  const incomeScore = area.incomeLevel === 'High' ? 85 : area.incomeLevel === 'Medium' ? 60 : 35;
  const growthScore = Math.min((area.populationGrowth || 0) * 10, 100);
  area.feasibilityScore = Math.round((avgDemand * 0.35 + incomeScore * 0.25 + growthScore * 0.25 + (area.urbanDevelopment || 50) * 0.15) * 10) / 10;
  area.opportunityScore = Math.round((avgGap * 0.4 + avgDemand * 0.3 + growthScore * 0.2 + incomeScore * 0.1) * 10) / 10;
};

// @desc    Get area by pincode (auto-fetch from APIs if not in database)
// @route   GET /api/areas/pincode/:pincode
// @access  Public
const getAreaByPincode = async (req, res) => {
  try {
    const { pincode } = req.params;
    
    // Try to get from database first
    let area = await Area.findOne({ pincode }).populate('district', 'name');
    const isNewArea = !area;
    
    if (!area) {
      // Fetch from APIs and store in database
      try {
        area = await dataFetcherService.fetchAndStoreArea(pincode);
        area = await Area.findOne({ pincode }).populate('district', 'name');
      } catch (error) {
        return res.status(404).json({ 
          success: false, 
          message: `Unable to fetch data for pincode ${pincode}. The pincode may not be valid or APIs are unavailable.` 
        });
      }
    }

    // Create a notification for the authenticated user when new area data is fetched
    if (isNewArea && area && req.user) {
      const districtName = area.district?.name || '';
      const gapScores = area.marketGapScores ? Object.fromEntries(area.marketGapScores) : {};
      const values = Object.values(gapScores).map(v => Number(v) || 0);
      const avgScore = values.length > 0
        ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
        : 0;

      await createNotification(
        req.user._id,
        'area_loaded',
        `New area data loaded: ${area.name} (${pincode})`,
        `Market data for ${area.name}, ${districtName} has been fetched from Census & Google Maps APIs. Population: ${(area.population || 0).toLocaleString()}. Avg market gap score: ${avgScore}.`,
        { pincode, areaName: area.name, districtName, score: avgScore }
      );

      // If market gap is high, add an opportunity alert notification too
      if (avgScore >= 70) {
        await createNotification(
          req.user._id,
          'market',
          `High Opportunity Area: ${area.name}`,
          `${area.name} (${pincode}) has an average market gap score of ${avgScore} — indicating strong business opportunity with relatively low competition.`,
          { pincode, areaName: area.name, districtName, score: avgScore }
        );
      }
    }
    
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
    const { district, limit, search } = req.query;
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

    const areas = await Area.find(query)
      .populate('district', 'name')
      .limit(parseInt(limit) || 0);
      
    res.json({
      success: true,
      count: areas.length,
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
