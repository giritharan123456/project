import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import EmptyState from './EmptyState';
import { averageOfValues, toPlainObject, NO_DATA_LABEL } from '../utils/dataUtils';

function OpportunityHeatMap({ pincodeData }) {
  const { isDarkMode } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredPincode, setHoveredPincode] = useState(null);
  const [showLegend, setShowLegend] = useState(false);

  if (!pincodeData || pincodeData.length === 0) {
    return (
      <EmptyState
        type="noData"
        message="No heat map data available. Search a pincode to load market gap scores from the backend."
      />
    );
  }

  const getCategories = () => {
    if (!pincodeData || pincodeData.length === 0) return [];
    const categories = new Set();
    pincodeData.forEach(pincode => {
      Object.keys(toPlainObject(pincode.marketGapScores)).forEach(cat => categories.add(cat));
    });
    return Array.from(categories);
  };

  const getHeatmapColor = (score) => {
    if (score >= 80) return 'rgba(239, 68, 68, 0.85)';
    if (score >= 65) return 'rgba(249, 115, 22, 0.85)';
    if (score >= 50) return 'rgba(234, 179, 8, 0.85)';
    return 'rgba(34, 197, 94, 0.85)';
  };

  const getHeatmapIntensity = (score) => {
    return Math.min(100, Math.max(20, score));
  };

  const generateHeatmapData = () => {
    if (!pincodeData || pincodeData.length === 0) return [];

    return pincodeData.map(pincode => {
      const categories = Object.entries(toPlainObject(pincode.marketGapScores));
      const avgGap = pincode.opportunityScore || averageOfValues(pincode.marketGapScores) || 0;
      
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
        competitors: Object.values(toPlainObject(pincode.competitors)).reduce((sum, val) => sum + Number(val), 0)
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
    <div className={`p-3 rounded-xl border mb-1 transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-[#ffffff] border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
        <h3 className={`text-lg sm:text-xl font-bold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>🗺️ Opportunity Heat Map</h3>
        <div className="flex gap-2">
          <select 
            className={`px-2 sm:px-3 py-1.5 sm:py-2 border-2 rounded-lg text-xs sm:text-sm ${isDarkMode ? 'bg-[#0f172a] border-[#334155] text-[#f1f5f9]' : 'bg-[#f8fafc] border-[#e2e8f0] text-[#1e293b]'}`}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="all">All</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button onClick={() => setShowLegend(!showLegend)} className={`px-2 sm:px-4 py-1.5 sm:py-2 border-2 rounded-lg text-xs sm:text-sm transition-all duration-300 ${isDarkMode ? 'bg-[#0f172a] border-[#334155] text-[#f1f5f9] hover:border-[#2563eb]' : 'bg-[#f8fafc] border-[#e2e8f0] text-[#1e293b] hover:border-[#2563eb]'}`}>📊 Legend</button>
        </div>
      </div>

      {showLegend && (
      <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 p-2 sm:p-3 rounded-lg border border-dashed">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded flex-shrink-0" style={{ background: 'rgba(239, 68, 68, 0.85)' }}></div>
          <span className={`text-[10px] sm:text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>High (80-100)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded flex-shrink-0" style={{ background: 'rgba(249, 115, 22, 0.85)' }}></div>
          <span className={`text-[10px] sm:text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Strong (65-79)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded flex-shrink-0" style={{ background: 'rgba(234, 179, 8, 0.85)' }}></div>
          <span className={`text-[10px] sm:text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Moderate (50-64)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded flex-shrink-0" style={{ background: 'rgba(34, 197, 94, 0.85)' }}></div>
          <span className={`text-[10px] sm:text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Low (0-49)</span>
        </div>
      </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
        {heatmapData.map((data, index) => (
          <motion.div
            key={data.pincode || index}
            className="p-3 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onMouseEnter={() => handlePincodeHover(data)}
            onMouseLeave={handlePincodeLeave}
            onClick={() => handlePincodeHover(hoveredPincode?.pincode === data.pincode ? null : data)}
            style={{
              background: getHeatmapColor(data.avgGap),
              opacity: getHeatmapIntensity(data.avgGap) / 100
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-white">{data.pincode}</span>
              <span className="text-xs text-white text-center">{data.area}</span>
              <span className="text-sm font-bold text-white">{data.avgGap.toFixed(2)}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {hoveredPincode && (
        <motion.div
          className={`fixed bottom-4 right-4 p-4 rounded-xl border shadow-lg max-w-xs ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{hoveredPincode.area} ({hoveredPincode.pincode})</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={`text-xs opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Avg Market Gap</span>
              <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{hoveredPincode.avgGap.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className={`text-xs opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Population</span>
              <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                {hoveredPincode.population != null ? hoveredPincode.population.toLocaleString() : NO_DATA_LABEL}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={`text-xs opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Growth Rate</span>
              <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                {hoveredPincode.growth != null ? `${Number(hoveredPincode.growth).toFixed(2)}%` : NO_DATA_LABEL}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={`text-xs opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Total Competitors</span>
              <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{hoveredPincode.competitors}</span>
            </div>
          </div>

          {selectedCategory !== 'all' && (
            <div className="mt-4">
              <h5 className={`font-bold text-sm mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Category Breakdown</h5>
              {Object.entries(hoveredPincode.categoryScores).map(([cat, score]) => (
                <div key={cat} className="flex items-center gap-2 mb-2">
                  <span className={`text-xs w-24 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{cat}</span>
                  <div className={`flex-1 h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className="h-full"
                      style={{ 
                        width: `${Number(score)}%`,
                        background: getHeatmapColor(Number(score))
                      }}
                    ></div>
                  </div>
                  <span className={`text-xs font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{Number(score).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      <div className="flex flex-wrap gap-6 mt-6 pt-4 border-t">
        <div>
          <span className={`text-xs opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Total Areas</span>
          <div className={`text-lg font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{heatmapData.length}</div>
        </div>
        <div>
          <span className={`text-xs opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>High Opportunity</span>
          <div className={`text-lg font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
            {heatmapData.filter(d => d.avgGap >= 65).length}
          </div>
        </div>
        <div>
          <span className={`text-xs opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Avg Gap Score</span>
          <div className={`text-lg font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
            {heatmapData.length > 0
              ? (heatmapData.reduce((sum, d) => sum + d.avgGap, 0) / heatmapData.length).toFixed(2)
              : NO_DATA_LABEL}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpportunityHeatMap;
