import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useDistrict } from '../contexts/DistrictContext';
import { explorerAPI } from '../services/api';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';

function CategoryExplorer() {
  const { isDarkMode } = useTheme();
  const { districts, selectedDistrict } = useDistrict();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('gap');
  const [filterDistrict, setFilterDistrict] = useState(selectedDistrict || '');
  const [page, setPage] = useState(1);
  const perPage = 8;

  const b = (light, dark) => isDarkMode ? dark : light;

  const paginatedCategories = categories.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(categories.length / perPage);

  useEffect(() => {
    loadCategories();
  }, [sortBy, filterDistrict]);

  const loadCategories = async () => {
    setLoading(true);
    setPage(1);
    try {
      const params = { sortBy };
      if (filterDistrict) params.district = filterDistrict;
      const res = await explorerAPI.getCategories(params);
      if (res.success) setCategories(res.categories);
    } catch (err) { console.error('Failed to load categories:', err); } finally { setLoading(false); }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getBarColor = (score) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`min-h-[calc(100vh-120px)] p-4 lg:p-8 transition-colors ${b('bg-gray-50', 'bg-[#0f172a]')}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${b('text-gray-900', 'text-white')}`}>Business Category Explorer</h1>
            <p className={`text-sm ${b('text-gray-500', 'text-gray-400')}`}>Browse all business categories by opportunity scores</p>
          </div>
          <div className="flex gap-3">
            <select value={filterDistrict} onChange={(e) => setFilterDistrict(e.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm outline-none ${b('bg-white border-gray-300 text-gray-700', 'bg-[#1e293b] border-[#334155] text-gray-200')}`}>
              <option value="">All Districts</option>
              {districts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm outline-none ${b('bg-white border-gray-300 text-gray-700', 'bg-[#1e293b] border-[#334155] text-gray-200')}`}>
              <option value="gap">Sort by Gap</option>
              <option value="demand">Sort by Demand</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2563eb]"></div></div>
        ) : (
          <div className="grid gap-4">
            {paginatedCategories.map((cat, i) => (
              <motion.div key={cat._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className={`rounded-xl border p-5 ${b('bg-white border-gray-200', 'bg-[#1e293b] border-[#334155]')}`}>
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-bold text-base ${b('text-gray-900', 'text-white')}`}>{cat.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${cat.gap >= 45 ? 'bg-green-100 text-green-700' : cat.gap >= 30 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        Gap: {cat.gap}
                      </span>
                    </div>
                    <p className={`text-xs ${b('text-gray-500', 'text-gray-400')} mb-3`}>{cat.description}</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      <div><span className={b('text-gray-500', 'text-gray-400')}>Avg Gap: </span><span className={`font-semibold ${getScoreColor(cat.avgGap)}`}>{cat.avgGap}</span></div>
                      <div><span className={b('text-gray-500', 'text-gray-400')}>Avg Demand: </span><span className={`font-semibold ${getScoreColor(cat.avgDemand)}`}>{cat.avgDemand}</span></div>
                      <div><span className={b('text-gray-500', 'text-gray-400')}>Areas: </span><span className="font-semibold">{cat.areaCount}</span></div>
                      <div><span className={b('text-gray-500', 'text-gray-400')}>Investment: </span><span className="font-semibold">₹{(cat.minInvestment / 100000).toFixed(1)}L - ₹{(cat.maxInvestment / 100000).toFixed(1)}L</span></div>
                    </div>
                    {/* Bar */}
                    <div className="mt-3">
                      <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-gray-200">
                        <div className={`${getBarColor(cat.avgGap)}`} style={{ width: `${cat.avgGap}%` }} title={`Gap: ${cat.avgGap}`} />
                        <div className="bg-blue-500" style={{ width: `${Math.max(0, cat.avgDemand - cat.avgGap)}%` }} title={`Demand: ${cat.avgDemand}`} />
                      </div>
                      <div className="flex justify-between text-[10px] mt-1">
                        <span className="text-green-600">Gap</span>
                        <span className="text-blue-600">Demand</span>
                      </div>
                    </div>
                  </div>
                  {cat.bestArea && (
                    <div className={`lg:w-48 p-3 rounded-lg ${b('bg-gray-50', 'bg-[#0f172a]')}`}>
                      <p className={`text-[10px] font-semibold uppercase tracking-wider ${b('text-gray-500', 'text-gray-400')} mb-1`}>Best Location</p>
                      <p className={`font-semibold text-sm ${b('text-gray-900', 'text-white')}`}>{cat.bestArea.name}</p>
                      <p className={`text-xs ${b('text-gray-500', 'text-gray-400')}`}>{cat.bestArea.pincode} · {cat.bestArea.district}</p>
                      <p className="text-xs font-bold text-green-500">Gap: {cat.bestArea.gap}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {!loading && categories.length > perPage && (
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} isDarkMode={isDarkMode} />
        )}
      </div>
    </div>
  );
}

export default CategoryExplorer;
