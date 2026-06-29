import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

function AdvancedKPICards({ data, selectedDistrict }) {
  const { isDarkMode } = useTheme();
  
  const calculateTrend = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return '↑';
    if (trend < 0) return '↓';
    return '→';
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return '#10b981';
    if (trend < 0) return '#ef4444';
    return isDarkMode ? '#f1f5f9' : '#1e293b';
  };

  const generateSparklineData = (baseValue, points = 7) => {
    const sparkData = [];
    for (let i = 0; i < points; i++) {
      const variation = (Math.random() - 0.5) * baseValue * 0.2;
      sparkData.push({
        value: Math.max(0, baseValue + variation)
      });
    }
    return sparkData;
  };

  const kpiData = [
    {
      title: 'Total Market Gap',
      value: data?.reduce((sum, pincode) => {
        const avgGap = Object.values(pincode.marketGapScores).reduce((s, v) => s + v, 0) / Object.values(pincode.marketGapScores).length;
        return sum + avgGap;
      }, 0) || 0,
      previousValue: 450,
      format: 'number',
      sparkline: true,
      trend: calculateTrend(
        data?.reduce((sum, pincode) => {
          const avgGap = Object.values(pincode.marketGapScores).reduce((s, v) => s + v, 0) / Object.values(pincode.marketGapScores).length;
          return sum + avgGap;
        }, 0) || 0,
        450
      )
    },
    {
      title: 'High Opportunity Areas',
      value: data?.filter(pincode => {
        const avgGap = Object.values(pincode.marketGapScores).reduce((s, v) => s + v, 0) / Object.values(pincode.marketGapScores).length;
        return avgGap >= 80;
      }).length || 0,
      previousValue: 3,
      format: 'number',
      sparkline: true,
      trend: calculateTrend(
        data?.filter(pincode => {
          const avgGap = Object.values(pincode.marketGapScores).reduce((s, v) => s + v, 0) / Object.values(pincode.marketGapScores).length;
          return avgGap >= 80;
        }).length || 0,
        3
      )
    },
    {
      title: 'Avg Demand Score',
      value: data?.reduce((sum, pincode) => {
        const avgDemand = Object.values(pincode.demandScores).reduce((s, v) => s + v, 0) / Object.values(pincode.demandScores).length;
        return sum + avgDemand;
      }, 0) / (data?.length || 1) || 0,
      previousValue: 75,
      format: 'percentage',
      sparkline: true,
      trend: calculateTrend(
        data?.reduce((sum, pincode) => {
          const avgDemand = Object.values(pincode.demandScores).reduce((s, v) => s + v, 0) / Object.values(pincode.demandScores).length;
          return sum + avgDemand;
        }, 0) / (data?.length || 1) || 0,
        75
      )
    },
    {
      title: 'Total Population',
      value: data?.reduce((sum, pincode) => sum + pincode.population, 0) || 0,
      previousValue: 850000,
      format: 'population',
      sparkline: true,
      trend: calculateTrend(
        data?.reduce((sum, pincode) => sum + pincode.population, 0) || 0,
        850000
      )
    },
    {
      title: 'Avg Growth Rate',
      value: data?.reduce((sum, pincode) => sum + pincode.populationGrowth, 0) / (data?.length || 1) || 0,
      previousValue: 3.2,
      format: 'percentage',
      sparkline: true,
      trend: calculateTrend(
        data?.reduce((sum, pincode) => sum + pincode.populationGrowth, 0) / (data?.length || 1) || 0,
        3.2
      )
    },
    {
      title: 'Urban Development',
      value: data?.reduce((sum, pincode) => sum + pincode.urbanDevelopment, 0) / (data?.length || 1) || 0,
      previousValue: 72,
      format: 'number',
      sparkline: true,
      trend: calculateTrend(
        data?.reduce((sum, pincode) => sum + pincode.urbanDevelopment, 0) / (data?.length || 1) || 0,
        72
      )
    }
  ];

  const formatValue = (value, format) => {
    switch (format) {
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'population':
        return value.toLocaleString();
      case 'number':
      default:
        return value.toFixed(0);
    }
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 mb-6">
      {kpiData.map((kpi, index) => (
        <motion.div
          key={index}
          className={`p-6 rounded-xl border transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-card-light border-border-light shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <div className="flex justify-between items-start mb-4">
            <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{kpi.title}</h4>
            <div className="flex items-center gap-1" style={{ color: getTrendColor(kpi.trend) }}>
              <span className="text-lg">{getTrendIcon(kpi.trend)}</span>
              <span className="text-sm font-semibold">{Math.abs(kpi.trend).toFixed(1)}%</span>
            </div>
          </div>

          <div className={`text-3xl font-bold mb-4 bg-gradient-to-r from-primary-blue to-primary-purple bg-clip-text text-transparent`}>
            {formatValue(kpi.value, kpi.format)}
          </div>

          {kpi.sparkline && (
            <div className="h-10 mb-3">
              <ResponsiveContainer width="100%" height={40}>
                <LineChart data={generateSparklineData(kpi.value)}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={getTrendColor(kpi.trend)}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: isDarkMode ? '#1e293b' : '#ffffff',
                      border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: isDarkMode ? '#f1f5f9' : '#1e293b'
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className={`text-xs opacity-60 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
            vs previous period
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default AdvancedKPICards;
