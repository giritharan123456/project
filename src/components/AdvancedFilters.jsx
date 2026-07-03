import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

function AdvancedFilters({ pincodeData, onFilterChange }) {
  const { isDarkMode } = useTheme();
  const [filters, setFilters] = useState({
    gapScoreRange: [0, 100],
    populationRange: [0, 200000],
    growthRateRange: [0, 10],
    incomeLevels: ['High', 'Medium', 'Low'],
    urbanDevelopmentRange: [0, 100]
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleReset = () => {
    const defaultFilters = {
      gapScoreRange: [0, 100],
      populationRange: [0, 200000],
      growthRateRange: [0, 10],
      incomeLevels: ['High', 'Medium', 'Low'],
      urbanDevelopmentRange: [0, 100]
    };
    setFilters(defaultFilters);
    if (onFilterChange) {
      onFilterChange(defaultFilters);
    }
  };

  const toggleIncomeLevel = (level) => {
    const newLevels = filters.incomeLevels.includes(level)
      ? filters.incomeLevels.filter(l => l !== level)
      : [...filters.incomeLevels, level];
    handleFilterChange('incomeLevels', newLevels);
  };

  const getFilteredCount = () => {
    if (!pincodeData) return 0;
    
    return pincodeData.filter(pincode => {
      const scores = Object.values(pincode.marketGapScores || {});
      const avgGap = scores.length > 0 ? scores.reduce((sum, val) => sum + (Number(val) || 0), 0) / scores.length : 0;
      const matchesGap = avgGap >= filters.gapScoreRange[0] && avgGap <= filters.gapScoreRange[1];
      const matchesPopulation = pincode.population >= filters.populationRange[0] && pincode.population <= filters.populationRange[1];
      const matchesGrowth = pincode.populationGrowth >= filters.growthRateRange[0] && pincode.populationGrowth <= filters.growthRateRange[1];
      const matchesIncome = filters.incomeLevels.includes(pincode.incomeLevel);
      const matchesUrban = pincode.urbanDevelopment >= filters.urbanDevelopmentRange[0] && pincode.urbanDevelopment <= filters.urbanDevelopmentRange[1];
      
      return matchesGap && matchesPopulation && matchesGrowth && matchesIncome && matchesUrban;
    }).length;
  };

  return (
    <div className={`p-6 rounded-xl border mb-6 transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-[#ffffff] border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-xl font-bold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>🔍 Advanced Filters</h3>
        <div className="flex items-center gap-3">
          <span className={`text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{getFilteredCount()} results</span>
          <button 
            className={`px-3 py-2 border-2 rounded-lg transition-all duration-300 ${isDarkMode ? 'bg-[#0f172a] border-[#334155] text-[#f1f5f9] hover:border-[#2563eb]' : 'bg-[#f8fafc] border-[#e2e8f0] text-[#1e293b] hover:border-[#2563eb]'}`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          <button className={`px-4 py-2 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white border-none rounded-lg font-semibold cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(102,126,234,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(102,126,234,0.4)] active:translate-y-0`} onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      <motion.div 
        className="overflow-hidden"
        initial={{ height: 'auto' }}
        animate={{ height: isExpanded ? 'auto' : '0px' }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-6">
          <div>
            <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Market Gap Score</h4>
            <div className="flex gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={filters.gapScoreRange[0]}
                onChange={(e) => handleFilterChange('gapScoreRange', [parseInt(e.target.value), filters.gapScoreRange[1]])}
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="100"
                value={filters.gapScoreRange[1]}
                onChange={(e) => handleFilterChange('gapScoreRange', [filters.gapScoreRange[0], parseInt(e.target.value)])}
                className="flex-1"
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className={`text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{filters.gapScoreRange[0]}</span>
              <span className={`text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{filters.gapScoreRange[1]}</span>
            </div>
          </div>

          <div>
            <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Population Range</h4>
            <div className="flex gap-4">
              <input
                type="range"
                min="0"
                max="200000"
                step="10000"
                value={filters.populationRange[0]}
                onChange={(e) => handleFilterChange('populationRange', [parseInt(e.target.value), filters.populationRange[1]])}
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="200000"
                step="10000"
                value={filters.populationRange[1]}
                onChange={(e) => handleFilterChange('populationRange', [filters.populationRange[0], parseInt(e.target.value)])}
                className="flex-1"
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className={`text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{(filters.populationRange[0] / 1000).toFixed(0)}K</span>
              <span className={`text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{(filters.populationRange[1] / 1000).toFixed(0)}K</span>
            </div>
          </div>

          <div>
            <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Growth Rate (%)</h4>
            <div className="flex gap-4">
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={filters.growthRateRange[0]}
                onChange={(e) => handleFilterChange('growthRateRange', [parseFloat(e.target.value), filters.growthRateRange[1]])}
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={filters.growthRateRange[1]}
                onChange={(e) => handleFilterChange('growthRateRange', [filters.growthRateRange[0], parseFloat(e.target.value)])}
                className="flex-1"
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className={`text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{filters.growthRateRange[0]}%</span>
              <span className={`text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{filters.growthRateRange[1]}%</span>
            </div>
          </div>

          <div>
            <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Income Level</h4>
            <div className="flex gap-4">
              {['High', 'Medium', 'Low'].map(level => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.incomeLevels.includes(level)}
                    onChange={() => toggleIncomeLevel(level)}
                    className="w-4 h-4"
                  />
                  <span className={`text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{level}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Urban Development Score</h4>
            <div className="flex gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={filters.urbanDevelopmentRange[0]}
                onChange={(e) => handleFilterChange('urbanDevelopmentRange', [parseInt(e.target.value), filters.urbanDevelopmentRange[1]])}
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="100"
                value={filters.urbanDevelopmentRange[1]}
                onChange={(e) => handleFilterChange('urbanDevelopmentRange', [filters.urbanDevelopmentRange[0], parseInt(e.target.value)])}
                className="flex-1"
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className={`text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{filters.urbanDevelopmentRange[0]}</span>
              <span className={`text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{filters.urbanDevelopmentRange[1]}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AdvancedFilters;
