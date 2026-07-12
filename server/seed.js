const mongoose = require('mongoose');
const dotenv = require('dotenv');
const District = require('./models/District');
const BusinessCategory = require('./models/BusinessCategory');
const Area = require('./models/Area');
const calculateScores = require('./utils/calculateScores');
const logger = require('./utils/logger');

dotenv.config({ path: __dirname + '/.env' });

const districtsData = [
  { name: 'Ariyalur', headquarters: 'Ariyalur', area: 1949, population: 754894, density: 387, literacyRate: 71.62, urbanizationRate: 16.3 },
  { name: 'Chengalpattu', headquarters: 'Chengalpattu', area: 1757, population: 2556434, density: 1455, literacyRate: 83.52, urbanizationRate: 34.2 },
  { name: 'Chennai', headquarters: 'Chennai', area: 426, population: 7088000, density: 16639, literacyRate: 90.18, urbanizationRate: 100 },
  { name: 'Coimbatore', headquarters: 'Coimbatore', area: 4730, population: 3458045, density: 731, literacyRate: 84.25, urbanizationRate: 65.6 },
  { name: 'Cuddalore', headquarters: 'Cuddalore', area: 3678, population: 2605914, density: 708, literacyRate: 77.04, urbanizationRate: 25.3 },
  { name: 'Dharmapuri', headquarters: 'Dharmapuri', area: 4497, population: 1506843, density: 335, literacyRate: 68.55, urbanizationRate: 17.2 },
  { name: 'Dindigul', headquarters: 'Dindigul', area: 6266, population: 2159775, density: 345, literacyRate: 76.12, urbanizationRate: 27.4 },
  { name: 'Erode', headquarters: 'Erode', area: 5722, population: 2251744, density: 394, literacyRate: 79.16, urbanizationRate: 34.9 },
  { name: 'Kallakurichi', headquarters: 'Kallakurichi', area: 3520, population: 1736750, density: 493, literacyRate: 69.33, urbanizationRate: 14.1 },
  { name: 'Kancheepuram', headquarters: 'Kancheepuram', area: 4393, population: 3998252, density: 910, literacyRate: 85.57, urbanizationRate: 53.3 },
  { name: 'Kanniyakumari', headquarters: 'Nagercoil', area: 1684, population: 1873765, density: 1113, literacyRate: 91.65, urbanizationRate: 44.2 },
  { name: 'Karur', headquarters: 'Karur', area: 2895, population: 1064493, density: 368, literacyRate: 76.44, urbanizationRate: 25.4 },
  { name: 'Krishnagiri', headquarters: 'Krishnagiri', area: 5143, population: 1879809, density: 366, literacyRate: 73.01, urbanizationRate: 17.9 },
  { name: 'Madurai', headquarters: 'Madurai', area: 3741, population: 3038259, density: 812, literacyRate: 83.44, urbanizationRate: 56.2 },
  { name: 'Mayiladuthurai', headquarters: 'Mayiladuthurai', area: 1172, population: 918356, density: 784, literacyRate: 78.71, urbanizationRate: 18.4 },
  { name: 'Nagapattinam', headquarters: 'Nagapattinam', area: 1387, population: 697092, density: 503, literacyRate: 80.61, urbanizationRate: 25.3 },
  { name: 'Namakkal', headquarters: 'Namakkal', area: 3429, population: 1721179, density: 502, literacyRate: 76.84, urbanizationRate: 25.6 },
  { name: 'The Nilgiris', headquarters: 'Udhagamandalam', area: 2452, population: 735394, density: 300, literacyRate: 86.56, urbanizationRate: 35.8 },
  { name: 'Perambalur', headquarters: 'Perambalur', area: 1757, population: 565223, density: 322, literacyRate: 71.39, urbanizationRate: 14.2 },
  { name: 'Pudukkottai', headquarters: 'Pudukkottai', area: 4663, population: 1918735, density: 411, literacyRate: 72.76, urbanizationRate: 18.2 },
  { name: 'Ramanathapuram', headquarters: 'Ramanathapuram', area: 4123, population: 1337560, density: 324, literacyRate: 73.13, urbanizationRate: 16.5 },
  { name: 'Ranipet', headquarters: 'Ranipet', area: 2895, population: 1212275, density: 419, literacyRate: 80.05, urbanizationRate: 28.5 },
  { name: 'Salem', headquarters: 'Salem', area: 7636, population: 3482056, density: 456, literacyRate: 79.84, urbanizationRate: 43.7 },
  { name: 'Sivagangai', headquarters: 'Sivagangai', area: 4189, population: 1331481, density: 318, literacyRate: 72.44, urbanizationRate: 13.5 },
  { name: 'Tenkasi', headquarters: 'Tenkasi', area: 2916, population: 1308367, density: 449, literacyRate: 75.75, urbanizationRate: 20.8 },
  { name: 'Thanjavur', headquarters: 'Thanjavur', area: 3477, population: 2405890, density: 692, literacyRate: 82.06, urbanizationRate: 34.1 },
  { name: 'Theni', headquarters: 'Theni', area: 2889, population: 1245899, density: 431, literacyRate: 77.43, urbanizationRate: 25.6 },
  { name: 'Thiruvallur', headquarters: 'Thiruvallur', area: 7583, population: 3725697, density: 491, literacyRate: 84.07, urbanizationRate: 56.7 },
  { name: 'Thiruvarur', headquarters: 'Thiruvarur', area: 2161, population: 1264277, density: 585, literacyRate: 78.74, urbanizationRate: 15.6 },
  { name: 'Tiruchirappalli', headquarters: 'Tiruchirappalli', area: 4404, population: 2722290, density: 618, literacyRate: 83.23, urbanizationRate: 43.5 },
  { name: 'Tirunelveli', headquarters: 'Tirunelveli', area: 6823, population: 1628307, density: 239, literacyRate: 83.13, urbanizationRate: 32.4 },
  { name: 'Tirupathur', headquarters: 'Tirupathur', area: 3402, population: 1243684, density: 366, literacyRate: 72.04, urbanizationRate: 19.5 },
  { name: 'Tiruppur', headquarters: 'Tiruppur', area: 5106, population: 2479520, density: 486, literacyRate: 79.42, urbanizationRate: 45.9 },
  { name: 'Tiruvannamalai', headquarters: 'Tiruvannamalai', area: 6191, population: 2464875, density: 398, literacyRate: 73.48, urbanizationRate: 20.4 },
  { name: 'Thoothukudi', headquarters: 'Thoothukudi', area: 4621, population: 1750756, density: 379, literacyRate: 78.22, urbanizationRate: 33.7 },
  { name: 'Vellore', headquarters: 'Vellore', area: 6077, population: 3936331, density: 648, literacyRate: 79.20, urbanizationRate: 42.5 },
  { name: 'Viluppuram', headquarters: 'Viluppuram', area: 7194, population: 2543906, density: 354, literacyRate: 72.01, urbanizationRate: 16.5 },
  { name: 'Virudhunagar', headquarters: 'Virudhunagar', area: 4288, population: 1942288, density: 453, literacyRate: 76.58, urbanizationRate: 28.2 }
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

const landmarkTypes = ['Temple', 'Hospital', 'School', 'Market', 'Park', 'Station', 'Mall', 'Other'];

const generateLandmarks = (areaName, urbanDev) => {
  const landmarks = [];
  const count = urbanDev >= 70 ? 5 : urbanDev >= 40 ? 3 : 2;
  
  // Always add a market
  landmarks.push({ name: `${areaName} Market`, type: 'Market' });
  
  if (urbanDev >= 50) {
    landmarks.push({ name: `${areaName} Hospital`, type: 'Hospital' });
    landmarks.push({ name: `${areaName} Higher Secondary School`, type: 'School' });
  }
  
  if (urbanDev >= 70) {
    landmarks.push({ name: `${areaName} Bus Stand`, type: 'Station' });
    landmarks.push({ name: `${areaName} Park`, type: 'Park' });
  }
  
  if (urbanDev >= 80) {
    landmarks.push({ name: `${areaName} Mall`, type: 'Mall' });
  }
  
  // Add a temple
  landmarks.push({ name: `${areaName} Temple`, type: 'Temple' });
  
  return landmarks.slice(0, count);
};

// District coordinates lookup from districtConfig
const districtCoords = {};
const districtPopulations = {};
const districtUrbanization = {};

// First pass: build lookup maps from districtConfig
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

// Populate lookup maps from districtConfig
districtConfig.forEach(dc => {
  districtCoords[dc.name] = { lat: dc.lat, lng: dc.lng };
  districtPopulations[dc.name] = dc.popBase * 10; // approximate district population
  districtUrbanization[dc.name] = dc.urbanBase;
});

const generateAreasForDistrict = (config, districtId) => {
  const basePincode = config.pincodeBase;
  const areas = [];

  config.areas.forEach((areaName, idx) => {
    const pincode = String(basePincode + idx + 1);
    const urbanDev = Math.min(95, Math.max(20, config.urbanBase + Math.floor(Math.random() * 16 - 8)));
    const popVariation = Math.floor(Math.random() * 20000) - 10000;
    const population = Math.max(15000, config.popBase + popVariation);
    const growthRate = Math.round((0.5 + (urbanDev / 100) * 2.5 + (Math.random() * 1.2 - 0.6)) * 10) / 10;
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
      // Base demand first, then compute competition proportional to it
      const demand = Math.min(95, Math.max(40, Math.floor((population / 1000) * incomeMultiplier * (urbanDev / 50) * (0.6 + Math.random() * 0.8))));
      demandScores[cat] = demand;
      
      // Competition proportional to demand (high demand = more competitors) + area-specific randomness
      const demandFactor = (demand / 60) * (population / 30000) * (urbanDev / 50);
      const categoryMultiplier = 0.6 + (catIdx % 5) * 0.08; // slight variation per category type
      const count = Math.max(1, Math.round(demandFactor * categoryMultiplier * (0.4 + Math.random() * 1.2)));
      competitors[cat] = count;
      
      // Gap = unmet demand (demand minus competition saturation)
      const saturation = Math.min(95, count * (demand / 30));
      const gap = Math.max(0, Math.min(95, Math.round(demand - saturation + (Math.random() * 10 - 5))));
      marketGapScores[cat] = gap;
    });

    areas.push({
      pincode, name: areaName, district: districtId,
      coordinates: { lat: Math.round((config.lat + latOffset) * 10000) / 10000, lng: Math.round((config.lng + lngOffset) * 10000) / 10000 },
      population, populationGrowth: growthRate, incomeLevel, urbanDevelopment: urbanDev,
      searchTrends: Math.round(urbanDev * 0.8 + Math.random() * 10 + 5),
      competitors, demandScores, marketGapScores,
      literacyRate: Math.round(70 + (urbanDev / 100) * 20 + (Math.random() * 5 - 2.5)),
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
      trafficLevel: urbanDev >= 80 ? 'Very High' : urbanDev >= 60 ? 'High' : urbanDev >= 40 ? 'Medium' : 'Low',
      landmarks: generateLandmarks(areaName, urbanDev)
    });
  });

  return areas;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('MongoDB Connected');

    await District.deleteMany();
    await Area.deleteMany();
    await BusinessCategory.deleteMany();
    logger.info('Cleared existing data');

    // Insert districts with coordinates and real data
    const districtsToInsert = districtsData.map(d => ({
      ...d,
      coordinates: districtCoords[d.name] || { lat: 11.0, lng: 79.0 },
      population: d.population || districtPopulations[d.name] || 500000,
      urbanizationRate: d.urbanizationRate || districtUrbanization[d.name] || 30
    }));
    const districts = await District.insertMany(districtsToInsert);
    logger.info(`Inserted ${districts.length} districts`);

    const districtMap = {};
    for (const d of districts) {
      districtMap[d.name] = d._id;
    }

    const categories = await BusinessCategory.insertMany(businessCategoriesData);
    logger.info(`Inserted ${categories.length} business categories`);

    let totalAreas = 0;
    for (const config of districtConfig) {
      const districtId = districtMap[config.name];
      if (!districtId) {
        logger.warn(`Warning: No district ID for ${config.name}`);
        continue;
      }
      const areaDocs = generateAreasForDistrict(config, districtId);
      const preparedAreas = areaDocs.map(d => {
        const area = new Area(d);
        calculateScores(area);
        const obj = area.toObject();
        delete obj._id;
        return obj;
      });
      await Area.insertMany(preparedAreas);
      totalAreas += preparedAreas.length;
      logger.info(`  ${config.name}: ${preparedAreas.length} areas`);
    }

    logger.info(`Inserted ${totalAreas} areas with calculated scores`);
    logger.info('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
