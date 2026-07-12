const Area = require('../models/Area');
const District = require('../models/District');
const logger = require('../utils/logger');

// @desc    Get market data for all areas
// @route   GET /api/market-data
// @access  Public
const getMarketData = async (req, res) => {
  try {
    const { district, limit } = req.query;
    let query = {};
    
    if (district) {
      query.district = district;
    }

    const areas = await Area.find(query)
      .lean()
      .populate('district', 'name')
      .limit(Math.min(parseInt(limit) || 100, 500));
      
    res.json({
      success: true,
      count: areas.length,
      data: areas
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Get market data for specific area
// @route   GET /api/market-data/area/:areaId
// @access  Public
const getMarketDataByArea = async (req, res) => {
  try {
    const area = await Area.findById(req.params.areaId).lean().populate('district', 'name');
    if (area) {
      res.json({
        success: true,
        data: {
          pincode: area.pincode,
          name: area.name,
          district: area.district,
          population: area.population,
          populationGrowth: area.populationGrowth,
          incomeLevel: area.incomeLevel,
          urbanDevelopment: area.urbanDevelopment,
          searchTrends: area.searchTrends,
          competitors: area.competitors,
          demandScores: area.demandScores,
          marketGapScores: area.marketGapScores
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'Area not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Get market data for district
// @route   GET /api/market-data/district/:districtId
// @access  Public
const getMarketDataByDistrict = async (req, res) => {
  try {
    const areas = await Area.find({ district: req.params.districtId })
      .lean()
      .populate('district', 'name')
      .limit(500);
      
    res.json({
      success: true,
      count: areas.length,
      data: areas
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

// @desc    Update market data for area
// @route   PUT /api/market-data/area/:areaId
// @access  Private/Admin
const updateMarketData = async (req, res) => {
  try {
    const updateFields = {};
    if (req.body.competitors !== undefined) updateFields.competitors = req.body.competitors;
    if (req.body.demandScores !== undefined) updateFields.demandScores = req.body.demandScores;
    if (req.body.marketGapScores !== undefined) updateFields.marketGapScores = req.body.marketGapScores;
    if (req.body.searchTrends !== undefined) updateFields.searchTrends = req.body.searchTrends;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    const area = await Area.findByIdAndUpdate(
      req.params.areaId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    if (area) {
      res.json({
        success: true,
        message: 'Market data updated successfully',
        data: area
      });
    } else {
      res.status(404).json({ success: false, message: 'Area not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

module.exports = {
  getMarketData,
  getMarketDataByArea,
  getMarketDataByDistrict,
  updateMarketData
};
