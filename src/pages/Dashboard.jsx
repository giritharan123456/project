import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
import SearchResultCard from '../components/SearchResultCard';
import ChartsSection from '../components/ChartsSection';
import MapSection from '../components/MapSection';
import DistrictSelector from '../components/DistrictSelector';
import HelpGuide from '../components/HelpGuide';
import PageTransition from '../components/PageTransition';
import FloatingAIChat from '../components/FloatingAIChat';
import ScrollToTop from '../components/ScrollToTop';
import { PageSkeleton } from '../components/Skeleton';
import Competitors from '../components/Competitors';
import BusinessInsights from '../components/BusinessInsights';
import AdvancedForecasting from '../components/AdvancedForecasting';
import OpportunityHeatMap from '../components/OpportunityHeatMap';
import AnalyticsPanel from '../components/AnalyticsPanel';
import EnhancedExport from '../components/EnhancedExport';
import HeroBanner from '../components/HeroBanner';
import QuickActions from '../components/QuickActions';
import ExecutiveSummary from '../components/ExecutiveSummary';
import TopPerformers from '../components/TopPerformers';

function Dashboard() {
  const { isDarkMode } = useTheme();
  const { selectedDistrict, setSelectedDistrict, districts, setDistricts } = useDistrict();
  const { selectedPincode, setSelectedPincode } = usePincode();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchPincode, setSearchPincode] = useState('');
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchVal = searchParams.get('search');
    if (searchVal) {
      setSearchPincode(searchVal);
      setSelectedPincode(searchVal);
      (async () => {
        try {
          setSearchLoading(true);
          setSearchError(null);
          const response = await areasAPI.getByPincode(searchVal);
          if (response.data) {
            if (response.data.district?._id && response.data.district._id !== selectedDistrict) {
              setSelectedDistrict(response.data.district._id);
            }
            setAreas(prev => {
              const idx = prev.findIndex(a => a.pincode === searchVal);
              if (idx >= 0) { const updated = [...prev]; updated[idx] = response.data; return updated; }
              return [...prev, response.data];
            });
          }
        } catch (err) {
          setSearchError(err.message || `Data for pincode ${searchVal} will be loaded soon.`);
        } finally {
          setSearchLoading(false);
        }
      })();
    }
  }, [searchParams]);

  const [selectedBusinessCategory, setSelectedBusinessCategory] = useState('all');
  const [searchError, setSearchError] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [districtsRes, areasRes] = await Promise.allSettled([districtsAPI.getAll(), areasAPI.getAll()]);
        const districtsData = districtsRes.status === 'fulfilled' ? (districtsRes.value.data || []) : [];
        const areasData = areasRes.status === 'fulfilled' ? (areasRes.value.data || []) : [];
        setDistricts(districtsData);
        setAreas(areasData);
        if (districtsData.length > 0 && !districtsData.find(d => d._id === selectedDistrict)) {
          setSelectedDistrict(districtsData[0]._id);
        }
        if (districtsRes.status === 'rejected' && areasRes.status === 'rejected') {
          setError('Failed to load data. Please check your connection and try again.');
        }
      } catch (err) {
        setError(`Failed to load data: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const currentDistrict = districts.find(d => d._id === selectedDistrict);
  const currentDistrictName = currentDistrict?.name;

  const pincodeData = useMemo(() => areas.map(transformAreaToPincodeData).filter(Boolean), [areas]);
  const filteredPincodeData = useMemo(() => {
    const byDistrict = pincodeData.filter(p => p.district === currentDistrictName);
    if (!selectedPincode) return byDistrict;
    const searched = pincodeData.find(p => p.pincode === selectedPincode);
    return searched ? [searched] : byDistrict;
  }, [pincodeData, currentDistrictName, selectedPincode]);
  const displayData = filteredPincodeData;

  const categorySourceArea = useMemo(() =>
    selectedPincode ? areas.find(a => a.pincode === selectedPincode) : displayData.length > 0 ? areas.find(a => a.pincode === displayData[0]?.pincode) : null,
    [selectedPincode, areas, displayData]
  );
  const businessCategories = getBusinessCategoriesFromArea(categorySourceArea);

  if (loading) return <PageSkeleton />;

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#0f172a]' : 'bg-slate-100'}`}>
        <div className="text-center max-w-md p-8 bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border-2 border-slate-200 dark:border-[#475569]">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-white mb-3">Unable to Load Data</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
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
    try {
      setSearchLoading(true);
      const response = await areasAPI.getByPincode(pincode);
      if (response.data) {
        if (response.data.district?._id && response.data.district._id !== selectedDistrict) {
          setSelectedDistrict(response.data.district._id);
        }
        setAreas(prev => {
          const idx = prev.findIndex(a => a.pincode === pincode);
          if (idx >= 0) { const updated = [...prev]; updated[idx] = response.data; return updated; }
          return [...prev, response.data];
        });
      } else {
        setSearchError(`Data for pincode ${pincode} will be loaded from government APIs.`);
      }
    } catch (err) {
      setSearchError(err.message || `Data for pincode ${pincode} will be loaded from government APIs.`);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleRefresh = () => window.location.reload();

  const bg = isDarkMode ? 'bg-[#0f172a]' : 'bg-slate-50';
  const card = `rounded-2xl border overflow-hidden transition-all duration-200 ${
    isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-200 shadow-sm'
  }`;
  const fadeIn = (d = 0) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: d } });

  return (
    <PageTransition>
      <div className={`min-h-screen transition-colors ${bg}`}>

        {/* ═══ TOP NAV BAR ═══ */}
        <div className={`sticky top-0 z-40 border-b ${isDarkMode ? 'bg-[#1e293b]/95 backdrop-blur border-[#334155]' : 'bg-white/95 backdrop-blur border-slate-200'}`}>
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">MarketVision AI</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                Dashboard
              </span>
            </div>
            <div className="flex items-center gap-2">
              <QuickActions onRefresh={handleRefresh} />
            </div>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-2 md:px-4 py-0">

          {/* ═══ ROW 1: LOCATION + FILTERS (Customer first asks "Where am I?") ═══ */}
          <motion.div {...fadeIn(0.02)} className={`${card} p-2.5`}>
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
              <div className="w-full md:w-48 flex-shrink-0">
                <DistrictSelector districts={districts} />
              </div>
              <div className="flex-1">
                <SearchBar onSearch={handleSearch} placeholder={`Search pincode in ${currentDistrictName || 'selected district'}...`} suggestions={displayData.map(p => p.pincode).filter(Boolean)} district={currentDistrictName} category={selectedBusinessCategory} />
                {searchLoading && <p className="mt-1 text-[10px] text-slate-400 font-medium">Fetching data...</p>}
                {searchError && <p className="mt-1 text-[10px] text-red-500 font-medium">{searchError}</p>}
              </div>
            </div>
            {businessCategories.length > 0 && (
              <div className={`flex flex-wrap gap-1 mt-2 pt-2 border-t ${isDarkMode ? 'border-[#334155]' : 'border-slate-200'}`}>
                {[{ name: 'all' }, ...businessCategories.map(c => ({ name: c.name || c }))].map(cat => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedBusinessCategory(cat.name)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all duration-200 ${
                      selectedBusinessCategory === cat.name
                        ? 'bg-blue-600 text-white shadow-md'
                        : isDarkMode
                          ? 'bg-[#0f172a] text-slate-400 hover:text-white hover:bg-[#0f172a]/80'
                          : 'bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    {cat.name === 'all' ? 'All' : cat.name}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ═══ SEARCH RESULT CARD ═══ */}
          {selectedPincode && (
            <motion.div {...fadeIn(0.03)} className="mt-2">
              <AnimatePresence mode="wait">
                <SearchResultCard
                  key={selectedPincode}
                  area={areas.find(a => a.pincode === selectedPincode) || null}
                  loading={searchLoading}
                  error={searchError}
                  onClose={() => {
                    setSelectedPincode('');
                    setSearchPincode('');
                    setSearchError(null);
                    navigate('/dashboard', { replace: true });
                  }}
                />
              </AnimatePresence>
            </motion.div>
          )}

          {/* ═══ ROW 2: KPIs (Customer asks "What's the big picture?") ═══ */}
          <motion.div {...fadeIn(0.05)}>
            <HeroBanner pincodeData={displayData} selectedDistrict={currentDistrictName} />
          </motion.div>

          {!hasAreaData(displayData) && !loading && (
            <motion.div {...fadeIn(0.1)}>
              <EmptyState type="noData" message="Select a district and search a pincode to view market opportunities." />
            </motion.div>
          )}

          {hasAreaData(displayData) && (
          <>

          {/* ═══ ROW 3: KEY INSIGHTS (Customer asks "What should I know now?") ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-0 -mt-px">
            <motion.div {...fadeIn(0.08)}>
              <ExecutiveSummary pincodeData={displayData} />
            </motion.div>
            <motion.div {...fadeIn(0.1)}>
              <TopPerformers pincodeData={displayData} />
            </motion.div>
          </div>

          {/* ═══ ROW 4: MAP (Customer asks "Show me on a map") ═══ */}
          <motion.div {...fadeIn(0.12)}>
            <div className={card}><MapSection pincodeData={displayData} selectedDistrict={currentDistrictName} /></div>
          </motion.div>

          {/* ═══ ROW 5: CHARTS (Customer asks "What do the charts say?") ═══ */}
          <motion.div {...fadeIn(0.15)}>
            <div className={card}><ChartsSection businessCategories={businessCategories} selectedCategory={selectedBusinessCategory} pincodeData={displayData} /></div>
          </motion.div>

          {/* ═══ ROW 6: INSIGHTS + COMPETITION (Customer asks "What business insights? Who's competing?") ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 -mt-px">
            <motion.div {...fadeIn(0.18)}>
              <div className={`${card} h-full`}><BusinessInsights pincodeData={displayData} /></div>
            </motion.div>
            <motion.div {...fadeIn(0.2)}>
              <div className={`${card} h-full`}><Competitors pincodeData={displayData} /></div>
            </motion.div>
          </div>

          {/* ═══ ROW 7: HEATMAP (Customer asks "Show me the heatmap") ═══ */}
          <motion.div {...fadeIn(0.23)}>
            <div className={card}><OpportunityHeatMap pincodeData={displayData} selectedDistrict={currentDistrictName} /></div>
          </motion.div>

          {/* ═══ ROW 8: FORECASTING (Customer asks "What about the future?") ═══ */}
          <motion.div {...fadeIn(0.26)}>
            <div className={card}><AdvancedForecasting pincodeData={displayData} businessCategories={businessCategories} /></div>
          </motion.div>

          {/* ═══ ROW 9: ANALYTICS (Customer asks "Give me detailed analytics") ═══ */}
          <motion.div {...fadeIn(0.29)}>
            <div className={card}><AnalyticsPanel pincodeData={displayData} businessCategories={businessCategories} selectedDistrict={currentDistrictName} /></div>
          </motion.div>

          {/* ═══ ROW 10: EXPORT (Customer asks "I want to download/report this") ═══ */}
          <motion.div {...fadeIn(0.32)}>
            <div className={card}><EnhancedExport data={displayData} selectedDistrict={currentDistrictName} businessCategories={businessCategories} /></div>
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
