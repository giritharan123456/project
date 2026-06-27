import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

function AIRecommendations({ pincodeData, businessCategories, selectedDistrict }) {
  const { isDarkMode } = useTheme();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateRecommendations();
  }, [pincodeData, businessCategories, selectedDistrict]);

  const generateRecommendations = () => {
    setLoading(true);
    
    setTimeout(() => {
      const recs = [];
      
      if (pincodeData && pincodeData.length > 0) {
        const sortedByGap = [...pincodeData].sort((a, b) => {
          const avgGapA = Object.values(a.marketGapScores).reduce((sum, val) => sum + val, 0) / Object.values(a.marketGapScores).length;
          const avgGapB = Object.values(b.marketGapScores).reduce((sum, val) => sum + val, 0) / Object.values(b.marketGapScores).length;
          return avgGapB - avgGapA;
        });

        const topArea = sortedByGap[0];
        if (topArea) {
          const bestCategory = Object.entries(topArea.marketGapScores)
            .sort((a, b) => b[1] - a[1])[0];
          
          if (bestCategory) {
            recs.push({
              type: 'opportunity',
              priority: 'high',
              title: `High Opportunity: ${bestCategory[0]} in ${topArea.area}`,
              description: `Market gap score of ${bestCategory[1]} indicates strong demand with low competition. Consider establishing a ${bestCategory[0]} business in this area.`,
              metrics: {
                gapScore: bestCategory[1],
                demandScore: topArea.demandScores[bestCategory[0]],
                competitors: topArea.competitors[bestCategory[0]],
                population: topArea.population
              },
              confidence: 0.92
            });
          }
        }

        const highGrowthArea = [...pincodeData].sort((a, b) => b.populationGrowth - a.populationGrowth)[0];
        if (highGrowthArea && highGrowthArea.populationGrowth > 3) {
          recs.push({
            type: 'growth',
            priority: 'medium',
            title: `Growth Potential: ${highGrowthArea.area}`,
            description: `Population growth of ${highGrowthArea.populationGrowth}% indicates expanding market. Early entry now could capture future demand.`,
            metrics: {
              growthRate: highGrowthArea.populationGrowth,
              population: highGrowthArea.population,
              urbanDevelopment: highGrowthArea.urbanDevelopment
            },
            confidence: 0.85
          });
        }

        const categoryGaps = {};
        pincodeData.forEach(pincode => {
          Object.entries(pincode.marketGapScores).forEach(([category, score]) => {
            if (!categoryGaps[category]) {
              categoryGaps[category] = { total: 0, count: 0 };
            }
            categoryGaps[category].total += score;
            categoryGaps[category].count += 1;
          });
        });

        const avgCategoryGaps = Object.entries(categoryGaps)
          .map(([category, data]) => ({
            category,
            avgGap: data.total / data.count
          }))
          .sort((a, b) => b.avgGap - a.avgGap);

        if (avgCategoryGaps.length > 0) {
          const topCategory = avgCategoryGaps[0];
          recs.push({
            type: 'category',
            priority: 'high',
            title: `Underserved Category: ${topCategory.category}`,
            description: `Average market gap score of ${topCategory.avgGap.toFixed(1)} across ${selectedDistrict} indicates this business category is underserved.`,
            metrics: {
              avgGap: topCategory.avgGap,
              totalPincodes: categoryGaps[topCategory.category].count
            },
            confidence: 0.88
          });
        }

        const saturatedArea = [...pincodeData].sort((a, b) => {
          const totalCompetitorsA = Object.values(a.competitors).reduce((sum, val) => sum + val, 0);
          const totalCompetitorsB = Object.values(b.competitors).reduce((sum, val) => sum + val, 0);
          return totalCompetitorsB - totalCompetitorsA;
        })[0];

        if (saturatedArea) {
          const totalCompetitors = Object.values(saturatedArea.competitors).reduce((sum, val) => sum + val, 0);
          if (totalCompetitors > 50) {
            recs.push({
              type: 'warning',
              priority: 'low',
              title: `Market Saturation Alert: ${saturatedArea.area}`,
              description: `High competitor count (${totalCompetitors}) indicates saturated market. Consider different business categories or nearby areas.`,
              metrics: {
                totalCompetitors,
                population: saturatedArea.population
              },
              confidence: 0.95
            });
          }
        }
      }

      setRecommendations(recs);
      setLoading(false);
    }, 800);
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'opportunity': return '💡';
      case 'growth': return '📈';
      case 'category': return '🎯';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return '#10b981';
    if (confidence >= 0.8) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div className={`p-6 rounded-xl border mb-6 transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-card-light border-border-light shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}>
        <h3 className={`text-xl font-bold mb-4 bg-gradient-to-r from-primary-blue to-primary-purple bg-clip-text text-transparent ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>🤖 AI-Powered Recommendations</h3>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-primary-blue border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className={`text-sm ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Analyzing market data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`p-6 rounded-xl border mb-6 transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-card-light border-border-light shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-xl font-bold bg-gradient-to-r from-primary-blue to-primary-purple bg-clip-text text-transparent ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>🤖 AI-Powered Recommendations</h3>
        <button 
          className={`px-4 py-2 border-2 rounded-lg transition-all duration-300 ${isDarkMode ? 'bg-bg-dark border-border-dark text-text-dark hover:border-primary-blue' : 'bg-bg-light border-border-light text-text-light hover:border-primary-blue'}`}
          onClick={generateRecommendations}
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {recommendations.length === 0 ? (
          <div className={`p-8 text-center ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
            <p>No recommendations available. Add more data to generate insights.</p>
          </div>
        ) : (
          recommendations.map((rec, index) => (
            <motion.div
              key={index}
              className={`p-4 rounded-lg border-l-4 transition-all duration-300 ${rec.priority === 'high' ? 'border-l-red-500' : rec.priority === 'medium' ? 'border-l-amber-500' : 'border-l-emerald-500'} ${isDarkMode ? 'bg-bg-dark border-border-dark hover:border-primary-blue' : 'bg-bg-light border-border-light hover:border-primary-blue'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-2">
                  <span className="text-xl">{getTypeIcon(rec.type)}</span>
                  <span className="text-xl">{getPriorityIcon(rec.priority)}</span>
                </div>
                <div className="text-sm font-semibold" style={{ color: getConfidenceColor(rec.confidence) }}>
                  {(rec.confidence * 100).toFixed(0)}% confidence
                </div>
              </div>

              <h4 className={`text-base font-bold mb-2 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{rec.title}</h4>
              <p className={`text-sm mb-3 opacity-80 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{rec.description}</p>

              <div className="flex flex-wrap gap-3">
                {Object.entries(rec.metrics).map(([key, value]) => (
                  <div key={key} className={`px-3 py-1 rounded-lg text-xs ${isDarkMode ? 'bg-bg-dark text-text-dark border border-border-dark' : 'bg-bg-light text-text-light border border-border-light'}`}>
                    <span className="opacity-70">{formatMetricKey(key)}:</span>
                    <span className="font-semibold ml-1">{formatMetricValue(key, value)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

function formatMetricKey(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

function formatMetricValue(key, value) {
  if (key === 'population') {
    return value.toLocaleString();
  }
  if (typeof value === 'number') {
    return value.toFixed(1);
  }
  return value;
}

export default AIRecommendations;
