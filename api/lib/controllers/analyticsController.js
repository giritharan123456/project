const Area = require('../models/Area');
const District = require('../models/District');

// @desc    Get analytics overview — computed from real DB data
// @route   GET /api/analytics/overview
// @access  Public
const getAnalyticsOverview = async (req, res) => {
  try {
    // ── District coverage ────────────────────────────────────────────
    const totalDistricts = await District.countDocuments();
    const districtsWithAreas = await Area.distinct('district');
    const coveredDistricts = districtsWithAreas.length;
    const coveragePercent = totalDistricts > 0
      ? Math.round((coveredDistricts / totalDistricts) * 100)
      : 0;

    // Names of covered districts for the list
    const coveredDistrictDocs = await District.find(
      { _id: { $in: districtsWithAreas } },
      'name'
    );
    const districtNames = coveredDistrictDocs.map(d => d.name);

    // ── Total areas & pincodes ────────────────────────────────────────
    const totalAreas = await Area.countDocuments();

    // ── Business opportunity counts ──────────────────────────────────
    const allAreas = await Area.find({}, 'marketGapScores');
    let highOpportunity = 0;
    let mediumOpportunity = 0;
    let lowOpportunity = 0;

    allAreas.forEach(area => {
      const scores = area.marketGapScores ? Object.fromEntries(area.marketGapScores) : {};
      const values = Object.values(scores).map(v => Number(v) || 0);
      const avgScore = values.length > 0
        ? values.reduce((a, b) => a + b, 0) / values.length
        : 0;

      if (avgScore >= 70) highOpportunity++;
      else if (avgScore >= 40) mediumOpportunity++;
      else lowOpportunity++;
    });

    // ── Top growth areas (by populationGrowth) ───────────────────────
    const topGrowthAreas = await Area.find()
      .sort({ populationGrowth: -1 })
      .limit(5)
      .populate('district', 'name')
      .select('name pincode populationGrowth marketGapScores');

    const highGrowthAreas = topGrowthAreas.map(area => {
      const scores = area.marketGapScores ? Object.fromEntries(area.marketGapScores) : {};
      const values = Object.values(scores).map(v => Number(v) || 0);
      const avgScore = values.length > 0
        ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
        : 0;
      return {
        name: area.name,
        pincode: area.pincode,
        district: area.district?.name || '',
        score: avgScore,
        growth: Number(area.populationGrowth) || 0
      };
    });

    // ── High risk areas (high competition, low demand) ────────────────
    const highRiskAreas = await Area.find()
      .populate('district', 'name')
      .select('name pincode competitors demandScores marketGapScores')
      .limit(100); // look at up to 100 areas

    const riskScored = highRiskAreas.map(area => {
      const competitors = area.competitors ? Object.fromEntries(area.competitors) : {};
      const demandScores = area.demandScores ? Object.fromEntries(area.demandScores) : {};
      const marketGapScores = area.marketGapScores ? Object.fromEntries(area.marketGapScores) : {};

      const totalCompetitors = Object.values(competitors).reduce((a, b) => a + (Number(b) || 0), 0);
      const avgDemand = Object.values(demandScores).length > 0
        ? Object.values(demandScores).reduce((a, b) => a + (Number(b) || 0), 0) / Object.values(demandScores).length
        : 0;
      const avgGap = Object.values(marketGapScores).length > 0
        ? Object.values(marketGapScores).reduce((a, b) => a + (Number(b) || 0), 0) / Object.values(marketGapScores).length
        : 0;

      // Risk = high competition + low demand
      const riskScore = totalCompetitors - avgDemand;
      let riskLabel = 'Low Competition';
      if (totalCompetitors > 10) riskLabel = 'High Competition';
      else if (avgDemand < 40) riskLabel = 'Low Demand';
      else if (avgGap < 30) riskLabel = 'Market Saturation';

      return {
        name: area.name,
        pincode: area.pincode,
        district: area.district?.name || '',
        score: Math.round(avgGap),
        risk: riskLabel,
        riskScore
      };
    });

    // Sort by riskScore descending (worst first), take top 5
    const topRiskAreas = riskScored
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5);

    // ── Data quality: percentage of areas with all key fields filled ──
    const areasWithAllFields = await Area.countDocuments({
      population: { $gt: 0 },
      populationGrowth: { $exists: true },
      incomeLevel: { $exists: true, $ne: null },
      urbanDevelopment: { $gt: 0 }
    });

    const dataQualityPercent = totalAreas > 0
      ? Math.round((areasWithAllFields / totalAreas) * 100)
      : 0;

    // ── Build response ────────────────────────────────────────────────
    res.json({
      success: true,
      data: {
        marketCoverage: {
          total: totalDistricts,
          covered: coveredDistricts,
          percentage: coveragePercent,
          districts: districtNames,
          totalAreas
        },
        dataQuality: {
          overall: dataQualityPercent,
          totalAreas,
          areasWithCompleteData: areasWithAllFields
        },
        businessOpportunities: {
          high: highOpportunity,
          medium: mediumOpportunity,
          low: lowOpportunity,
          total: totalAreas
        },
        highGrowthAreas,
        highRiskAreas: topRiskAreas
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get analytics for a specific district
// @route   GET /api/analytics/district/:districtId
// @access  Public
const getDistrictAnalytics = async (req, res) => {
  try {
    const district = await District.findById(req.params.districtId);
    if (!district) {
      return res.status(404).json({ success: false, message: 'District not found' });
    }

    const areas = await Area.find({ district: req.params.districtId });

    const areaCount = areas.length;
    const totalPopulation = areas.reduce((sum, a) => sum + (Number(a.population) || 0), 0);

    // Average market gap score across all areas
    let totalGap = 0;
    let gapCount = 0;
    areas.forEach(area => {
      const scores = Object.values(Object.fromEntries(area.marketGapScores || new Map()));
      scores.forEach(s => {
        totalGap += Number(s) || 0;
        gapCount++;
      });
    });
    const avgMarketGap = gapCount > 0 ? Math.round(totalGap / gapCount) : 0;

    res.json({
      success: true,
      data: {
        district: district.name,
        areaCount,
        totalPopulation,
        avgMarketGapScore: avgMarketGap,
        areas: areas.map(a => ({
          name: a.name,
          pincode: a.pincode,
          population: a.population,
          populationGrowth: a.populationGrowth,
          incomeLevel: a.incomeLevel
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAnalyticsOverview,
  getDistrictAnalytics
};
