import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { Trophy, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { averageOfValues } from '../utils/dataUtils';

function TopPerformers({ pincodeData }) {
  const { isDarkMode } = useTheme();

  const topAreas = useMemo(() => {
    if (!pincodeData || pincodeData.length === 0) return [];

    return pincodeData
      .map(p => {
        const avgGap = averageOfValues(p.marketGapScores) ?? 0;
        const avgDemand = averageOfValues(p.demandScores) ?? 0;
        const totalComps = Object.values(p.competitors || {}).reduce((s, v) => s + (Number(v) || 0), 0);
        const score = avgGap * 0.5 + avgDemand * 0.3 + Math.max(0, 100 - totalComps) * 0.2;
        return {
          area: p.area || p.name || 'Unknown',
          pincode: p.pincode,
          population: p.population || 0,
          growth: p.populationGrowth || 0,
          gap: avgGap,
          demand: avgDemand,
          competitors: totalComps,
          score: score.toFixed(0),
          income: p.incomeLevel || 'N/A',
        };
      })
      .sort((a, b) => Number(b.score) - Number(a.score))
      .slice(0, 8);
  }, [pincodeData]);

  if (topAreas.length === 0) return null;

  const b = (dark, light) => isDarkMode ? dark : light;
  const medals = ['🥇', '🥈', '🥉'];

  const getScoreColor = (score) => {
    if (score >= 70) return isDarkMode ? 'text-emerald-400' : 'text-emerald-600';
    if (score >= 50) return isDarkMode ? 'text-amber-400' : 'text-amber-600';
    return isDarkMode ? 'text-slate-400' : 'text-slate-500';
  };

  const getGrowthIcon = (g) => {
    if (g > 1.5) return { icon: ArrowUpRight, color: 'text-emerald-500' };
    if (g > 0.5) return { icon: Minus, color: 'text-amber-500' };
    return { icon: ArrowDownRight, color: 'text-red-500' };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`rounded-2xl border overflow-hidden ${
        isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-200'
      }`}
    >
      {/* Header */}
      <div className={`px-4 py-2.5 border-b flex items-center justify-between ${
        isDarkMode ? 'border-[#334155] bg-[#0f172a]/40' : 'border-slate-100 bg-slate-50/50'
      }`}>
        <div className="flex items-center gap-2">
          <Trophy size={14} className="text-amber-500" />
          <span className={`text-sm font-extrabold uppercase tracking-wider ${b('text-slate-300', 'text-slate-600')}`}>
            Top Performing Areas
          </span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          isDarkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-50 text-amber-600'
        }`}>
          Ranked by Score
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className={isDarkMode ? 'bg-[#0f172a]/60' : 'bg-slate-50'}>
              {['Rank', 'Area', 'Population', 'Growth', 'Gap Score', 'Demand', 'Score'].map(h => (
                <th key={h} className={`px-2.5 py-1.5 text-left text-xs font-extrabold uppercase tracking-wider ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topAreas.map((area, i) => {
              const growthInfo = getGrowthIcon(area.growth);
              const GrowthIcon = growthInfo.icon;
              return (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className={`border-t transition-colors ${
                    isDarkMode ? 'border-[#334155] hover:bg-[#0f172a]/40' : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <td className="px-2.5 py-1.5">
                    <span className="text-sm">{medals[i] || <span className={`font-bold ${b('text-slate-500', 'text-slate-400')}`}>{i + 1}</span>}</span>
                  </td>
                  <td className="px-2.5 py-1.5">
                    <div>
                      <p className={`font-extrabold ${b('text-white', 'text-slate-800')}`}>{area.area}</p>
                      <p className={`text-[10px] ${b('text-slate-500', 'text-slate-400')}`}>{area.pincode}</p>
                    </div>
                  </td>
                  <td className={`px-3 py-2 font-bold ${b('text-slate-300', 'text-slate-600')}`}>
                    {area.population > 1000 ? `${(area.population / 1000).toFixed(0)}K` : area.population}
                  </td>
                  <td className="px-2.5 py-1.5">
                    <div className={`flex items-center gap-1 font-bold ${growthInfo.color}`}>
                      <GrowthIcon size={12} />
                      {area.growth.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-2.5 py-1.5">
                    <span className={`font-extrabold ${getScoreColor(area.gap)}`}>{area.gap.toFixed(0)}</span>
                  </td>
                  <td className={`px-3 py-2 font-bold ${b('text-slate-300', 'text-slate-600')}`}>{area.demand.toFixed(0)}</td>
                  <td className="px-2.5 py-1.5">
                    <span className={`px-2 py-0.5 rounded-md font-extrabold ${
                      Number(area.score) >= 70 ? isDarkMode ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                      : Number(area.score) >= 50 ? isDarkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-50 text-amber-600'
                      : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-500'
                    }`}>
                      {area.score}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default TopPerformers;
