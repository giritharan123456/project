import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import EmptyState from './EmptyState';
import { averageOfValues, NO_DATA_LABEL } from '../utils/dataUtils';

function AdvancedKPICards({ data, selectedDistrict }) {
  const { isDarkMode } = useTheme();

  if (!data || data.length === 0) {
    return (
      <EmptyState
        type="noData"
        message="No KPI data available. Search a pincode to fetch census and market analysis."
      />
    );
  }

  const totalMarketGap = data.reduce((sum, pincode) => {
    const avgGap = averageOfValues(pincode.marketGapScores);
    return sum + (avgGap ?? 0);
  }, 0);

  const highOpportunityAreas = data.filter(pincode => {
    const avgGap = averageOfValues(pincode.marketGapScores);
    return avgGap !== null && avgGap >= 80;
  }).length;

  const avgDemandScore = (() => {
    const scores = data.map(p => averageOfValues(p.demandScores)).filter(v => v !== null);
    if (scores.length === 0) return null;
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  })();

  const totalPopulation = data.reduce((sum, p) => sum + (p.population ?? 0), 0);

  const avgGrowthRate = (() => {
    const rates = data.map(p => p.populationGrowth).filter(v => v !== null);
    if (rates.length === 0) return null;
    return rates.reduce((a, b) => a + b, 0) / rates.length;
  })();

  const avgUrbanDev = (() => {
    const scores = data.map(p => p.urbanDevelopment).filter(v => v !== null);
    if (scores.length === 0) return null;
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  })();

  const kpiData = [
    { title: 'Total Market Gap', value: totalMarketGap, format: 'number', icon: '📊', color: 'from-blue-500 to-indigo-600', bgLight: 'bg-blue-50', bgDark: 'bg-blue-900/20' },
    { title: 'High Opportunity', value: highOpportunityAreas, format: 'number', icon: '🎯', color: 'from-emerald-500 to-green-600', bgLight: 'bg-emerald-50', bgDark: 'bg-emerald-900/20' },
    { title: 'Avg Demand Score', value: avgDemandScore, format: 'percentage', icon: '📈', color: 'from-violet-500 to-purple-600', bgLight: 'bg-violet-50', bgDark: 'bg-violet-900/20' },
    { title: 'Total Population', value: totalPopulation, format: 'population', icon: '👥', color: 'from-amber-500 to-orange-600', bgLight: 'bg-amber-50', bgDark: 'bg-amber-900/20' },
    { title: 'Avg Growth Rate', value: avgGrowthRate, format: 'percentage', icon: '🚀', color: 'from-rose-500 to-pink-600', bgLight: 'bg-rose-50', bgDark: 'bg-rose-900/20' },
    { title: 'Urban Development', value: avgUrbanDev, format: 'number', icon: '🏙️', color: 'from-cyan-500 to-teal-600', bgLight: 'bg-cyan-50', bgDark: 'bg-cyan-900/20' },
  ];

  const formatValue = (value, format) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return NO_DATA_LABEL;
    switch (format) {
      case 'percentage':
        return `${Number(value).toFixed(2)}%`;
      case 'population':
        return value > 0 ? value.toLocaleString() : NO_DATA_LABEL;
      case 'number':
      default:
        return Math.round(value).toLocaleString();
    }
  };

  const b = (dark, light) => isDarkMode ? dark : light;

  return (
    <div className={`p-3 rounded-xl border-2 ${isDarkMode ? 'bg-[#1e293b] border-[#475569]' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center gap-2 mb-3">
        <h3 className={`text-xs font-extrabold uppercase tracking-wider ${b('text-slate-300', 'text-slate-600')}`}>
          Key Metrics
        </h3>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
          isDarkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700'
        }`}>
          {selectedDistrict || 'All'}
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={index}
            className={`relative p-3 rounded-xl border overflow-hidden transition-all duration-300 ${
              isDarkMode 
                ? `bg-[#1e293b] border-[#334155] hover:border-[#2563eb]/50` 
                : `bg-white border-[#e2e8f0] hover:border-[#2563eb]/50`
            } shadow-sm hover:shadow-md`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -2, scale: 1.01 }}
          >
            {/* Gradient accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${kpi.color}`} />
            
            <div className="flex items-start justify-between mb-2">
              <span className="text-xl">{kpi.icon}</span>
            </div>
            
            <p className={`text-[10px] sm:text-[11px] font-bold mb-0.5 uppercase tracking-wide ${b('text-slate-400', 'text-slate-500')}`}>{kpi.title}</p>
            <p className={`text-lg font-extrabold ${b('text-[#f1f5f9]', 'text-[#1e293b]')}`}>
              {formatValue(kpi.value, kpi.format)}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default AdvancedKPICards;
