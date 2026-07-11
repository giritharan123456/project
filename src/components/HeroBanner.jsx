import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Target, BarChart3, ArrowUpRight, ArrowDownRight, Minus, Activity, Zap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { averageOfValues } from '../utils/dataUtils';

export default function HeroBanner({ pincodeData, selectedDistrict }) {
  const { isDarkMode } = useTheme();

  if (!pincodeData || pincodeData.length === 0) return null;

  const totalAreas = pincodeData.length;
  const highOpp = pincodeData.filter(p => {
    const score = p.opportunityScore || averageOfValues(p.marketGapScores) || 0;
    return score != null && score >= 65;
  }).length;
  const totalPop = pincodeData.reduce((s, p) => s + (p.population || 0), 0);
  const avgGrowth = (() => {
    const vals = pincodeData.map(p => p.populationGrowth).filter(v => v != null);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  })();
  const avgGap = (() => {
    const vals = pincodeData.map(p => averageOfValues(p.marketGapScores)).filter(v => v != null);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  })();
  const avgDemand = (() => {
    const vals = pincodeData.map(p => averageOfValues(p.demandScores)).filter(v => v != null);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  })();
  const totalCompetitors = pincodeData.reduce((s, p) => {
    const comps = Object.values(p.competitors || {});
    return s + comps.reduce((a, b) => a + (Number(b) || 0), 0);
  }, 0);

  const getTrend = (value, thresholds) => {
    if (value >= thresholds[0]) return { icon: ArrowUpRight, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Strong' };
    if (value >= thresholds[1]) return { icon: Minus, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Moderate' };
    return { icon: ArrowDownRight, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Low' };
  };

  const gapTrend = getTrend(avgGap, [70, 50]);
  const growthTrend = getTrend(avgGrowth, [1.5, 0.8]);
  const demandTrend = getTrend(avgDemand, [75, 55]);

  const kpis = [
    {
      label: 'Areas Analyzed',
      value: totalAreas,
      suffix: '',
      icon: MapPin,
      trend: null,
      color: 'from-blue-500 to-blue-600',
      borderColor: 'border-l-blue-500',
    },
    {
      label: 'High Opportunity',
      value: highOpp,
      suffix: '',
      icon: Target,
      trend: gapTrend,
      color: 'from-emerald-500 to-emerald-600',
      borderColor: 'border-l-emerald-500',
    },
    {
      label: 'Population Reach',
      value: totalPop > 1000000 ? `${(totalPop / 1000000).toFixed(1)}M` : totalPop > 1000 ? `${(totalPop / 1000).toFixed(0)}K` : (totalPop || 0),
      suffix: '',
      icon: Users,
      trend: growthTrend,
      color: 'from-violet-500 to-violet-600',
      borderColor: 'border-l-violet-500',
    },
    {
      label: 'Market Gap Score',
      value: avgGap.toFixed(2),
      suffix: '/100',
      icon: BarChart3,
      trend: gapTrend,
      color: 'from-amber-500 to-amber-600',
      borderColor: 'border-l-amber-500',
    },
    {
      label: 'Demand Index',
      value: avgDemand.toFixed(2),
      suffix: '/100',
      icon: Activity,
      trend: demandTrend,
      color: 'from-rose-500 to-rose-600',
      borderColor: 'border-l-rose-500',
    },
    {
      label: 'Competitors',
      value: totalCompetitors,
      suffix: '',
      icon: Zap,
      trend: null,
      color: 'from-cyan-500 to-cyan-600',
      borderColor: 'border-l-cyan-500',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl border overflow-hidden ${
        isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-200'
      }`}
    >
      {/* Executive Summary Header */}
      <div className={`px-3 sm:px-4 py-3 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
        isDarkMode ? 'border-[#334155] bg-[#0f172a]/40' : 'border-slate-100 bg-slate-50/50'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-blue-900/40' : 'bg-blue-50'}`}>
            <MapPin size={14} className="text-blue-600" />
          </div>
          <div>
            <h2 className={`text-sm font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {selectedDistrict || 'Select a District'}
            </h2>
            <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Executive Overview — {totalAreas} locations analyzed
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-[10px] sm:text-xs font-bold ${
          avgGap >= 70
            ? isDarkMode ? 'bg-emerald-900/20 border-emerald-700/40 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : avgGap >= 50
              ? isDarkMode ? 'bg-amber-900/20 border-amber-700/40 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700'
              : isDarkMode ? 'bg-slate-800 border-slate-600 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${avgGap >= 70 ? 'bg-emerald-500' : avgGap >= 50 ? 'bg-amber-500' : 'bg-slate-400'}`} />
          {avgGap >= 70 ? 'Excellent' : avgGap >= 50 ? 'Moderate' : 'Developing'}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="p-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.04 }}
              className={`relative p-3 rounded-xl border-l-4 ${kpi.borderColor} ${
                isDarkMode ? 'bg-[#0f172a]/60 border-r border-t border-b border-[#334155]' : 'bg-slate-50/80 border-r border-t border-b border-slate-100'
              } transition-all duration-200 hover:scale-[1.02]`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-1.5 rounded-lg bg-gradient-to-br ${kpi.color} shadow-sm`}>
                  <kpi.icon size={12} className="text-white" />
                </div>
                {kpi.trend && (
                  <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${kpi.trend.bg} ${kpi.trend.color}`}>
                    <kpi.trend.icon size={10} />
                    {kpi.trend.label}
                  </div>
                )}
              </div>
              <p className={`text-2xl font-extrabold leading-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {kpi.value}<span className="text-sm font-bold opacity-50">{kpi.suffix}</span>
              </p>
              <p className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {kpi.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
