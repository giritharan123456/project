import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

function PincodeAnalysis({ rankingData, selectedCategory }) {
  const { isDarkMode } = useTheme();
  const filteredData = selectedCategory === 'all' 
    ? rankingData 
    : rankingData.filter(item => item.businessCategory === selectedCategory);

  const top10 = filteredData.slice(0, 10);

  return (
    <div className={`p-6 rounded-xl border mb-6 transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-card-light border-border-light shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}>
      <h3 className={`text-xl font-bold mb-2 bg-gradient-to-r from-primary-blue to-primary-purple bg-clip-text text-transparent ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>📊 Market Gap Ranking by Pincode</h3>
      <p className={`text-sm mb-6 opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Top opportunities sorted by Market Gap Score</p>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className={`border-b ${isDarkMode ? 'border-border-dark' : 'border-border-light'}`}>
              <th className={`p-3 text-left text-sm font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Rank</th>
              <th className={`p-3 text-left text-sm font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Pincode</th>
              <th className={`p-3 text-left text-sm font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Area</th>
              <th className={`p-3 text-left text-sm font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Business Category</th>
              <th className={`p-3 text-left text-sm font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Competitors</th>
              <th className={`p-3 text-left text-sm font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Demand Score</th>
              <th className={`p-3 text-left text-sm font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Market Gap Score</th>
            </tr>
          </thead>
          <tbody>
            {top10.map((item, index) => (
              <tr key={index} className={`border-b transition-colors duration-200 ${index < 3 ? `${isDarkMode ? 'bg-bg-dark/50' : 'bg-bg-light/50'}` : ''} ${isDarkMode ? 'border-border-dark hover:bg-bg-dark/30' : 'border-border-light hover:bg-bg-light/30'}`}>
                <td className="p-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${index === 0 ? 'bg-amber-500 text-white' : index === 1 ? 'bg-gray-400 text-white' : index === 2 ? 'bg-amber-700 text-white' : isDarkMode ? 'bg-bg-dark text-text-dark border border-border-dark' : 'bg-bg-light text-text-light border border-border-light'}`}>
                    #{item.rank}
                  </span>
                </td>
                <td className={`p-3 text-sm ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{item.pincode}</td>
                <td className={`p-3 text-sm ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{item.area}</td>
                <td className={`p-3 text-sm ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{item.businessCategory}</td>
                <td className={`p-3 text-sm ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{item.competitors}</td>
                <td className="p-3">
                  <div className="w-full h-2 rounded-full bg-gray-200 mb-1 overflow-hidden">
                    <div 
                      className="h-full bg-primary-blue transition-all duration-300" 
                      style={{ width: `${item.demandScore}%` }}
                    ></div>
                  </div>
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{item.demandScore}</span>
                </td>
                <td className="p-3">
                  <div className="w-full h-2 rounded-full bg-gray-200 mb-1 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${item.marketGapScore >= 80 ? 'bg-red-500' : item.marketGapScore >= 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${item.marketGapScore}%` }}
                    ></div>
                  </div>
                  <span className={`text-sm font-semibold ${item.marketGapScore >= 80 ? 'text-red-500' : item.marketGapScore >= 70 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {item.marketGapScore}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 mt-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span className={`text-xs ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Top Opportunity (Gold)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gray-400"></span>
          <span className={`text-xs ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>High Potential (Silver)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-700"></span>
          <span className={`text-xs ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Good Opportunity (Bronze)</span>
        </div>
      </div>
    </div>
  );
}

export default PincodeAnalysis;
