import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import EmptyState from './EmptyState';
import { averageOfValues, NO_DATA_LABEL } from '../utils/dataUtils';

function TopAreas({ pincodeData, businessCategories }) {
  const { isDarkMode } = useTheme();

  if (!pincodeData || pincodeData.length === 0) {
    return (
      <EmptyState
        type="noData"
        message="No pincode rankings available. Search a pincode to load area data from the backend."
      />
    );
  }

  const sortedPincodes = [...pincodeData].sort((a, b) => {
    const avgGapA = averageOfValues(a.marketGapScores) ?? 0;
    const avgGapB = averageOfValues(b.marketGapScores) ?? 0;
    return avgGapB - avgGapA;
  });

  return (
    <div className={`p-6 rounded-xl border transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-[#ffffff] border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}>
      <h3 className={`text-xl font-bold mb-6 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Top Pincodes by Market Opportunity</h3>
      <div className="flex flex-col gap-4">
        {sortedPincodes.map((pincode, index) => {
          const avgGapScore = averageOfValues(pincode.marketGapScores);
          const topCategory = Object.entries(pincode.marketGapScores || {})
            .sort(([, a], [, b]) => Number(b) - Number(a))[0];

          return (
            <div key={pincode.pincode || index} className={`p-4 rounded-lg border transition-all duration-300 ${isDarkMode ? 'bg-[#0f172a] border-[#334155] hover:border-[#2563eb]' : 'bg-[#f8fafc] border-[#e2e8f0] hover:border-[#2563eb]'}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>#{index + 1}</span>
                  <div>
                    <span className={`block font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{pincode.area || NO_DATA_LABEL}</span>
                    <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{pincode.pincode || NO_DATA_LABEL}</span>
                    <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{pincode.district || NO_DATA_LABEL}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-[#0f172a] text-[#f1f5f9] border border-[#334155]' : 'bg-[#f8fafc] text-[#1e293b] border border-[#e2e8f0]'}`}>
                      {pincode.population != null ? pincode.population.toLocaleString() : NO_DATA_LABEL}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-[#0f172a] text-[#f1f5f9] border border-[#334155]' : 'bg-[#f8fafc] text-[#1e293b] border border-[#e2e8f0]'}`}>
                      {pincode.populationGrowth != null ? `${pincode.populationGrowth}%` : NO_DATA_LABEL}
                    </span>
                  </div>
                  {topCategory && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Best: {topCategory[0]}</span>
                      <span className={`text-sm font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{topCategory[1]}</span>
                    </div>
                  )}
                  {avgGapScore !== null && (
                    <>
                      <div className="w-full h-2 rounded-full bg-gray-200 mb-1 overflow-hidden">
                        <div
                          className="h-full transition-all duration-300"
                          style={{ width: `${avgGapScore}%`, backgroundColor: avgGapScore >= 80 ? '#e74c3c' : avgGapScore >= 70 ? '#f39c12' : '#27ae60' }}
                        />
                      </div>
                      <span className={`text-sm font-semibold ${avgGapScore >= 80 ? 'text-red-500' : avgGapScore >= 70 ? 'text-amber-500' : 'text-emerald-500'}`}>{avgGapScore.toFixed(1)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {businessCategories.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <h4 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Business Category Summary</h4>
          <div className="flex flex-wrap gap-3">
            {businessCategories.slice(0, 4).map((cat, index) => (
              <div key={index} className={`px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
                <span className={`block text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{cat.name}</span>
                <span className={`block text-xs font-bold ${cat.gap != null && cat.gap >= 30 ? 'text-red-500' : cat.gap != null && cat.gap >= 20 ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {cat.gap != null ? `${cat.gap.toFixed(0)}% gap` : NO_DATA_LABEL}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TopAreas;
