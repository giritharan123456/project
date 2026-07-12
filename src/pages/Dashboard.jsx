import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useDistrict } from '../contexts/DistrictContext';
import { usePincode } from '../contexts/PincodeContext';
import { areasAPI, districtsAPI, favoriteAPI } from '../services/api';
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
import DataFilter, { applyFilters } from '../components/DataFilter';
import AreaComparison from '../components/AreaComparison';
import AreaDetailDrilldown from '../components/AreaDetailDrilldown';
import DataTable from '../components/DataTable';

function Dashboard() {
  const { isDarkMode } = useTheme();
  const { selectedDistrict, setSelectedDistrict, districts, setDistricts } = useDistrict();
  const { selectedPincode, setSelectedPincode } = usePincode();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchPincode, setSearchPincode] = useState('');
  const userClearedRef = useRef(sessionStorage.getItem('dashboardSearchCleared') === 'true');
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedBusinessCategory, setSelectedBusinessCategory] = useState('all');

  // ═══ NEW STATE: Filters, Comparison, Drill-down, Favorites ═══
  const [filters, setFilters] = useState({});
  const [compareList, setCompareList] = useState([]);
  const [drilldownArea, setDrilldownArea] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [activeView, setActiveView] = useState('dashboard');

  // ═══ FAVORITES: localStorage (reliable, no auth dependency) ═══
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mv_favorites');
      if (stored) setFavorites(new Set(JSON.parse(stored)));
    } catch { /* ignore */ }
  }, []);

  const saveFavorites = (newSet) => {
    setFavorites(newSet);
    localStorage.setItem('mv_favorites', JSON.stringify([...newSet]));
  };

  const toggleFavorite = (area) => {
    const pincode = String(area.pincode);
    const isFav = favorites.has(pincode);
    const next = new Set(favorites);
    if (isFav) next.delete(pincode);
    else next.add(pincode);
    saveFavorites(next);
  };

  const toggleCompare = (area) => {
    setCompareList(prev => {
      const exists = prev.find(c => c.pincode === area.pincode);
      if (exists) return prev.filter(c => c.pincode !== area.pincode);
      if (prev.length >= 3) return prev;
      return [...prev, area];
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    const searchVal = searchParams.get('search');
    if (searchVal) {
      setSearchPincode(searchVal);
      setSelectedPincode(searchVal);
      (async () => {
        try {
          setSearchLoading(true);
          setSearchError(null);
          const response = await areasAPI.getByPincode(searchVal);
          if (!controller.signal.aborted && response.data) {
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
          if (!controller.signal.aborted) {
            setSearchError(err.message || `Data for pincode ${searchVal} will be loaded from government APIs.`);
          }
        } finally {
          if (!controller.signal.aborted) {
            setSearchLoading(false);
          }
        }
      })();
    }
    return () => controller.abort();
  }, [searchParams]);


  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        // Step 1: always load districts first
        const districtsRes = await districtsAPI.getAll();
        if (cancelled) return;
        const districtsData = districtsRes.data || [];
        setDistricts(districtsData);

        // Mark initial load done so district-change effect doesn't double-fetch
        initialLoadDone.current = true;

        // Step 2: ensure a valid district is selected
        let districtId = selectedDistrict;
        if (!districtId || !districtsData.find(d => d._id === districtId)) {
          districtId = districtsData[0]?._id;
          if (districtId) setSelectedDistrict(districtId);
        }

        // Step 3: load areas for that district (only if no search is active)
        if (districtId && !searchParams.get('search')) {
          const areasRes = await areasAPI.getAll({ district: districtId, limit: 50 });
          if (!cancelled) setAreas(areasRes.data || []);
        }
      } catch (err) {
        if (!cancelled) setError('Failed to load data. Please check your connection and try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  // Re-fetch areas when district changes (after initial load)
  const initialLoadDone = useRef(false);
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      return;
    }
    if (!selectedDistrict) return;
    let cancelled = false;
    const fetchAreas = async () => {
      try {
        const areasRes = await areasAPI.getAll({ district: selectedDistrict, limit: 50 });
        if (!cancelled) setAreas(areasRes.data || []);
      } catch { if (!cancelled) setAreas([]); }
    };
    fetchAreas();
    return () => { cancelled = true; };
  }, [selectedDistrict]);

  const currentDistrict = districts.find(d => d._id === selectedDistrict);
  const currentDistrictName = currentDistrict?.name;

  const pincodeData = useMemo(() => areas.map(transformAreaToPincodeData).filter(Boolean), [areas]);
  const filteredPincodeData = useMemo(() => {
    const byDistrict = pincodeData.filter(p => p.district === currentDistrictName);
    if (!selectedPincode) return byDistrict;
    const searched = pincodeData.find(p => p.pincode === selectedPincode);
    return searched ? [searched] : byDistrict;
  }, [pincodeData, currentDistrictName, selectedPincode]);

  // Apply filters to displayData
  const filteredByCriteria = useMemo(() => applyFilters(filteredPincodeData, filters), [filteredPincodeData, filters]);
  const displayData = filteredByCriteria;

  // Suggestions: all pincodes when no district, district pincodes when district selected
  const searchSuggestions = useMemo(() => {
    if (!selectedDistrict) return pincodeData.map(p => p.pincode).filter(Boolean);
    return filteredPincodeData.map(p => p.pincode).filter(Boolean);
  }, [pincodeData, filteredPincodeData, selectedDistrict]);

  useEffect(() => {
    if (userClearedRef.current) return;
    if (currentDistrictName && filteredPincodeData.length > 0 && !selectedPincode && !searchPincode && !searchParams.get('search')) {
      const firstPincode = filteredPincodeData[0].pincode;
      if (firstPincode) {
        setSearchPincode(firstPincode);
        setSelectedPincode(firstPincode);
      }
    }
  }, [currentDistrictName, filteredPincodeData, selectedPincode, searchPincode, searchParams]);

  const categorySourceArea = useMemo(() =>
    selectedPincode ? areas.find(a => a.pincode === selectedPincode) : displayData.length > 0 ? areas.find(a => a.pincode === displayData[0]?.pincode) : null,
    [selectedPincode, areas, displayData]
  );
  const businessCategories = getBusinessCategoriesFromArea(categorySourceArea);

  if (loading) return <PageSkeleton />;

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#0f172a]' : 'bg-slate-100'}`}>
        <div className={`text-center max-w-md p-8 rounded-2xl shadow-xl border-2 ${isDarkMode ? 'bg-[#1e293b] border-[#475569]' : 'bg-white border-slate-200'}`}>
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className={`text-xl font-extrabold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Unable to Load Data</h1>
          <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{error}</p>
          <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handleSearch = async (pincode) => {
    setSearchPincode(pincode);
    setSearchError(null);
    
    if (!pincode || !pincode.trim()) {
      userClearedRef.current = true;
      sessionStorage.setItem('dashboardSearchCleared', 'true');
      setSelectedPincode(null);
      setSearchPincode('');
      setSearchLoading(true);
      try {
        const res = await areasAPI.getAll({ district: selectedDistrict, limit: 50 });
        if (res.data) setAreas(res.data);
      } catch { /* keep existing data */ }
      finally { setSearchLoading(false); }
      return;
    }
    userClearedRef.current = false;
    sessionStorage.removeItem('dashboardSearchCleared');
    
    setSelectedPincode(pincode);
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
          <div className="max-w-[1600px] mx-auto px-2 sm:px-4 md:px-6 py-2 flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
              <span className="text-xs sm:text-lg font-extrabold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent whitespace-nowrap">MarketVision AI</span>
              <span className={`hidden md:inline text-[10px] font-bold px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                Dashboard
              </span>
            </div>
            <div className="flex-1 flex items-center gap-1 min-w-0 overflow-x-auto scrollbar-hide justify-end">
              {/* View Tabs */}
              <div className={`flex items-center gap-0.5 p-0.5 rounded-lg flex-shrink-0 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-slate-100'}`}>
                {[
                  { key: 'dashboard', icon: '📊', label: 'Dash' },
                  { key: 'table', icon: '📋', label: 'Table' },
                  { key: 'favorites', icon: '❤️', label: 'Favs' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveView(tab.key)}
                    title={tab.label}
                    className={`flex items-center gap-1 px-1.5 sm:px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-bold transition-all whitespace-nowrap ${
                      activeView === tab.key
                        ? 'bg-blue-600 text-white shadow-sm'
                        : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span className="text-[11px] sm:text-[12px]">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex-shrink-0">
                <QuickActions onRefresh={handleRefresh} />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-2 sm:px-3 md:px-4 py-0">

          {/* ═══ ROW 1: LOCATION + SEARCH + FILTERS ═══ */}
          <motion.div {...fadeIn(0.02)} className={`${card} p-2 sm:p-2.5 mt-2`}>
            {/* Row 1a: District + Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="w-full sm:w-44 flex-shrink-0">
                <DistrictSelector districts={districts} onDistrictChange={() => {
                  userClearedRef.current = false;
                  sessionStorage.removeItem('dashboardSearchCleared');
                  setSelectedPincode(null);
                  setSearchPincode('');
                  setSearchError(null);
                  setSearchLoading(false);
                  setFilters({});
                  setCompareList([]);
                }} />
              </div>
              <div className="flex-1 min-w-0">
                <SearchBar value={searchPincode} onSearch={handleSearch} placeholder={selectedDistrict ? `Search pincode in ${currentDistrictName}...` : 'Search pincode (all districts)...'} suggestions={searchSuggestions} district={currentDistrictName} category={selectedBusinessCategory} />
                {searchLoading && <p className="mt-1 text-[10px] text-slate-400 font-medium">Fetching data...</p>}
                {searchError && <p className="mt-1 text-[10px] text-red-500 font-medium">{searchError}</p>}
              </div>
            </div>
            {/* Row 1b: Filter Button + Category Pills */}
            <div className={`flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2 pt-2 border-t ${isDarkMode ? 'border-[#334155]' : 'border-slate-200'}`}>
              <DataFilter
                pincodeData={pincodeData}
                filters={filters}
                onFiltersChange={setFilters}
                resultCount={displayData.length}
                totalCount={filteredPincodeData.length}
              />
              {businessCategories.length > 0 && businessCategories.map(cat => (
                <button
                  key={cat.name || cat}
                  onClick={() => setSelectedBusinessCategory(cat.name || cat)}
                  className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all duration-200 ${
                    selectedBusinessCategory === (cat.name || cat)
                      ? 'bg-blue-600 text-white shadow-md'
                      : isDarkMode
                        ? 'bg-[#0f172a] text-slate-300 hover:text-white border border-[#334155] hover:border-blue-500'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-800 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cat.name || cat}
                </button>
              ))}
            </div>
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
                    userClearedRef.current = true;
                    sessionStorage.setItem('dashboardSearchCleared', 'true');
                    setSelectedPincode(null);
                    setSearchPincode('');
                    setSearchError(null);
                    navigate('/dashboard', { replace: true });
                  }}
                />
              </AnimatePresence>
            </motion.div>
          )}

          {/* ═══ VIEW: DASHBOARD ═══ */}
          {activeView === 'dashboard' && (
            <>
              {/* ═══ ROW 2: KPIs (Customer asks "What's the big picture?") ═══ */}
              <motion.div {...fadeIn(0.05)}>
                <HeroBanner pincodeData={displayData} selectedDistrict={currentDistrictName} />
              </motion.div>

              {/* ═══ COMPARISON PANEL ═══ */}
              {compareList.length > 0 && (
                <motion.div {...fadeIn(0.06)} className="mt-2">
                  <AreaComparison
                    areas={compareList}
                    onRemove={(pincode) => setCompareList(prev => prev.filter(c => c.pincode !== pincode))}
                    onClear={() => setCompareList([])}
                    onOpenDetail={(area) => setDrilldownArea(area)}
                  />
                </motion.div>
              )}

              {!hasAreaData(displayData) && !loading && !searchLoading && (
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

              {/* ═══ ROW 4: DATA TABLE ═══ */}
              <motion.div {...fadeIn(0.11)}>
                <DataTable
                  pincodeData={displayData}
                  onAreaClick={(area) => setDrilldownArea(area)}
                  onCompare={toggleCompare}
                  compareList={compareList}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              </motion.div>

              {/* ═══ ROW 5: MAP (Customer asks "Show me on a map") ═══ */}
              <motion.div {...fadeIn(0.12)}>
                <div className={card}><MapSection pincodeData={displayData} selectedDistrict={currentDistrictName} /></div>
              </motion.div>

              {/* ═══ ROW 6: CHARTS (Customer asks "What do the charts say?") ═══ */}
              <motion.div {...fadeIn(0.15)}>
                <div className={card}><ChartsSection businessCategories={businessCategories} selectedCategory={selectedBusinessCategory} pincodeData={displayData} /></div>
              </motion.div>

              {/* ═══ ROW 7: INSIGHTS + COMPETITION (Customer asks "What business insights? Who's competing?") ═══ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 -mt-px">
                <motion.div {...fadeIn(0.18)}>
                  <div className={`${card} h-full`}><BusinessInsights pincodeData={displayData} /></div>
                </motion.div>
                <motion.div {...fadeIn(0.2)}>
                  <div className={`${card} h-full`}><Competitors pincodeData={displayData} /></div>
                </motion.div>
              </div>

              {/* ═══ ROW 8: HEATMAP (Customer asks "Show me the heatmap") ═══ */}
              <motion.div {...fadeIn(0.23)}>
                <div className={card}><OpportunityHeatMap pincodeData={displayData} selectedDistrict={currentDistrictName} /></div>
              </motion.div>

              {/* ═══ ROW 9: FORECASTING (Customer asks "What about the future?") ═══ */}
              <motion.div {...fadeIn(0.26)}>
                <div className={card}><AdvancedForecasting pincodeData={displayData} businessCategories={businessCategories} /></div>
              </motion.div>

              {/* ═══ ROW 10: ANALYTICS (Customer asks "Give me detailed analytics") ═══ */}
              <motion.div {...fadeIn(0.29)}>
                <div className={card}><AnalyticsPanel pincodeData={displayData} businessCategories={businessCategories} selectedDistrict={currentDistrictName} /></div>
              </motion.div>

              {/* ═══ ROW 11: EXPORT (Customer asks "I want to download/report this") ═══ */}
              <motion.div {...fadeIn(0.32)}>
                <div className={card}><EnhancedExport data={displayData} selectedDistrict={currentDistrictName} businessCategories={businessCategories} /></div>
              </motion.div>

              </>
              )}
            </>
          )}

          {/* ═══ VIEW: TABLE ═══ */}
          {activeView === 'table' && (
            <motion.div {...fadeIn(0.05)} className="mt-2">
              <DataTable
                pincodeData={displayData}
                onAreaClick={(area) => setDrilldownArea(area)}
                onCompare={toggleCompare}
                compareList={compareList}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            </motion.div>
          )}

          {/* ═══ VIEW: FAVORITES ═══ */}
          {activeView === 'favorites' && (
            <motion.div {...fadeIn(0.05)} className="mt-2">
              {favorites.size === 0 ? (
                <EmptyState type="noData" message="No favorite areas yet. Click the heart icon on any area to save it for quick access." />
              ) : (
                <div className="space-y-2">
                  <div className={`flex items-center justify-between px-4 py-2 rounded-2xl border ${
                    isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    <span className={`text-sm font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      ❤️ {favorites.size} Favorite Area{favorites.size !== 1 ? 's' : ''}
                    </span>
                    <button
                      onClick={() => { setFavorites(new Set()); localStorage.removeItem('mv_favorites'); }}
                      className="text-[10px] font-bold text-red-500 hover:text-red-400 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                  {(() => {
                    const favData = pincodeData.filter(p => favorites.has(String(p.pincode)));
                    if (favData.length === 0) {
                      return (
                        <EmptyState type="noData" message="No favorites found. Try switching districts or adding new favorites." />
                      );
                    }
                    return (
                      <DataTable
                        pincodeData={favData}
                        onAreaClick={(area) => setDrilldownArea(area)}
                        onCompare={toggleCompare}
                        compareList={compareList}
                        favorites={favorites}
                        onToggleFavorite={toggleFavorite}
                      />
                    );
                  })()}
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* ═══ DRILL-DOWN MODAL ═══ */}
        {drilldownArea && (
          <AreaDetailDrilldown
            area={drilldownArea}
            onClose={() => setDrilldownArea(null)}
            onCompare={toggleCompare}
            isComparing={compareList.some(c => c.pincode === drilldownArea.pincode)}
          />
        )}

        <ScrollToTop />
        <HelpGuide />
        <FloatingAIChat />
      </div>
    </PageTransition>
  );
}

export default Dashboard;
