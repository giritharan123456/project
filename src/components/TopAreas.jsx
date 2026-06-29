import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

function TopAreas({ pincodeData, businessCategories }) {
  const { isDarkMode } = useTheme();
  const sortedPincodes = [...pincodeData].sort((a, b) => {
    const avgGapA = Object.values(a.marketGapScores).reduce((x, y) => x + y, 0) / Object.keys(a.marketGapScores).length;
    const avgGapB = Object.values(b.marketGapScores).reduce((x, y) => x + y, 0) / Object.keys(b.marketGapScores).length;
    return avgGapB - avgGapA;
  });

  return (
    <div className={`p-6 rounded-xl border transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-card-light border-border-light shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}>
      <h3 className={`text-xl font-bold mb-6 bg-gradient-to-r from-primary-blue to-primary-purple bg-clip-text text-transparent ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>🏆 Top Pincodes by Market Opportunity</h3>
      <div className="flex flex-col gap-4">
        {sortedPincodes.map((pincode, index) => {
          const avgGapScore = Object.values(pincode.marketGapScores).reduce((a, b) => a + b, 0) / Object.keys(pincode.marketGapScores).length;
          const topCategory = Object.entries(pincode.marketGapScores).sort(([, a], [, b]) => b - a)[0];
          
          return (
            <div key={index} className={`p-4 rounded-lg border transition-all duration-300 ${isDarkMode ? 'bg-bg-dark border-border-dark hover:border-primary-blue' : 'bg-bg-light border-border-light hover:border-primary-blue'}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>#{index + 1}</span>
                  <div>
                    <span className={`block font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{pincode.area}</span>
                    <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{pincode.pincode}</span>
                    <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{pincode.district}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-bg-dark text-text-dark border border-border-dark' : 'bg-bg-light text-text-light border border-border-light'}`}>👥 {pincode.population.toLocaleString()}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-bg-dark text-text-dark border border-border-dark' : 'bg-bg-light text-text-light border border-border-light'}`}>📈 {pincode.populationGrowth}%</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Best: {topCategory[0]}</span>
                    <span className={`text-sm font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{topCategory[1]}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 mb-1 overflow-hidden">
                    <div 
                      className="h-full transition-all duration-300"
                      style={{ width: `${avgGapScore}%`, backgroundColor: avgGapScore >= 80 ? '#e74c3c' : avgGapScore >= 70 ? '#f39c12' : '#27ae60' }}
                    ></div>
                  </div>
                  <span className={`text-sm font-semibold ${avgGapScore >= 80 ? 'text-red-500' : avgGapScore >= 70 ? 'text-amber-500' : 'text-emerald-500'}`}>{avgGapScore.toFixed(1)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-6 border-t">
        <h4 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>📊 Business Category Summary</h4>
        <div className="flex flex-wrap gap-3">
          {businessCategories.slice(0, 4).map((cat, index) => (
            <div key={index} className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-bg-dark border-border-dark' : 'bg-bg-light border-border-light'}`}>
              <span className={`block text-sm font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{cat.name}</span>
              <span className={`block text-xs font-bold ${cat.gap >= 30 ? 'text-red-500' : cat.gap >= 20 ? 'text-amber-500' : 'text-emerald-500'}`}>
                {cat.gap}% gap
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopAreas;
