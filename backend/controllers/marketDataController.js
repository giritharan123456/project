const Area = require('../models/Area');
const District = require('../models/District');

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

// @desc    Get market data for specific area
// @route   GET /api/market-data/area/:areaId
// @access  Public
const getMarketDataByArea = async (req, res) => {
  try {
    const area = await Area.findById(req.params.areaId).populate('district', 'name');
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
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get market data for district
// @route   GET /api/market-data/district/:districtId
// @access  Public
const getMarketDataByDistrict = async (req, res) => {
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

// @desc    Update market data for area
// @route   PUT /api/market-data/area/:areaId
// @access  Private/Admin
const updateMarketData = async (req, res) => {
  try {
    const { competitors, demandScores, marketGapScores, searchTrends } = req.body;
    const area = await Area.findByIdAndUpdate(
      req.params.areaId,
      { competitors, demandScores, marketGapScores, searchTrends },
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
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMarketData,
  getMarketDataByArea,
  getMarketDataByDistrict,
  updateMarketData
};
