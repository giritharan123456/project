import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { AlertTriangle, TrendingUp, ChevronDown, ChevronUp, Swords } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white dark:bg-[#1e293b] p-3 rounded-lg shadow-xl border border-gray-200 dark:border-[#334155]">
      <p className="font-semibold text-sm mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: <span className="font-bold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

const Competitors = ({ pincodeData }) => {
  const { isDarkMode } = useTheme();
  const [expandedInsight, setExpandedInsight] = useState(null);
  const [error, setError] = useState(null);
  const b = (dark, light) => isDarkMode ? dark : light;

  const axisDark = { fontSize: 13, fontWeight: 700, fill: '#e2e8f0' };
  const axisLight = { fontSize: 13, fontWeight: 700, fill: '#1e293b' };
  const getAxis = () => isDarkMode ? axisDark : axisLight;
  const gridStroke = isDarkMode ? '#475569' : '#cbd5e1';
  const axisLine = { stroke: isDarkMode ? '#64748b' : '#94a3b8' };
  const labelStyle = { fontSize: 12, fontWeight: 700, fill: isDarkMode ? '#e2e8f0' : '#1e293b' };

  const toggleInsight = (id) => setExpandedInsight(expandedInsight === id ? null : id);

  const generateCompetitorData = (data) => {
    try {
      if (!data || !Array.isArray(data) || data.length === 0) return null;
      const area = data[0];
      if (!area || typeof area !== 'object') return null;

      const competitors = area.competitors || {};
      const demandScores = area.demandScores || {};
      const marketGapScores = area.marketGapScores || {};

      if (typeof competitors !== 'object' || competitors === null) return null;
      if (typeof demandScores !== 'object' || demandScores === null) return null;
      if (typeof marketGapScores !== 'object' || marketGapScores === null) return null;

      const hasData = Object.keys(competitors).length > 0 || Object.keys(demandScores).length > 0 || Object.keys(marketGapScores).length > 0;
      if (!hasData) return null;

      const totalCompetitors = Object.values(competitors).reduce((sum, val) => sum + (Number(val) || 0), 0) || 1;
      const yourShare = Math.max(20, 100 - totalCompetitors * 10);
      const competitorAShare = Math.min(40, totalCompetitors * 15);
      const competitorBShare = Math.max(5, 100 - yourShare - competitorAShare);

      const barData = [
        { name: 'Your Business', 'Market Share': yourShare, 'Digital Presence': Math.min(90, yourShare + 20) },
        { name: 'Competitor A', 'Market Share': competitorAShare, 'Digital Presence': Math.min(70, competitorAShare + 10) },
        { name: 'Competitor B', 'Market Share': competitorBShare, 'Digital Presence': Math.min(50, competitorBShare + 15) }
      ];

      const avgGap = Object.values(marketGapScores).reduce((sum, val) => sum + (Number(val) || 0), 0) / (Object.keys(marketGapScores).length || 1);
      const avgDemand = Object.values(demandScores).reduce((sum, val) => sum + (Number(val) || 0), 0) / (Object.keys(demandScores).length || 1);

      const radarData = [
        { subject: 'Pricing', A: Math.min(90, avgGap + 20), B: Math.min(70, avgGap - 10), fullMark: 100 },
        { subject: 'Location', A: Math.min(95, avgDemand + 15), B: Math.min(75, avgDemand - 5), fullMark: 100 },
        { subject: 'Quality', A: Math.min(85, avgGap + 10), B: Math.min(80, avgGap), fullMark: 100 },
        { subject: 'Speed', A: Math.min(90, avgDemand + 10), B: Math.min(65, avgDemand - 15), fullMark: 100 },
        { subject: 'Support', A: Math.min(95, avgGap + 25), B: Math.min(50, avgGap - 20), fullMark: 100 }
      ];

      const insights = [];
      const categories = Object.keys(competitors);
      if (categories.length > 0) {
        const highestCompetition = categories.reduce((max, cat) => (competitors[cat] || 0) > (competitors[max] || 0) ? cat : max, categories[0]);
        insights.push({
          id: 1, icon: AlertTriangle, color: '#f59e0b',
          title: `High Competition in ${highestCompetition}`,
          description: 'Consider differentiation strategy',
          rationale: `${competitors[highestCompetition]} competitors in ${highestCompetition}. Gap score: ${marketGapScores[highestCompetition]}.`,
          action: `Focus on underserved categories like ${categories.find(c => marketGapScores[c] > 70) || 'available categories'}.`
        });

        const lowestCompetition = categories.reduce((min, cat) => (competitors[cat] || 0) < (competitors[min] || 0) ? cat : min, categories[0]);
        insights.push({
          id: 2, icon: TrendingUp, color: '#10b981',
          title: `Low Competition in ${lowestCompetition}`,
          description: 'Opportunity for market entry',
          rationale: `Only ${competitors[lowestCompetition]} competitors. Demand: ${demandScores[lowestCompetition]}.`,
          action: `Launch targeted marketing for ${lowestCompetition} services.`
        });
      }

      return { barData, radarData, insights };
    } catch (error) {
      return null;
    }
  };

  let barData, radarData, insights;
  try {
    const result = generateCompetitorData(pincodeData);
    barData = result?.barData;
    radarData = result?.radarData;
    insights = result?.insights;
  } catch (err) {
    setError('Failed to load competitor data');
  }

  if (error || !barData || !radarData) {
    return (
      <div className="text-center py-12">
        <Swords size={40} className={`mx-auto mb-3 ${b('text-gray-600', 'text-gray-400')}`} />
        <p className={`text-sm ${b('text-gray-400', 'text-gray-500')}`}>
          {error || 'Select a pincode to view competitor analysis'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Swords size={22} className="text-violet-500" />
        <h3 className={`text-xl font-bold ${b('text-[#f1f5f9]', 'text-[#1e293b]')}`}>Competitor Intelligence</h3>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-2 mb-2">
        {/* Bar Chart */}
        <div className={`rounded-xl border p-3 ${isDarkMode ? 'border-[#334155] bg-[#0f172a]/50' : 'border-[#e2e8f0] bg-gray-50'}`}>
          <h4 className={`text-sm font-bold uppercase tracking-wide mb-3 ${b('text-gray-400', 'text-gray-500')}`}>
            Market Share vs Digital Presence
          </h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} barCategoryGap="25%" margin={{ top: 8, right: 15, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="name" tick={getAxis()} axisLine={axisLine} tickLine={false} />
              <YAxis tick={getAxis()} axisLine={axisLine} tickLine={false} label={{ value: '%', angle: -90, position: 'insideLeft', offset: 5, style: labelStyle }} />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, fontWeight: 700, paddingTop: 8 }} formatter={(value) => <span style={{ color: isDarkMode ? '#e2e8f0' : '#1e293b', fontWeight: 800 }}>{value}</span>} />
              <Bar dataKey="Market Share" fill="#667eea" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Digital Presence" fill="#764ba2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className={`rounded-xl border p-3 ${isDarkMode ? 'border-[#334155] bg-[#0f172a]/50' : 'border-[#e2e8f0] bg-gray-50'}`}>
          <h4 className={`text-sm font-bold uppercase tracking-wide mb-3 ${b('text-gray-400', 'text-gray-500')}`}>
            Competitive Strengths Matrix
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke={gridStroke} />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fontWeight: 700, fill: isDarkMode ? '#e2e8f0' : '#1e293b' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fontWeight: 700, fill: isDarkMode ? '#e2e8f0' : '#1e293b' }} />
              <Radar name="Your Business" dataKey="A" stroke="#667eea" fill="#667eea" fillOpacity={0.4} strokeWidth={2} />
              <Radar name="Competitor" dataKey="B" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: 12, fontWeight: 700, paddingTop: 8 }} formatter={(value) => <span style={{ color: isDarkMode ? '#e2e8f0' : '#1e293b', fontWeight: 800 }}>{value}</span>} />
              <RechartsTooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      {insights && insights.length > 0 && (
        <div className="space-y-3">
          <h4 className={`text-sm font-bold uppercase tracking-wide ${b('text-gray-400', 'text-gray-500')}`}>
            AI Insights
          </h4>
          {insights.map(insight => (
            <motion.div
              key={insight.id}
              className={`rounded-xl border-2 overflow-hidden cursor-pointer transition-all duration-300 ${
                isDarkMode ? 'bg-[#0f172a] border-[#334155] hover:border-[#2563eb]/40' : 'bg-white border-[#e2e8f0] hover:border-[#2563eb]/40'
              }`}
              onClick={() => toggleInsight(insight.id)}
            >
              <div className="p-4 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${insight.color}15` }}>
                    <insight.icon size={18} style={{ color: insight.color }} />
                  </div>
                  <div>
                    <h5 className={`text-sm font-bold ${b('text-gray-200', 'text-gray-700')}`}>{insight.title}</h5>
                    <p className={`text-xs mt-0.5 ${b('text-gray-400', 'text-gray-500')}`}>{insight.description}</p>
                  </div>
                </div>
                {expandedInsight === insight.id ? <ChevronUp size={16} className={b('text-gray-400', 'text-gray-500')} /> : <ChevronDown size={16} className={b('text-gray-400', 'text-gray-500')} />}
              </div>
              <AnimatePresence>
                {expandedInsight === insight.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className={`px-4 pb-4 pt-2 border-t ${isDarkMode ? 'border-[#334155]' : 'border-[#e2e8f0]'}`}>
                      <p className={`text-xs leading-relaxed ${b('text-gray-300', 'text-gray-600')}`}>{insight.rationale}</p>
                      <p className={`text-xs mt-2 font-semibold ${b('text-blue-400', 'text-blue-600')}`}>{insight.action}</p>
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
