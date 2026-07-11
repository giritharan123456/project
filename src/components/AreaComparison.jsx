import React, { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { X, BarChart3, Users, TrendingUp, Target, Building2 } from 'lucide-react';
import { averageOfValues } from '../utils/dataUtils';

function AreaComparison({ areas, onRemove, onClear, onOpenDetail }) {
  const { isDarkMode } = useTheme();

  if (!areas || areas.length === 0) return null;

  const maxPop = areas.reduce((max, a) => Math.max(max, a.population || 0), 0);
  const maxOpp = areas.reduce((max, a) => Math.max(max, a.opportunityScore ?? averageOfValues(a.marketGapScores) ?? 0), 0);

  const getBarWidth = (value, max) => max > 0 ? `${(value / max) * 100}%` : '0%';

  const getScoreColor = (score) => {
    if (score >= 65) return { bg: 'bg-red-500', text: 'text-red-500', light: 'bg-red-500/10' };
    if (score >= 50) return { bg: 'bg-amber-500', text: 'text-amber-500', light: 'bg-amber-500/10' };
    return { bg: 'bg-emerald-500', text: 'text-emerald-500', light: 'bg-emerald-500/10' };
  };

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
          <BarChart3 size={14} className="text-blue-500" />
          <span className={`text-sm font-extrabold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Compare Areas ({areas.length})
          </span>
        </div>
        <button onClick={onClear} className="text-[10px] font-bold text-blue-500 hover:text-blue-400 transition-colors">
          Clear All
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="p-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {areas.map((area, idx) => {
            const avgGap = area.opportunityScore ?? averageOfValues(area.marketGapScores) ?? 0;
            const avgDemand = averageOfValues(area.demandScores) ?? 0;
            const totalComps = Object.values(area.competitors || {}).reduce((s, v) => s + (Number(v) || 0), 0);
            const colors = getScoreColor(avgGap);

            return (
              <div
                key={area.pincode || idx}
                className={`relative p-3 rounded-xl border transition-all duration-200 ${
                  isDarkMode ? 'bg-[#0f172a] border-[#334155] hover:border-blue-500/50' : 'bg-[#f8fafc] border-slate-200 hover:border-blue-400'
                }`}
              >
                <button
                  onClick={() => onRemove(area.pincode)}
                  className={`absolute top-1.5 right-1.5 p-1 rounded-full transition-colors ${
                    isDarkMode ? 'hover:bg-white/10 text-slate-500 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <X size={12} />
                </button>

                <h5
                  className={`text-xs font-extrabold mb-2 pr-5 cursor-pointer hover:underline ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}
                  onClick={() => onOpenDetail && onOpenDetail(area)}
                >
                  {area.area || area.name || 'Unknown'}
                </h5>

                {/* Score Badge */}
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full mb-2 ${colors.light}`}>
                  <span className={`text-[10px] font-extrabold ${colors.text}`}>{avgGap.toFixed(1)}</span>
                  <span className={`text-[9px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>opp</span>
                </div>

                {/* Metrics */}
                <div className="space-y-2">
                  {/* Population */}
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1">
                        <Users size={10} className="text-blue-500" />
                        <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Population</span>
                      </div>
                      <span className={`text-[10px] font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        {(area.population || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: getBarWidth(area.population || 0, maxPop) }} />
                    </div>
                  </div>

                  {/* Opportunity */}
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1">
                        <Target size={10} className="text-violet-500" />
                        <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Opportunity</span>
                      </div>
                      <span className={`text-[10px] font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        {avgGap.toFixed(1)}
                      </span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: getBarWidth(avgGap, maxOpp) }} />
                    </div>
                  </div>

                  {/* Demand */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <TrendingUp size={10} className="text-amber-500" />
                      <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Demand</span>
                    </div>
                    <span className={`text-[10px] font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      {avgDemand.toFixed(1)}
                    </span>
                  </div>

                  {/* Competitors */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Building2 size={10} className="text-red-500" />
                      <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Competitors</span>
                    </div>
                    <span className={`text-[10px] font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      {totalComps}
                    </span>
                  </div>

                  {/* Growth */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Growth</span>
                    <span className={`text-[10px] font-extrabold ${(area.populationGrowth || 0) >= 1 ? 'text-emerald-500' : (area.populationGrowth || 0) >= 0 ? 'text-amber-500' : 'text-red-500'}`}>
                      {(area.populationGrowth || 0) >= 0 ? '+' : ''}{(area.populationGrowth || 0).toFixed(2)}%
                    </span>
                  </div>

                  {/* Income */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Income</span>
                    <span className={`text-[10px] font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      {area.incomeLevel || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Top Category */}
                {area.marketGapScores && Object.keys(area.marketGapScores).length > 0 && (
                  <div className={`mt-2 pt-2 border-t ${isDarkMode ? 'border-[#334155]' : 'border-slate-200'}`}>
                    <span className={`text-[9px] font-bold uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Top Category</span>
                    <p className={`text-[10px] font-extrabold mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      {Object.entries(area.marketGapScores).sort(([, a], [, b]) => Number(b) - Number(a))[0]?.[0] || 'N/A'}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default AreaComparison;
