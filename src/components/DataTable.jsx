import React, { useState, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Table2, Heart } from 'lucide-react';
import { averageOfValues } from '../utils/dataUtils';

function DataTable({ pincodeData, onAreaClick, onCompare, compareList, favorites, onToggleFavorite }) {
  const { isDarkMode } = useTheme();
  const [sortKey, setSortKey] = useState('opportunityScore');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const perPage = 10;

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
    setPage(1);
  };

  const sorted = useMemo(() => {
    if (!pincodeData || pincodeData.length === 0) return [];
    const rows = pincodeData.map(p => ({
      ...p,
      _avgGap: p.opportunityScore || averageOfValues(p.marketGapScores) || 0,
      _avgDemand: averageOfValues(p.demandScores) ?? 0,
      _totalComps: Object.values(p.competitors || {}).reduce((s, v) => s + (Number(v) || 0), 0),
    }));
    return rows.sort((a, b) => {
      let aVal, bVal;
      switch (sortKey) {
        case 'area': aVal = (a.area || a.name || '').toLowerCase(); bVal = (b.area || b.name || '').toLowerCase(); return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        case 'pincode': aVal = a.pincode || ''; bVal = b.pincode || ''; return sortDir === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
        case 'population': aVal = a.population || 0; bVal = b.population || 0; break;
        case 'growth': aVal = a.populationGrowth || 0; bVal = b.populationGrowth || 0; break;
        case 'opportunityScore': aVal = a._avgGap; bVal = b._avgGap; break;
        case 'demand': aVal = a._avgDemand; bVal = b._avgDemand; break;
        case 'competitors': aVal = a._totalComps; bVal = b._totalComps; break;
        case 'income': aVal = (a.incomeLevel || '').toLowerCase(); bVal = (b.incomeLevel || '').toLowerCase(); return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        default: aVal = a._avgGap; bVal = b._avgGap;
      }
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [pincodeData, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / perPage);
  const paged = sorted.slice((page - 1) * perPage, page * perPage);

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ArrowUpDown size={10} className="opacity-30" />;
    return sortDir === 'asc' ? <ArrowUp size={10} className="text-blue-500" /> : <ArrowDown size={10} className="text-blue-500" />;
  };

  const thClass = `px-2 py-2 text-left text-[10px] font-extrabold uppercase tracking-wider cursor-pointer select-none transition-colors hover:text-blue-500 ${
    isDarkMode ? 'text-slate-400' : 'text-slate-500'
  }`;

  const getScoreBadge = (score) => {
    if (score >= 65) return isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600';
    if (score >= 50) return isDarkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-50 text-amber-600';
    return isDarkMode ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-600';
  };

  if (!pincodeData || pincodeData.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border overflow-hidden ${
        isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      {/* Header */}
      <div className={`px-4 py-2.5 border-b flex items-center justify-between ${
        isDarkMode ? 'border-[#334155] bg-[#0f172a]/40' : 'border-slate-100 bg-slate-50/50'
      }`}>
        <div className="flex items-center gap-2">
          <Table2 size={14} className="text-blue-500" />
          <span className={`text-sm font-extrabold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            All Areas
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'
          }`}>
            {sorted.length} total
          </span>
        </div>
        <span className={`text-[10px] font-semibold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          Page {page} of {totalPages || 1}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className={isDarkMode ? 'bg-[#0f172a]/60' : 'bg-slate-50'}>
              <th className={`px-2 py-2 w-8 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}></th>
              {[
                { key: 'area', label: 'Area' },
                { key: 'pincode', label: 'Pincode' },
                { key: 'population', label: 'Population' },
                { key: 'growth', label: 'Growth' },
                { key: 'opportunityScore', label: 'Opp. Score' },
                { key: 'demand', label: 'Demand' },
                { key: 'competitors', label: 'Comps' },
                { key: 'income', label: 'Income' },
              ].map(col => (
                <th key={col.key} className={thClass} onClick={() => handleSort(col.key)}>
                  <div className="flex items-center gap-1">
                    {col.label}
                    <SortIcon col={col.key} />
                  </div>
                </th>
              ))}
              <th className={`px-2 py-2 w-8 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}></th>
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => (
              <tr
                key={row.pincode || i}
                onClick={() => onAreaClick && onAreaClick(row)}
                className={`border-t transition-colors cursor-pointer ${
                  isDarkMode ? 'border-[#334155] hover:bg-[#0f172a]/40' : 'border-slate-100 hover:bg-slate-50'
                }`}
              >
                <td className="px-2 py-1.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite && onToggleFavorite(row); }}
                    className="p-0.5 transition-colors"
                  >
                    <Heart
                      size={12}
                      className={favorites?.has(row.pincode) ? 'fill-red-500 text-red-500' : isDarkMode ? 'text-slate-600 hover:text-red-400' : 'text-slate-300 hover:text-red-400'}
                    />
                  </button>
                </td>
                <td className="px-2 py-1.5">
                  <p className={`font-extrabold truncate max-w-[120px] ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{row.area || row.name || 'Unknown'}</p>
                </td>
                <td className={`px-2 py-1.5 font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{row.pincode || '-'}</td>
                <td className={`px-2 py-1.5 font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {(row.population || 0).toLocaleString()}
                </td>
                <td className="px-2 py-1.5">
                  <span className={`font-bold ${(row.populationGrowth || 0) >= 1 ? 'text-emerald-500' : (row.populationGrowth || 0) >= 0 ? 'text-amber-500' : 'text-red-500'}`}>
                    {(row.populationGrowth || 0) >= 0 ? '+' : ''}{(row.populationGrowth || 0).toFixed(2)}%
                  </span>
                </td>
                <td className="px-2 py-1.5">
                  <span className={`px-1.5 py-0.5 rounded-md font-extrabold text-[10px] ${getScoreBadge(row._avgGap)}`}>
                    {row._avgGap.toFixed(1)}
                  </span>
                </td>
                <td className={`px-2 py-1.5 font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{row._avgDemand.toFixed(0)}</td>
                <td className={`px-2 py-1.5 font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{row._totalComps}</td>
                <td className={`px-2 py-1.5 font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{row.incomeLevel || '-'}</td>
                <td className="px-2 py-1.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); onCompare && onCompare(row); }}
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded transition-colors ${
                      compareList?.some(c => c.pincode === row.pincode)
                        ? 'bg-blue-600 text-white'
                        : isDarkMode ? 'bg-[#0f172a] text-slate-400 hover:text-blue-400 border border-[#334155]' : 'bg-slate-100 text-slate-500 hover:text-blue-600 border border-slate-200'
                    }`}
                  >
                    {compareList?.some(c => c.pincode === row.pincode) ? '✓' : '+'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={`px-4 py-2 border-t flex items-center justify-between ${
          isDarkMode ? 'border-[#334155]' : 'border-slate-200'
        }`}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
              page === 1 ? 'opacity-40 cursor-not-allowed' : ''
            } ${isDarkMode ? 'bg-[#0f172a] text-slate-300 hover:border-blue-500 border border-[#334155]' : 'bg-slate-100 text-slate-600 hover:border-blue-400 border border-slate-200'}`}
          >
            <ChevronLeft size={12} /> Prev
          </button>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (page <= 3) pageNum = i + 1;
              else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = page - 2 + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-6 h-6 rounded-md text-[10px] font-extrabold transition-colors ${
                    page === pageNum
                      ? 'bg-blue-600 text-white'
                      : isDarkMode ? 'bg-[#0f172a] text-slate-400 hover:text-white border border-[#334155]' : 'bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
              page === totalPages ? 'opacity-40 cursor-not-allowed' : ''
            } ${isDarkMode ? 'bg-[#0f172a] text-slate-300 hover:border-blue-500 border border-[#334155]' : 'bg-slate-100 text-slate-600 hover:border-blue-400 border border-slate-200'}`}
          >
            Next <ChevronRight size={12} />
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default DataTable;
