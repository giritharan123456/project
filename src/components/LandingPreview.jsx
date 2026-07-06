import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, TrendingUp, Target, BarChart3, Building2, ArrowRight, Lock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { averageOfValues } from '../utils/dataUtils';

export default function LandingPreview({ area, onNavigate }) {
  const { isDarkMode } = useTheme();
  const { isAuthenticated } = useAuth();
  if (!area) return null;

  const gapScores = area.marketGapScores || {};
  const demandScores = area.demandScores || {};
  const competitors = area.competitors || {};
  const avgGap = area.opportunityScore ?? averageOfValues(gapScores) ?? 0;
  const avgDemand = averageOfValues(demandScores) ?? 0;
  const totalCompetitors = Object.values(competitors).reduce((s, v) => s + (Number(v) || 0), 0);

  const sortedCategories = Object.entries(gapScores).sort(([, a], [, b]) => b - a);
  const maxScore = sortedCategories.length > 0 ? Math.max(...sortedCategories.map(([, v]) => v)) : 1;

  const getScoreColor = (score) => {
    if (score >= 65) return { bar: 'bg-red-500', text: 'text-red-500', badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
    if (score >= 50) return { bar: 'bg-amber-500', text: 'text-amber-500', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };
    return { bar: 'bg-emerald-500', text: 'text-emerald-500', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' };
  };

  const getOppLabel = (score) => {
    if (score >= 65) return { label: 'High Opportunity', cls: 'bg-red-500/10 text-red-500 border-red-500/30' };
    if (score >= 50) return { label: 'Medium Opportunity', cls: 'bg-amber-500/10 text-amber-500 border-amber-500/30' };
    return { label: 'Low Opportunity', cls: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' };
  };

  const opp = getOppLabel(avgGap);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`rounded-2xl border-2 overflow-hidden shadow-2xl ${
        isDarkMode ? 'bg-[#1e293b] border-[#2563eb]/30' : 'bg-white border-blue-200'
      }`}
    >
      {/* Header */}
      <div className={`px-6 py-4 flex items-center justify-between ${isDarkMode ? 'bg-blue-500/10 border-b border-[#334155]' : 'bg-gradient-to-r from-blue-50 to-violet-50 border-b border-blue-100'}`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2563eb] to-[#7c3aed] flex items-center justify-center shadow-lg">
            <MapPin className="text-white" size={24} />
          </div>
          <div>
            <h3 className={`text-xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {area.name || area.area}
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <span className={`font-semibold ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Pincode: {area.pincode}</span>
              <span className={isDarkMode ? 'text-slate-600' : 'text-gray-300'}>|</span>
              <span className={`font-semibold ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{area.district?.name || area.district}</span>
            </div>
          </div>
        </div>
        <span className={`text-sm font-bold px-3 py-1 rounded-full border ${opp.cls}`}>
          {opp.label}
        </span>
      </div>

      {/* Key Metrics */}
      <div className={`grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 ${isDarkMode ? 'divide-[#334155]' : 'divide-gray-100'}`}>
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-1">
            <Users size={14} className="text-blue-500" />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>Population</span>
          </div>
          <p className={`text-2xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {area.population != null ? Number(area.population).toLocaleString() : 'N/A'}
          </p>
          {area.populationGrowth != null && (
            <p className={`text-[11px] font-bold mt-0.5 ${Number(area.populationGrowth) >= 1 ? 'text-emerald-500' : 'text-amber-500'}`}>
              +{Number(area.populationGrowth).toFixed(2)}% growth
            </p>
          )}
        </div>
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-1">
            <Target size={14} className="text-violet-500" />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>Opportunity</span>
          </div>
          <p className={`text-2xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{avgGap.toFixed(2)}</p>
        </div>
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={14} className="text-amber-500" />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>Avg Demand</span>
          </div>
          <p className={`text-2xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{avgDemand.toFixed(2)}</p>
        </div>
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-1">
            <Building2 size={14} className="text-red-500" />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>Competitors</span>
          </div>
          <p className={`text-2xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{totalCompetitors}</p>
        </div>
      </div>

      {/* Category Breakdown Bar Chart */}
      {sortedCategories.length > 0 && (
        <div className={`px-6 py-4 border-t ${isDarkMode ? 'border-[#334155]' : 'border-gray-100'}`}>
          <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
            Market Gap by Category
          </h4>
          <div className="space-y-2.5">
            {sortedCategories.map(([cat, score]) => {
              const colors = getScoreColor(score);
              const width = Math.max(8, (score / maxScore) * 100);
              return (
                <div key={cat} className="flex items-center gap-3">
                  <span className={`text-xs font-semibold w-32 text-right truncate ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    {cat}
                  </span>
                  <div className={`flex-1 h-5 rounded-full overflow-hidden ${isDarkMode ? 'bg-[#0f172a]' : 'bg-gray-100'}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={`h-full rounded-full ${colors.bar}`}
                    />
                  </div>
                  <span className={`text-xs font-extrabold w-12 ${colors.text}`}>{score.toFixed(0)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Location Info */}
      <div className={`px-6 py-2.5 border-t flex items-center gap-4 text-[11px] font-semibold ${
        isDarkMode ? 'border-[#334155] text-slate-500' : 'border-gray-100 text-gray-400'
      }`}>
        {area.incomeLevel && <span>Income: <strong className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>{area.incomeLevel}</strong></span>}
        {area.urbanDevelopment != null && <span>Urban Dev: <strong className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>{area.urbanDevelopment}/100</strong></span>}
        {area.searchTrends != null && <span>Search Trends: <strong className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>{area.searchTrends}</strong></span>}
      </div>

      {/* CTA */}
      <button
        onClick={onNavigate}
        className={`w-full py-4 flex items-center justify-center gap-2 font-bold text-sm transition-all ${
          isAuthenticated
            ? 'bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white hover:opacity-90'
            : isDarkMode
              ? 'bg-[#0f172a] text-blue-400 hover:bg-[#0f172a]/80 border-t border-[#334155]'
              : 'bg-gray-50 text-[#2563eb] hover:bg-gray-100 border-t border-gray-200'
        }`}
      >
        {isAuthenticated ? (
          <>View Full Dashboard <ArrowRight size={16} /></>
        ) : (
          <>Login to View Full Dashboard <Lock size={14} /></>
        )}
      </button>
    </motion.div>
  );
}
