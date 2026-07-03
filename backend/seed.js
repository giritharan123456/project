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

const allCategories = businessCategoriesData.map(c => c.name);

const districtConfig = [
  { name: 'Ariyalur', pincodeBase: 621700, lat: 11.14, lng: 79.08, urbanBase: 40, popBase: 35000, incomeBase: 'Medium', areas: ['Ariyalur Town', 'Udayarpalayam', 'Sendurai', 'Andimadam', 'Jayankondam', 'T. Palur', 'Elaiyur', 'Kunnam', 'Meensuruti', 'Vilandai'] },
  { name: 'Chengalpattu', pincodeBase: 603100, lat: 12.69, lng: 79.98, urbanBase: 55, popBase: 55000, incomeBase: 'Medium', areas: ['Chengalpattu Town', 'Tambaram', 'Maraimalai Nagar', 'Guduvanchery', 'Urapakkam', 'Padappai', 'Oragadam', 'Sriperumbudur', 'Mamallapuram', 'Tirukazhukundram'] },
  { name: 'Chennai', pincodeBase: 600001, lat: 13.08, lng: 80.27, urbanBase: 92, popBase: 120000, incomeBase: 'High', areas: ['T. Nagar', 'Anna Nagar', 'Thousand Lights', 'Guindy', 'Adyar', 'Velachery', 'Chromepet', 'Porur', 'Ambattur', 'Thoraipakkam'] },
  { name: 'Coimbatore', pincodeBase: 641001, lat: 11.02, lng: 76.96, urbanBase: 88, popBase: 110000, incomeBase: 'High', areas: ['Gandhipuram', 'RS Puram', 'Peelamedu', 'Saibaba Colony', 'Singanallur', 'Podanur', 'Kuniyamuthur', 'Kurichi', 'Sukrawar Pettai', 'Ramanathapuram'] },
  { name: 'Cuddalore', pincodeBase: 607001, lat: 11.75, lng: 79.75, urbanBase: 50, popBase: 45000, incomeBase: 'Medium', areas: ['Cuddalore Town', 'Vadalur', 'Neyveli', 'Kattumannarkoil', 'Panruti', 'Kurinjipadi', 'Tittagudi', 'Veppur', 'Mangalampettai', 'Srimushnam'] },
  { name: 'Dharmapuri', pincodeBase: 636700, lat: 12.13, lng: 78.16, urbanBase: 42, popBase: 32000, incomeBase: 'Medium', areas: ['Dharmapuri Town', 'Harur', 'Pappireddipatti', 'Palacode', 'Pennagaram', 'Kadathur', 'Marandahalli', 'Bargur', 'Morappur', 'Theerthamalai'] },
  { name: 'Dindigul', pincodeBase: 624001, lat: 10.35, lng: 77.95, urbanBase: 52, popBase: 48000, incomeBase: 'Medium', areas: ['Dindigul Town', 'Palani', 'Kodaikanal', 'Vedasandur', 'Natham', 'Nilakottai', 'Oddanchatram', 'Athalur', 'Batlagundu', 'Vadamadurai'] },
  { name: 'Erode', pincodeBase: 638001, lat: 11.34, lng: 77.72, urbanBase: 60, popBase: 50000, incomeBase: 'Medium', areas: ['Brough Road', 'Perundurai', 'Gobichettipalayam', 'Sathyamangalam', 'Bhavani', 'Kangeyam', 'Punjaipuliampatti', 'Nasiyanur', 'Modakurichi', 'Kodumudi'] },
  { name: 'Kallakurichi', pincodeBase: 606200, lat: 11.74, lng: 78.96, urbanBase: 38, popBase: 30000, incomeBase: 'Low', areas: ['Kallakurichi Town', 'Sankarapuram', 'Ulundurpettai', 'Tirukoilur', 'Rishivandiyam', 'Chinnasalem', 'Kachirampatti', 'Kalrayan Hills', 'Thenur', 'Moongilthuraipattu'] },
  { name: 'Kancheepuram', pincodeBase: 631500, lat: 12.84, lng: 79.70, urbanBase: 55, popBase: 52000, incomeBase: 'Medium', areas: ['Kancheepuram Town', 'Kanchipuram', 'Walajabad', 'Uthiramerur', 'Sriperumbudur', 'Acharapakkam', 'Kattankulathur', 'Poonamallee', 'Kundrathur', 'Mangadu'] },
  { name: 'Kanniyakumari', pincodeBase: 629001, lat: 8.09, lng: 77.55, urbanBase: 58, popBase: 42000, incomeBase: 'Medium', areas: ['Nagercoil', 'Kanniyakumari', 'Thuckalay', 'Kuzhithurai', 'Padmanabhapuram', 'Colachel', 'Kallukootam', 'Vencode', 'Eraniel', 'Marthandam'] },
  { name: 'Karur', pincodeBase: 639001, lat: 10.96, lng: 78.08, urbanBase: 48, popBase: 38000, incomeBase: 'Medium', areas: ['Karur Town', 'Kulithalai', 'Pugalur', 'Karurpettai', 'Thanthoni', 'Kadavur', 'Krishnarayapuram', 'Nangavaram', 'Aravakurichi', 'Manmangalam'] },
  { name: 'Krishnagiri', pincodeBase: 635001, lat: 12.52, lng: 78.21, urbanBase: 45, popBase: 35000, incomeBase: 'Medium', areas: ['Krishnagiri Town', 'Hosur', 'Rayakottai', 'Denkanikottai', 'Bargur', 'Uthangarai', 'Kelamangalam', 'Mathur', 'Shoolagiri', 'Samalpatti'] },
  { name: 'Madurai', pincodeBase: 625001, lat: 9.92, lng: 78.12, urbanBase: 82, popBase: 100000, incomeBase: 'High', areas: ['KK Nagar', 'Anna Nagar', 'Madurai Town', 'Tirumangalam', 'Thirupparankundram', 'Pudur', 'Villapuram', 'Simmakkal', 'Kochadai', 'Sathamangalam'] },
  { name: 'Mayiladuthurai', pincodeBase: 609001, lat: 11.10, lng: 79.65, urbanBase: 42, popBase: 32000, incomeBase: 'Medium', areas: ['Mayiladuthurai Town', 'Sirkazhi', 'Tharangambadi', 'Kuthalam', 'Kodangi', 'Poompuhar', 'Vaitheeswaran Koil', 'Nangur', 'Kadambur', 'Erukkur'] },
  { name: 'Nagapattinam', pincodeBase: 611001, lat: 10.77, lng: 79.84, urbanBase: 40, popBase: 30000, incomeBase: 'Low', areas: ['Nagapattinam Town', 'Kilvelur', 'Thirukkuvalai', 'Velankanni', 'Vedaranyam', 'Sikkal', 'Thirumarugal', 'Keezhaiyur', 'Kollidam', 'Poraiyar'] },
  { name: 'Namakkal', pincodeBase: 637001, lat: 11.22, lng: 78.17, urbanBase: 48, popBase: 38000, incomeBase: 'Medium', areas: ['Namakkal Town', 'Tiruchengode', 'Rasipuram', 'Paramathi', 'Velur', 'Sendamangalam', 'Kolli Hills', 'Pallipalayam', 'Kumarapalayam', 'Elachipalayam'] },
  { name: 'The Nilgiris', pincodeBase: 643001, lat: 11.41, lng: 76.69, urbanBase: 52, popBase: 28000, incomeBase: 'Medium', areas: ['Ooty', 'Coonoor', 'Kotagiri', 'Gudalur', 'Wellington', 'Aruvankadu', 'Hulikal', 'Ketti', 'Mettupalayam', 'Naduvattam'] },
  { name: 'Perambalur', pincodeBase: 621212, lat: 11.24, lng: 78.88, urbanBase: 38, popBase: 28000, incomeBase: 'Low', areas: ['Perambalur Town', 'Thuraiyur', 'Veppanthattai', 'Chettikulam', 'Kunnam', 'Alathur', 'Ladapuram', 'Agalur', 'Arumbavur', 'Eraiyur'] },
  { name: 'Pudukkottai', pincodeBase: 622001, lat: 10.38, lng: 78.82, urbanBase: 40, popBase: 32000, incomeBase: 'Low', areas: ['Pudukkottai Town', 'Aranthangi', 'Thirumayam', 'Ponnamaravathi', 'Karambakudi', 'Gandarvakottai', 'Alangudi', 'Kulathur', 'Annavasal', 'Kirantur'] },
  { name: 'Ramanathapuram', pincodeBase: 623501, lat: 9.37, lng: 78.84, urbanBase: 38, popBase: 30000, incomeBase: 'Low', areas: ['Ramanathapuram Town', 'Paramakudi', 'Rameswaram', 'Keelakarai', 'Mandapam', 'Sayalgudi', 'Mudukulathur', 'Kamuthi', 'Bogalur', 'Thiruvadanai'] },
  { name: 'Ranipet', pincodeBase: 632401, lat: 12.93, lng: 79.34, urbanBase: 48, popBase: 38000, incomeBase: 'Medium', areas: ['Ranipet Town', 'Walajapet', 'Arakkonam', 'Sholinghur', 'Nemili', 'Kaveripakkam', 'Melvisharam', 'Panapakkam', 'Pallikonda', 'Vilapakkam'] },
  { name: 'Salem', pincodeBase: 636001, lat: 11.66, lng: 78.15, urbanBase: 70, popBase: 75000, incomeBase: 'High', areas: ['Fairlands', 'Salem Town', 'Attur', 'Mettur', 'Omalur', 'Yercaud', 'Tharamangalam', 'Edappadi', 'Valapady', 'Konganapuram'] },
  { name: 'Sivagangai', pincodeBase: 630561, lat: 9.85, lng: 78.48, urbanBase: 42, popBase: 32000, incomeBase: 'Low', areas: ['Sivagangai Town', 'Karaikudi', 'Devakottai', 'Tirupathur', 'Manamadurai', 'Kalayarkoil', 'Ilaiyankudi', 'Kallal', 'Singampunari', 'Kanadukathan'] },
  { name: 'Tenkasi', pincodeBase: 627801, lat: 8.96, lng: 77.31, urbanBase: 42, popBase: 35000, incomeBase: 'Medium', areas: ['Tenkasi Town', 'Puliyangudi', 'Sankarankovil', 'Sivagiri', 'Narthamalai', 'Vasudevanallur', 'Surandai', 'Veerakeralampudur', 'Kadayanallur', 'Achampatti'] },
  { name: 'Thanjavur', pincodeBase: 613001, lat: 10.79, lng: 79.14, urbanBase: 58, popBase: 55000, incomeBase: 'Medium', areas: ['Thanjavur Town', 'Kumbakonam', 'Pattukkottai', 'Thiruvaiyaru', 'Orathanadu', 'Papanasam', 'Ayyampettai', 'Aduthurai', 'Swamimalai', 'Budalur'] },
  { name: 'Theni', pincodeBase: 625531, lat: 10.01, lng: 77.48, urbanBase: 48, popBase: 38000, incomeBase: 'Medium', areas: ['Theni Town', 'Bodinayakanur', 'Andipatti', 'Cumbum', 'Gudalur', 'Chinnamanur', 'Uthamapalayam', 'Periyakulam', 'Devadanapatti', 'Kambam'] },
  { name: 'Thiruvallur', pincodeBase: 602001, lat: 13.14, lng: 79.91, urbanBase: 52, popBase: 48000, incomeBase: 'Medium', areas: ['Thiruvallur Town', 'Poonamallee', 'Avadi', 'Pattabiram', 'Tiruttani', 'Pallipatu', 'Gunavathy', 'Kadambathur', 'Sevvapet', 'Pulicat'] },
  { name: 'Thiruvarur', pincodeBase: 610001, lat: 10.77, lng: 79.64, urbanBase: 40, popBase: 30000, incomeBase: 'Low', areas: ['Thiruvarur Town', 'Mannargudi', 'Needamangalam', 'Tirutturaipundi', 'Muthupet', 'Koradacheri', 'Nannilam', 'Kudavasal', 'Valangaiman', 'Peralam'] },
  { name: 'Tiruchirappalli', pincodeBase: 620001, lat: 10.81, lng: 78.69, urbanBase: 75, popBase: 90000, incomeBase: 'High', areas: ['Srirangam', 'Tennur', 'Tiruchirappalli Town', 'Thuvakudi', 'K.K. Nagar', 'Ponmalai', 'Kajamalai', 'Crawford', 'Woraiyur', 'Samayapuram'] },
  { name: 'Tirunelveli', pincodeBase: 627001, lat: 8.73, lng: 77.70, urbanBase: 65, popBase: 65000, incomeBase: 'Medium', areas: ['Tirunelveli Town', 'Palayamkottai', 'Pavoorchatram', 'Ambasamudram', 'Pappakudi', 'Valliyoor', 'Nanguneri', 'Cheranmahadevi', 'Kalakkad', 'Manur'] },
  { name: 'Tirupathur', pincodeBase: 635601, lat: 12.49, lng: 78.58, urbanBase: 40, popBase: 30000, incomeBase: 'Low', areas: ['Tirupathur Town', 'Vaniyambadi', 'Ambur', 'Gudiyatham', 'Pernambut', 'Natrampalli', 'Alangayam', 'Madhanur', 'Odugathur', 'Jolarpet'] },
  { name: 'Tiruppur', pincodeBase: 641601, lat: 11.10, lng: 77.34, urbanBase: 65, popBase: 65000, incomeBase: 'Medium', areas: ['Tiruppur Town', 'Avinashi', 'Kangeyam', 'Dharapuram', 'Udumalaipettai', 'Palladam', 'Mulanur', 'Vellakoil', 'Kaniyur', 'Vijayamangalam'] },
  { name: 'Tiruvannamalai', pincodeBase: 606601, lat: 12.22, lng: 79.07, urbanBase: 48, popBase: 42000, incomeBase: 'Medium', areas: ['Tiruvannamalai Town', 'Arni', 'Chengam', 'Polur', 'Vandavasi', 'Cheyyar', 'Jamunamarathur', 'Arani', 'Kannamangalam', 'Vembakkam'] },
  { name: 'Thoothukudi', pincodeBase: 628001, lat: 8.78, lng: 78.13, urbanBase: 58, popBase: 52000, incomeBase: 'Medium', areas: ['Thoothukudi Town', 'Kovilpatti', 'Tiruchendur', 'Kayalpattinam', 'Srivaikuntam', 'Eral', 'Pudur', 'Ottapidaram', 'Sathankulam', 'Nazareth'] },
  { name: 'Vellore', pincodeBase: 632001, lat: 12.92, lng: 79.13, urbanBase: 62, popBase: 58000, incomeBase: 'Medium', areas: ['Vellore Town', 'Katpadi', 'Gudiyatham', 'Ambur', 'Sathuvacheri', 'Arcot', 'Walajapet', 'Pallikonda', 'Pernambut', 'Odugathur'] },
  { name: 'Viluppuram', pincodeBase: 605601, lat: 11.94, lng: 79.49, urbanBase: 42, popBase: 35000, incomeBase: 'Low', areas: ['Viluppuram Town', 'Tindivanam', 'Gingee', 'Vikravandi', 'Vanur', 'Marakkanam', 'Ulundurpettai', 'Arakandanallur', 'Mugaiyur', 'Chithamur'] },
  { name: 'Virudhunagar', pincodeBase: 626001, lat: 9.58, lng: 77.96, urbanBase: 48, popBase: 40000, incomeBase: 'Medium', areas: ['Virudhunagar Town', 'Sivakasi', 'Rajapalayam', 'Sattur', 'Srivilliputhur', 'Aruppukottai', 'Kariapatti', 'Tiruchuli', 'Nattarsankottai', 'Vembakottai'] }
];

const calculateScores = (area) => {
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
};

const generateAreasForDistrict = (config, districtId) => {
  const basePincode = config.pincodeBase;
  const areas = [];

  config.areas.forEach((areaName, idx) => {
    const pincode = String(basePincode + idx + 1);
    const urbanDev = Math.min(95, Math.max(20, config.urbanBase + Math.floor(Math.random() * 16 - 8)));
    const popVariation = Math.floor(Math.random() * 20000) - 10000;
    const population = Math.max(15000, config.popBase + popVariation);
    const growthRate = Math.round((0.5 + (urbanDev / 100) * 2.5) * 10) / 10;
    const incomeOptions = urbanDev >= 70 ? ['High'] : urbanDev >= 40 ? ['Medium', 'High'] : ['Low', 'Medium'];
    const incomeLevel = config.incomeBase === 'High' ? 'High' : incomeOptions[Math.floor(Math.random() * incomeOptions.length)];
    const latOffset = (Math.random() * 0.2) - 0.1;
    const lngOffset = (Math.random() * 0.2) - 0.1;
    const categoryCount = Math.min(allCategories.length, Math.floor(urbanDev / 15) + 4);
    const selectedCats = allCategories.slice(0, categoryCount);
    const competitors = {};
    const demandScores = {};
    const marketGapScores = {};
    const incomeMultiplier = incomeLevel === 'High' ? 1.3 : incomeLevel === 'Medium' ? 1.0 : 0.7;

    selectedCats.forEach((cat, catIdx) => {
      const count = Math.max(1, Math.floor((population / 8000) * (urbanDev / 30) * ((catIdx + 1) * 0.8)));
      competitors[cat] = count;
      const demand = Math.min(95, Math.max(40, Math.floor((population / 800) * incomeMultiplier * (urbanDev / 40) * (1 + (catIdx * 0.05)))));
      demandScores[cat] = demand;
      const gap = Math.max(0, Math.min(95, demand - (count * 2) + Math.floor(Math.random() * 8 - 4)));
      marketGapScores[cat] = gap;
    });

    areas.push({
      pincode, name: areaName, district: districtId,
      coordinates: { lat: Math.round((config.lat + latOffset) * 10000) / 10000, lng: Math.round((config.lng + lngOffset) * 10000) / 10000 },
      population, populationGrowth: growthRate, incomeLevel, urbanDevelopment: urbanDev,
      searchTrends: Math.round(urbanDev * 0.8 + Math.random() * 10 + 5),
      competitors, demandScores, marketGapScores
    });
  });

  return areas;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    await District.deleteMany();
    await Area.deleteMany();
    await BusinessCategory.deleteMany();
    console.log('Cleared existing data');

    const districts = await District.insertMany(districtsData);
    console.log(`Inserted ${districts.length} districts`);

    const districtMap = {};
    for (const d of districts) {
      districtMap[d.name] = d._id;
    }

    const categories = await BusinessCategory.insertMany(businessCategoriesData);
    console.log(`Inserted ${categories.length} business categories`);

    let totalAreas = 0;
    for (const config of districtConfig) {
      const districtId = districtMap[config.name];
      if (!districtId) {
        console.log(`Warning: No district ID for ${config.name}`);
        continue;
      }
      const areaDocs = generateAreasForDistrict(config, districtId);
      const areas = [];
      for (const d of areaDocs) {
        const area = new Area(d);
        calculateScores(area);
        await area.save();
        areas.push(area);
      }
      totalAreas += areas.length;
      console.log(`  ${config.name}: ${areas.length} areas`);
    }

    console.log(`\nInserted ${totalAreas} areas with calculated scores`);
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
