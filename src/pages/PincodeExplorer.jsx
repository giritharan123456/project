import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useDistrict } from '../contexts/DistrictContext';
import { useToast } from '../contexts/ToastContext';
import { explorerAPI, areasAPI, searchAPI } from '../services/api';
import { Search, MapPin, Users, TrendingUp, Store, ChevronDown, IndianRupee, X } from 'lucide-react';

function PincodeExplorer() {
  const { isDarkMode } = useTheme();
  const { districts, selectedDistrict, setSelectedDistrict } = useDistrict();
  const { error: toastError } = useToast();
  const [areas, setAreas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [incomeFilter, setIncomeFilter] = useState('');
  const [sortBy, setSortBy] = useState('opportunityScore');
  const [pincodeSearch, setPincodeSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const searchRef = useRef(null);
  const suggestTimerRef = useRef(null);
  const abortControllerRef = useRef(null);

  const b = (light, dark) => isDarkMode ? dark : light;

  useEffect(() => { loadShops(); }, [selectedDistrict, selectedCategory, incomeFilter, sortBy, page]);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const fetchSuggestions = (query) => {
    setPincodeSearch(query);
    if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current);
    if (!query || query.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    suggestTimerRef.current = setTimeout(async () => {
      try {
        const currentDist = districts.find(d => d._id === selectedDistrict);
        const res = await searchAPI.suggestions(query, currentDist?.name);
        if (res.data) { setSuggestions(res.data); setShowSuggestions(res.data.length > 0); }
      } catch { setSuggestions([]); }
    }, 300);
  };

  const selectSuggestion = (s) => {
    setPincodeSearch(s.pincode);
    setShowSuggestions(false);
    setSuggestions([]);
    setPage(1);
    setLoading(true);
    explorerAPI.getPincodeShops({ pincode: s.pincode }).then(res => {
      if (res.success) { setAreas(res.areas || []); setTotal(res.total || 0); if (res.areas?.length === 1) setSelectedArea(res.areas[0]); }
    }).catch(() => toastError('Pincode not found')).finally(() => setLoading(false));
  };

  const loadShops = async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    setLoading(true);
    try {
      const params = { page, limit: 20, sortBy };
      if (selectedDistrict) params.district = selectedDistrict;
      if (selectedCategory) params.category = selectedCategory;
      if (incomeFilter) params.incomeLevel = incomeFilter;
      if (pincodeSearch) params.pincode = pincodeSearch;
      const res = await explorerAPI.getPincodeShops(params);
      if (res.success) {
        setAreas(res.areas || []);
        setCategories(res.categories || []);
        setTotalPages(res.totalPages || 1);
        setTotal(res.total || 0);
      }
    } catch (err) {
      if (err?.name !== 'AbortError') toastError('Failed to load shop data');
    } finally { setLoading(false); }
  };

  const searchByPincode = async () => {
    if (!pincodeSearch || pincodeSearch.length < 6) return;
    setPage(1);
    setLoading(true);
    try {
      const res = await explorerAPI.getPincodeShops({ pincode: pincodeSearch });
      if (res.success) {
        setAreas(res.areas || []);
        setTotal(res.total || 0);
        if (res.areas?.length === 1) setSelectedArea(res.areas[0]);
      }
    } catch { toastError('Pincode not found'); } finally { setLoading(false); }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setIncomeFilter('');
    setPincodeSearch('');
    setSelectedArea(null);
    setPage(1);
    loadShops();
  };

  const formatCurrency = (val) => {
    if (val == null) return '-';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
    return `₹${val}`;
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusBadge = (status) => {
    if (status === 'High Opportunity') return 'bg-green-100 text-green-700 border-green-200';
    if (status === 'Moderate') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <div className={`min-h-[calc(100vh-120px)] px-3 sm:px-4 py-4 sm:py-8 transition-colors ${b('bg-gray-50', 'bg-[#0f172a]')}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className={`text-xl sm:text-2xl font-bold ${b('text-gray-900', 'text-white')}`}>Pincode Shop Explorer</h1>
          <p className={`text-xs sm:text-sm ${b('text-gray-500', 'text-gray-400')}`}>Discover businesses, opportunities, and market gaps in any pincode</p>
        </div>

        {/* Search & Filters */}
        <motion.div className={`rounded-xl border p-4 sm:p-5 mb-6 ${b('bg-white border-gray-200', 'bg-[#1e293b] border-[#334155]')}`}>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 relative" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={16} />
              <input
                type="text"
                value={pincodeSearch}
                onChange={(e) => fetchSuggestions(e.target.value)}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { setShowSuggestions(false); searchByPincode(); } }}
                placeholder="Type pincode or area name..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none ${b('bg-white border-gray-300 text-gray-700', 'bg-[#0f172a] border-[#334155] text-gray-200')}`}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className={`absolute left-0 right-0 top-full mt-1 rounded-lg border shadow-xl z-50 max-h-60 overflow-y-auto ${b('bg-white border-gray-200', 'bg-[#1e293b] border-[#334155]')}`}>
                  {suggestions.map((s) => (
                    <button key={s.id} onClick={() => selectSuggestion(s)}
                      className={`w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-blue-50 transition-colors border-b last:border-0 ${b('border-gray-100', 'border-[#334155] hover:bg-blue-900/20')}`}>
                      <div className="flex items-center gap-2">
                        <MapPin size={12} className="text-blue-500" />
                        <span className={`text-xs font-semibold ${b('text-gray-700', 'text-gray-200')}`}>{s.name}</span>
                      </div>
                      <span className={`text-[10px] font-bold ${b('text-gray-400', 'text-gray-500')}`}>{s.pincode}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={searchByPincode}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white text-sm font-semibold hover:shadow-lg transition-all">
              Search
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <select value={selectedDistrict || ''} onChange={(e) => { setSelectedDistrict(e.target.value); setPage(1); }}
                className={`pl-3 pr-8 py-2 rounded-lg border text-xs font-medium outline-none appearance-none ${b('bg-white border-gray-300 text-gray-700', 'bg-[#0f172a] border-[#334155] text-gray-200')}`}>
                <option value="">All Districts</option>
                {districts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" size={14} />
            </div>

            <div className="relative">
              <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
                className={`pl-3 pr-8 py-2 rounded-lg border text-xs font-medium outline-none appearance-none ${b('bg-white border-gray-300 text-gray-700', 'bg-[#0f172a] border-[#334155] text-gray-200')}`}>
                <option value="">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" size={14} />
            </div>

            <div className="relative">
              <select value={incomeFilter} onChange={(e) => { setIncomeFilter(e.target.value); setPage(1); }}
                className={`pl-3 pr-8 py-2 rounded-lg border text-xs font-medium outline-none appearance-none ${b('bg-white border-gray-300 text-gray-700', 'bg-[#0f172a] border-[#334155] text-gray-200')}`}>
                <option value="">All Income Levels</option>
                <option value="Low">Low Income</option>
                <option value="Medium">Medium Income</option>
                <option value="High">High Income</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" size={14} />
            </div>

            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className={`pl-3 pr-8 py-2 rounded-lg border text-xs font-medium outline-none appearance-none ${b('bg-white border-gray-300 text-gray-700', 'bg-[#0f172a] border-[#334155] text-gray-200')}`}>
                <option value="opportunityScore">Sort: Opportunity</option>
                <option value="feasibilityScore">Sort: Feasibility</option>
                <option value="population">Sort: Population</option>
                <option value="populationGrowth">Sort: Growth</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" size={14} />
            </div>

            {(selectedCategory || incomeFilter || pincodeSearch) && (
              <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-red-500 hover:text-red-700">
                <X size={14} /> Clear
              </button>
            )}
          </div>

          <p className={`text-[10px] sm:text-xs mt-3 ${b('text-gray-400', 'text-gray-500')}`}>
            Showing {areas.length} of {total} pincodes
          </p>
        </motion.div>

        {/* Area Detail Modal */}
        {selectedArea && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border p-4 sm:p-6 mb-6 ${b('bg-white border-gray-200', 'bg-[#1e293b] border-[#334155]')}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold ${b('text-gray-900', 'text-white')}`}>
                {selectedArea.name} ({selectedArea.pincode})
              </h2>
              <button onClick={() => setSelectedArea(null)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#0f172a]">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className={`p-3 rounded-lg ${b('bg-blue-50', 'bg-blue-900/20')}`}>
                <Users size={16} className="text-blue-500 mb-1" />
                <p className={`text-[10px] uppercase ${b('text-gray-500', 'text-gray-400')}`}>Population</p>
                <p className={`text-sm font-bold ${b('text-gray-900', 'text-white')}`}>{selectedArea.population?.toLocaleString()}</p>
              </div>
              <div className={`p-3 rounded-lg ${b('bg-green-50', 'bg-green-900/20')}`}>
                <TrendingUp size={16} className="text-green-500 mb-1" />
                <p className={`text-[10px] uppercase ${b('text-gray-500', 'text-gray-400')}`}>Growth</p>
                <p className={`text-sm font-bold ${b('text-gray-900', 'text-white')}`}>{selectedArea.populationGrowth ?? 0}%</p>
              </div>
              <div className={`p-3 rounded-lg ${b('bg-purple-50', 'bg-purple-900/20')}`}>
                <IndianRupee size={16} className="text-purple-500 mb-1" />
                <p className={`text-[10px] uppercase ${b('text-gray-500', 'text-gray-400')}`}>Income</p>
                <p className={`text-sm font-bold ${b('text-gray-900', 'text-white')}`}>{selectedArea.incomeLevel}</p>
              </div>
              <div className={`p-3 rounded-lg ${b('bg-orange-50', 'bg-orange-900/20')}`}>
                <Store size={16} className="text-orange-500 mb-1" />
                <p className={`text-[10px] uppercase ${b('text-gray-500', 'text-gray-400')}`}>Total Shops</p>
                <p className={`text-sm font-bold ${b('text-gray-900', 'text-white')}`}>{selectedArea.totalBusinesses ?? 0}</p>
              </div>
            </div>

            {selectedArea.landmarks?.length > 0 && (
              <div className="mb-4">
                <p className={`text-xs font-semibold mb-2 ${b('text-gray-600', 'text-gray-400')}`}>Nearby Landmarks</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedArea.landmarks.slice(0, 8).map((l, i) => (
                    <span key={i} className={`px-2 py-1 rounded-full text-[10px] font-medium ${b('bg-gray-100 text-gray-600', 'bg-[#0f172a] text-gray-400')}`}>
                      {l.name} ({l.type})
                    </span>
                  ))}
                </div>
              </div>
            )}

            <h3 className={`text-sm font-semibold mb-2 ${b('text-gray-700', 'text-gray-300')}`}>Business Categories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {selectedArea.businesses?.map((biz, i) => (
                <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-lg ${b('bg-gray-50 border border-gray-100', 'bg-[#0f172a] border border-[#1e293b]')}`}>
                  <div>
                    <p className={`text-xs font-semibold ${b('text-gray-700', 'text-gray-300')}`}>{biz.category}</p>
                    <p className={`text-[10px] ${b('text-gray-400', 'text-gray-500')}`}>{biz.businessCount} shops · {formatCurrency(biz.minInvestment)}-{formatCurrency(biz.maxInvestment)}</p>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(biz.status)}`}>
                    {biz.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Area Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className={`animate-pulse rounded-xl border p-5 ${b('bg-white border-gray-200', 'bg-[#1e293b] border-[#334155]')}`}>
                <div className={`h-4 rounded w-1/3 mb-3 ${b('bg-gray-200', 'bg-[#334155]')}`}></div>
                <div className={`h-3 rounded w-1/2 mb-2 ${b('bg-gray-200', 'bg-[#334155]')}`}></div>
                <div className={`h-3 rounded w-2/3 ${b('bg-gray-200', 'bg-[#334155]')}`}></div>
              </div>
            ))}
          </div>
        ) : areas.length === 0 ? (
          <div className={`text-center py-16 rounded-xl border ${b('bg-white border-gray-200', 'bg-[#1e293b] border-[#334155]')}`}>
            <Store size={40} className={`mx-auto mb-3 ${b('text-gray-300', 'text-gray-600')}`} />
            <p className={`text-sm ${b('text-gray-500', 'text-gray-400')}`}>No pincodes found. Try different filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {areas.map((area) => (
              <motion.div key={area._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedArea(selectedArea?._id === area._id ? null : area)}
                className={`rounded-xl border p-4 sm:p-5 cursor-pointer transition-all hover:shadow-lg ${b('bg-white border-gray-200 hover:border-blue-300', 'bg-[#1e293b] border-[#334155] hover:border-blue-500')} ${selectedArea?._id === area._id ? 'ring-2 ring-blue-500' : ''}`}>
                
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className={`text-sm font-bold ${b('text-gray-900', 'text-white')}`}>{area.name}</h3>
                    <p className={`text-[10px] flex items-center gap-1 ${b('text-gray-500', 'text-gray-400')}`}>
                      <MapPin size={10} /> {area.pincode} · {area.district}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${getScoreColor(area.opportunityScore)}`}>{area.opportunityScore?.toFixed(0)}</p>
                    <p className={`text-[10px] uppercase ${b('text-gray-400', 'text-gray-500')}`}>Opportunity</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className={`text-center p-1.5 rounded-lg ${b('bg-gray-50', 'bg-[#0f172a]')}`}>
                    <p className={`text-xs font-bold ${b('text-gray-900', 'text-white')}`}>{area.population?.toLocaleString()}</p>
                    <p className={`text-[10px] ${b('text-gray-400', 'text-gray-500')}`}>Population</p>
                  </div>
                  <div className={`text-center p-1.5 rounded-lg ${b('bg-gray-50', 'bg-[#0f172a]')}`}>
                    <p className={`text-xs font-bold ${b('text-gray-900', 'text-white')}`}>{area.totalBusinesses ?? 0}</p>
                    <p className={`text-[10px] ${b('text-gray-400', 'text-gray-500')}`}>Shops</p>
                  </div>
                  <div className={`text-center p-1.5 rounded-lg ${b('bg-gray-50', 'bg-[#0f172a]')}`}>
                    <p className={`text-xs font-bold ${b('text-gray-900', 'text-white')}`}>{area.highOpportunityCount ?? 0}</p>
                    <p className={`text-[10px] ${b('text-gray-400', 'text-gray-500')}`}>High Opp.</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${b('bg-gray-100 text-gray-600', 'bg-[#0f172a] text-gray-400')}`}>
                    {area.incomeLevel ?? 'N/A'} Income
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${b('bg-gray-100 text-gray-600', 'bg-[#0f172a] text-gray-400')}`}>
                    {area.trafficLevel ?? 'N/A'} Traffic
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${b('bg-gray-100 text-gray-600', 'bg-[#0f172a] text-gray-400')}`}>
                    +{area.populationGrowth ?? 0}% Growth
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-30 ${b('bg-white border border-gray-200 text-gray-700 hover:bg-gray-50', 'bg-[#1e293b] border-[#334155] text-gray-300 hover:bg-[#0f172a]')}`}>
              Previous
            </button>
            <span className={`text-xs ${b('text-gray-500', 'text-gray-400')}`}>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-30 ${b('bg-white border border-gray-200 text-gray-700 hover:bg-gray-50', 'bg-[#1e293b] border-[#334155] text-gray-300 hover:bg-[#0f172a]')}`}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PincodeExplorer;
