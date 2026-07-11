import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, TrendingUp, Building2, Target, BarChart3, X, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { averageOfValues } from '../utils/dataUtils';

export default function SearchResultCard({ area, loading, error, onClose }) {
  const { isDarkMode } = useTheme();

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`rounded-xl border-2 p-4 ${
          isDarkMode ? 'bg-[#1e293b] border-blue-500/40' : 'bg-white border-blue-200 shadow-md'
        }`}
      >
        <div className="flex items-center gap-3">
          <Loader2 className="animate-spin text-blue-500" size={20} />
          <span className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Fetching area data...
          </span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`rounded-xl border-2 p-4 ${
          isDarkMode ? 'bg-[#1e293b] border-red-500/40' : 'bg-white border-red-200 shadow-md'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <MapPin className="text-red-500" size={16} />
            </div>
            <div>
              <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Area Not Found</p>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{error}</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className={`p-1 rounded-lg ${isDarkMode ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
              <X size={16} />
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  if (!area) return null;

  const gapScores = area.marketGapScores || {};
  const demandScores = area.demandScores || {};
  const competitors = area.competitors || {};
  const avgGap = averageOfValues(gapScores) ?? area.opportunityScore ?? 0;
  const avgDemand = averageOfValues(demandScores) ?? 0;
  const totalCompetitors = Object.values(competitors).reduce((s, v) => s + (Number(v) || 0), 0);

  const topCategories = Object.entries(gapScores)
    .sort(([, a], [, b]) => Number(b) - Number(a))
    .slice(0, 5);

  const getOppColor = (score) => {
    if (score >= 65) return { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/30', label: 'High' };
    if (score >= 50) return { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30', label: 'Medium' };
    return { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/30', label: 'Low' };
  };

  const opp = getOppColor(avgGap);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl border-2 overflow-hidden ${
        isDarkMode ? 'bg-[#1e293b] border-blue-500/30' : 'bg-white border-blue-200 shadow-lg'
      }`}
    >
      {/* Header */}
      <div className={`px-4 py-3 flex items-center justify-between ${
        isDarkMode ? 'bg-blue-500/10 border-b border-[#334155]' : 'bg-blue-50 border-b border-blue-100'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg">
            <MapPin className="text-white" size={20} />
          </div>
          <div>
            <h3 className={`text-lg font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {area.name || area.area || 'Unknown Area'}
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <span className={`font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Pincode: {area.pincode || 'N/A'}
              </span>
              <span className={isDarkMode ? 'text-slate-600' : 'text-slate-300'}>|</span>
              <span className={`font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {area.district?.name || area.district || 'N/A'}
              </span>
            </div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'}`}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Key Metrics Row */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-y md:divide-y-0 ${isDarkMode ? 'divide-[#334155]' : 'divide-slate-100'}`}>
        {/* Population */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <Users size={14} className="text-blue-500" />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Population
            </span>
          </div>
          <p className={`text-xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {area.population != null ? Number(area.population).toLocaleString() : 'N/A'}
          </p>
          {area.populationGrowth != null && (
            <p className={`text-[10px] font-bold mt-0.5 ${Number(area.populationGrowth) >= 1 ? 'text-emerald-500' : Number(area.populationGrowth) >= 0 ? 'text-amber-500' : 'text-red-500'}`}>
              {Number(area.populationGrowth) >= 0 ? '+' : ''}{Number(area.populationGrowth).toFixed(2)}% growth
            </p>
          )}
        </div>

        {/* Opportunity Score */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <Target size={14} className="text-violet-500" />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Opportunity
            </span>
          </div>
          <div className="flex items-center gap-2">
            <p className={`text-xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {avgGap.toFixed(2)}
            </p>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${opp.bg} ${opp.text} ${opp.border}`}>
              {opp.label}
            </span>
          </div>
        </div>

        {/* Demand Score */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={14} className="text-amber-500" />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Avg Demand
            </span>
          </div>
          <p className={`text-xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {avgDemand.toFixed(2)}
          </p>
        </div>

        {/* Competitors */}
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <Building2 size={14} className="text-red-500" />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Competitors
            </span>
          </div>
          <p className={`text-xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {totalCompetitors}
          </p>
        </div>
      </div>

      {/* Top Categories */}
      {topCategories.length > 0 && (
        <div className={`px-4 py-2.5 border-t ${isDarkMode ? 'border-[#334155]' : 'border-slate-100'}`}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Top Gap Categories:
            </span>
            {topCategories.map(([cat, score]) => (
              <span
                key={cat}
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  score >= 65
                    ? 'bg-red-500/10 text-red-500'
                    : score >= 50
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'bg-emerald-500/10 text-emerald-500'
                }`}
              >
                {cat}: {Number(score).toFixed(2)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Location + Income */}
      <div className={`px-4 py-2 border-t flex items-center gap-4 text-[11px] font-semibold ${
        isDarkMode ? 'border-[#334155] text-slate-500' : 'border-slate-100 text-slate-400'
      }`}>
        {area.incomeLevel && (
          <span>Income: <strong className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{area.incomeLevel}</strong></span>
        )}
        {area.urbanDevelopment != null && (
          <span>Urban Dev: <strong className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{area.urbanDevelopment}/100</strong></span>
        )}
        {area.lat && area.lng && (
          <span>Coords: <strong className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{Number(area.lat).toFixed(4)}, {Number(area.lng).toFixed(4)}</strong></span>
        )}
      </div>
    </motion.div>
  );
}
