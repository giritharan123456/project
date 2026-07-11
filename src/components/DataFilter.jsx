import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Filter, X, ChevronDown, Check } from 'lucide-react';

function DataFilter({ pincodeData, filters, onFiltersChange, onClear, resultCount, totalCount }) {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const incomeLevels = [...new Set((pincodeData || []).map(p => p.incomeLevel).filter(Boolean))].sort();
  const hasActiveFilters = filters.incomeLevel || filters.opportunityLevel || filters.minPopulation || filters.maxPopulation || filters.minGrowth != null || filters.maxGrowth != null;

  const handleChange = (key, value) => {
    const next = { ...filters, [key]: value };
    if (value === '' || value === null || value === undefined) delete next[key];
    onFiltersChange(next);
  };

  const clearAll = () => {
    onFiltersChange({});
    if (onClear) onClear();
  };

  const getActiveCount = () => {
    let count = 0;
    if (filters.incomeLevel) count++;
    if (filters.opportunityLevel) count++;
    if (filters.minPopulation) count++;
    if (filters.maxPopulation) count++;
    if (filters.minGrowth != null) count++;
    if (filters.maxGrowth != null) count++;
    return count;
  };

  const selectClass = `w-full px-3 py-2.5 rounded-lg text-sm font-semibold border transition-all duration-200 outline-none cursor-pointer ${
    isDarkMode
      ? 'bg-[#0f172a] border-[#334155] text-white focus:border-blue-500'
      : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
  }`;

  const inputClass = `w-full px-3 py-2.5 rounded-lg text-sm font-semibold border transition-all duration-200 outline-none ${
    isDarkMode
      ? 'bg-[#0f172a] border-[#334155] text-white focus:border-blue-500'
      : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
  }`;

  const labelClass = `text-[11px] font-bold uppercase tracking-wider mb-1.5 block ${
    isDarkMode ? 'text-slate-400' : 'text-slate-500'
  }`;

  const activeBg = isDarkMode ? 'bg-blue-900/40 border-blue-500 text-blue-300' : 'bg-blue-50 border-blue-400 text-blue-700';
  const inactiveBg = isDarkMode ? 'bg-[#0f172a] border-[#334155] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ═══ FILTER BUTTON — Large & Visible ═══ */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-extrabold transition-all duration-200 border-2 shadow-lg ${
          hasActiveFilters
            ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white border-blue-500 shadow-blue-500/25'
            : isDarkMode
              ? 'bg-[#1e293b] text-white border-[#475569] hover:border-blue-500 hover:shadow-blue-500/20'
              : 'bg-white text-slate-700 border-slate-300 hover:border-blue-500 hover:shadow-blue-500/20'
        }`}
      >
        <Filter size={18} className={hasActiveFilters ? 'text-white' : 'text-blue-500'} />
        <span>Filter Areas</span>
        {hasActiveFilters && (
          <span className="px-2 py-0.5 rounded-full bg-white/25 text-[11px] font-extrabold">
            {getActiveCount()}
          </span>
        )}
        {!hasActiveFilters && resultCount != null && totalCount != null && resultCount < totalCount && (
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
            isDarkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-50 text-blue-600'
          }`}>
            {resultCount}/{totalCount}
          </span>
        )}
      </button>

      {/* ═══ DROPDOWN ═══ */}
      {isOpen && (
        <div
          className={`absolute top-full right-0 mt-2 p-5 rounded-2xl border-2 shadow-2xl z-[60] w-[360px] sm:w-[440px] ${
            isDarkMode ? 'bg-[#1e293b] border-[#475569]' : 'bg-white border-slate-200'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className={`text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>🔍 Filter Areas</h4>
              {resultCount != null && totalCount != null && (
                <p className={`text-xs font-bold mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Showing <span className={resultCount > 0 ? 'text-emerald-500' : 'text-red-500'}>{resultCount}</span> of {totalCount} areas
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button onClick={clearAll} className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-500/10 border border-blue-500/30">
                  Clear All
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Income Level */}
            <div>
              <label className={labelClass}>💰 Income Level</label>
              <div className="relative">
                <select
                  value={filters.incomeLevel || ''}
                  onChange={(e) => handleChange('incomeLevel', e.target.value)}
                  className={`${selectClass} appearance-none pr-8`}
                >
                  <option value="">All Levels</option>
                  {incomeLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <ChevronDown size={14} className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              </div>
            </div>

            {/* Opportunity Level */}
            <div>
              <label className={labelClass}>🎯 Opportunity</label>
              <div className="relative">
                <select
                  value={filters.opportunityLevel || ''}
                  onChange={(e) => handleChange('opportunityLevel', e.target.value)}
                  className={`${selectClass} appearance-none pr-8`}
                >
                  <option value="">All Levels</option>
                  <option value="high">🟢 High (≥65)</option>
                  <option value="medium">🟡 Medium (50-64)</option>
                  <option value="low">🔴 Low (&lt;50)</option>
                </select>
                <ChevronDown size={14} className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              </div>
            </div>

            {/* Min Population */}
            <div>
              <label className={labelClass}>👥 Min Population</label>
              <input
                type="number"
                placeholder="No minimum"
                value={filters.minPopulation || ''}
                onChange={(e) => handleChange('minPopulation', e.target.value ? Number(e.target.value) : null)}
                className={inputClass}
                min="0"
              />
            </div>

            {/* Max Population */}
            <div>
              <label className={labelClass}>👥 Max Population</label>
              <input
                type="number"
                placeholder="No maximum"
                value={filters.maxPopulation || ''}
                onChange={(e) => handleChange('maxPopulation', e.target.value ? Number(e.target.value) : null)}
                className={inputClass}
                min="0"
              />
            </div>

            {/* Min Growth */}
            <div>
              <label className={labelClass}>📈 Min Growth %</label>
              <input
                type="number"
                step="0.1"
                placeholder="No minimum"
                value={filters.minGrowth != null ? filters.minGrowth : ''}
                onChange={(e) => handleChange('minGrowth', e.target.value !== '' ? Number(e.target.value) : null)}
                className={inputClass}
              />
            </div>

            {/* Max Growth */}
            <div>
              <label className={labelClass}>📉 Max Growth %</label>
              <input
                type="number"
                step="0.1"
                placeholder="No maximum"
                value={filters.maxGrowth != null ? filters.maxGrowth : ''}
                onChange={(e) => handleChange('maxGrowth', e.target.value !== '' ? Number(e.target.value) : null)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className={`mt-4 pt-3 border-t ${isDarkMode ? 'border-[#334155]' : 'border-slate-200'}`}>
            <label className={labelClass}>⚡ Quick Filters</label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '💰 High Income', filter: { incomeLevel: 'High' } },
                { label: '💰 Low Income', filter: { incomeLevel: 'Low' } },
                { label: '🎯 High Opportunity', filter: { opportunityLevel: 'high' } },
                { label: '📈 Fast Growing', filter: { minGrowth: 1.5 } },
                { label: '👥 Pop > 50K', filter: { minPopulation: 50000 } },
              ].map(qf => {
                const isActive = JSON.stringify(filters) === JSON.stringify(qf.filter);
                return (
                  <button
                    key={qf.label}
                    onClick={() => {
                      if (isActive) clearAll();
                      else onFiltersChange(qf.filter);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${
                      isActive ? activeBg : `${inactiveBg} hover:border-blue-400`
                    }`}
                  >
                    {isActive && <Check size={12} className="inline mr-1" />}
                    {qf.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className={`mt-4 pt-3 border-t flex items-center justify-between ${isDarkMode ? 'border-[#334155]' : 'border-slate-200'}`}>
              <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {getActiveCount()} filter(s) active
              </span>
              {resultCount != null && (
                <span className={`text-xs font-extrabold ${resultCount > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {resultCount} match{resultCount !== 1 ? 'es' : ''}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function applyFilters(pincodeData, filters) {
  if (!pincodeData || !filters || Object.keys(filters).length === 0) return pincodeData;
  return pincodeData.filter(p => {
    if (filters.incomeLevel && p.incomeLevel !== filters.incomeLevel) return false;
    if (filters.opportunityLevel) {
      const score = p.opportunityScore || 0;
      if (filters.opportunityLevel === 'high' && score < 65) return false;
      if (filters.opportunityLevel === 'medium' && (score < 50 || score >= 65)) return false;
      if (filters.opportunityLevel === 'low' && score >= 50) return false;
    }
    const pop = p.population || 0;
    if (filters.minPopulation != null && filters.minPopulation !== '' && pop < filters.minPopulation) return false;
    if (filters.maxPopulation != null && filters.maxPopulation !== '' && pop > filters.maxPopulation) return false;
    const growth = p.populationGrowth || 0;
    if (filters.minGrowth != null && filters.minGrowth !== '' && growth < filters.minGrowth) return false;
    if (filters.maxGrowth != null && filters.maxGrowth !== '' && growth > filters.maxGrowth) return false;
    return true;
  });
}

export default DataFilter;
