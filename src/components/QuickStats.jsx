import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { TrendingUp, MapPin, Building, Users, Target } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

const QuickStats = ({ pincodeData, selectedDistrict }) => {
  const { isDarkMode } = useTheme();

  const stats = [
    {
      icon: MapPin,
      label: 'Total Pincodes',
      value: pincodeData.length,
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Target,
      label: 'High Opportunity',
      value: pincodeData.filter(p => {
        const avgGap = Object.values(p.marketGapScores).reduce((a, b) => a + b, 0) / Object.keys(p.marketGapScores).length;
        return avgGap >= 70;
      }).length,
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Building,
      label: 'Business Categories',
      value: pincodeData.length > 0 ? Object.keys(pincodeData[0].marketGapScores).length : 0,
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Users,
      label: 'Total Population',
      value: pincodeData.reduce((sum, p) => sum + p.population, 0),
      color: 'from-orange-500 to-orange-600',
      format: true
    }
  ];

  return (
    <div className={`p-6 rounded-xl border mb-6 ${isDarkMode ? 'bg-card-dark border-border-dark shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-card-light border-border-light shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}>
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>📊 Quick Overview - {selectedDistrict}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`p-4 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}
            >
              <Icon size={24} className="mb-2 opacity-90" />
              <p className="text-sm opacity-90 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">
                <AnimatedCounter 
                  value={stat.value} 
                  duration={1.5}
                  decimals={0}
                  prefix={stat.format ? '' : ''}
                  suffix={stat.format ? '' : ''}
                />
                {stat.format && stat.value >= 1000 ? 'K' : ''}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickStats;
