import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

function PincodeAnalysis({ rankingData, selectedCategory }) {
  const { isDarkMode } = useTheme();
  const filteredData = selectedCategory === 'all' 
    ? rankingData 
    : rankingData.filter(item => item.businessCategory === selectedCategory);

  const top10 = filteredData.slice(0, 10);

  return (
    <div className={`p-6 rounded-xl border mb-6 transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-[#ffffff] border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}>
      <h3 className={`text-xl font-bold mb-2 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>📊 Market Gap Ranking by Pincode</h3>
      <p className={`text-sm mb-6 opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Top opportunities sorted by Market Gap Score</p>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className={`border-b ${isDarkMode ? 'border-[#334155]' : 'border-[#e2e8f0]'}`}>
              <th className={`p-3 text-left text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Rank</th>
              <th className={`p-3 text-left text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Pincode</th>
              <th className={`p-3 text-left text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Area</th>
              <th className={`p-3 text-left text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Business Category</th>
              <th className={`p-3 text-left text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Competitors</th>
              <th className={`p-3 text-left text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Demand Score</th>
              <th className={`p-3 text-left text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Market Gap Score</th>
            </tr>
          </thead>
          <tbody>
            {top10.map((item, index) => (
              <tr key={index} className={`border-b transition-colors duration-200 ${index < 3 ? `${isDarkMode ? 'bg-[#0f172a]/50' : 'bg-[#f8fafc]/50'}` : ''} ${isDarkMode ? 'border-[#334155] hover:bg-[#0f172a]/30' : 'border-[#e2e8f0] hover:bg-[#f8fafc]/30'}`}>
                <td className="p-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${index === 0 ? 'bg-amber-500 text-white' : index === 1 ? 'bg-gray-400 text-white' : index === 2 ? 'bg-amber-700 text-white' : isDarkMode ? 'bg-[#0f172a] text-[#f1f5f9] border border-[#334155]' : 'bg-[#f8fafc] text-[#1e293b] border border-[#e2e8f0]'}`}>
                    #{item.rank}
                  </span>
                </td>
                <td className={`p-3 text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{item.pincode}</td>
                <td className={`p-3 text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{item.area}</td>
                <td className={`p-3 text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{item.businessCategory}</td>
                <td className={`p-3 text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{item.competitors}</td>
                <td className="p-3">
                  <div className="w-full h-2 rounded-full bg-gray-200 mb-1 overflow-hidden">
                    <div 
                      className="h-full bg-[#2563eb] transition-all duration-300" 
                      style={{ width: `${item.demandScore}%` }}
                    ></div>
                  </div>
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{item.demandScore}</span>
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
          <span className={`text-xs ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Top Opportunity (Gold)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gray-400"></span>
          <span className={`text-xs ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>High Potential (Silver)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-700"></span>
          <span className={`text-xs ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Good Opportunity (Bronze)</span>
        </div>
      </div>
    </div>
  );
}

export default PincodeAnalysis;
