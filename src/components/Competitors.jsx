import React, { useState, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingUp, ChevronDown, ChevronUp, Swords } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a', '#0891b2', '#d946ef', '#0ea5e9'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white dark:bg-[#1e293b] p-3 rounded-lg shadow-xl border border-gray-200 dark:border-[#334155]">
      <p className="font-semibold text-sm mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: <span className="font-bold">{typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}</span>
        </p>
      ))}
    </div>
  );
};

const Competitors = ({ pincodeData }) => {
  const { isDarkMode } = useTheme();
  const [expandedInsight, setExpandedInsight] = useState(null);
  const b = (dark, light) => isDarkMode ? dark : light;

  const axisDark = { fontSize: 13, fontWeight: 700, fill: '#e2e8f0' };
  const axisLight = { fontSize: 13, fontWeight: 700, fill: '#1e293b' };
  const getAxis = () => isDarkMode ? axisDark : axisLight;
  const gridStroke = isDarkMode ? '#475569' : '#cbd5e1';
  const axisLine = { stroke: isDarkMode ? '#64748b' : '#94a3b8' };

  const toggleInsight = (id) => setExpandedInsight(expandedInsight === id ? null : id);

  const chartData = useMemo(() => {
    if (!pincodeData || !Array.isArray(pincodeData) || pincodeData.length === 0) return null;

    const categoryStats = {};
    pincodeData.forEach(p => {
      const competitors = p.competitors || {};
      const demand = p.demandScores || {};
      const gap = p.marketGapScores || {};
      Object.keys(competitors).forEach(cat => {
        if (!categoryStats[cat]) categoryStats[cat] = { competitors: 0, demand: 0, gap: 0, count: 0 };
        categoryStats[cat].competitors += Number(competitors[cat]) || 0;
        categoryStats[cat].demand += Number(demand[cat]) || 0;
        categoryStats[cat].gap += Number(gap[cat]) || 0;
        categoryStats[cat].count += 1;
      });
    });

    const categories = Object.keys(categoryStats);
    if (categories.length === 0) return null;

    const barData = categories.map(cat => ({
      name: cat.length > 12 ? cat.slice(0, 10) + '…' : cat,
      fullName: cat,
      Competitors: Math.round(categoryStats[cat].competitors / categoryStats[cat].count * 100) / 100,
      Demand: Math.round(categoryStats[cat].demand / categoryStats[cat].count * 100) / 100,
      'Market Gap': Math.round(categoryStats[cat].gap / categoryStats[cat].count * 100) / 100
    }));

    const totalCompetitors = categories.reduce((sum, cat) => sum + categoryStats[cat].competitors, 0) / pincodeData.length;
    const avgDemand = categories.reduce((sum, cat) => sum + categoryStats[cat].demand / categoryStats[cat].count, 0) / categories.length;
    const avgGap = categories.reduce((sum, cat) => sum + categoryStats[cat].gap / categoryStats[cat].count, 0) / categories.length;

    const insights = [];
    if (categories.length > 0) {
      const mostCompetitive = categories.reduce((max, cat) =>
        (categoryStats[cat].competitors / categoryStats[cat].count) > (categoryStats[max].competitors / categoryStats[max].count) ? cat : max
      , categories[0]);
      const leastCompetitive = categories.reduce((min, cat) =>
        (categoryStats[cat].competitors / categoryStats[cat].count) < (categoryStats[min].competitors / categoryStats[min].count) ? cat : min
      , categories[0]);

      insights.push({
        id: 1, icon: AlertTriangle, color: '#f59e0b',
        title: `High Competition in ${mostCompetitive}`,
        description: `${(categoryStats[mostCompetitive].competitors / categoryStats[mostCompetitive].count).toFixed(2)} avg competitors per area`,
        rationale: `Demand: ${(categoryStats[mostCompetitive].demand / categoryStats[mostCompetitive].count).toFixed(2)}, Gap: ${(categoryStats[mostCompetitive].gap / categoryStats[mostCompetitive].count).toFixed(2)}`,
        action: `Focus on differentiation or explore ${leastCompetitive} which has lower competition.`
      });

      insights.push({
        id: 2, icon: TrendingUp, color: '#10b981',
        title: `Opportunity in ${leastCompetitive}`,
        description: `Only ${(categoryStats[leastCompetitive].competitors / categoryStats[leastCompetitive].count).toFixed(2)} avg competitors`,
        rationale: `Demand: ${(categoryStats[leastCompetitive].demand / categoryStats[leastCompetitive].count).toFixed(2)}, Gap: ${(categoryStats[leastCompetitive].gap / categoryStats[leastCompetitive].count).toFixed(2)}`,
        action: `Consider entering ${leastCompetitive} market — high demand, low competition.`
      });
    }

    return { barData, insights, totalCompetitors, avgDemand, avgGap, areaCount: pincodeData.length };
  }, [pincodeData]);

  if (!chartData) {
    return (
      <div className="text-center py-12">
        <Swords size={40} className={`mx-auto mb-3 ${b('text-gray-600', 'text-gray-400')}`} />
        <p className={`text-sm ${b('text-gray-400', 'text-gray-500')}`}>
          No competitor data available for this district
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Swords size={22} className="text-violet-500" />
        <h3 className={`text-xl font-bold ${b('text-[#f1f5f9]', 'text-[#1e293b]')}`}>Competition Analysis</h3>
      </div>

      <div className={`flex flex-wrap gap-3 mb-3 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
        <span>Areas: <b>{chartData.areaCount}</b></span>
        <span>Avg Competitors: <b>{chartData.totalCompetitors.toFixed(2)}</b></span>
        <span>Avg Demand: <b>{chartData.avgDemand.toFixed(2)}</b></span>
        <span>Avg Gap: <b>{chartData.avgGap.toFixed(2)}</b></span>
      </div>

      <div className={`rounded-xl border p-3 ${isDarkMode ? 'border-[#334155] bg-[#0f172a]/50' : 'border-[#e2e8f0] bg-gray-50'}`}>
        <h4 className={`text-sm font-bold uppercase tracking-wide mb-3 ${b('text-gray-400', 'text-gray-500')}`}>
          Competition vs Demand by Category
        </h4>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={chartData.barData} barCategoryGap="20%" margin={{ top: 8, right: 15, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
            <XAxis dataKey="name" tick={getAxis()} axisLine={axisLine} tickLine={false} angle={-35} textAnchor="end" height={55} interval={0} />
            <YAxis tick={getAxis()} axisLine={axisLine} tickLine={false} />
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 13, fontWeight: 700, paddingTop: 8 }} formatter={(value) => <span style={{ color: isDarkMode ? '#e2e8f0' : '#1e293b', fontWeight: 800, fontSize: 13 }}>{value}</span>} />
            <Bar dataKey="Competitors" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Demand" fill="#2563eb" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Market Gap" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {chartData.insights && chartData.insights.length > 0 && (
        <div className="space-y-2 mt-3">
          <h4 className={`text-sm font-bold uppercase tracking-wide ${b('text-gray-400', 'text-gray-500')}`}>
            AI Insights
          </h4>
          {chartData.insights.map(insight => (
            <motion.div
              key={insight.id}
              className={`rounded-xl border overflow-hidden cursor-pointer transition-all duration-300 ${
                isDarkMode ? 'bg-[#0f172a] border-[#334155] hover:border-[#2563eb]/40' : 'bg-white border-[#e2e8f0] hover:border-[#2563eb]/40'
              }`}
              onClick={() => toggleInsight(insight.id)}
            >
              <div className="p-3 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${insight.color}15` }}>
                    <insight.icon size={18} style={{ color: insight.color }} />
                  </div>
                  <div>
                    <h5 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{insight.title}</h5>
                    <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{insight.description}</p>
                  </div>
                </div>
                {expandedInsight === insight.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              <AnimatePresence>
                {expandedInsight === insight.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className={`border-t ${isDarkMode ? 'border-[#334155]' : 'border-[#e2e8f0]'}`}
                  >
                    <div className="p-3">
                      <p className={`text-xs mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}><b>Analysis:</b> {insight.rationale}</p>
                      <p className={`text-xs font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Action: {insight.action}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Competitors;
