import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useDistrict } from '../contexts/DistrictContext';
import { explorerAPI } from '../services/api';

function AreaLeaderboard() {
  const { isDarkMode } = useTheme();
  const { districts, selectedDistrict } = useDistrict();
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('opportunityScore');
  const [filterDistrict, setFilterDistrict] = useState(selectedDistrict || '');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const b = (light, dark) => isDarkMode ? dark : light;

  useEffect(() => {
    loadLeaderboard();
  }, [sortBy, filterDistrict, page]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const params = { sortBy, page, limit: 15 };
      if (filterDistrict) params.district = filterDistrict;
      const res = await explorerAPI.getLeaderboard(params);
      if (res.success) { setAreas(res.areas); setTotalPages(res.pages || 1); }
    } catch (err) { console.error('Failed to load leaderboard:', err); } finally { setLoading(false); }
  };

  const getRankBadge = (i) => {
    if (i === 0) return '🥇';
    if (i === 1) return '🥈';
    if (i === 2) return '🥉';
    return `#${i + 1}`;
  };

  const getScoreColor = (s) => {
    if (s >= 70) return 'text-green-500';
    if (s >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const sortOptions = [
    { value: 'opportunityScore', label: 'Opportunity Score' },
    { value: 'feasibilityScore', label: 'Feasibility Score' },
    { value: 'population', label: 'Population' },
    { value: 'populationGrowth', label: 'Growth Rate' },
  ];

  return (
    <div className={`min-h-[calc(100vh-120px)] p-4 lg:p-8 transition-colors ${b('bg-gray-50', 'bg-[#0f172a]')}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${b('text-gray-900', 'text-white')}`}>Area Leaderboard</h1>
            <p className={`text-sm ${b('text-gray-500', 'text-gray-400')}`}>All areas ranked by opportunity and feasibility scores</p>
          </div>
          <div className="flex gap-3">
            <select value={filterDistrict} onChange={(e) => { setFilterDistrict(e.target.value); setPage(1); }}
              className={`px-3 py-2 rounded-lg border text-sm outline-none ${b('bg-white border-gray-300 text-gray-700', 'bg-[#1e293b] border-[#334155] text-gray-200')}`}>
              <option value="">All Districts</option>
              {districts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
            <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className={`px-3 py-2 rounded-lg border text-sm outline-none ${b('bg-white border-gray-300 text-gray-700', 'bg-[#1e293b] border-[#334155] text-gray-200')}`}>
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2563eb]"></div></div>
        ) : areas.length === 0 ? (
          <div className={`text-center py-20 ${b('text-gray-400', 'text-gray-500')}`}><p>No areas found</p></div>
        ) : (
          <div className="space-y-3">
            {areas.map((area, i) => (
              <motion.div key={area._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                <Link to={`/area-overview/${area.pincode}`} className={`block rounded-xl border p-4 no-underline transition-all hover:shadow-md ${b('bg-white border-gray-200 hover:bg-gray-50', 'bg-[#1e293b] border-[#334155] hover:bg-[#1e293b]/80')}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${i < 3 ? 'text-lg' : ''} ${b('bg-gray-100', 'bg-[#0f172a]')}`}>
                      {getRankBadge(i)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold text-sm truncate ${b('text-gray-900', 'text-white')}`}>{area.name}</h3>
                        <span className={`text-xs ${b('text-gray-400', 'text-gray-500')}`}>{area.pincode}</span>
                      </div>
                      <p className={`text-xs ${b('text-gray-500', 'text-gray-400')}`}>{area.district} · {area.population?.toLocaleString()} population · {area.incomeLevel} income</p>
                    </div>
                    <div className="text-right flex gap-4">
                      <div>
                        <p className={`text-[10px] uppercase tracking-wider ${b('text-gray-400', 'text-gray-500')}`}>Opportunity</p>
                         <p className={`text-lg font-bold ${getScoreColor(area.opportunityScore)}`}>{Number(area.opportunityScore).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className={`text-[10px] uppercase tracking-wider ${b('text-gray-400', 'text-gray-500')}`}>Feasibility</p>
                         <p className={`text-lg font-bold ${getScoreColor(area.feasibilityScore)}`}>{Number(area.feasibilityScore).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-4">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border ${b('bg-white border-gray-300 text-gray-700', 'bg-[#1e293b] border-[#334155] text-gray-200')} disabled:opacity-40`}>Previous</button>
                <span className={`flex items-center px-3 text-sm ${b('text-gray-600', 'text-gray-400')}`}>Page {page} of {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border ${b('bg-white border-gray-300 text-gray-700', 'bg-[#1e293b] border-[#334155] text-gray-200')} disabled:opacity-40`}>Next</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AreaLeaderboard;
