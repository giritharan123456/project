import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useDistrict } from '../contexts/DistrictContext';
import { useToast } from '../contexts/ToastContext';
import { explorerAPI } from '../services/api';
import Pagination from '../components/Pagination';

function CategoryPincodeMatrix() {
  const { isDarkMode } = useTheme();
  const { error: toastError } = useToast();
  const { districts, selectedDistrict } = useDistrict();
  const [matrix, setMatrix] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDistrict, setFilterDistrict] = useState(selectedDistrict || '');
  const [page, setPage] = useState(1);
  const perPage = 15;

  const b = (light, dark) => isDarkMode ? dark : light;

  const paginatedMatrix = matrix.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(matrix.length / perPage);

  useEffect(() => {
    loadMatrix();
  }, [filterDistrict]);

  const loadMatrix = async () => {
    setLoading(true);
    setPage(1);
    try {
      const params = {};
      if (filterDistrict) params.district = filterDistrict;
      const res = await explorerAPI.getMatrix(params);
      if (res.success) setMatrix(res.matrix || []);
    } catch { toastError('Failed to load matrix'); } finally { setLoading(false); }
  };

  const getScoreColor = (s) => {
    if (s >= 70) return 'text-green-500';
    if (s >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className={`min-h-[calc(100vh-120px)] px-3 sm:px-4 py-4 sm:py-8 transition-colors ${b('bg-gray-50', 'bg-[#0f172a]')}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className={`text-xl sm:text-2xl font-bold ${b('text-gray-900', 'text-white')}`}>Category-Pincode Matrix</h1>
            <p className={`text-xs sm:text-sm ${b('text-gray-500', 'text-gray-400')}`}>Best pincode for each business category</p>
          </div>
          <select value={filterDistrict} onChange={(e) => setFilterDistrict(e.target.value)}
            className={`w-full sm:w-48 px-3 py-2 rounded-lg border text-sm outline-none ${b('bg-white border-gray-300 text-gray-700', 'bg-[#1e293b] border-[#334155] text-gray-200')}`}>
            <option value="">All Districts</option>
            {districts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2563eb]"></div></div>
        ) : matrix.length === 0 ? (
          <div className={`text-center py-20 ${b('text-gray-400', 'text-gray-500')}`}><p>No matrix data available</p></div>
        ) : (
          <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0 rounded-xl border" style={{ WebkitOverflowScrolling: 'touch' }}>
            <table className={`w-full text-xs sm:text-sm min-w-[600px] ${b('bg-white', 'bg-[#1e293b]')} ${b('text-gray-700', 'text-gray-200')}`}>
              <thead>
                <tr className={`${b('bg-gray-100', 'bg-[#0f172a]')}`}>
                  <th className={`text-left px-3 sm:px-4 py-2 sm:py-3 font-semibold text-xs uppercase tracking-wider ${b('text-gray-600', 'text-gray-400')}`}>Category</th>
                  <th className={`text-left px-3 sm:px-4 py-2 sm:py-3 font-semibold text-xs uppercase tracking-wider ${b('text-gray-600', 'text-gray-400')}`}>Best Pincode</th>
                  <th className={`text-left px-3 sm:px-4 py-2 sm:py-3 font-semibold text-xs uppercase tracking-wider ${b('text-gray-600', 'text-gray-400')}`}>Area</th>
                  <th className={`hidden md:table-cell text-left px-3 sm:px-4 py-2 sm:py-3 font-semibold text-xs uppercase tracking-wider ${b('text-gray-600', 'text-gray-400')}`}>District</th>
                  <th className={`text-center px-3 sm:px-4 py-2 sm:py-3 font-semibold text-xs uppercase tracking-wider ${b('text-gray-600', 'text-gray-400')}`}>Gap Score</th>
                  <th className={`hidden lg:table-cell text-center px-3 sm:px-4 py-2 sm:py-3 font-semibold text-xs uppercase tracking-wider ${b('text-gray-600', 'text-gray-400')}`}>Demand</th>
                  <th className={`hidden lg:table-cell text-center px-3 sm:px-4 py-2 sm:py-3 font-semibold text-xs uppercase tracking-wider ${b('text-gray-600', 'text-gray-400')}`}>Feasibility</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMatrix.map((row, i) => {
                  const catNames = Object.keys(row.categories || {});
                  return (
                    <motion.tr key={row.pincode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      className={`border-t ${b('border-gray-200 hover:bg-gray-50', 'border-[#334155] hover:bg-[#0f172a]/50')}`}>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">{catNames[0] || '-'}</td>
                      <td className={`px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap font-semibold ${b('text-gray-900', 'text-white')}`}>{row.pincode}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">{row.areaName || '-'}</td>
                      <td className="hidden md:table-cell px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">{row.district || '-'}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-center">
                         <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getScoreColor(row.gapScore)}`}>{row.gapScore != null ? Number(row.gapScore).toFixed(2) : '-'}</span>
                      </td>
                      <td className="hidden lg:table-cell px-3 sm:px-4 py-2 sm:py-3 text-center">
                         <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getScoreColor(row.demandScore)}`}>{row.demandScore != null ? Number(row.demandScore).toFixed(2) : '-'}</span>
                      </td>
                      <td className="hidden lg:table-cell px-3 sm:px-4 py-2 sm:py-3 text-center">
                         <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getScoreColor(row.feasibilityScore)}`}>{row.feasibilityScore != null ? Number(row.feasibilityScore).toFixed(2) : '-'}</span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!loading && matrix.length > perPage && (
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} isDarkMode={isDarkMode} />
        )}
      </div>
    </div>
  );
}

export default CategoryPincodeMatrix;