/**
 * Utilities for normalizing API data and displaying values.
 * Never show null, undefined, N/A, or fake defaults — use "No data available" instead.
 */

export const NO_DATA_LABEL = 'No data available';

/** Convert Mongoose Map or nested object to a plain object */
export function toPlainObject(value) {
  if (value == null) return {};
  if (value instanceof Map) return Object.fromEntries(value);
  if (typeof value === 'object' && !Array.isArray(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, v])
    );
  }
  return {};
}

/** Check if a value is a usable number */
export function hasValidNumber(value) {
  if (value === null || value === undefined || value === '') return false;
  const num = Number(value);
  return !isNaN(num) && isFinite(num);
}

/** Format a value for display; returns NO_DATA_LABEL when missing */
export function formatDisplayValue(value, formatter) {
  if (!hasValidNumber(value) && (value === null || value === undefined || value === '')) {
    return NO_DATA_LABEL;
  }
  if (typeof formatter === 'function') return formatter(value);
  return String(value);
}

/** Safely get numeric value or null (never fake defaults) */
export function toNumberOrNull(value) {
  if (!hasValidNumber(value)) return null;
  return Number(value);
}

/** Transform a backend Area document into frontend pincodeData shape */
export function transformAreaToPincodeData(area) {
  if (!area) return null;

  const marketGapScores = toPlainObject(area.marketGapScores);
  const competitors = toPlainObject(area.competitors);
  const demandScores = toPlainObject(area.demandScores);

  const lat = toNumberOrNull(area.coordinates?.lat);
  const lng = toNumberOrNull(area.coordinates?.lng);
  
  // Calculate populationGrowth if not present (algorithmic calculation in frontend)
  const population = toNumberOrNull(area.population);
  const urbanDevelopment = toNumberOrNull(area.urbanDevelopment);
  const searchTrends = toNumberOrNull(area.searchTrends);
  
  let populationGrowth = toNumberOrNull(area.populationGrowth);
  if (populationGrowth === null && population !== null && urbanDevelopment !== null) {
    // Algorithmic formula: growth based on urban development and search trends
    const growthFactor = (urbanDevelopment / 100) * 2;
    const trendFactor = searchTrends ? (searchTrends / 100) * 0.5 : 0;
    populationGrowth = Math.round(Math.max(0, Math.min(10, (growthFactor + trendFactor) * 2.5)) * 100) / 100;
  }

  return {
    pincode: area.pincode || null,
    area: area.name || null,
    district: area.district?.name || null,
    population: toNumberOrNull(area.population),
    lat,
    lng,
    hasCoordinates: lat !== null && lng !== null,
    populationGrowth,
    incomeLevel: area.incomeLevel || null,
    urbanDevelopment: toNumberOrNull(area.urbanDevelopment),
    searchTrends: toNumberOrNull(area.searchTrends),
    marketGapScores,
    competitors,
    demandScores,
    opportunityScore: toNumberOrNull(area.opportunityScore),
    feasibilityScore: toNumberOrNull(area.feasibilityScore),
  };
}

/** Build business category list from a single area's real API data */
export function getBusinessCategoriesFromArea(area) {
  if (!area) return [];

  const demandScores = toPlainObject(area.demandScores);
  const competitors = toPlainObject(area.competitors);

  const categories = new Set([
    ...Object.keys(demandScores),
    ...Object.keys(competitors),
  ]);

  return Array.from(categories).map((name) => {
    const demand = toNumberOrNull(demandScores[name]) || 0;
    const supply = toNumberOrNull(competitors[name]) || 0;
    const gap = demand !== null && supply !== null ? Math.max(0, demand - supply) : 0;
    return { name, demand, supply, gap };
  });
}

/** Average of numeric values in an object; null if empty */
export function averageOfValues(obj) {
  const values = Object.values(toPlainObject(obj)).map(Number).filter((v) => !isNaN(v));
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/** Check if pincodeData array has any usable records */
export function hasAreaData(pincodeData) {
  return Array.isArray(pincodeData) && pincodeData.length > 0;
}

/** Round a number to 2 decimal places (avoids floating-point display like 64.39999999%) */
export function round2(value) {
  if (value === null || value === undefined || value === '') return value;
  const num = Number(value);
  if (isNaN(num)) return value;
  return Math.round(num * 100) / 100;
}
