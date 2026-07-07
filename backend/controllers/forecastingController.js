const Area = require('../models/Area');
const District = require('../models/District');

// @desc    Get forecast data for all areas
// @route   GET /api/forecasting
// @access  Public
const getForecastData = async (req, res) => {
  try {
    const { district, timeframe } = req.query;
    let query = {};
    
    if (district) {
      query.district = district;
    }

    const areas = await Area.find(query).populate('district', 'name');
    
    // Generate forecast data based on timeframe
    const forecastData = areas.map(area => {
      const years = timeframe === '10years' ? 10 : 5;
      const growthRate = (area.populationGrowth || 0) / 100;
      
      const districtName = area.district?.name || 'Unknown';
      const currentPop = area.population || 1;
      const forecast = {
        area: area.name,
        pincode: area.pincode,
        district: districtName,
        currentPopulation: currentPop,
        projections: []
      };

      for (let year = 1; year <= years; year++) {
        const projectedPopulation = Math.round(currentPop * Math.pow(1 + growthRate, year));
        forecast.projections.push({
          year: new Date().getFullYear() + year,
          population: projectedPopulation,
          growth: Math.round((projectedPopulation - currentPop) / currentPop * 100)
        });
      }

      return forecast;
    });
      
    res.json({
      success: true,
      count: forecastData.length,
      data: forecastData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get forecast for specific area
// @route   GET /api/forecasting/area/:areaId
// @access  Public
const getForecastByArea = async (req, res) => {
  try {
    const { timeframe } = req.query;
    const area = await Area.findById(req.params.areaId).populate('district', 'name');
    
    if (!area) {
      return res.status(404).json({ success: false, message: 'Area not found' });
    }

    const years = timeframe === '10years' ? 10 : 5;
    const growthRate = (area.populationGrowth || 0) / 100;
    
    const districtName = area.district?.name || 'Unknown';
    const currentPop = area.population || 1;
    const forecast = {
      area: area.name,
      pincode: area.pincode,
      district: districtName,
      currentPopulation: currentPop,
      currentDemandScores: area.demandScores,
      currentMarketGapScores: area.marketGapScores,
      projections: []
    };

    for (let year = 1; year <= years; year++) {
      const projectedPopulation = Math.round(currentPop * Math.pow(1 + growthRate, year));
      const projectedDemand = {};
      const projectedGap = {};
      
      const demandObj = Object.fromEntries(area.demandScores || new Map());
      const gapObj = Object.fromEntries(area.marketGapScores || new Map());
      
      Object.entries(demandObj).forEach(([category, score]) => {
        projectedDemand[category] = Math.min(100, Math.round(score * (1 + growthRate * 0.5)));
      });
      
      Object.entries(gapObj).forEach(([category, score]) => {
        projectedGap[category] = Math.min(100, Math.round(score * (1 + growthRate * 0.3)));
      });

      forecast.projections.push({
        year: new Date().getFullYear() + year,
        population: projectedPopulation,
        growth: Math.round((projectedPopulation - currentPop) / currentPop * 100),
        demandScores: projectedDemand,
        marketGapScores: projectedGap
      });
    }
      
    res.json({
      success: true,
      data: forecast
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get forecast for district
// @route   GET /api/forecasting/district/:districtId
// @access  Public
const getForecastByDistrict = async (req, res) => {
  try {
    const { timeframe } = req.query;
    const areas = await Area.find({ district: req.params.districtId }).populate('district', 'name');
    
    const years = timeframe === '10years' ? 10 : 5;
    const forecastData = areas.map(area => {
      const growthRate = (area.populationGrowth || 0) / 100;
      const currentPop = area.population || 1;
      const forecast = {
        area: area.name,
        pincode: area.pincode,
        currentPopulation: currentPop,
        projections: []
      };

      for (let year = 1; year <= years; year++) {
        const projectedPopulation = Math.round(currentPop * Math.pow(1 + growthRate, year));
        forecast.projections.push({
          year: new Date().getFullYear() + year,
          population: projectedPopulation
        });
      }

      return forecast;
    });
      
    res.json({
      success: true,
      count: forecastData.length,
      data: forecastData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getForecastData,
  getForecastByArea,
  getForecastByDistrict
};
