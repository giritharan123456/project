import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Filter, X, ChevronDown } from 'lucide-react';

function DataFilter({ pincodeData, filters, onFiltersChange, onClear }) {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const incomeLevels = [...new Set((pincodeData || []).map(p => p.incomeLevel).filter(Boolean))];
  const hasActiveFilters = filters.incomeLevel || filters.opportunityLevel || filters.minPopulation || filters.maxPopulation || filters.minGrowth || filters.maxGrowth;

  const handleChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
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
    if (filters.minGrowth) count++;
    if (filters.maxGrowth) count++;
    return count;
  };

  const inputClass = `w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 outline-none ${
    isDarkMode
      ? 'bg-[#0f172a] border-[#334155] text-white focus:border-blue-500'
      : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
  }`;

  const labelClass = `text-[10px] font-bold uppercase tracking-wider mb-1 block ${
    isDarkMode ? 'text-slate-400' : 'text-slate-500'
  }`;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
          hasActiveFilters
            ? 'bg-blue-600 text-white shadow-md'
            : isDarkMode
              ? 'bg-[#0f172a] text-slate-300 border border-[#334155] hover:border-blue-500'
              : 'bg-slate-100 text-slate-600 border border-slate-200 hover:border-blue-400'
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

      {isOpen && (
        <div
          className={`absolute top-full left-0 mt-2 p-3 rounded-xl border shadow-2xl z-50 w-[320px] sm:w-[400px] ${
            isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-200'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className={`text-sm font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Filter Areas</h4>
            <div className="flex items-center gap-1.5">
              {hasActiveFilters && (
                <button onClick={clearAll} className="text-[10px] font-bold text-blue-500 hover:text-blue-400 transition-colors">
                  Clear All
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className={`p-1 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Income Level */}
            <div>
              <label className={labelClass}>Income Level</label>
              <div className="relative">
                <select
                  value={filters.incomeLevel || ''}
                  onChange={(e) => handleChange('incomeLevel', e.target.value)}
                  className={`${inputClass} appearance-none pr-7 cursor-pointer`}
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
                  className={`${inputClass} appearance-none pr-7 cursor-pointer`}
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
                placeholder="0"
                value={filters.minPopulation || ''}
                onChange={(e) => handleChange('minPopulation', e.target.value ? Number(e.target.value) : '')}
                className={inputClass}
                min="0"
              />
            </div>

            {/* Max Population */}
            <div>
              <label className={labelClass}>Max Population</label>
              <input
                type="number"
                placeholder="No limit"
                value={filters.maxPopulation || ''}
                onChange={(e) => handleChange('maxPopulation', e.target.value ? Number(e.target.value) : '')}
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
                placeholder="0"
                value={filters.minGrowth || ''}
                onChange={(e) => handleChange('minGrowth', e.target.value ? Number(e.target.value) : '')}
                className={inputClass}
              />
            </div>

            {/* Max Growth */}
            <div>
              <label className={labelClass}>Max Growth %</label>
              <input
                type="number"
                step="0.1"
                placeholder="No limit"
                value={filters.maxGrowth || ''}
                onChange={(e) => handleChange('maxGrowth', e.target.value ? Number(e.target.value) : '')}
                className={inputClass}
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className={`mt-3 pt-2 border-t text-[10px] font-bold ${isDarkMode ? 'border-[#334155] text-slate-400' : 'border-slate-200 text-slate-500'}`}>
              {getActiveCount()} filter(s) active — showing matching areas
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function applyFilters(pincodeData, filters) {
  if (!pincodeData || !filters) return pincodeData;
  return pincodeData.filter(p => {
    if (filters.incomeLevel && p.incomeLevel !== filters.incomeLevel) return false;
    if (filters.opportunityLevel) {
      const score = p.opportunityScore || 0;
      if (filters.opportunityLevel === 'high' && score < 65) return false;
      if (filters.opportunityLevel === 'medium' && (score < 50 || score >= 65)) return false;
      if (filters.opportunityLevel === 'low' && score >= 50) return false;
    }
    if (filters.minPopulation && (p.population || 0) < filters.minPopulation) return false;
    if (filters.maxPopulation && (p.population || 0) > filters.maxPopulation) return false;
    if (filters.minGrowth != null && filters.minGrowth !== '' && (p.populationGrowth || 0) < filters.minGrowth) return false;
    if (filters.maxGrowth != null && filters.maxGrowth !== '' && (p.populationGrowth || 0) > filters.maxGrowth) return false;
    return true;
  });
}

export default DataFilter;
