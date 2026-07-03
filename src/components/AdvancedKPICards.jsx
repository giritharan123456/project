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
        message="No KPI data available. Search a pincode to fetch census and market analysis from the backend."
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
    { title: 'Total Market Gap', value: totalMarketGap, format: 'number' },
    { title: 'High Opportunity Areas', value: highOpportunityAreas, format: 'number' },
    { title: 'Avg Demand Score', value: avgDemandScore, format: 'percentage' },
    { title: 'Total Population', value: totalPopulation, format: 'population' },
    { title: 'Avg Growth Rate', value: avgGrowthRate, format: 'percentage' },
    { title: 'Urban Development', value: avgUrbanDev, format: 'number' },
  ];

  const formatValue = (value, format) => {
    if (value === null || value === undefined) return NO_DATA_LABEL;
    switch (format) {
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'population':
        return value > 0 ? value.toLocaleString() : NO_DATA_LABEL;
      case 'number':
      default:
        return value.toFixed(0);
    }
  };

  return (
    <div>
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
        Key Metrics — {selectedDistrict || NO_DATA_LABEL}
      </h3>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 mb-6">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={index}
            className={`p-6 rounded-xl border transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)] hover:-translate-y-1' : 'bg-[#ffffff] border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-1'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <h4 className={`text-sm font-semibold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{kpi.title}</h4>
            <div className="text-3xl font-bold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent">
              {formatValue(kpi.value, kpi.format)}
            </div>
            <div className={`text-xs opacity-60 mt-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              From live API data
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default AdvancedKPICards;
