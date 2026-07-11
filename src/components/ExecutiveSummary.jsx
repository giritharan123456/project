import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { AlertTriangle, TrendingUp, CheckCircle, ArrowRight, Lightbulb, Target } from 'lucide-react';
import { averageOfValues } from '../utils/dataUtils';

function ExecutiveSummary({ pincodeData }) {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const insights = useMemo(() => {
    if (!pincodeData || pincodeData.length === 0) return { alerts: [], recommendations: [], topActions: [] };

    const alerts = [];
    const recommendations = [];
    const topActions = [];

    // Analyze each area
    const areaAnalysis = pincodeData.map(p => {
      const avgGap = averageOfValues(p.marketGapScores) ?? 0;
      const avgDemand = averageOfValues(p.demandScores) ?? 0;
      const totalComps = Object.values(p.competitors || {}).reduce((s, v) => s + (Number(v) || 0), 0);
      return { ...p, avgGap, avgDemand, totalComps };
    });

    // Find high opportunity areas
    const highOppAreas = areaAnalysis.filter(a => a.avgGap >= 70 && a.avgDemand >= 60);
    if (highOppAreas.length > 0) {
      alerts.push({
        type: 'success',
        icon: Target,
        title: `${highOppAreas.length} High Opportunity ${highOppAreas.length === 1 ? 'Area' : 'Areas'} Found`,
        message: `${highOppAreas.map(a => a.area).slice(0, 3).join(', ')} ${highOppAreas.length > 3 ? `+${highOppAreas.length - 3} more` : ''} show strong market gaps with high demand.`,
      });
    }

    // Find saturated areas
    const saturated = areaAnalysis.filter(a => a.totalComps > 200);
    if (saturated.length > 0) {
      alerts.push({
        type: 'warning',
        icon: AlertTriangle,
        title: `${saturated.length} Saturated ${saturated.length === 1 ? 'Market' : 'Markets'} Detected`,
        message: `High competition in ${saturated.map(a => a.area).slice(0, 2).join(', ')}. Consider differentiated positioning.`,
      });
    }

    // Growth areas
    const growingAreas = areaAnalysis.filter(a => (a.populationGrowth || 0) > 1.5);
    if (growingAreas.length > 0) {
      recommendations.push({
        icon: TrendingUp,
        title: 'Focus on Growing Markets',
        message: `${growingAreas.length} areas with >1.5% population growth. Early entry recommended.`,
        priority: 'high',
      });
    }

    // Underserved categories
    const categoryGaps = {};
    pincodeData.forEach(p => {
      Object.entries(p.marketGapScores || {}).forEach(([cat, score]) => {
        if (!categoryGaps[cat]) categoryGaps[cat] = { total: 0, count: 0 };
        categoryGaps[cat].total += Number(score) || 0;
        categoryGaps[cat].count += 1;
      });
    });
    const topGapCategories = Object.entries(categoryGaps)
      .map(([name, data]) => ({ name, avg: data.total / data.count }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 3);

    if (topGapCategories.length > 0) {
      recommendations.push({
        icon: Lightbulb,
        title: 'Top Underserved Categories',
        message: `${topGapCategories.map(c => `${c.name} (${c.avg.toFixed(0)} gap)`).join(', ')}.`,
        priority: 'medium',
      });
    }

    // Top actions
    const topArea = areaAnalysis.sort((a, b) => b.avgGap - a.avgGap)[0];
    if (topArea) {
      topActions.push({
        action: `Explore ${topArea.area}`,
        detail: `Highest market gap score: ${topArea.avgGap.toFixed(0)}`,
        color: 'blue',
        path: '/area-leaderboard',
      });
    }

    const fastGrowing = areaAnalysis.sort((a, b) => (b.populationGrowth || 0) - (a.populationGrowth || 0))[0];
    if (fastGrowing && fastGrowing !== topArea) {
      topActions.push({
        action: `Target ${fastGrowing.area}`,
        detail: `Fastest growing: ${(fastGrowing.populationGrowth || 0).toFixed(2)}%`,
        color: 'emerald',
        path: '/area-overview',
      });
    }

    const leastCompetitive = areaAnalysis.sort((a, b) => a.totalComps - b.totalComps)[0];
    if (leastCompetitive) {
      topActions.push({
        action: `Enter ${leastCompetitive.area}`,
        detail: `Lowest competition: ${leastCompetitive.totalComps} competitors`,
        color: 'violet',
        path: '/pincode-explorer',
      });
    }

    return { alerts, recommendations, topActions };
  }, [pincodeData]);

  if (insights.alerts.length === 0 && insights.recommendations.length === 0) return null;

  const b = (dark, light) => isDarkMode ? dark : light;
  const alertColors = {
    success: { bg: isDarkMode ? 'bg-emerald-900/20' : 'bg-emerald-50', border: isDarkMode ? 'border-emerald-700/40' : 'border-emerald-200', icon: 'text-emerald-500' },
    warning: { bg: isDarkMode ? 'bg-amber-900/20' : 'bg-amber-50', border: isDarkMode ? 'border-amber-700/40' : 'border-amber-200', icon: 'text-amber-500' },
    danger: { bg: isDarkMode ? 'bg-red-900/20' : 'bg-red-50', border: isDarkMode ? 'border-red-700/40' : 'border-red-200', icon: 'text-red-500' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className={`rounded-2xl border overflow-hidden ${
        isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-slate-200'
      }`}
    >
      {/* Header */}
      <div className={`px-4 py-2.5 border-b flex items-center gap-2 ${
        isDarkMode ? 'border-[#334155] bg-[#0f172a]/40' : 'border-slate-100 bg-slate-50/50'
      }`}>
        <CheckCircle size={14} className="text-blue-600" />
        <span className={`text-sm font-extrabold uppercase tracking-wider ${b('text-slate-300', 'text-slate-600')}`}>
          Executive Summary
        </span>
      </div>

      <div className="p-2.5 space-y-1.5">
        {/* Alerts */}
        {insights.alerts.map((alert, i) => {
          const colors = alertColors[alert.type] || alertColors.success;
          return (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${colors.bg} ${colors.border}`}>
              <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-[#0f172a]/60' : 'bg-white'}`}>
                <alert.icon size={14} className={colors.icon} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-extrabold ${b('text-white', 'text-slate-800')}`}>{alert.title}</p>
                <p className={`text-xs mt-0.5 leading-relaxed ${b('text-slate-300', 'text-slate-600')}`}>{alert.message}</p>
              </div>
            </div>
          );
        })}

        {/* Recommendations */}
        {insights.recommendations.map((rec, i) => (
          <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${
            isDarkMode ? 'bg-[#0f172a]/40 border-[#334155]' : 'bg-slate-50 border-slate-100'
          }`}>
            <div className={`p-1.5 rounded-lg ${
              rec.priority === 'high'
                ? isDarkMode ? 'bg-blue-900/40' : 'bg-blue-50'
                : isDarkMode ? 'bg-violet-900/40' : 'bg-violet-50'
            }`}>
              <rec.icon size={14} className={rec.priority === 'high' ? 'text-blue-500' : 'text-violet-500'} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-extrabold ${b('text-white', 'text-slate-800')}`}>{rec.title}</p>
              <p className={`text-xs mt-0.5 leading-relaxed ${b('text-slate-300', 'text-slate-600')}`}>{rec.message}</p>
            </div>
          </div>
        ))}

        {/* Quick Actions */}
        {insights.topActions.length > 0 && (
          <div className={`pt-2 border-t ${isDarkMode ? 'border-[#334155]' : 'border-slate-100'}`}>
            <p className={`text-xs font-extrabold uppercase tracking-wider mb-2 ${b('text-slate-400', 'text-slate-500')}`}>
              Recommended Actions
            </p>
            <div className="flex flex-wrap gap-1.5">
              {insights.topActions.map((action, i) => (
                <div key={i} onClick={() => action.path && navigate(action.path)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all hover:scale-105 ${
                  isDarkMode ? 'bg-[#0f172a] border border-[#334155] text-slate-300 hover:border-[#3b82f6]' : 'bg-slate-50 border border-slate-100 text-slate-600 hover:border-[#3b82f6]'
                }`}>
                  <ArrowRight size={10} style={{ color: action.color === 'blue' ? '#3b82f6' : action.color === 'emerald' ? '#10b981' : '#8b5cf6' }} />
                  <span>{action.action}</span>
                  <span className={`text-[10px] font-medium ${b('text-slate-500', 'text-slate-400')}`}>{action.detail}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ExecutiveSummary;
