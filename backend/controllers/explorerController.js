const Area = require('../models/Area');
const BusinessCategory = require('../models/BusinessCategory');
const District = require('../models/District');

const getCategoryExplorer = async (req, res) => {
  try {
    const { district, sortBy = 'gap', limit = 50 } = req.query;
    const categories = await BusinessCategory.find().sort({ [sortBy]: -1 }).limit(Number(limit));

    const filter = {};
    if (district) filter.district = district;
    const areas = await Area.find(filter).populate('district', 'name');

    const enriched = categories.map(cat => {
      const areasWithCat = areas.filter(a => a.marketGapScores && a.marketGapScores.get(cat.name) != null);
      const avgGap = areasWithCat.length ? areasWithCat.reduce((s, a) => s + (a.marketGapScores.get(cat.name) || 0), 0) / areasWithCat.length : 0;
      const avgDemand = areasWithCat.length ? areasWithCat.reduce((s, a) => s + (a.demandScores.get(cat.name) || 0), 0) / areasWithCat.length : 0;
      const bestArea = areasWithCat.sort((a, b) => (b.marketGapScores.get(cat.name) || 0) - (a.marketGapScores.get(cat.name) || 0))[0] || null;
      return {
        _id: cat._id, name: cat.name, description: cat.description,
        demand: cat.demand, supply: cat.supply, gap: cat.gap,
        minInvestment: cat.minInvestment, maxInvestment: cat.maxInvestment,
        avgGap: Math.round(avgGap * 10) / 10,
        avgDemand: Math.round(avgDemand * 10) / 10,
        areaCount: areasWithCat.length,
        bestArea: bestArea ? { name: bestArea.name, pincode: bestArea.pincode, district: bestArea.district?.name || '', gap: bestArea.marketGapScores?.get(cat.name) } : null
      };
    });

    res.json({ success: true, categories: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const { district, sortBy = 'opportunityScore', page = 1, limit = 20 } = req.query;
    const filter = {};
    if (district) filter.district = district;

    let sortField = { [sortBy]: -1 };
    const skip = (Number(page) - 1) * Number(limit);
    const [areas, total] = await Promise.all([
      Area.find(filter).populate('district', 'name').sort(sortField).skip(skip).limit(Number(limit)),
      Area.countDocuments(filter)
    ]);

    const enriched = areas.map(a => {
      const gaps = a.marketGapScores ? Object.fromEntries(a.marketGapScores) : {};
      const demands = a.demandScores ? Object.fromEntries(a.demandScores) : {};
      const totalGap = Object.values(gaps).reduce((s, v) => s + v, 0);
      const totalDemand = Object.values(demands).reduce((s, v) => s + v, 0);
      const avgGap = Object.keys(gaps).length ? (totalGap / Object.keys(gaps).length) : 0;
      return {
        _id: a._id, pincode: a.pincode, name: a.name,
        district: a.district?.name || '',
        population: a.population, populationGrowth: a.populationGrowth,
        incomeLevel: a.incomeLevel,
        feasibilityScore: a.feasibilityScore,
        opportunityScore: a.opportunityScore,
        avgGap: Math.round(avgGap * 10) / 10,
        totalGap: Math.round(totalGap * 10) / 10,
        categoriesCount: Object.keys(gaps).length
      };
    });

    res.json({ success: true, areas: enriched, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMatrix = async (req, res) => {
  try {
    const { district } = req.query;
    const filter = {};
    if (district) filter.district = district;

    const [areas, categories] = await Promise.all([
      Area.find(filter).populate('district', 'name'),
      BusinessCategory.find()
    ]);

    const matrix = categories.map(cat => {
      const scores = areas.map(a => ({
        areaId: a._id, areaName: a.name, pincode: a.pincode,
        district: a.district?.name || '',
        gap: a.marketGapScores?.get(cat.name) || 0,
        demand: a.demandScores?.get(cat.name) || 0,
        feasibilityScore: a.feasibilityScore,
        incomeLevel: a.incomeLevel, population: a.population
      })).filter(s => s.gap > 0).sort((a, b) => b.gap - a.gap);

      const best = scores[0] || null;
      return {
        categories: { [cat.name]: cat.gap },
        category: cat.name,
        pincode: best?.pincode || '-',
        areaName: best?.areaName || '-',
        district: best?.district || '-',
        gapScore: best?.gap || 0,
        demandScore: best?.demand || 0,
        feasibilityScore: best?.feasibilityScore || 0,
        bestArea: best ? `${best.areaName} (${best.pincode})` : 'N/A',
        bestGap: best?.gap || 0,
        topAreas: scores.slice(0, 5)
      };
    });

    res.json({ success: true, matrix });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getInvestmentEstimate = async (req, res) => {
  try {
    const { category, areaId } = req.query;
    if (!category) return res.status(400).json({ success: false, message: 'Category required' });

    const cat = await BusinessCategory.findById(category);
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });

    let area = null;
    if (areaId) area = await Area.findById(areaId).populate('district', 'name');

    const baseMin = cat.minInvestment || 500000;
    const baseMax = cat.maxInvestment || 5000000;

    let multiplier = 1;
    let incomeFactor = 1, growthFactor = 1, demandFactor = 1;
    if (area) {
      incomeFactor = area.incomeLevel === 'High' ? 1.3 : area.incomeLevel === 'Medium' ? 1.0 : 0.8;
      growthFactor = 1 + ((area.populationGrowth || 0) / 100);
      const demandScore = area.demandScores?.get(cat.name) || 50;
      demandFactor = 0.5 + (demandScore / 200);
      multiplier = incomeFactor * growthFactor * demandFactor;
    }

    const estimatedMin = Math.round(baseMin * multiplier);
    const estimatedMax = Math.round(baseMax * multiplier);

    const breakdown = area ? [
      { label: 'Base Investment', min: baseMin, max: baseMax },
      { label: 'Income Level Adjustment', min: Math.round(baseMin * (incomeFactor - 1)), max: Math.round(baseMax * (incomeFactor - 1)) },
      { label: 'Growth Premium', min: Math.round(baseMin * (growthFactor - 1)), max: Math.round(baseMax * (growthFactor - 1)) },
      { label: 'Demand Multiplier', min: Math.round(baseMin * (demandFactor - 1)), max: Math.round(baseMax * (demandFactor - 1)) },
    ] : [{ label: 'Base Investment', min: baseMin, max: baseMax }];

    res.json({
      success: true,
      estimate: {
        minTotal: estimatedMin,
        maxTotal: estimatedMax,
        baseMin,
        baseMax,
        locationMultiplier: Math.round(multiplier * 100) / 100,
        breakdown,
        category: cat.name,
        area: area ? { name: area.name, pincode: area.pincode, district: area.district?.name } : null,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const recalculateScores = async (req, res) => {
  try {
    const areas = await Area.find();
    let updated = 0;
    for (const area of areas) {
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
      await area.save();
      updated++;
    }
    res.json({ success: true, message: `Recalculated scores for ${updated} areas` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCategoryExplorer, getLeaderboard, getMatrix, getInvestmentEstimate, recalculateScores };
