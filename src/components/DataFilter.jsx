import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Filter, X, ChevronDown, Check } from 'lucide-react';

function DataFilter({ pincodeData, filters, onFiltersChange, onClear, resultCount, totalCount }) {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Click outside to close
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
    // Clean up empty values
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

  const selectClass = `w-full px-2.5 py-2 rounded-lg text-xs font-semibold border transition-all duration-200 outline-none cursor-pointer ${
    isDarkMode
      ? 'bg-[#0f172a] border-[#334155] text-white focus:border-blue-500'
      : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
  }`;

  const inputClass = `w-full px-2.5 py-2 rounded-lg text-xs font-semibold border transition-all duration-200 outline-none ${
    isDarkMode
      ? 'bg-[#0f172a] border-[#334155] text-white focus:border-blue-500'
      : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
  }`;

  const labelClass = `text-[10px] font-bold uppercase tracking-wider mb-1 block ${
    isDarkMode ? 'text-slate-400' : 'text-slate-500'
  }`;

  const activeBg = isDarkMode ? 'bg-blue-900/40 border-blue-500 text-blue-300' : 'bg-blue-50 border-blue-400 text-blue-700';
  const inactiveBg = isDarkMode ? 'bg-[#0f172a] border-[#334155] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 border ${
          hasActiveFilters
            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
            : isDarkMode
              ? 'bg-[#0f172a] text-slate-300 border-[#334155] hover:border-blue-500 hover:text-white'
              : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600'
        }`}
      >
        <Filter size={13} />
        Filters
        {hasActiveFilters && (
          <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold">
            {getActiveCount()}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`absolute top-full left-0 mt-2 p-4 rounded-xl border shadow-2xl z-[60] w-[340px] sm:w-[420px] ${
            isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-200'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className={`text-sm font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Filter Areas</h4>
              {resultCount != null && totalCount != null && (
                <p className={`text-[10px] font-bold mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Showing {resultCount} of {totalCount} areas
                </p>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {hasActiveFilters && (
                <button onClick={clearAll} className="text-[10px] font-bold text-blue-500 hover:text-blue-400 transition-colors px-2 py-1 rounded-md hover:bg-blue-500/10">
                  Clear All
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className={`p-1 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Filter Options */}
          <div className="grid grid-cols-2 gap-3">
            {/* Income Level */}
            <div>
              <label className={labelClass}>Income Level</label>
              <div className="relative">
                <select
                  value={filters.incomeLevel || ''}
                  onChange={(e) => handleChange('incomeLevel', e.target.value)}
                  className={`${selectClass} appearance-none pr-7`}
                >
                  <option value="">All Levels</option>
                  {incomeLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <ChevronDown size={12} className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              </div>
            </div>

            {/* Opportunity Level */}
            <div>
              <label className={labelClass}>Opportunity</label>
              <div className="relative">
                <select
                  value={filters.opportunityLevel || ''}
                  onChange={(e) => handleChange('opportunityLevel', e.target.value)}
                  className={`${selectClass} appearance-none pr-7`}
                >
                  <option value="">All Levels</option>
                  <option value="high">High (≥65)</option>
                  <option value="medium">Medium (50-64)</option>
                  <option value="low">Low (&lt;50)</option>
                </select>
                <ChevronDown size={12} className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              </div>
            </div>

            {/* Min Population */}
            <div>
              <label className={labelClass}>Min Population</label>
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
              <label className={labelClass}>Max Population</label>
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
              <label className={labelClass}>Min Growth %</label>
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
              <label className={labelClass}>Max Growth %</label>
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
          <div className={`mt-3 pt-3 border-t ${isDarkMode ? 'border-[#334155]' : 'border-slate-200'}`}>
            <label className={labelClass}>Quick Filters</label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'High Income', filter: { incomeLevel: 'High' } },
                { label: 'Low Income', filter: { incomeLevel: 'Low' } },
                { label: 'High Opportunity', filter: { opportunityLevel: 'high' } },
                { label: 'Fast Growing', filter: { minGrowth: 1.5 } },
                { label: 'Pop > 50K', filter: { minPopulation: 50000 } },
              ].map(qf => {
                const isActive = JSON.stringify(filters) === JSON.stringify(qf.filter);
                return (
                  <button
                    key={qf.label}
                    onClick={() => {
                      if (isActive) clearAll();
                      else onFiltersChange(qf.filter);
                    }}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-all ${
                      isActive ? activeBg : `${inactiveBg} hover:border-blue-400`
                    }`}
                  >
                    {isActive && <Check size={10} className="inline mr-0.5" />}
                    {qf.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className={`mt-3 pt-2 border-t flex items-center justify-between ${isDarkMode ? 'border-[#334155]' : 'border-slate-200'}`}>
              <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {getActiveCount()} filter(s) active
              </span>
              {resultCount != null && (
                <span className={`text-[10px] font-extrabold ${resultCount > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
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
    // Income Level filter
    if (filters.incomeLevel && p.incomeLevel !== filters.incomeLevel) return false;

    // Opportunity Level filter
    if (filters.opportunityLevel) {
      const score = p.opportunityScore || 0;
      if (filters.opportunityLevel === 'high' && score < 65) return false;
      if (filters.opportunityLevel === 'medium' && (score < 50 || score >= 65)) return false;
      if (filters.opportunityLevel === 'low' && score >= 50) return false;
    }

    // Population filters
    const pop = p.population || 0;
    if (filters.minPopulation != null && filters.minPopulation !== '' && pop < filters.minPopulation) return false;
    if (filters.maxPopulation != null && filters.maxPopulation !== '' && pop > filters.maxPopulation) return false;

    // Growth filters
    const growth = p.populationGrowth || 0;
    if (filters.minGrowth != null && filters.minGrowth !== '' && growth < filters.minGrowth) return false;
    if (filters.maxGrowth != null && filters.maxGrowth !== '' && growth > filters.maxGrowth) return false;

    return true;
  });
}

export default DataFilter;
