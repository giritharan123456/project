import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Users, TrendingUp, Target, Building2, BarChart3, DollarSign, Home, Globe2, BookOpen } from 'lucide-react';
import { averageOfValues } from '../utils/dataUtils';

function AreaDetailDrilldown({ area, onClose, onCompare, isComparing }) {
  const { isDarkMode } = useTheme();

  if (!area) return null;

  const avgGap = area.opportunityScore ?? averageOfValues(area.marketGapScores) ?? 0;
  const avgDemand = averageOfValues(area.demandScores) ?? 0;
  const totalComps = Object.values(area.competitors || {}).reduce((s, v) => s + (Number(v) || 0), 0);

  const getScoreColor = (score) => {
    if (score >= 65) return { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/30', label: 'High Opportunity' };
    if (score >= 50) return { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30', label: 'Medium Opportunity' };
    return { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/30', label: 'Low Opportunity' };
  };

  const opp = getScoreColor(avgGap);

  const sortedGap = Object.entries(area.marketGapScores || {}).sort(([, a], [, b]) => Number(b) - Number(a));
  const sortedDemand = Object.entries(area.demandScores || {}).sort(([, a], [, b]) => Number(b) - Number(a));
  const sortedCompetitors = Object.entries(area.competitors || {}).sort(([, a], [, b]) => Number(b) - Number(a));

  const MetricCard = ({ icon: Icon, iconColor, label, value, sub }) => (
    <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-slate-200'}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon size={14} className={iconColor} />
        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
      </div>
      <p className={`text-lg font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{value}</p>
      {sub && <p className={`text-[10px] font-semibold mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{sub}</p>}
    </div>
  );

  const ScoreBar = ({ label, score, max = 100 }) => (
    <div className="flex items-center gap-2">
      <span className={`text-[11px] font-bold w-24 truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{label}</span>
      <div className={`flex-1 h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${Math.min(100, (Number(score) / max) * 100)}%`,
            background: Number(score) >= 65 ? '#ef4444' : Number(score) >= 50 ? '#f59e0b' : '#22c55e'
          }}
        />
      </div>
      <span className={`text-[11px] font-extrabold w-8 text-right ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
        {Number(score).toFixed(1)}
      </span>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl ${
            isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-200'
          }`}
        >
          {/* Header */}
          <div className={`sticky top-0 z-10 px-4 py-3 border-b backdrop-blur-sm ${
            isDarkMode ? 'bg-[#1e293b]/95 border-[#334155]' : 'bg-white/95 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg">
                  <MapPin className="text-white" size={20} />
                </div>
                <div>
                  <h3 className={`text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {area.area || area.name || 'Unknown Area'}
                  </h3>
                  <p className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {area.district?.name || area.district || 'N/A'} &middot; {area.pincode || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {onCompare && (
                  <button
                    onClick={() => onCompare(area)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      isComparing
                        ? 'bg-blue-600 text-white'
                        : isDarkMode ? 'bg-[#0f172a] text-slate-300 border border-[#334155] hover:border-blue-500' : 'bg-slate-100 text-slate-600 border border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    {isComparing ? '✓ Comparing' : '+ Compare'}
                  </button>
                )}
                <button
                  onClick={onClose}
                  className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'}`}
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Score Badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${opp.bg} ${opp.border}`}>
              <span className={`text-sm font-extrabold ${opp.text}`}>{avgGap.toFixed(1)}</span>
              <span className={`text-xs font-bold ${opp.text}`}>{opp.label}</span>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <MetricCard icon={Users} iconColor="text-blue-500" label="Population" value={(area.population || 0).toLocaleString()} sub={area.populationGrowth != null ? `${Number(area.populationGrowth) >= 0 ? '+' : ''}${Number(area.populationGrowth).toFixed(2)}% growth` : undefined} />
              <MetricCard icon={Target} iconColor="text-violet-500" label="Opportunity" value={avgGap.toFixed(1)} sub="Score out of 100" />
              <MetricCard icon={TrendingUp} iconColor="text-amber-500" label="Demand" value={avgDemand.toFixed(1)} sub="Demand index" />
              <MetricCard icon={Building2} iconColor="text-red-500" label="Competitors" value={totalComps} sub="Total businesses" />
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <MetricCard icon={DollarSign} iconColor="text-emerald-500" label="Income Level" value={area.incomeLevel || 'N/A'} />
              <MetricCard icon={Home} iconColor="text-cyan-500" label="Urban Dev" value={area.urbanDevelopment != null ? `${area.urbanDevelopment}/100` : 'N/A'} />
              <MetricCard icon={Globe2} iconColor="text-indigo-500" label="Coordinates" value={area.lat && area.lng ? `${Number(area.lat).toFixed(4)}, ${Number(area.lng).toFixed(4)}` : 'N/A'} />
              <MetricCard icon={BookOpen} iconColor="text-pink-500" label="Literacy" value={area.literacyRate != null ? `${area.literacyRate}%` : 'N/A'} />
            </div>

            {/* Market Gap Scores */}
            {sortedGap.length > 0 && (
              <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-slate-200'}`}>
                <h4 className={`text-xs font-extrabold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Market Gap by Category</h4>
                <div className="space-y-1.5">
                  {sortedGap.map(([cat, score]) => (
                    <ScoreBar key={cat} label={cat} score={score} />
                  ))}
                </div>
              </div>
            )}

            {/* Demand Scores */}
            {sortedDemand.length > 0 && (
              <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-slate-200'}`}>
                <h4 className={`text-xs font-extrabold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Demand by Category</h4>
                <div className="space-y-1.5">
                  {sortedDemand.map(([cat, score]) => (
                    <ScoreBar key={cat} label={cat} score={score} />
                  ))}
                </div>
              </div>
            )}

            {/* Competitors */}
            {sortedCompetitors.length > 0 && (
              <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-slate-200'}`}>
                <h4 className={`text-xs font-extrabold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Competitors by Category</h4>
                <div className="space-y-1.5">
                  {sortedCompetitors.map(([cat, count]) => (
                    <ScoreBar key={cat} label={cat} score={count} max={sortedCompetitors.reduce((max, [, v]) => Math.max(max, Number(v) || 0), 1)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AreaDetailDrilldown;
