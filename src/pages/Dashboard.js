import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import ChartsSection from '../components/ChartsSection';
import MapSection from '../components/MapSection';
import TopAreas from '../components/TopAreas';
import DistrictSelector from '../components/DistrictSelector';
import RealTimeDashboard from '../components/RealTimeDashboard';
import Competitors from '../components/Competitors';
import AdvancedKPICards from '../components/AdvancedKPICards';
import BusinessInsights from '../components/BusinessInsights';
import AdvancedForecasting from '../components/AdvancedForecasting';
import OpportunityHeatMap from '../components/OpportunityHeatMap';
import AdvancedFilters from '../components/AdvancedFilters';
import AnalyticsPanel from '../components/AnalyticsPanel';
import EnhancedExport from '../components/EnhancedExport';

function Dashboard() {
  const { isDarkMode } = useTheme();
  const [selectedDistrict, setSelectedDistrict] = useState('Chennai');
  const [searchPincode, setSearchPincode] = useState('');
  const [selectedBusinessCategory, setSelectedBusinessCategory] = useState('all');
  
  const tamilNaduData = {
    districts: {
      'Chennai': {
        areas: ['T. Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'Mylapore', 'Perambur', 'Ambattur', 'Porur'],
        population: 4646732,
        totalBusinesses: 12500
      },
      'Coimbatore': {
        areas: ['Gandhipuram', 'RS Puram', 'Peelamedu', 'Saravanampatti', 'Town Hall', 'Singanallur'],
        population: 1601438,
        totalBusinesses: 8500
      },
      'Madurai': {
        areas: ['KK Nagar', 'Anna Nagar', 'Goripalayam', 'Thilagar Thidal', 'Villapuram'],
        population: 1561129,
        totalBusinesses: 6200
      },
      'Tiruchirappalli': {
        areas: ['Srirangam', 'Cantonment', 'Woraiyur', 'K.K. Nagar', 'Thillai Nagar'],
        population: 916857,
        totalBusinesses: 4800
      },
      'Salem': {
        areas: ['Fairlands', 'Aragalur', 'Mettur', 'Yercaud', 'Attur'],
        population: 829267,
        totalBusinesses: 4100
      },
      'Erode': {
        areas: ['Brough Road', 'Kasipalayam', 'Vellalar Street', 'Nanjundapuram'],
        population: 498129,
        totalBusinesses: 3500
      }
    },
    businessCategories: [
      { name: 'Pharmacy', demand: 85, supply: 60, gap: 25 },
      { name: 'Supermarket', demand: 88, supply: 75, gap: 13 },
      { name: 'Restaurant', demand: 80, supply: 55, gap: 25 },
      { name: 'Coaching Centre', demand: 85, supply: 40, gap: 45 },
      { name: 'Clothing', demand: 70, supply: 50, gap: 20 },
      { name: 'Electronics', demand: 65, supply: 45, gap: 20 },
      { name: 'Education', demand: 75, supply: 40, gap: 35 },
      { name: 'Healthcare', demand: 88, supply: 50, gap: 38 }
    ],
    pincodeData: [
      { 
        pincode: '600100', 
        area: 'T. Nagar', 
        district: 'Chennai', 
        lat: 13.0417, 
        lng: 80.2356, 
        population: 120000, 
        populationGrowth: 3.2,
        incomeLevel: 'High',
        competitors: { 'Pharmacy': 4, 'Restaurant': 18, 'Supermarket': 6, 'Coaching Centre': 3, 'Clothing': 12, 'Electronics': 8, 'Education': 5, 'Healthcare': 3 },
        demandScores: { 'Pharmacy': 92, 'Restaurant': 85, 'Supermarket': 88, 'Coaching Centre': 85, 'Clothing': 78, 'Electronics': 72, 'Education': 80, 'Healthcare': 88 },
        marketGapScores: { 'Pharmacy': 88, 'Restaurant': 67, 'Supermarket': 82, 'Coaching Centre': 82, 'Clothing': 66, 'Electronics': 57, 'Education': 75, 'Healthcare': 85 },
        urbanDevelopment: 85,
        searchTrends: 78
      },
      { 
        pincode: '600040', 
        area: 'Anna Nagar', 
        district: 'Chennai', 
        lat: 13.0857, 
        lng: 80.2106, 
        population: 180000, 
        populationGrowth: 2.8,
        incomeLevel: 'High',
        competitors: { 'Pharmacy': 8, 'Restaurant': 25, 'Supermarket': 12, 'Coaching Centre': 5, 'Clothing': 15, 'Electronics': 10, 'Education': 7, 'Healthcare': 4 },
        demandScores: { 'Pharmacy': 88, 'Restaurant': 82, 'Supermarket': 85, 'Coaching Centre': 80, 'Clothing': 75, 'Electronics': 70, 'Education': 78, 'Healthcare': 85 },
        marketGapScores: { 'Pharmacy': 80, 'Restaurant': 57, 'Supermarket': 73, 'Coaching Centre': 75, 'Clothing': 60, 'Electronics': 55, 'Education': 71, 'Healthcare': 81 },
        urbanDevelopment: 90,
        searchTrends: 82
      },
      { 
        pincode: '641035', 
        area: 'Gandhipuram', 
        district: 'Coimbatore', 
        lat: 11.0168, 
        lng: 76.9558, 
        population: 95000, 
        populationGrowth: 4.1,
        incomeLevel: 'Medium',
        competitors: { 'Pharmacy': 6, 'Restaurant': 15, 'Supermarket': 6, 'Coaching Centre': 4, 'Clothing': 10, 'Electronics': 7, 'Education': 4, 'Healthcare': 3 },
        demandScores: { 'Pharmacy': 85, 'Restaurant': 80, 'Supermarket': 89, 'Coaching Centre': 82, 'Clothing': 72, 'Electronics': 68, 'Education': 78, 'Healthcare': 83 },
        marketGapScores: { 'Pharmacy': 79, 'Restaurant': 65, 'Supermarket': 83, 'Coaching Centre': 78, 'Clothing': 62, 'Electronics': 58, 'Education': 74, 'Healthcare': 80 },
        urbanDevelopment: 75,
        searchTrends: 70
      },
      { 
        pincode: '641002', 
        area: 'RS Puram', 
        district: 'Coimbatore', 
        lat: 11.0047, 
        lng: 76.9635, 
        population: 85000, 
        populationGrowth: 3.5,
        incomeLevel: 'High',
        competitors: { 'Pharmacy': 5, 'Restaurant': 12, 'Supermarket': 5, 'Coaching Centre': 3, 'Clothing': 9, 'Electronics': 6, 'Education': 4, 'Healthcare': 2 },
        demandScores: { 'Pharmacy': 82, 'Restaurant': 78, 'Supermarket': 86, 'Coaching Centre': 85, 'Clothing': 74, 'Electronics': 70, 'Education': 82, 'Healthcare': 86 },
        marketGapScores: { 'Pharmacy': 77, 'Restaurant': 66, 'Supermarket': 81, 'Coaching Centre': 82, 'Clothing': 65, 'Electronics': 61, 'Education': 78, 'Healthcare': 84 },
        urbanDevelopment: 80,
        searchTrends: 75
      },
      { 
        pincode: '625020', 
        area: 'KK Nagar', 
        district: 'Madurai', 
        lat: 9.9252, 
        lng: 78.1197, 
        population: 110000, 
        populationGrowth: 2.9,
        incomeLevel: 'Medium',
        competitors: { 'Pharmacy': 7, 'Restaurant': 20, 'Supermarket': 8, 'Coaching Centre': 6, 'Clothing': 14, 'Electronics': 9, 'Education': 5, 'Healthcare': 4 },
        demandScores: { 'Pharmacy': 80, 'Restaurant': 75, 'Supermarket': 82, 'Coaching Centre': 85, 'Clothing': 70, 'Electronics': 65, 'Education': 80, 'Healthcare': 84 },
        marketGapScores: { 'Pharmacy': 73, 'Restaurant': 55, 'Supermarket': 74, 'Coaching Centre': 79, 'Clothing': 56, 'Electronics': 52, 'Education': 75, 'Healthcare': 80 },
        urbanDevelopment: 70,
        searchTrends: 68
      },
      { 
        pincode: '620018', 
        area: 'Srirangam', 
        district: 'Tiruchirappalli', 
        lat: 10.8586, 
        lng: 78.6946, 
        population: 75000, 
        populationGrowth: 3.8,
        incomeLevel: 'Medium',
        competitors: { 'Pharmacy': 3, 'Restaurant': 10, 'Supermarket': 4, 'Coaching Centre': 3, 'Clothing': 8, 'Electronics': 5, 'Education': 3, 'Healthcare': 2 },
        demandScores: { 'Pharmacy': 85, 'Restaurant': 72, 'Supermarket': 84, 'Coaching Centre': 85, 'Clothing': 68, 'Electronics': 62, 'Education': 83, 'Healthcare': 87 },
        marketGapScores: { 'Pharmacy': 82, 'Restaurant': 62, 'Supermarket': 80, 'Coaching Centre': 82, 'Clothing': 60, 'Electronics': 54, 'Education': 80, 'Healthcare': 85 },
        urbanDevelopment: 65,
        searchTrends: 65
      },
      { 
        pincode: '636004', 
        area: 'Fairlands', 
        district: 'Salem', 
        lat: 11.6643, 
        lng: 78.1460, 
        population: 80000, 
        populationGrowth: 3.0,
        incomeLevel: 'Medium',
        competitors: { 'Pharmacy': 5, 'Restaurant': 14, 'Supermarket': 5, 'Coaching Centre': 4, 'Clothing': 11, 'Electronics': 7, 'Education': 4, 'Healthcare': 3 },
        demandScores: { 'Pharmacy': 78, 'Restaurant': 70, 'Supermarket': 80, 'Coaching Centre': 78, 'Clothing': 65, 'Electronics': 60, 'Education': 76, 'Healthcare': 82 },
        marketGapScores: { 'Pharmacy': 73, 'Restaurant': 56, 'Supermarket': 75, 'Coaching Centre': 74, 'Clothing': 54, 'Electronics': 50, 'Education': 72, 'Healthcare': 79 },
        urbanDevelopment: 68,
        searchTrends: 62
      },
      { 
        pincode: '638001', 
        area: 'Brough Road', 
        district: 'Erode', 
        lat: 11.3410, 
        lng: 77.7172, 
        population: 65000, 
        populationGrowth: 3.3,
        incomeLevel: 'Medium',
        competitors: { 'Pharmacy': 4, 'Restaurant': 11, 'Supermarket': 4, 'Coaching Centre': 3, 'Clothing': 9, 'Electronics': 6, 'Education': 3, 'Healthcare': 2 },
        demandScores: { 'Pharmacy': 75, 'Restaurant': 68, 'Supermarket': 78, 'Coaching Centre': 80, 'Clothing': 63, 'Electronics': 58, 'Education': 77, 'Healthcare': 81 },
        marketGapScores: { 'Pharmacy': 71, 'Restaurant': 57, 'Supermarket': 74, 'Coaching Centre': 77, 'Clothing': 54, 'Electronics': 49, 'Education': 74, 'Healthcare': 79 },
        urbanDevelopment: 72,
        searchTrends: 60
      }
    ]
  };

  const [marketData, setMarketData] = useState(tamilNaduData);

  const handleSearch = (pincode) => {
    setSearchPincode(pincode);
  };

  const handleFilter = (category) => {
    setSelectedBusinessCategory(category);
  };

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
  };

  const currentDistrictData = marketData.districts[selectedDistrict];
  const filteredPincodeData = marketData.pincodeData.filter(pincode => 
    pincode.district === selectedDistrict &&
    (searchPincode === '' || pincode.pincode.includes(searchPincode))
  );

  const rankingData = filteredPincodeData.flatMap(pincode => 
    Object.keys(pincode.competitors).map(category => ({
      rank: 0,
      pincode: pincode.pincode,
      area: pincode.area,
      businessCategory: category,
      competitors: pincode.competitors[category],
      demandScore: pincode.demandScores[category],
      marketGapScore: pincode.marketGapScores[category]
    }))
  ).sort((a, b) => b.marketGapScore - a.marketGapScore)
   .map((item, index) => ({ ...item, rank: index + 1 }));

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-bg-dark' : 'bg-bg-light'}`}>
      <motion.header 
        className={`py-8 px-8 border-b shadow-lg ${isDarkMode ? 'bg-card-dark border-border-dark shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-card-light border-border-light shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-primary-blue to-primary-purple bg-clip-text text-transparent ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>🇮🇳 Tamil Nadu Market Gap Finder</h1>
        <p className={`text-base opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Pincode-wise underserved business opportunities analysis</p>
      </motion.header>

      <div className="max-w-[1600px] mx-auto p-8">
        <motion.div 
          className="flex justify-between items-center mb-8 gap-6 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <DistrictSelector 
            districts={Object.keys(marketData.districts)}
            selectedDistrict={selectedDistrict}
            onDistrictChange={handleDistrictChange}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <SearchBar onSearch={handleSearch} placeholder={`Search by pincode in ${selectedDistrict}...`} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FilterPanel 
            onFilter={handleFilter} 
            selectedCategory={selectedBusinessCategory}
            categories={marketData.businessCategories}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <AdvancedFilters pincodeData={filteredPincodeData} onFilterChange={() => {}} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <AdvancedKPICards data={filteredPincodeData} selectedDistrict={selectedDistrict} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <RealTimeDashboard data={filteredPincodeData} />
        </motion.div>
        
        <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6 mt-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ChartsSection 
              businessCategories={marketData.businessCategories}
              selectedCategory={selectedBusinessCategory}
              pincodeData={filteredPincodeData}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <MapSection 
              pincodeData={filteredPincodeData}
              selectedDistrict={selectedDistrict}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <TopAreas 
              pincodeData={filteredPincodeData}
              businessCategories={marketData.businessCategories}
            />
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <Competitors />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <BusinessInsights 
            pincodeData={filteredPincodeData} 
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
        >
          <AdvancedForecasting 
            pincodeData={filteredPincodeData} 
            businessCategories={marketData.businessCategories}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <OpportunityHeatMap 
            pincodeData={filteredPincodeData}
            selectedDistrict={selectedDistrict}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.75 }}
        >
          <AnalyticsPanel 
            pincodeData={filteredPincodeData}
            businessCategories={marketData.businessCategories}
            selectedDistrict={selectedDistrict}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <EnhancedExport 
            data={filteredPincodeData}
            selectedDistrict={selectedDistrict}
            businessCategories={marketData.businessCategories}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
