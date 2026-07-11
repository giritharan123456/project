import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { Lightbulb, TrendingUp, Target, BarChart3 } from 'lucide-react';
import ChartTooltip from './ChartTooltip';

function getScoreClass(score) {
  if (score >= 80) return 'high';
  if (score >= 60) return 'medium';
  return 'low';
}

function BusinessInsights({ pincodeData }) {
  const { isDarkMode } = useTheme();
  const [selectedView, setSelectedView] = useState('opportunity');
  const b = (dark, light) => isDarkMode ? dark : light;

  const COLORS = ['#667eea', '#764ba2', '#f39c12', '#27ae60', '#e74c3c', '#3498db'];

  const generateOpportunityData = () => {
    if (!pincodeData || pincodeData.length === 0) return [];
    const categoryOpportunities = {};
    pincodeData.forEach(pincode => {
      Object.entries(pincode.marketGapScores || {}).forEach(([category, score]) => {
        if (!categoryOpportunities[category]) {
          categoryOpportunities[category] = { totalGap: 0, count: 0, avgDemand: 0, totalCompetitors: 0 };
        }
        categoryOpportunities[category].totalGap += Number(score) || 0;
        categoryOpportunities[category].count += 1;
        categoryOpportunities[category].avgDemand += Number(pincode.demandScores?.[category]) || 0;
        categoryOpportunities[category].totalCompetitors += Number(pincode.competitors?.[category]) || 0;
      });
    });
    return Object.entries(categoryOpportunities).map(([category, data]) => ({
      category,
      avgGap: Number((data.totalGap / data.count).toFixed(2)),
      avgDemand: Number((data.avgDemand / data.count).toFixed(2)),
      avgCompetitors: Number((data.totalCompetitors / data.count).toFixed(2)),
      opportunityScore: Number(((data.totalGap / data.count) * 0.6 + (data.avgDemand / data.count) * 0.4).toFixed(2))
    })).sort((a, b) => b.opportunityScore - a.opportunityScore);
  };

  const generateCompetitionData = () => {
    if (!pincodeData || pincodeData.length === 0) return [];
    return pincodeData.map(pincode => {
      const totalCompetitors = Object.values(pincode.competitors || {}).reduce((sum, val) => sum + (Number(val) || 0), 0);
      const avgGap = Object.values(pincode.marketGapScores || {}).reduce((sum, val) => sum + (Number(val) || 0), 0) / (Object.keys(pincode.marketGapScores || {}).length || 1);
      return {
        area: (pincode.area || pincode.name || '').slice(0, 12),
        competitors: totalCompetitors,
        marketGap: Number(avgGap.toFixed(2)),
        population: Number(pincode.population) || 0
      };
    }).sort((a, b) => b.competitors - a.competitors).slice(0, 8);
  };

  const generateDemandDistribution = () => {
    if (!pincodeData || pincodeData.length === 0) return [];
    const demandLevels = { 'High (80-100)': 0, 'Medium (60-79)': 0, 'Low (0-59)': 0 };
    pincodeData.forEach(pincode => {
      const scores = Object.values(pincode.demandScores || {});
      if (scores.length === 0) return;
      const avgDemand = scores.reduce((sum, s) => sum + (Number(s) || 0), 0) / scores.length;
      if (avgDemand >= 80) demandLevels['High (80-100)']++;
      else if (avgDemand >= 60) demandLevels['Medium (60-79)']++;
      else demandLevels['Low (0-59)']++;
    });
    const total = Object.values(demandLevels).reduce((sum, v) => sum + v, 0);
    return Object.entries(demandLevels).map(([name, value]) => ({
      name, value, percentage: total > 0 ? Number(((value / total) * 100).toFixed(2)) : 0
    }));
  };

  const opportunityData = generateOpportunityData();
  const competitionData = generateCompetitionData();
  const demandDistribution = generateDemandDistribution();

  const axisDark = { fontSize: 13, fontWeight: 700, fill: '#e2e8f0' };
  const axisLight = { fontSize: 13, fontWeight: 700, fill: '#1e293b' };
  const getAxis = () => isDarkMode ? axisDark : axisLight;
  const gridStroke = isDarkMode ? '#475569' : '#cbd5e1';
  const axisLine = { stroke: isDarkMode ? '#64748b' : '#94a3b8' };
  const labelStyle = { fontSize: 13, fontWeight: 700, fill: isDarkMode ? '#e2e8f0' : '#1e293b' };

  const tabs = [
    { key: 'opportunity', label: 'Opportunity', icon: <TrendingUp size={14} /> },
    { key: 'competition', label: 'Competition', icon: <Target size={14} /> },
    { key: 'demand', label: 'Demand', icon: <BarChart3 size={14} /> },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={22} className="text-amber-500" />
        <h3 className={`text-xl font-bold ${b('text-[#f1f5f9]', 'text-[#1e293b]')}`}>Business Insights</h3>
      </div>

      {(!opportunityData || opportunityData.length === 0) && (!competitionData || competitionData.length === 0) && (!demandDistribution || demandDistribution.length === 0) ? (
        <p className={`text-sm text-center py-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>No insight data available for this area.</p>
      ) : (<>

      {/* Tabs */}
      <div className={`flex gap-1 p-1 rounded-xl mb-3 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-gray-100'}`}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setSelectedView(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex-1 justify-center ${
              selectedView === tab.key
                ? 'bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white shadow-md'
                : `${b('text-slate-300 hover:text-white', 'text-slate-500 hover:text-slate-800')}`
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {selectedView === 'opportunity' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <h4 className={`text-sm font-extrabold uppercase tracking-wide mb-3 ${b('text-slate-300', 'text-slate-600')}`}>
              Category Opportunity Scores
            </h4>
            <div className={`rounded-xl border p-3 mb-3 ${isDarkMode ? 'border-[#334155] bg-[#0f172a]/50' : 'border-[#e2e8f0] bg-gray-50'}`}>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={opportunityData} barCategoryGap="20%" margin={{ top: 8, right: 15, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                  <XAxis dataKey="category" tick={{ ...getAxis(), fontSize: 13, fontWeight: 800 }} axisLine={axisLine} tickLine={false} angle={-40} textAnchor="end" height={65} interval={0} />
                  <YAxis tick={getAxis()} axisLine={axisLine} tickLine={false} label={{ value: 'Score', angle: -90, position: 'insideLeft', offset: 5, style: { ...labelStyle, fontSize: 13 } }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="opportunityScore" name="Opportunity Score" fill="#667eea" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'border-[#334155]' : 'border-[#e2e8f0]'}`}>
              <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className={isDarkMode ? 'bg-[#0f172a]' : 'bg-gray-50'}>
                    <th className={`p-2 sm:p-3 text-left text-xs font-extrabold uppercase tracking-wider ${b('text-slate-300', 'text-slate-600')}`}>Category</th>
                    <th className={`p-2 sm:p-3 text-left text-xs font-extrabold uppercase tracking-wider ${b('text-slate-300', 'text-slate-600')}`}>Avg Gap</th>
                    <th className={`hidden md:table-cell p-2 sm:p-3 text-left text-xs font-extrabold uppercase tracking-wider ${b('text-slate-300', 'text-slate-600')}`}>Avg Demand</th>
                    <th className={`hidden md:table-cell p-2 sm:p-3 text-left text-xs font-extrabold uppercase tracking-wider ${b('text-slate-300', 'text-slate-600')}`}>Competitors</th>
                    <th className={`p-2 sm:p-3 text-left text-xs font-extrabold uppercase tracking-wider ${b('text-slate-300', 'text-slate-600')}`}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunityData.map((item) => (
                    <tr key={item.category} className={`border-t transition-colors ${isDarkMode ? 'border-[#334155] hover:bg-[#0f172a]/50' : 'border-[#e2e8f0] hover:bg-gray-50'}`}>
                      <td className={`p-2 sm:p-3 text-sm font-medium ${b('text-white', 'text-slate-800')}`}>{item.category}</td>
                      <td className={`p-2 sm:p-3 text-sm font-bold ${b('text-slate-200', 'text-slate-700')}`}>{item.avgGap}</td>
                      <td className={`hidden md:table-cell p-2 sm:p-3 text-sm font-bold ${b('text-slate-200', 'text-slate-700')}`}>{item.avgDemand}</td>
                      <td className={`hidden md:table-cell p-2 sm:p-3 text-sm font-bold ${b('text-slate-200', 'text-slate-700')}`}>{item.avgCompetitors}</td>
                      <td className="p-2 sm:p-3">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                          getScoreClass(item.opportunityScore) === 'high' ? isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600' :
                          getScoreClass(item.opportunityScore) === 'medium' ? isDarkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600' :
                          isDarkMode ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                        }`}>
                          {item.opportunityScore}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </motion.div>
        )}

        {selectedView === 'competition' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <h4 className={`text-sm font-extrabold uppercase tracking-wide mb-3 ${b('text-slate-300', 'text-slate-600')}`}>
              Area Competition Levels
            </h4>
            <div className={`rounded-xl border p-3 mb-3 ${isDarkMode ? 'border-[#334155] bg-[#0f172a]/50' : 'border-[#e2e8f0] bg-gray-50'}`}>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={competitionData} barCategoryGap="20%" margin={{ top: 8, right: 15, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                  <XAxis dataKey="area" tick={{ ...getAxis(), fontSize: 13, fontWeight: 800 }} axisLine={axisLine} tickLine={false} angle={-40} textAnchor="end" height={65} interval={0} />
                  <YAxis tick={getAxis()} axisLine={axisLine} tickLine={false} label={{ value: 'Count', angle: -90, position: 'insideLeft', offset: 5, style: { ...labelStyle, fontSize: 13 } }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="competitors" name="Competitors" fill="#764ba2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {competitionData.slice(0, 4).map((area, i) => (
                <div key={i} className={`p-3 rounded-xl border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
                  <h5 className={`text-sm font-bold mb-2 ${b('text-white', 'text-slate-800')}`}>{area.area}</h5>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className={b('text-slate-300', 'text-slate-600')}>Competitors</span>
                      <span className={`font-bold ${b('text-white', 'text-slate-800')}`}>{area.competitors}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className={b('text-slate-300', 'text-slate-600')}>Market Gap</span>
                      <span className={`font-bold ${b('text-white', 'text-slate-800')}`}>{area.marketGap}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {selectedView === 'demand' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <h4 className={`text-sm font-extrabold uppercase tracking-wide mb-3 ${b('text-slate-300', 'text-slate-600')}`}>
              Demand Distribution
            </h4>
            <div className={`rounded-xl border p-3 mb-3 ${isDarkMode ? 'border-[#334155] bg-[#0f172a]/50' : 'border-[#e2e8f0] bg-gray-50'}`}>
              <ResponsiveContainer width="100%" height={340}>
                <PieChart>
                  <Pie data={demandDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={110} paddingAngle={3} dataKey="value">
                    {demandDistribution.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} stroke={isDarkMode ? '#1e293b' : '#ffffff'} strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 13, fontWeight: 700, paddingTop: 8 }}
                    formatter={(value) => <span style={{ color: isDarkMode ? '#e2e8f0' : '#1e293b', fontWeight: 800, fontSize: 13 }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {demandDistribution.map((item, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className={`text-sm font-medium ${b('text-white', 'text-slate-800')}`}>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium ${b('text-slate-300', 'text-slate-600')}`}>{item.value} areas</span>
                    <span className={`text-sm font-bold ${b('text-white', 'text-slate-800')}`}>{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      </>)}
    </div>
  );
}

export default BusinessInsights;
