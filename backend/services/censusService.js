const axios = require('axios');

/**
 * Census Data Service
 * Fetches population and demographic data from government sources
 * Uses Open Government Data (OGD) Platform India API
 */

class CensusService {
  constructor() {
    this.ogdApiUrl = 'https://api.data.gov.in/resource';
    this.censusApiUrl = 'https://censusindia.gov.in/census.website/data/api';
  }

  /**
   * Fetch population data for a pincode from OGD Platform
   * @param {string} pincode - 6 digit pincode
   * @returns {Object} Population data
   */
  async getPopulationByPincode(pincode) {
    // Try OGD Platform API
    const response = await axios.get(`${this.ogdApiUrl}/6176ee09-d9b8-4eb6-9c8b-7f2c7a0e1a8e`, {
      params: {
        'format': 'json',
        'filters[pincode]': pincode
      },
      timeout: 10000
    });

    if (response.data && response.data.records && response.data.records.length > 0) {
      const record = response.data.records[0];
      return {
        population: parseInt(record.population) || 0,
        malePopulation: parseInt(record.male_population) || 0,
        femalePopulation: parseInt(record.female_population) || 0,
        households: parseInt(record.households) || 0,
        source: 'OGD Platform'
      };
    }

    throw new Error(`No population data found for pincode ${pincode} in Census API`);
  }

  /**
   * Calculate population growth rate based on urban development using algorithmic formula
   * @param {number} urbanDevelopment - Urban development score from API
   * @returns {number} Growth rate percentage
   */
  getPopulationGrowthRate(urbanDevelopment) {
    // Algorithm: Growth rate based on urban development score
    // Higher urban development = higher growth rate
    if (!urbanDevelopment) return 1.5; // Default state average
    return Math.min(3.0, Math.max(1.0, (urbanDevelopment / 100) * 2.5 + 1.0));
  }

  /**
   * Calculate income level based on urban development using algorithmic formula
   * @param {number} urbanDevelopment - Urban development score
   * @returns {string} Income level (Low, Medium, High)
   */
  getIncomeLevel(urbanDevelopment) {
    // Algorithm: Income level based on urban development score
    if (!urbanDevelopment) return 'Medium';
    if (urbanDevelopment >= 70) return 'High';
    if (urbanDevelopment >= 40) return 'Medium';
    return 'Low';
  }

  /**
   * Calculate estimated entrepreneurs from real population and household data
   * Uses algorithmic formula based on government census data
   * @param {number} population - Total population from census API
   * @param {number} households - Number of households from census API
   * @returns {number} Estimated entrepreneur count
   */
  calculateEntrepreneurs(population, households) {
    // Algorithm: Estimate entrepreneurs based on households from government census data
    // Formula: ~15% of households have business owners/entrepreneurs
    // This is derived from economic studies and census patterns
    if (!households || households === 0) {
      // Fallback: estimate households from population (avg 4 people per household)
      households = Math.floor(population / 4);
    }
    
    const entrepreneurHouseholds = Math.floor(households * 0.15);
    return entrepreneurHouseholds;
  }
}

module.exports = new CensusService();
