const Area = require('../models/Area');
const BusinessCategory = require('../models/BusinessCategory');
const District = require('../models/District');
const { convertMapFields, convertMapFieldsArray } = require('../utils/leanHelpers');
const logger = require('../utils/logger');

const ALLOWED_SORT_FIELDS = ['opportunityScore', 'feasibilityScore', 'population', 'populationGrowth', 'demand', 'supply', 'gap', 'name', 'createdAt'];
const sanitizeSortBy = (sortBy, defaultField = 'opportunityScore') => ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : defaultField;

const getCategoryExplorer = async (req, res) => {
  try {
    const { district, sortBy: rawSortBy = 'gap', limit: rawLimit = 50 } = req.query;
    const sortBy = sanitizeSortBy(rawSortBy, 'gap');
    const limit = Math.min(Math.max(parseInt(rawLimit) || 50, 1), 200);
    const categories = await BusinessCategory.find().lean().sort({ [sortBy]: -1 }).limit(limit);

    const filter = {};
    if (district) filter.district = district;
    const areaLimit = Math.min(Math.max(parseInt(req.query.areaLimit) || 500, 1), 1000);
    const rawAreas = await Area.find(filter).lean().populate('district', 'name').limit(areaLimit);
    const areas = convertMapFieldsArray(rawAreas);

    const enriched = categories.map(cat => {
      const areasWithCat = areas.filter(a => a.marketGapScores && (a.marketGapScores[cat.name] != null || a.marketGapScores.get?.(cat.name) != null));
      const getGap = (a) => a.marketGapScores?.[cat.name] ?? a.marketGapScores?.get?.(cat.name) ?? 0;
      const getDemand = (a) => a.demandScores?.[cat.name] ?? a.demandScores?.get?.(cat.name) ?? 0;
      const avgGap = areasWithCat.length ? areasWithCat.reduce((s, a) => s + getGap(a), 0) / areasWithCat.length : 0;
      const avgDemand = areasWithCat.length ? areasWithCat.reduce((s, a) => s + getDemand(a), 0) / areasWithCat.length : 0;
      const bestArea = areasWithCat.sort((a, b) => getGap(b) - getGap(a))[0] || null;
      return {
        _id: cat._id, name: cat.name, description: cat.description,
        demand: cat.demand, supply: cat.supply, gap: cat.gap,
        minInvestment: cat.minInvestment, maxInvestment: cat.maxInvestment,
        avgGap: Math.round(avgGap * 10) / 10,
        avgDemand: Math.round(avgDemand * 10) / 10,
        areaCount: areasWithCat.length,
        bestArea: bestArea ? { name: bestArea.name, pincode: bestArea.pincode, district: bestArea.district?.name || '', gap: getGap(bestArea) } : null
      };
    });

    res.json({ success: true, categories: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const { district, sortBy: rawSortBy = 'opportunityScore', page = 1, limit = 20 } = req.query;
    const sortBy = sanitizeSortBy(rawSortBy);
    const filter = {};
    if (district) filter.district = district;

    let sortField = { [sortBy]: -1 };
    const safePage = Math.max(1, parseInt(page) || 1);
    const safeLimit = Math.min(200, Math.max(1, parseInt(limit) || 20));
    const skip = (safePage - 1) * safeLimit;
    const [rawAreas, total] = await Promise.all([
      Area.find(filter).lean().populate('district', 'name').sort(sortField).skip(skip).limit(safeLimit),
      Area.countDocuments(filter)
    ]);
    const areas = convertMapFieldsArray(rawAreas);

    const enriched = areas.map(a => {
      const gaps = a.marketGapScores || {};
      const demands = a.demandScores || {};
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
        literacyRate: a.literacyRate,
        trafficLevel: a.trafficLevel,
        avgGap: Math.round(avgGap * 10) / 10,
        totalGap: Math.round(totalGap * 10) / 10,
        categoriesCount: Object.keys(gaps).length
      };
    });

    res.json({ success: true, areas: enriched, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

const getMatrix = async (req, res) => {
  try {
    const { district } = req.query;
    const filter = {};
    if (district) filter.district = district;

    const [rawAreas, categories] = await Promise.all([
      Area.find(filter).populate('district', 'name').lean(),
      BusinessCategory.find().lean()
    ]);
    const areas = convertMapFieldsArray(rawAreas);

    const matrix = categories.map(cat => {
      const scores = areas.map(a => ({
        areaId: a._id, areaName: a.name, pincode: a.pincode,
        district: a.district?.name || '',
        gap: a.marketGapScores?.[cat.name] ?? a.marketGapScores?.get?.(cat.name) ?? 0,
        demand: a.demandScores?.[cat.name] ?? a.demandScores?.get?.(cat.name) ?? 0,
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
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

const getInvestmentEstimate = async (req, res) => {
  try {
    const { category, areaId } = req.query;
    if (!category) return res.status(400).json({ success: false, message: 'Category required' });

    const cat = await BusinessCategory.findById(category).lean();
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });

    let area = null;
    if (areaId) area = convertMapFields(await Area.findById(areaId).lean().populate('district', 'name'));

    const baseMin = cat.minInvestment || 500000;
    const baseMax = cat.maxInvestment || 5000000;

    let multiplier = 1;
    let incomeFactor = 1, growthFactor = 1, demandFactor = 1;
    if (area) {
      incomeFactor = area.incomeLevel === 'High' ? 1.3 : area.incomeLevel === 'Medium' ? 1.0 : 0.8;
      growthFactor = 1 + ((area.populationGrowth || 0) / 100);
      const demandScore = area.demandScores?.[cat.name] ?? area.demandScores?.get?.(cat.name) || 50;
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

    let areaContext = null;
    if (area) {
      const competitors = area.competitors || {};
      const demands = area.demandScores || {};
      const gaps = area.marketGapScores || {};
      const totalCompetitors = Object.values(competitors).reduce((s, v) => s + (Number(v) || 0), 0);
      const demandScore = Number(demands[cat.name]) || 0;
      const gapScore = Number(gaps[cat.name]) || 0;
      const competitorsForCat = Number(competitors[cat.name]) || 0;

      const population = Number(area.population) || 0;
      const incomeLevel = area.incomeLevel || 'Low';
      const avgSpendPerVisit = incomeLevel === 'High' ? 800 : incomeLevel === 'Medium' ? 500 : 300;
      const dailyCustomersMin = Math.round(population * 0.001 * (demandScore / 100));
      const dailyCustomersMax = Math.round(population * 0.003 * (demandScore / 100));

      const monthlyRent = incomeLevel === 'High' ? 25000 : incomeLevel === 'Medium' ? 15000 : 8000;
      const monthlyStaff = incomeLevel === 'High' ? 40000 : incomeLevel === 'Medium' ? 25000 : 15000;
      const monthlyUtilities = incomeLevel === 'High' ? 8000 : incomeLevel === 'Medium' ? 5000 : 3000;
      const monthlyMisc = 7000;
      const monthlyCostMin = monthlyRent + monthlyStaff + monthlyUtilities + monthlyMisc;
      const monthlyCostMax = Math.round(monthlyCostMin * 1.5);

      const monthlyRevenueMin = dailyCustomersMin * avgSpendPerVisit * 26;
      const monthlyRevenueMax = dailyCustomersMax * avgSpendPerVisit * 26;

      const monthlyProfitMin = monthlyRevenueMin - monthlyCostMax;
      const monthlyProfitMax = monthlyRevenueMax - monthlyCostMin;

      const avgInvestment = (estimatedMin + estimatedMax) / 2;
      const avgMonthlyProfit = (Math.max(0, monthlyProfitMin) + monthlyProfitMax) / 2;
      const breakEvenMonths = avgMonthlyProfit > 0 ? Math.round(avgInvestment / avgMonthlyProfit) : null;
      const annualROI = avgMonthlyProfit > 0 ? Math.round((avgMonthlyProfit * 12 / avgInvestment) * 100) : null;

      const marketSaturation = competitorsForCat > 5 ? 'High' : competitorsForCat > 2 ? 'Moderate' : 'Low';
      const demandLabel = demandScore > 70 ? 'Very High' : demandScore > 50 ? 'High' : demandScore > 30 ? 'Moderate' : 'Low';

      const topAreas = convertMapFieldsArray(await Area.find({
        [`demandScores.${cat.name}`]: { $gt: 0 }
      }).lean().populate('district', 'name').sort({ [`marketGapScores.${cat.name}`]: -1 }).limit(5).select('name pincode district'));

      areaContext = {
        areaInfo: {
          name: area.name,
          pincode: area.pincode,
          district: area.district?.name || '',
          population,
          incomeLevel,
          populationGrowth: area.populationGrowth || 0,
        },
        monthlyCosts: {
          rent: monthlyRent,
          staff: monthlyStaff,
          utilities: monthlyUtilities,
          misc: monthlyMisc,
          totalMin: monthlyCostMin,
          totalMax: monthlyCostMax,
        },
        revenue: {
          dailyCustomersMin,
          dailyCustomersMax,
          avgSpendPerVisit,
          monthlyMin: monthlyRevenueMin,
          monthlyMax: monthlyRevenueMax,
        },
        profit: {
          monthlyMin: Math.max(0, monthlyProfitMin),
          monthlyMax: monthlyProfitMax,
        },
        roi: {
          breakEvenMonths,
          annualROI,
        },
        market: {
          demandScore,
          demandLabel,
          gapScore,
          competitorsForCat,
          totalCompetitors,
          marketSaturation,
        },
        topAreas: topAreas.map(a => ({
          name: a.name,
          pincode: a.pincode,
          district: a.district?.name || '',
          gap: a.marketGapScores?.[cat.name] ?? a.marketGapScores?.get?.(cat.name) || 0,
        })),
      };
    }

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
        description: cat.description,
        area: area ? { name: area.name, pincode: area.pincode, district: area.district?.name } : null,
        areaContext,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

const recalculateScores = async (req, res) => {
  try {
    const BATCH_SIZE = 200;
    const cursor = Area.find().lean().cursor();
    let total = 0;
    let bulkOps = [];
    for await (const rawArea of cursor) {
      const area = convertMapFields(rawArea);
      const gaps = area.marketGapScores || {};
      const demands = area.demandScores || {};
      const gapValues = Object.values(gaps);
      const demandValues = Object.values(demands);

      const avgGap = gapValues.length ? gapValues.reduce((s, v) => s + v, 0) / gapValues.length : 0;
      const avgDemand = demandValues.length ? demandValues.reduce((s, v) => s + v, 0) / demandValues.length : 0;
      const incomeScore = area.incomeLevel === 'High' ? 85 : area.incomeLevel === 'Medium' ? 60 : 35;
      const growthScore = Math.min((area.populationGrowth || 0) * 10, 100);

      const feasibilityScore = Math.round((avgDemand * 0.35 + incomeScore * 0.25 + growthScore * 0.25 + (area.urbanDevelopment || 50) * 0.15) * 10) / 10;
      const opportunityScore = Math.round((avgGap * 0.4 + avgDemand * 0.3 + growthScore * 0.2 + incomeScore * 0.1) * 10) / 10;

      bulkOps.push({
        updateOne: { filter: { _id: area._id }, update: { $set: { feasibilityScore, opportunityScore } } }
      });
      if (bulkOps.length >= BATCH_SIZE) {
        await Area.bulkWrite(bulkOps);
        total += bulkOps.length;
        bulkOps = [];
      }
    }
    if (bulkOps.length > 0) {
      await Area.bulkWrite(bulkOps);
      total += bulkOps.length;
    }
    res.json({ success: true, message: `Recalculated scores for ${total} areas` });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

const getPincodeShops = async (req, res) => {
  try {
    const { pincode, district, category, incomeLevel, minPopulation, maxPopulation, sortBy: rawSortBy = 'opportunityScore', page = 1, limit = 50 } = req.query;
    const sortBy = sanitizeSortBy(rawSortBy);

    const filter = {};
    if (pincode) filter.pincode = pincode;
    if (district) {
      if (/^[0-9a-fA-F]{24}$/.test(district)) {
        filter.district = district;
      } else {
        const dist = await District.findOne({ name: { $regex: district, $options: 'i' } }).lean();
        if (dist) filter.district = dist._id;
      }
    }
    if (incomeLevel) filter.incomeLevel = incomeLevel;
    if (minPopulation || maxPopulation) {
      filter.population = {};
      if (minPopulation) filter.population.$gte = Number(minPopulation);
      if (maxPopulation) filter.population.$lte = Number(maxPopulation);
    }

    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit) || 50, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const [rawAreas, total] = await Promise.all([
      Area.find(filter).lean().populate('district', 'name').sort({ [sortBy]: -1 }).skip(skip).limit(limitNum),
      Area.countDocuments(filter)
    ]);
    const areas = convertMapFieldsArray(rawAreas);

    const categories = await BusinessCategory.find().lean().select('name demand supply gap minInvestment maxInvestment');
    const catMap = {};
    categories.forEach(c => { catMap[c.name] = c; });

    const enriched = areas.map(area => {
      const competitors = area.competitors || {};
      const demands = area.demandScores || {};
      const gaps = area.marketGapScores || {};

      const businessList = categories.map(cat => {
        const count = competitors[cat.name] || 0;
        const demand = demands[cat.name] || 0;
        const gap = gaps[cat.name] || 0;
        return {
          category: cat.name,
          businessCount: count,
          demandScore: Math.round(demand * 10) / 10,
          gapScore: Math.round(gap * 10) / 10,
          minInvestment: cat.minInvestment,
          maxInvestment: cat.maxInvestment,
          status: gap > 60 ? 'High Opportunity' : gap > 30 ? 'Moderate' : 'Saturated'
        };
      }).filter(b => !category || b.category.toLowerCase().includes(category.toLowerCase()));

      const totalBusinesses = businessList.reduce((s, b) => s + b.businessCount, 0);
      const highOppCount = businessList.filter(b => b.status === 'High Opportunity').length;

      return {
        _id: area._id,
        pincode: area.pincode,
        name: area.name,
        district: area.district?.name || '',
        population: area.population,
        populationGrowth: area.populationGrowth,
        incomeLevel: area.incomeLevel,
        trafficLevel: area.trafficLevel,
        literacyRate: area.literacyRate,
        feasibilityScore: area.feasibilityScore,
        opportunityScore: area.opportunityScore,
        coordinates: area.coordinates,
        landmarks: area.landmarks || [],
        ageDistribution: area.ageDistribution,
        residentialVsCommercial: area.residentialVsCommercial,
        totalBusinesses,
        highOpportunityCount: highOppCount,
        businesses: businessList
      };
    });

    res.json({
      success: true,
      areas: enriched,
      categories: categories.map(c => c.name),
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: logger.getClientMessage(error) });
  }
};

module.exports = { getCategoryExplorer, getLeaderboard, getMatrix, getInvestmentEstimate, getPincodeShops, recalculateScores };
