import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Trophy, MapPin, TrendingUp, Star, Crown } from 'lucide-react';
import EmptyState from './EmptyState';
import { averageOfValues, NO_DATA_LABEL } from '../utils/dataUtils';

function TopAreas({ pincodeData, businessCategories }) {
  const { isDarkMode } = useTheme();
  const themeClass = (dark, light) => isDarkMode ? dark : light;

  if (!pincodeData || pincodeData.length === 0) {
    return (
      <EmptyState type="noData" message="No pincode rankings available. Search a pincode to load area data." />
    );
  }

  const sortedPincodes = [...pincodeData].sort((a, b) => {
    const avgGapA = averageOfValues(a.marketGapScores) ?? 0;
    const avgGapB = averageOfValues(b.marketGapScores) ?? 0;
    return avgGapB - avgGapA;
  });

  const getRankBadge = (index) => {
    if (index === 0) return { bg: 'bg-gradient-to-r from-yellow-400 to-amber-500', icon: <Crown size={14} className="text-white" />, text: 'text-white' };
    if (index === 1) return { bg: 'bg-gradient-to-r from-gray-300 to-gray-400', icon: <Star size={14} className="text-white" />, text: 'text-white' };
    if (index === 2) return { bg: 'bg-gradient-to-r from-amber-600 to-orange-600', icon: <Star size={14} className="text-white" />, text: 'text-white' };
    return { bg: isDarkMode ? 'bg-[#0f172a]' : 'bg-gray-100', icon: null, text: themeClass('text-gray-400', 'text-gray-500') };
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Trophy size={20} className="text-amber-500" />
        <h3 className={`text-lg font-bold ${themeClass('text-[#f1f5f9]', 'text-[#1e293b]')}`}>
          Top Pincodes
        </h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          isDarkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600'
        }`}>
          by Opportunity
        </span>
      </div>

      {/* Rankings List */}
      <div className="space-y-3">
        {sortedPincodes.map((pincode, index) => {
          const avgGapScore = averageOfValues(pincode.marketGapScores);
          const topCategory = Object.entries(pincode.marketGapScores || {})
            .sort(([, a], [, b]) => Number(b) - Number(a))[0];
          const rank = getRankBadge(index);

          return (
            <div 
              key={pincode.pincode || index} 
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                isDarkMode 
                  ? `bg-[#0f172a] ${index < 3 ? 'border-amber-500/30' : 'border-[#334155] hover:border-[#2563eb]/40'}` 
                  : `bg-white ${index < 3 ? 'border-amber-200' : 'border-[#e2e8f0] hover:border-[#2563eb]/40'}`
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Rank Badge */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${rank.bg} ${rank.text}`}>
                  {rank.icon || (index + 1)}
                </div>

                {/* Area Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={14} className="text-blue-500 flex-shrink-0" />
                    <span className={`font-bold text-sm truncate ${themeClass('text-[#f1f5f9]', 'text-[#1e293b]')}`}>
                      {pincode.area || NO_DATA_LABEL}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className={themeClass('text-gray-400', 'text-gray-500')}>{pincode.pincode}</span>
                    <span className={themeClass('text-gray-500', 'text-gray-400')}>•</span>
                    <span className={themeClass('text-gray-400', 'text-gray-500')}>{pincode.district}</span>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {pincode.population != null && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'
                      }`}>
                        Pop: {pincode.population.toLocaleString()}
                      </span>
                    )}
                    {pincode.populationGrowth != null && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-600'
                      }`}>
                        +{Number(pincode.populationGrowth).toFixed(2)}%
                      </span>
                    )}
                    {topCategory && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        isDarkMode ? 'bg-violet-900/30 text-violet-400' : 'bg-violet-50 text-violet-600'
                      }`}>
                        Best: {topCategory[0]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Score */}
                {avgGapScore !== null && (
                  <div className="flex-shrink-0 text-right">
                    <div className={`text-2xl font-extrabold ${
                      avgGapScore >= 80 ? 'text-red-500' : avgGapScore >= 70 ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      {avgGapScore.toFixed(2)}
                    </div>
                    <div className="w-16 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min(100, avgGapScore)}%`, 
                          backgroundColor: avgGapScore >= 80 ? '#e74c3c' : avgGapScore >= 70 ? '#f39c12' : '#27ae60' 
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Business Category Summary */}
      {businessCategories.length > 0 && (
        <div className={`mt-5 pt-5 border-t ${isDarkMode ? 'border-[#334155]' : 'border-[#e2e8f0]'}`}>
          <h4 className={`text-sm font-bold mb-3 uppercase tracking-wide ${themeClass('text-gray-400', 'text-gray-500')}`}>
            Category Gaps
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {businessCategories.slice(0, 6).map((cat, index) => (
              <div key={index} className={`flex items-center justify-between p-2.5 rounded-lg border ${
                isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-gray-50 border-[#e2e8f0]'
              }`}>
                <span className={`text-xs font-medium truncate ${themeClass('text-gray-300', 'text-gray-600')}`}>{cat.name}</span>
                <span className={`text-xs font-bold ml-2 ${
                  cat.gap != null && cat.gap >= 30 ? 'text-red-500' : cat.gap != null && cat.gap >= 20 ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                  {cat.gap != null ? `${cat.gap.toFixed(0)}%` : '—'}
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
