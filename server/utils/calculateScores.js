const { safeToObj } = require('./leanHelpers');

const calculateScores = (area) => {
  const gaps = safeToObj(area.marketGapScores);
  const demands = safeToObj(area.demandScores);
  const gapValues = Object.values(gaps);
  const demandValues = Object.values(demands);
  const avgGap = gapValues.length ? gapValues.reduce((s, v) => s + v, 0) / gapValues.length : 0;
  const avgDemand = demandValues.length ? demandValues.reduce((s, v) => s + v, 0) / demandValues.length : 0;
  const incomeScore = area.incomeLevel === 'High' ? 85 : area.incomeLevel === 'Medium' ? 60 : 35;
  const growthScore = Math.min((area.populationGrowth || 0) * 10, 100);
  area.feasibilityScore = Math.round((avgDemand * 0.35 + incomeScore * 0.25 + growthScore * 0.25 + (area.urbanDevelopment || 50) * 0.15) * 10) / 10;
  area.opportunityScore = Math.round((avgGap * 0.4 + avgDemand * 0.3 + growthScore * 0.2 + incomeScore * 0.1) * 10) / 10;
};

module.exports = calculateScores;
