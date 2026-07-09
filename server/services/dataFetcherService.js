const Area = require('../models/Area');
const District = require('../models/District');

// NOTE: This service generates algorithmically estimated data for pincodes
// not found in the database. The data is based on demographic formulas and
// randomization. For real data, pre-seed the database using seed.js.

class DataFetcherService {
  generatePopulationData(pincode) {
    const pincodeNum = parseInt(pincode);
    const basePop = 20000 + ((pincodeNum % 1000) * 150);
    const variation = Math.floor(Math.random() * 10000) - 5000;
    const population = Math.max(10000, basePop + variation);
    const households = Math.floor(population / 4);
    return { population, malePopulation: Math.floor(population * 0.49), femalePopulation: Math.floor(population * 0.51), households };
  }

  getUrbanDevelopment(pincode) {
    const pincodeNum = parseInt(pincode);
    const base = ((pincodeNum % 100) / 99) * 100;
    return Math.round(Math.min(95, Math.max(25, base + (Math.random() * 15 - 7.5))));
  }

  getPopulationGrowthRate(urbanDevelopment) {
    return Math.round((Math.min(3.0, Math.max(0.5, (urbanDevelopment / 100) * 2.5 + 0.8))) * 10) / 10;
  }

  getIncomeLevel(urbanDevelopment) {
    if (urbanDevelopment >= 70) return 'High';
    if (urbanDevelopment >= 40) return 'Medium';
    return 'Low';
  }

  generateMarketAnalysis(population, urbanDevelopment, incomeLevel) {
    const categoryCount = Math.floor(urbanDevelopment / 15) + 4;
    const businessCategories = ['Pharmacy', 'Supermarket', 'Restaurant', 'Coaching Centre', 'Fitness Center', 'Diagnostic Lab', 'Electronics Store', 'Salon & Spa', 'Café', 'Department Store', 'Clinic', 'Bakery'];
    const selectedCategories = businessCategories.slice(0, Math.min(categoryCount, businessCategories.length));
    const competitors = {};
    const demandScores = {};
    const marketGapScores = {};
    const incomeMultiplier = incomeLevel === 'High' ? 1.3 : incomeLevel === 'Medium' ? 1.0 : 0.7;

    selectedCategories.forEach((cat, index) => {
      const competitorCount = Math.max(1, Math.floor((population / 8000) * (urbanDevelopment / 30) * ((index + 1) * 0.8)));
      competitors[cat] = competitorCount;
      const demandScore = Math.min(95, Math.max(40, Math.floor((population / 800) * incomeMultiplier * (urbanDevelopment / 40) * (1 + (index * 0.05)))));
      demandScores[cat] = demandScore;
      const gapScore = Math.max(0, Math.min(95, demandScore - (competitorCount * 2) + Math.floor(Math.random() * 10 - 5)));
      marketGapScores[cat] = gapScore;
    });

    return { competitors, demandScores, marketGapScores };
  }

  generateLandmarks(name, urbanDev) {
    const landmarks = [];
    landmarks.push({ name: `${name} Market`, type: 'Market' });
    
    if (urbanDev >= 50) {
      landmarks.push({ name: `${name} Hospital`, type: 'Hospital' });
      landmarks.push({ name: `${name} School`, type: 'School' });
    }
    
    if (urbanDev >= 70) {
      landmarks.push({ name: `${name} Bus Stand`, type: 'Station' });
      landmarks.push({ name: `${name} Park`, type: 'Park' });
    }
    
    if (urbanDev >= 80) {
      landmarks.push({ name: `${name} Mall`, type: 'Mall' });
    }
    
    landmarks.push({ name: `${name} Temple`, type: 'Temple' });
    
    return landmarks;
  }

  async fetchAreaData(pincode) {
    const urbanDevelopment = this.getUrbanDevelopment(pincode);
    const locationData = { name: `Area near ${pincode}`, coordinates: { lat: 11.0 + Math.random() * 2.5, lng: 77.5 + Math.random() * 3.0 } };
    const populationData = this.generatePopulationData(pincode);
    const populationGrowth = this.getPopulationGrowthRate(urbanDevelopment);
    const incomeLevel = this.getIncomeLevel(urbanDevelopment);
    const marketAnalysis = this.generateMarketAnalysis(populationData.population, urbanDevelopment, incomeLevel);

    let districtDoc = await District.findOne({});
    if (!districtDoc) {
      districtDoc = await District.create({ name: 'Default District', state: 'Tamil Nadu' });
    }

    return {
      pincode, name: locationData.name, district: districtDoc._id,
      coordinates: locationData.coordinates, population: populationData.population,
      populationGrowth, incomeLevel, urbanDevelopment, searchTrends: Math.round(urbanDevelopment * 0.85 + Math.random() * 10),
      competitors: marketAnalysis.competitors, demandScores: marketAnalysis.demandScores,
      marketGapScores: marketAnalysis.marketGapScores,
      literacyRate: Math.round(70 + (urbanDevelopment / 100) * 20 + (Math.random() * 5 - 2.5)),
      ageDistribution: {
        youth: Math.round(22 + Math.random() * 10),
        working: Math.round(50 + Math.random() * 10),
        senior: Math.round(12 + Math.random() * 8)
      },
      residentialVsCommercial: {
        residential: Math.round(60 + Math.random() * 20),
        commercial: Math.round(15 + Math.random() * 15),
        industrial: Math.round(5 + Math.random() * 10)
      },
      trafficLevel: urbanDevelopment >= 80 ? 'Very High' : urbanDevelopment >= 60 ? 'High' : urbanDevelopment >= 40 ? 'Medium' : 'Low',
      landmarks: this.generateLandmarks(locationData.name, urbanDevelopment)
    };
  }

  async fetchAndStoreArea(pincode) {
    let existingArea = await Area.findOne({ pincode });
    if (existingArea) return existingArea;
    const areaData = await this.fetchAreaData(pincode);
    const newArea = await Area.create(areaData);
    return newArea;
  }
}

module.exports = new DataFetcherService();
