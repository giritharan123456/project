import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Filter, X, ChevronDown, Check } from 'lucide-react';

function DataFilter({ pincodeData, filters, onFiltersChange, onClear, resultCount, totalCount }) {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen]);

  const incomeLevels = [...new Set((pincodeData || []).map(p => p.incomeLevel).filter(Boolean))].sort();
  const hasActiveFilters = Object.keys(filters).length > 0;

  const handleChange = (key, value) => {
    const next = { ...filters };
    if (value === '' || value === null || value === undefined) delete next[key];
    else next[key] = value;
    onFiltersChange(next);
  };

  const clearAll = () => {
    onFiltersChange({});
    if (onClear) onClear();
  };

  const getActiveCount = () => Object.keys(filters).length;

  const inputCls = `w-full px-3 py-2.5 rounded-lg text-sm font-semibold border transition-all outline-none ${
    isDarkMode ? 'bg-[#0f172a] border-[#334155] text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
  }`;

  const labelCls = `text-[11px] font-bold uppercase tracking-wider mb-1.5 block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 border-2 shadow-lg ${
          hasActiveFilters
            ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white border-blue-500 shadow-blue-500/25'
            : isDarkMode
              ? 'bg-[#1e293b] text-white border-[#475569] hover:border-blue-500'
              : 'bg-white text-slate-700 border-slate-300 hover:border-blue-500'
        }`}
      >
        <Filter size={16} className={hasActiveFilters ? 'text-white' : 'text-blue-500'} />
        <span>Filter</span>
        {hasActiveFilters && (
          <span className="px-1.5 py-0.5 rounded-full bg-white/25 text-[10px] font-extrabold">{getActiveCount()}</span>
        )}
      </button>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border-2 shadow-2xl ${
              isDarkMode ? 'bg-[#1e293b] border-[#475569]' : 'bg-white border-slate-200'
            }`}
          >
            <div className={`sticky top-0 z-10 px-5 py-4 border-b flex items-center justify-between ${
              isDarkMode ? 'bg-[#1e293b]' : 'bg-white'
            }`}>
              <div>
                <h4 className={`text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Filter Areas</h4>
                {resultCount != null && totalCount != null && (
                  <p className={`text-xs font-bold mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Showing <span className={resultCount > 0 ? 'text-emerald-500' : 'text-red-500'}>{resultCount}</span> of {totalCount} areas
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button onClick={clearAll} className="text-xs font-bold text-blue-500 hover:text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-500/10 border border-blue-500/30">
                    Clear All
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Income Level</label>
                  <div className="relative">
                    <select value={filters.incomeLevel || ''} onChange={(e) => handleChange('incomeLevel', e.target.value)} className={`${inputCls} appearance-none pr-8`}>
                      <option value="">All Levels</option>
                      {incomeLevels.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <ChevronDown size={14} className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Opportunity</label>
                  <div className="relative">
                    <select value={filters.opportunityLevel || ''} onChange={(e) => handleChange('opportunityLevel', e.target.value)} className={`${inputCls} appearance-none pr-8`}>
                      <option value="">All Levels</option>
                      <option value="high">High (&ge;65)</option>
                      <option value="medium">Medium (50-64)</option>
                      <option value="low">Low (&lt;50)</option>
                    </select>
                    <ChevronDown size={14} className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Min Population</label>
                  <input type="number" placeholder="No minimum" value={filters.minPopulation || ''} onChange={(e) => handleChange('minPopulation', e.target.value ? Number(e.target.value) : null)} className={inputCls} min="0" />
                </div>

                <div>
                  <label className={labelCls}>Max Population</label>
                  <input type="number" placeholder="No maximum" value={filters.maxPopulation || ''} onChange={(e) => handleChange('maxPopulation', e.target.value ? Number(e.target.value) : null)} className={inputCls} min="0" />
                </div>

                <div>
                  <label className={labelCls}>Min Growth %</label>
                  <input type="number" step="0.1" placeholder="No minimum" value={filters.minGrowth != null ? filters.minGrowth : ''} onChange={(e) => handleChange('minGrowth', e.target.value !== '' ? Number(e.target.value) : null)} className={inputCls} />
                </div>

                <div>
                  <label className={labelCls}>Max Growth %</label>
                  <input type="number" step="0.1" placeholder="No maximum" value={filters.maxGrowth != null ? filters.maxGrowth : ''} onChange={(e) => handleChange('maxGrowth', e.target.value !== '' ? Number(e.target.value) : null)} className={inputCls} />
                </div>
              </div>

              <div className={`mt-4 pt-3 border-t ${isDarkMode ? 'border-[#334155]' : 'border-slate-200'}`}>
                <label className={labelCls}>Quick Filters</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'High Income', filter: { incomeLevel: 'High' } },
                    { label: 'Low Income', filter: { incomeLevel: 'Low' } },
                    { label: 'High Opportunity', filter: { opportunityLevel: 'high' } },
                    { label: 'Fast Growing', filter: { minGrowth: 1.5 } },
                    { label: 'Pop > 50K', filter: { minPopulation: 50000 } },
                  ].map(qf => {
                    const isActive = JSON.stringify(filters) === JSON.stringify(qf.filter);
                    return (
                      <button key={qf.label} onClick={() => isActive ? clearAll() : onFiltersChange(qf.filter)}
                        className={`px-3 py-2 min-h-[40px] rounded-lg text-xs font-bold border-2 transition-all ${
                          isActive
                            ? isDarkMode ? 'bg-blue-900/40 border-blue-500 text-blue-300' : 'bg-blue-50 border-blue-400 text-blue-700'
                            : isDarkMode ? 'bg-[#0f172a] border-[#334155] text-slate-300 hover:border-blue-400' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-blue-400'
                        }`}
                      >
                        {isActive && <Check size={12} className="inline mr-1" />}
                        {qf.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {hasActiveFilters && (
                <div className={`mt-3 pt-3 border-t flex items-center justify-between ${isDarkMode ? 'border-[#334155]' : 'border-slate-200'}`}>
                  <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{getActiveCount()} filter(s) active</span>
                  {resultCount != null && (
                    <span className={`text-xs font-extrabold ${resultCount > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {resultCount} match{resultCount !== 1 ? 'es' : ''}
                    </span>
                  )}
                </div>
              )}

              <button
                onClick={() => setIsOpen(false)}
                className="w-full mt-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-extrabold hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
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
    if (filters.minPopulation != null && pop < filters.minPopulation) return false;
    if (filters.maxPopulation != null && pop > filters.maxPopulation) return false;
    const growth = p.populationGrowth || 0;
    if (filters.minGrowth != null && growth < filters.minGrowth) return false;
    if (filters.maxGrowth != null && growth > filters.maxGrowth) return false;
    return true;
  });
}

export default DataFilter;
