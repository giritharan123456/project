import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

function OpportunityHeatMap({ pincodeData, selectedDistrict }) {
  const { isDarkMode } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredPincode, setHoveredPincode] = useState(null);

  const getCategories = () => {
    if (!pincodeData || pincodeData.length === 0) return [];
    const categories = new Set();
    pincodeData.forEach(pincode => {
      Object.keys(pincode.marketGapScores).forEach(cat => categories.add(cat));
    });
    return Array.from(categories);
  };

  const getHeatmapColor = (score) => {
    if (score >= 80) return 'rgba(34, 197, 94, 0.8)';
    if (score >= 60) return 'rgba(234, 179, 8, 0.8)';
    if (score >= 40) return 'rgba(249, 115, 22, 0.8)';
    return 'rgba(239, 68, 68, 0.8)';
  };

  const getHeatmapIntensity = (score) => {
    return Math.min(100, Math.max(20, score));
  };

  const generateHeatmapData = () => {
    if (!pincodeData || pincodeData.length === 0) return [];

    return pincodeData.map(pincode => {
      const categories = Object.entries(pincode.marketGapScores);
      const avgGap = categories.reduce((sum, [_, score]) => sum + score, 0) / categories.length;
      
      let categoryScores = {};
      if (selectedCategory === 'all') {
        categoryScores = Object.fromEntries(categories);
      } else {
        categoryScores[selectedCategory] = pincode.marketGapScores[selectedCategory] || 0;
      }

      return {
        pincode: pincode.pincode,
        area: pincode.area,
        avgGap,
        categoryScores,
        population: pincode.population,
        growth: pincode.populationGrowth,
        competitors: Object.values(pincode.competitors).reduce((sum, val) => sum + val, 0)
      };
    });
  };

  const heatmapData = generateHeatmapData();
  const categories = getCategories();

  const handlePincodeHover = (pincode) => {
    setHoveredPincode(pincode);
  };

  const handlePincodeLeave = () => {
    setHoveredPincode(null);
  };

  return (
    <div className={`p-6 rounded-xl border mb-6 transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-card-light border-border-light shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-xl font-bold bg-gradient-to-r from-primary-blue to-primary-purple bg-clip-text text-transparent ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>🗺️ Opportunity Heat Map</h3>
        <div className="flex gap-2">
          <select 
            className={`px-3 py-2 border-2 rounded-lg ${isDarkMode ? 'bg-bg-dark border-border-dark text-text-dark' : 'bg-bg-light border-border-light text-text-light'}`}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button className={`px-4 py-2 border-2 rounded-lg transition-all duration-300 ${isDarkMode ? 'bg-bg-dark border-border-dark text-text-dark hover:border-primary-blue' : 'bg-bg-light border-border-light text-text-light hover:border-primary-blue'}`}>📊 Legend</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: 'rgba(34, 197, 94, 0.8)' }}></div>
          <span className={`text-sm ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>High Opportunity (80-100)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: 'rgba(234, 179, 8, 0.8)' }}></div>
          <span className={`text-sm ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Medium Opportunity (60-79)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: 'rgba(249, 115, 22, 0.8)' }}></div>
          <span className={`text-sm ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Low Opportunity (40-59)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: 'rgba(239, 68, 68, 0.8)' }}></div>
          <span className={`text-sm ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Critical (0-39)</span>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
        {heatmapData.map((data, index) => (
          <motion.div
            key={data.pincode}
            className="p-3 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onMouseEnter={() => handlePincodeHover(data)}
            onMouseLeave={handlePincodeLeave}
            style={{
              background: getHeatmapColor(data.avgGap),
              opacity: getHeatmapIntensity(data.avgGap) / 100
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-white">{data.pincode}</span>
              <span className="text-xs text-white text-center">{data.area}</span>
              <span className="text-sm font-bold text-white">{data.avgGap.toFixed(0)}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {hoveredPincode && (
        <motion.div
          className={`fixed bottom-4 right-4 p-4 rounded-xl border shadow-lg max-w-xs ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{hoveredPincode.area} ({hoveredPincode.pincode})</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={`text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Avg Market Gap</span>
              <span className={`text-sm font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{hoveredPincode.avgGap.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className={`text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Population</span>
              <span className={`text-sm font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{hoveredPincode.population.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className={`text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Growth Rate</span>
              <span className={`text-sm font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{hoveredPincode.growth}%</span>
            </div>
            <div className="flex justify-between">
              <span className={`text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Total Competitors</span>
              <span className={`text-sm font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{hoveredPincode.competitors}</span>
            </div>
          </div>
          
          {selectedCategory !== 'all' && (
            <div className="mt-4">
              <h5 className={`font-bold text-sm mb-2 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Category Breakdown</h5>
              {Object.entries(hoveredPincode.categoryScores).map(([cat, score]) => (
                <div key={cat} className="flex items-center gap-2 mb-2">
                  <span className={`text-xs w-24 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{cat}</span>
                  <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div 
                      className="h-full"
                      style={{ 
                        width: `${score}%`,
                        background: getHeatmapColor(score)
                      }}
                    ></div>
                  </div>
                  <span className={`text-xs font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{score.toFixed(0)}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      <div className="flex flex-wrap gap-6 mt-6 pt-4 border-t">
        <div>
          <span className={`text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Total Areas</span>
          <div className={`text-lg font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{heatmapData.length}</div>
        </div>
        <div>
          <span className={`text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>High Opportunity</span>
          <div className={`text-lg font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
            {heatmapData.filter(d => d.avgGap >= 80).length}
          </div>
        </div>
        <div>
          <span className={`text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Avg Gap Score</span>
          <div className={`text-lg font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
            {(heatmapData.reduce((sum, d) => sum + d.avgGap, 0) / heatmapData.length).toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpportunityHeatMap;
