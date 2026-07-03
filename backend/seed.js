const mongoose = require('mongoose');
const dotenv = require('dotenv');
const District = require('./models/District');
const BusinessCategory = require('./models/BusinessCategory');
const Area = require('./models/Area');


dotenv.config();

const districtsData = [
  { name: 'Ariyalur' }, { name: 'Chengalpattu' }, { name: 'Chennai' },
  { name: 'Coimbatore' }, { name: 'Cuddalore' }, { name: 'Dharmapuri' },
  { name: 'Dindigul' }, { name: 'Erode' }, { name: 'Kallakurichi' },
  { name: 'Kancheepuram' }, { name: 'Kanniyakumari' }, { name: 'Karur' },
  { name: 'Krishnagiri' }, { name: 'Madurai' }, { name: 'Mayiladuthurai' },
  { name: 'Nagapattinam' }, { name: 'Namakkal' }, { name: 'The Nilgiris' },
  { name: 'Perambalur' }, { name: 'Pudukkottai' }, { name: 'Ramanathapuram' },
  { name: 'Ranipet' }, { name: 'Salem' }, { name: 'Sivagangai' },
  { name: 'Tenkasi' }, { name: 'Thanjavur' }, { name: 'Theni' },
  { name: 'Thiruvallur' }, { name: 'Thiruvarur' }, { name: 'Tiruchirappalli' },
  { name: 'Tirunelveli' }, { name: 'Tirupathur' }, { name: 'Tiruppur' },
  { name: 'Tiruvannamalai' }, { name: 'Thoothukudi' }, { name: 'Vellore' },
  { name: 'Viluppuram' }, { name: 'Virudhunagar' }
];

const businessCategoriesData = [
  { name: 'Pharmacy', demand: 85, supply: 45, gap: 40, description: 'Retail pharmacy and medical stores', minInvestment: 800000, maxInvestment: 3000000 },
  { name: 'Supermarket', demand: 90, supply: 55, gap: 35, description: 'Grocery and household retail', minInvestment: 1500000, maxInvestment: 8000000 },
  { name: 'Restaurant', demand: 88, supply: 60, gap: 28, description: 'Dining and food services', minInvestment: 1000000, maxInvestment: 5000000 },
  { name: 'Coaching Centre', demand: 82, supply: 35, gap: 47, description: 'Educational tutoring and training', minInvestment: 300000, maxInvestment: 1500000 },
  { name: 'Fitness Center', demand: 75, supply: 30, gap: 45, description: 'Gym and fitness facilities', minInvestment: 500000, maxInvestment: 3000000 },
  { name: 'Diagnostic Lab', demand: 78, supply: 25, gap: 53, description: 'Medical diagnostic services', minInvestment: 2000000, maxInvestment: 10000000 },
  { name: 'Electronics Store', demand: 80, supply: 40, gap: 40, description: 'Consumer electronics retail', minInvestment: 1000000, maxInvestment: 5000000 },
  { name: 'Salon & Spa', demand: 72, supply: 35, gap: 37, description: 'Beauty and wellness services', minInvestment: 400000, maxInvestment: 2000000 },
  { name: 'Café', demand: 85, supply: 50, gap: 35, description: 'Coffee shop and café', minInvestment: 600000, maxInvestment: 2500000 },
  { name: 'Department Store', demand: 78, supply: 38, gap: 40, description: 'Multi-brand retail store', minInvestment: 2000000, maxInvestment: 10000000 },
  { name: 'Clinic', demand: 82, supply: 30, gap: 52, description: 'Medical clinic and healthcare', minInvestment: 1500000, maxInvestment: 5000000 },
  { name: 'Bakery', demand: 70, supply: 28, gap: 42, description: 'Bakery and confectionery', minInvestment: 300000, maxInvestment: 1500000 }
];

const areasData = [
  {
    pincode: '600100', name: 'T. Nagar', districtName: 'Chennai',
    coordinates: { lat: 13.0418, lng: 80.2341 }, population: 120000,
    populationGrowth: 2.5, incomeLevel: 'High', urbanDevelopment: 85, searchTrends: 82,
    competitors: { Pharmacy: 4, Supermarket: 6, Restaurant: 18, 'Coaching Centre': 5, 'Fitness Center': 3, 'Diagnostic Lab': 2, Café: 8, 'Salon & Spa': 4 },
    demandScores: { Pharmacy: 92, Supermarket: 89, Restaurant: 95, 'Coaching Centre': 78, 'Fitness Center': 70, 'Diagnostic Lab': 65, Café: 88, 'Salon & Spa': 72 },
    marketGapScores: { Pharmacy: 88, Supermarket: 83, Restaurant: 77, 'Coaching Centre': 73, 'Fitness Center': 67, 'Diagnostic Lab': 63, Café: 80, 'Salon & Spa': 68 }
  },
  {
    pincode: '600040', name: 'Anna Nagar', districtName: 'Chennai',
    coordinates: { lat: 13.0850, lng: 80.2101 }, population: 95000,
    populationGrowth: 2.0, incomeLevel: 'High', urbanDevelopment: 82, searchTrends: 78,
    competitors: { Pharmacy: 3, Supermarket: 5, Restaurant: 14, 'Coaching Centre': 4, 'Fitness Center': 2, 'Diagnostic Lab': 1, Café: 6, 'Salon & Spa': 3 },
    demandScores: { Pharmacy: 88, Supermarket: 85, Restaurant: 90, 'Coaching Centre': 82, 'Fitness Center': 72, 'Diagnostic Lab': 68, Café: 82, 'Salon & Spa': 70 },
    marketGapScores: { Pharmacy: 85, Supermarket: 80, Restaurant: 76, 'Coaching Centre': 78, 'Fitness Center': 70, 'Diagnostic Lab': 67, Café: 76, 'Salon & Spa': 67 }
  },
  {
    pincode: '600017', name: 'Thousand Lights', districtName: 'Chennai',
    coordinates: { lat: 13.0574, lng: 80.2581 }, population: 78000,
    populationGrowth: 1.8, incomeLevel: 'Medium', urbanDevelopment: 78, searchTrends: 75,
    competitors: { Pharmacy: 2, Supermarket: 3, Restaurant: 10, 'Coaching Centre': 3, Café: 5, 'Diagnostic Lab': 1 },
    demandScores: { Pharmacy: 80, Supermarket: 78, Restaurant: 85, 'Coaching Centre': 75, Café: 80, 'Diagnostic Lab': 62 },
    marketGapScores: { Pharmacy: 78, Supermarket: 75, Restaurant: 75, 'Coaching Centre': 72, Café: 75, 'Diagnostic Lab': 61 }
  },
  {
    pincode: '641035', name: 'Gandhipuram', districtName: 'Coimbatore',
    coordinates: { lat: 11.0168, lng: 76.9558 }, population: 110000,
    populationGrowth: 3.2, incomeLevel: 'High', urbanDevelopment: 80, searchTrends: 80,
    competitors: { Pharmacy: 5, Supermarket: 6, Restaurant: 16, 'Coaching Centre': 4, 'Fitness Center': 3, Café: 7, 'Electronics Store': 2 },
    demandScores: { Pharmacy: 90, Supermarket: 88, Restaurant: 92, 'Coaching Centre': 80, 'Fitness Center': 74, Café: 85, 'Electronics Store': 72 },
    marketGapScores: { Pharmacy: 85, Supermarket: 82, Restaurant: 76, 'Coaching Centre': 76, 'Fitness Center': 71, Café: 78, 'Electronics Store': 70 }
  },
  {
    pincode: '641002', name: 'RS Puram', districtName: 'Coimbatore',
    coordinates: { lat: 11.0022, lng: 76.9625 }, population: 72000,
    populationGrowth: 2.8, incomeLevel: 'Medium', urbanDevelopment: 75, searchTrends: 72,
    competitors: { Pharmacy: 3, Supermarket: 4, Restaurant: 10, 'Coaching Centre': 2, Café: 5, 'Diagnostic Lab': 1 },
    demandScores: { Pharmacy: 82, Supermarket: 80, Restaurant: 85, 'Coaching Centre': 72, Café: 78, 'Diagnostic Lab': 60 },
    marketGapScores: { Pharmacy: 79, Supermarket: 76, Restaurant: 75, 'Coaching Centre': 70, Café: 73, 'Diagnostic Lab': 59 }
  },
  {
    pincode: '625020', name: 'KK Nagar', districtName: 'Madurai',
    coordinates: { lat: 9.9299, lng: 78.1170 }, population: 85000,
    populationGrowth: 2.2, incomeLevel: 'Medium', urbanDevelopment: 72, searchTrends: 68,
    competitors: { Pharmacy: 3, Supermarket: 4, Restaurant: 8, 'Coaching Centre': 2, 'Fitness Center': 1, Café: 3 },
    demandScores: { Pharmacy: 78, Supermarket: 76, Restaurant: 82, 'Coaching Centre': 74, 'Fitness Center': 65, Café: 72 },
    marketGapScores: { Pharmacy: 75, Supermarket: 72, Restaurant: 74, 'Coaching Centre': 72, 'Fitness Center': 64, Café: 69 }
  },
  {
    pincode: '620018', name: 'Srirangam', districtName: 'Tiruchirappalli',
    coordinates: { lat: 10.8627, lng: 78.6917 }, population: 68000,
    populationGrowth: 1.9, incomeLevel: 'Medium', urbanDevelopment: 68, searchTrends: 65,
    competitors: { Pharmacy: 2, Supermarket: 3, Restaurant: 6, 'Coaching Centre': 3, Café: 2 },
    demandScores: { Pharmacy: 75, Supermarket: 72, Restaurant: 78, 'Coaching Centre': 70, Café: 68 },
    marketGapScores: { Pharmacy: 73, Supermarket: 69, Restaurant: 72, 'Coaching Centre': 67, Café: 66 }
  },
  {
    pincode: '636004', name: 'Fairlands', districtName: 'Salem',
    coordinates: { lat: 11.6643, lng: 78.1460 }, population: 55000,
    populationGrowth: 2.5, incomeLevel: 'Medium', urbanDevelopment: 65, searchTrends: 62,
    competitors: { Pharmacy: 2, Supermarket: 3, Restaurant: 5, 'Coaching Centre': 1, Café: 2 },
    demandScores: { Pharmacy: 72, Supermarket: 70, Restaurant: 75, 'Coaching Centre': 68, Café: 65 },
    marketGapScores: { Pharmacy: 70, Supermarket: 67, Restaurant: 70, 'Coaching Centre': 67, Café: 63 }
  },
  {
    pincode: '638001', name: 'Brough Road', districtName: 'Erode',
    coordinates: { lat: 11.3410, lng: 77.7172 }, population: 48000,
    populationGrowth: 2.0, incomeLevel: 'Medium', urbanDevelopment: 62, searchTrends: 60,
    competitors: { Pharmacy: 2, Supermarket: 2, Restaurant: 4, 'Coaching Centre': 1, 'Diagnostic Lab': 1 },
    demandScores: { Pharmacy: 68, Supermarket: 66, Restaurant: 72, 'Coaching Centre': 65, 'Diagnostic Lab': 58 },
    marketGapScores: { Pharmacy: 66, Supermarket: 64, Restaurant: 68, 'Coaching Centre': 64, 'Diagnostic Lab': 57 }
  },
  {
    pincode: '600028', name: 'Guindy', districtName: 'Chennai',
    coordinates: { lat: 13.0067, lng: 80.2206 }, population: 62000,
    populationGrowth: 2.3, incomeLevel: 'High', urbanDevelopment: 80, searchTrends: 76,
    competitors: { Pharmacy: 2, Supermarket: 3, Restaurant: 8, 'Fitness Center': 2, Café: 4, 'Clinic': 1, Bakery: 2 },
    demandScores: { Pharmacy: 82, Supermarket: 80, Restaurant: 86, 'Fitness Center': 72, Café: 80, 'Clinic': 75, Bakery: 68 },
    marketGapScores: { Pharmacy: 80, Supermarket: 77, Restaurant: 78, 'Fitness Center': 70, Café: 76, 'Clinic': 74, Bakery: 66 }
  },
  {
    pincode: '641046', name: 'Peelamedu', districtName: 'Coimbatore',
    coordinates: { lat: 11.0241, lng: 76.9934 }, population: 58000,
    populationGrowth: 3.5, incomeLevel: 'Medium', urbanDevelopment: 74, searchTrends: 70,
    competitors: { Pharmacy: 2, Supermarket: 3, Restaurant: 7, 'Coaching Centre': 3, 'Fitness Center': 1, Café: 3, 'Electronics Store': 1 },
    demandScores: { Pharmacy: 76, Supermarket: 74, Restaurant: 80, 'Coaching Centre': 78, 'Fitness Center': 66, Café: 74, 'Electronics Store': 65 },
    marketGapScores: { Pharmacy: 74, Supermarket: 71, Restaurant: 73, 'Coaching Centre': 75, 'Fitness Center': 65, Café: 71, 'Electronics Store': 64 }
  },
  {
    pincode: '625008', name: 'Anna Nagar', districtName: 'Madurai',
    coordinates: { lat: 9.9342, lng: 78.1372 }, population: 42000,
    populationGrowth: 1.7, incomeLevel: 'Medium', urbanDevelopment: 66, searchTrends: 62,
    competitors: { Pharmacy: 2, Supermarket: 2, Restaurant: 5, 'Coaching Centre': 2, Café: 2 },
    demandScores: { Pharmacy: 70, Supermarket: 68, Restaurant: 74, 'Coaching Centre': 70, Café: 66 },
    marketGapScores: { Pharmacy: 68, Supermarket: 66, Restaurant: 69, 'Coaching Centre': 68, Café: 64 }
  },
  {
    pincode: '620002', name: 'Tennur', districtName: 'Tiruchirappalli',
    coordinates: { lat: 10.8150, lng: 78.6960 }, population: 45000,
    populationGrowth: 1.5, incomeLevel: 'Medium', urbanDevelopment: 64, searchTrends: 60,
    competitors: { Pharmacy: 2, Supermarket: 2, Restaurant: 5, 'Coaching Centre': 2, Bakery: 1 },
    demandScores: { Pharmacy: 68, Supermarket: 66, Restaurant: 72, 'Coaching Centre': 67, Bakery: 60 },
    marketGapScores: { Pharmacy: 66, Supermarket: 64, Restaurant: 67, 'Coaching Centre': 65, Bakery: 59 }
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing data
    await District.deleteMany();
    await Area.deleteMany();
    await BusinessCategory.deleteMany();
    console.log('Cleared existing data');

    // Insert districts
    const districts = await District.insertMany(districtsData);
    console.log(`Inserted ${districts.length} districts`);

    // Create a name-to-id mapping for district references
    const districtMap = {};
    for (const d of districts) {
      districtMap[d.name] = d._id;
    }

    // Insert business categories
    const categories = await BusinessCategory.insertMany(businessCategoriesData);
    console.log(`Inserted ${categories.length} business categories`);

    // Build area documents with district ObjectId references
    const areaDocs = areasData.map(a => ({
      pincode: a.pincode,
      name: a.name,
      district: districtMap[a.districtName],
      coordinates: a.coordinates,
      population: a.population,
      populationGrowth: a.populationGrowth,
      incomeLevel: a.incomeLevel,
      urbanDevelopment: a.urbanDevelopment,
      searchTrends: a.searchTrends,
      competitors: a.competitors,
      demandScores: a.demandScores,
      marketGapScores: a.marketGapScores
    }));

    const insertAreas = async (docs) => {
      const result = [];
      for (const d of docs) {
        const area = new Area(d);
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
        result.push(area);
      }
      return result;
    };
    const areas = await insertAreas(areaDocs);
    console.log(`Inserted ${areas.length} areas with calculated scores`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
