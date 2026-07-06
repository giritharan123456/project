import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { MapPin, Building, Users, Target } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';
import { averageOfValues, NO_DATA_LABEL } from '../utils/dataUtils';

const QuickStats = ({ pincodeData, selectedDistrict }) => {
  const { isDarkMode } = useTheme();

  if (!pincodeData || pincodeData.length === 0) {
    return (
      <div className={`p-4 rounded-xl border-2 ${isDarkMode ? 'bg-[#1e293b] border-[#475569]' : 'bg-white border-slate-200'}`}>
        <h3 className={`text-xs font-extrabold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          Quick Overview — {selectedDistrict || 'Select a district'}
        </h3>
        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Select a district to view market gap statistics
        </p>
      </div>
    );
  }

  const highOpportunityCount = pincodeData.filter(p => {
    const avgGap = averageOfValues(p.marketGapScores);
    return avgGap !== null && avgGap >= 70;
  }).length;

  const categoryCount = pincodeData.length > 0
    ? Object.keys(pincodeData[0].marketGapScores || {}).length
    : 0;

  const totalPopulation = pincodeData.reduce((sum, p) => {
    return sum + (p.population ?? 0);
  }, 0);

  const stats = [
    {
      icon: MapPin,
      label: 'Total Pincodes',
      value: pincodeData.length,
      color: 'from-blue-500 to-blue-600',
      format: false
    },
    {
      icon: Target,
      label: 'High Opportunity',
      value: highOpportunityCount,
      color: 'from-green-500 to-green-600',
      format: false
    },
    {
      icon: Building,
      label: 'Business Categories',
      value: categoryCount,
      color: 'from-purple-500 to-purple-600',
      format: false
    },
    {
      icon: Users,
      label: 'Total Population',
      value: totalPopulation,
      color: 'from-orange-500 to-orange-600',
      format: true,
      noData: totalPopulation === 0
    }
  ];

  return (
    <div className={`p-4 rounded-xl border-2 ${isDarkMode ? 'bg-[#1e293b] border-[#475569]' : 'bg-white border-slate-200'}`}>
      <h3 className={`text-xs font-extrabold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
        Quick Overview — {selectedDistrict || NO_DATA_LABEL}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-md`}
            >
              <Icon size={20} className="mb-1.5 opacity-90" />
              <p className="text-[10px] opacity-80 mb-0.5 uppercase tracking-wide">{stat.label}</p>
              <p className="text-xl font-bold">
                {stat.noData ? (
                  <span className="text-sm font-normal opacity-90">{NO_DATA_LABEL}</span>
                ) : (
                  <>
                    <AnimatedCounter
                      value={stat.format && stat.value >= 1000 ? stat.value / 1000 : stat.value}
                      duration={1.5}
                      decimals={stat.format && stat.value >= 1000 ? 1 : 0}
                    />
                    {stat.format && stat.value >= 1000 ? 'K' : ''}
                  </>
                )}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickStats;
