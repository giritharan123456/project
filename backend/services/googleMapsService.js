const axios = require('axios');

/**
 * OpenStreetMap Nominatim API Service
 * Fetches location data including coordinates, area name, and district
 * Uses OpenStreetMap Nominatim API (free, no API key required)
 */

class GoogleMapsService {
  constructor() {
    this.nominatimUrl = 'https://nominatim.openstreetmap.org/search';
  }

  /**
   * Get location data for a pincode
   * @param {string} pincode - 6 digit pincode
   * @returns {Object} Location data with coordinates, area name, district
   */
  async getLocationByPincode(pincode) {
    const response = await axios.get(this.nominatimUrl, {
      params: {
        postalcode: pincode,
        countrycodes: 'IN',
        format: 'json'
      },
      timeout: 10000,
      headers: {
        'User-Agent': 'MarketGapFinder/1.0'
      }
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      const displayName = result.display_name;
      const addressParts = displayName.split(',').map(part => part.trim());
      
      // Extract area name, district, and state from display name
      let areaName = result.name || pincode;
      let district = '';
      let state = '';

      // Parse address parts to extract district and state
      for (let i = 0; i < addressParts.length; i++) {
        const part = addressParts[i];
        if (part.toLowerCase().includes('district') || part.toLowerCase().includes('corporation')) {
          district = part.replace(/district|corporation/gi, '').trim();
        }
        if (part === 'Tamil Nadu' || part === 'Tamilnadu') {
          state = 'Tamil Nadu';
        }
      }

      // If district not found, try to extract from address parts
      if (!district && addressParts.length >= 3) {
        // Usually district is the second or third part
        for (let i = 1; i < Math.min(3, addressParts.length); i++) {
          const part = addressParts[i];
          if (part !== pincode && part !== 'India' && part !== 'Tamil Nadu' && part !== 'Tamilnadu') {
            district = part;
            break;
          }
        }
      }

      return {
        name: areaName,
        district: district,
        state: state,
        coordinates: {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon)
        },
        formattedAddress: displayName,
        source: 'OpenStreetMap Nominatim API'
      };
    } else {
      throw new Error(`OpenStreetMap API returned no results for pincode ${pincode}`);
    }
  }

  /**
   * Calculate urban development score based on coordinates using algorithmic formula
   * @param {Object} coordinates - Latitude and longitude from OpenStreetMap
   * @returns {number} Urban development score (0-100)
   */
  getUrbanDevelopmentScore(coordinates) {
    // Algorithm: Urban development score based on geographic coordinates
    // Uses latitude-based approximation for Tamil Nadu region
    if (!coordinates || !coordinates.lat) return 50; // Default score
    
    // Tamil Nadu latitude range: approximately 8°N to 13°N
    // Higher latitude (north) generally more urban in TN
    const lat = coordinates.lat;
    const latScore = Math.min(100, Math.max(30, Math.floor((lat - 8) * 15)));
    return latScore;
  }

  /**
   * Calculate search trends based on urban development and population using algorithmic formula
   * @param {number} urbanDevelopment - Urban development score
   * @param {number} population - Population count from Census API
   * @returns {number} Search trends score (0-100)
   */
  getSearchTrends(urbanDevelopment, population) {
    // Algorithm: Search trends based on urban development and population density
    const baseScore = urbanDevelopment ? urbanDevelopment * 0.6 : 30;
    const populationFactor = population ? Math.min(population / 100000, 20) : 10;
    return Math.min(100, Math.floor(baseScore + populationFactor + 30));
  }
}

module.exports = new GoogleMapsService();
