import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useDistrict } from '../contexts/DistrictContext';
import { usePincode } from '../contexts/PincodeContext';
import { districtsAPI, areasAPI } from '../services/api';
import EmptyState from '../components/EmptyState';
import {
  transformAreaToPincodeData,
  getBusinessCategoriesFromArea,
  hasAreaData,
} from '../utils/dataUtils';
import SearchBar from '../components/SearchBar';
import ChartsSection from '../components/ChartsSection';
import MapSection from '../components/MapSection';
import TopAreas from '../components/TopAreas';
import DistrictSelector from '../components/DistrictSelector';
import QuickStats from '../components/QuickStats';
import HelpGuide from '../components/HelpGuide';
import PageTransition from '../components/PageTransition';
import FloatingAIChat from '../components/FloatingAIChat';
import ScrollToTop from '../components/ScrollToTop';
import { PageSkeleton } from '../components/Skeleton';
import RecentSearches from '../components/RecentSearches';
import FilterPanel from '../components/FilterPanel';
import AdvancedKPICards from '../components/AdvancedKPICards';
import RealTimeDashboard from '../components/RealTimeDashboard';
import AdvancedFilters from '../components/AdvancedFilters';
import Competitors from '../components/Competitors';
import BusinessInsights from '../components/BusinessInsights';
import AdvancedForecasting from '../components/AdvancedForecasting';
import OpportunityHeatMap from '../components/OpportunityHeatMap';
import AnalyticsPanel from '../components/AnalyticsPanel';
import EnhancedExport from '../components/EnhancedExport';
import RecentlyViewed from '../components/RecentlyViewed';

function Dashboard() {
  const { isDarkMode } = useTheme();
  const { selectedDistrict, setSelectedDistrict, districts, setDistricts } = useDistrict();
  const { selectedPincode, setSelectedPincode } = usePincode();
  const [searchParams] = useSearchParams();
  const [searchPincode, setSearchPincode] = useState(searchParams.get('search') || '');
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem('recentSearches') || '[]'); } catch { return []; }
  });
  const [selectedBusinessCategory, setSelectedBusinessCategory] = useState('all');
  const [searchError, setSearchError] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const districtsResponse = await districtsAPI.getAll();
        const areasResponse = await areasAPI.getAll();
        
        setDistricts(districtsResponse.data || []);
        setAreas(areasResponse.data || []);
        
        // Only auto-select first district if none is already selected
        if (!selectedDistrict && (districtsResponse.data || []).length > 0) {
          setSelectedDistrict(districtsResponse.data[0]._id);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Dashboard: Error fetching data', err);
        setError(`Failed to load data: ${err.message || 'Unknown error'}`);
        setLoading(false);
        // Set empty data to prevent loading state from getting stuck
        setDistricts([]);
        setAreas([]);
      }
    };

    fetchData();
  }, []); // Empty dependency array - only run on mount

  if (loading) {
    return <PageSkeleton />;
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <div className="text-center max-w-md p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Unable to Load Data</h1>
          <p className={`text-lg mb-6 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handleSearch = async (pincode) => {
    setSearchPincode(pincode);
    setSelectedPincode(pincode);
    setSearchError(null);

    // Fetch from backend — triggers Census + Google Maps APIs if not in database
    try {
      setSearchLoading(true);
      const response = await areasAPI.getByPincode(pincode);
      if (response.data) {
        setAreas(prevAreas => {
          const existingIndex = prevAreas.findIndex(a => a.pincode === pincode);
          if (existingIndex >= 0) {
            const updatedAreas = [...prevAreas];
            updatedAreas[existingIndex] = response.data;
            return updatedAreas;
          }
          return [...prevAreas, response.data];
        });
      } else {
        setSearchError(`Data for pincode ${pincode} will be loaded from government APIs. Please try again or select a different pincode.`);
      }
    } catch (err) {
      console.error('Error fetching area data for pincode:', pincode, err);
      setSearchError(err.message || `Data for pincode ${pincode} will be loaded from government APIs. Please try again or select a different pincode.`);
    } finally {
      setSearchLoading(false);
    }

    if (pincode && !recentSearches.includes(pincode)) {
      const updated = [pincode, ...recentSearches.slice(0, 4)];
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleFilter = (category) => {
    setSelectedBusinessCategory(category);
  };

  const currentDistrict = districts.find(d => d._id === selectedDistrict);
  const currentDistrictName = currentDistrict?.name;

  const pincodeData = useMemo(() =>
    areas.map(transformAreaToPincodeData).filter(Boolean),
    [areas]
  );

  const filteredPincodeData = useMemo(() =>
    pincodeData.filter(p => {
      const matchesDistrict = p.district === currentDistrictName;
      const matchesPincode = selectedPincode ? p.pincode === selectedPincode : true;
      const matchesSearch = searchPincode === '' || p.pincode.includes(searchPincode);
      return matchesDistrict && matchesPincode && matchesSearch;
    }),
    [pincodeData, currentDistrictName, selectedPincode, searchPincode]
  );

  const displayData = searchPincode
    ? filteredPincodeData.filter(p => p.pincode.includes(searchPincode) || p.areaName?.toLowerCase().includes(searchPincode.toLowerCase()))
    : selectedPincode ? filteredPincodeData.filter(p => p.pincode === selectedPincode) : filteredPincodeData;

  const categorySourceArea = useMemo(() =>
    selectedPincode
      ? areas.find(a => a.pincode === selectedPincode)
      : displayData.length > 0
        ? areas.find(a => a.pincode === displayData[0]?.pincode)
        : null,
    [selectedPincode, areas, displayData]
  );
  const businessCategories = getBusinessCategoriesFromArea(categorySourceArea);

  return (
    <PageTransition>
      <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <motion.header 
          className={`py-8 px-8 border-b shadow-lg ${isDarkMode ? 'bg-[#1e293b] border-[#334155] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-[#ffffff] border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={`text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>🚀 MarketVision AI</h1>
          <p className={`text-sm md:text-base opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Pincode-wise underserved business opportunities analysis</p>
        </motion.header>

        <div className="max-w-[1600px] mx-auto p-4 md:p-8">
          <motion.div 
            className="flex justify-between items-center mb-8 gap-6 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <DistrictSelector 
              districts={districts}
            />
          </motion.div>

          {/* District Summary Card - REMOVED */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mb-4"
          >
            <QuickStats pincodeData={displayData} selectedDistrict={currentDistrictName} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-4"
          >
            <SearchBar 
              onSearch={handleSearch} 
              placeholder={`Search by pincode in ${currentDistrictName || 'Tamil Nadu'}...`}
              suggestions={displayData.map(p => p.pincode).filter(Boolean)}
            />
            {searchLoading && (
              <p className={`mt-2 text-sm ${isDarkMode ? 'text-[#f1f5f9] opacity-70' : 'text-[#1e293b] opacity-70'}`}>
                Fetching census and map data from government APIs...
              </p>
            )}
            {searchError && (
              <p className="mt-2 text-sm text-red-500">{searchError}</p>
            )}
          </motion.div>

          {!hasAreaData(displayData) && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <EmptyState
                type="noData"
                message="No area data loaded yet. Search a pincode above to fetch real census and map data from the backend. Data is stored after the first search."
              />
            </motion.div>
          )}

          {hasAreaData(displayData) && (
          <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6 mt-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <ChartsSection 
                businessCategories={businessCategories}
                selectedCategory="all"
                pincodeData={displayData}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <MapSection 
                pincodeData={displayData}
                selectedDistrict={currentDistrictName}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <TopAreas 
                pincodeData={displayData}
                businessCategories={businessCategories}
              />
            </motion.div>
          </div>
          )}

          {hasAreaData(displayData) && (
          <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.17 }}
            className="mb-4"
          >
            <RecentSearches
              searches={recentSearches}
              onSearch={handleSearch}
              onClear={handleClearRecentSearches}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4"
          >
            <FilterPanel
              onFilter={handleFilter}
              selectedCategory={selectedBusinessCategory}
              categories={businessCategories}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-4"
          >
            <AdvancedKPICards data={displayData} selectedDistrict={currentDistrictName} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mb-4"
          >
            <RealTimeDashboard data={displayData} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-4"
          >
            <AdvancedFilters pincodeData={displayData} onFilterChange={() => {}} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mb-4"
          >
            <Competitors pincodeData={displayData} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-4"
          >
            <BusinessInsights
              pincodeData={displayData}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-4"
          >
            <RecentlyViewed isDarkMode={isDarkMode} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="mb-4"
          >
            <AdvancedForecasting
              pincodeData={displayData}
              businessCategories={businessCategories}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mb-4"
          >
            <OpportunityHeatMap
              pincodeData={displayData}
              selectedDistrict={currentDistrictName}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.5, delay: 0.75 }}
            className="mb-4"
          >
            <AnalyticsPanel
              pincodeData={displayData}
              businessCategories={businessCategories}
              selectedDistrict={currentDistrictName}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mb-4"
          >
            <EnhancedExport
              data={displayData}
              selectedDistrict={currentDistrictName}
              businessCategories={businessCategories}
            />
          </motion.div>
          </>
          )}
        </div>
        
        <ScrollToTop />
        <HelpGuide />
        <FloatingAIChat />
      </div>
    </PageTransition>
  );
}

export default Dashboard;
