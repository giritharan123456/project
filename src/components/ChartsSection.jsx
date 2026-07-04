import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { BarChart3, TrendingUp, PieChart as PieIcon, Activity } from 'lucide-react';
import EmptyState from './EmptyState';
import { averageOfValues, toPlainObject } from '../utils/dataUtils';

const COLORS = ['#2563eb', '#7c3aed', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#8b5cf6', '#ec4899'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="p-3 rounded-lg shadow-2xl border-2" style={{ background: '#ffffff', borderColor: '#cbd5e1' }}>
      <p className="font-bold text-sm text-gray-900 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs font-bold" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
        </p>
      ))}
    </div>
  );
};

function ChartsSection({ businessCategories, selectedCategory, pincodeData }) {
  const { isDarkMode } = useTheme();

  if (!pincodeData || pincodeData.length === 0 || businessCategories.length === 0) {
    return <EmptyState type="noData" message="No chart data available." />;
  }

  const filteredCategories = selectedCategory === 'all'
    ? businessCategories.filter(c => c.demand !== null || c.supply !== null)
    : businessCategories.filter(cat => cat.name === selectedCategory);

  const forecastData = pincodeData.map(pincode => {
    const demandScores = toPlainObject(pincode.demandScores);
    const avgDemand = averageOfValues(demandScores);
    const growth = pincode.populationGrowth ?? 0;
    return {
      name: pincode.pincode,
      currentDemand: Math.round((avgDemand ?? 0) * 100) / 100,
      projectedDemand: avgDemand !== null ? Math.round((avgDemand + (growth * 2)) * 100) / 100 : 0,
    };
  }).filter(d => d.currentDemand > 0 || d.projectedDemand > 0);

  const gapDistribution = pincodeData.flatMap(pincode =>
    Object.entries(toPlainObject(pincode.marketGapScores)).map(([category, score]) => ({
      category, score: Number(score)
    }))
  ).reduce((acc, { category, score }) => {
    if (!isNaN(score)) { acc[category] = (acc[category] || 0) + score; }
    return acc;
  }, {});

  const gapChartData = Object.entries(gapDistribution).map(([category, score]) => ({
    name: category.length > 14 ? category.slice(0, 12) + '…' : category,
    fullName: category,
    score: Math.round(score / pincodeData.length * 100) / 100
  }));

  if (filteredCategories.length === 0 && forecastData.length === 0 && gapChartData.length === 0) {
    return <EmptyState type="noData" message="No chart data for selected area." />;
  }

  // HIGH CONTRAST axis styling — always dark and bold
  const axisDark = { fontSize: 13, fontWeight: 700, fill: '#e2e8f0' };
  const axisLight = { fontSize: 13, fontWeight: 700, fill: '#1e293b' };
  const getAxis = () => isDarkMode ? axisDark : axisLight;
  const xAxisDark = { fontSize: 13, fontWeight: 800, fill: '#e2e8f0' };
  const xAxisLight = { fontSize: 13, fontWeight: 800, fill: '#1e293b' };
  const getXAxis = () => isDarkMode ? xAxisDark : xAxisLight;

  const labelDark = (text) => ({
    value: text, angle: -90, position: 'insideLeft', offset: 5,
    style: { fontSize: 12, fontWeight: 700, fill: isDarkMode ? '#e2e8f0' : '#1e293b' }
  });

  const gridStroke = isDarkMode ? '#475569' : '#cbd5e1';
  const axisLine = { stroke: isDarkMode ? '#64748b' : '#94a3b8' };

  return (
    <div className="space-y-0">
      {/* Demand vs Supply */}
      <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-[#1e293b] border-[#475569]' : 'bg-white border-slate-200'}`}>
        <div className={`px-4 py-2.5 border-b flex items-center gap-2 ${isDarkMode ? 'border-[#475569] bg-[#0f172a]/60' : 'border-slate-200 bg-slate-50'}`}>
          <BarChart3 size={16} className="text-blue-600" />
          <span className={`text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Demand vs Supply Analysis</span>
        </div>
        <div className="p-3">
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={filteredCategories} barGap={2} barCategoryGap="18%" margin={{ top: 8, right: 15, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="name" tick={{ ...getXAxis(), fontSize: 13 }} axisLine={axisLine} tickLine={false} angle={-25} textAnchor="end" height={48} interval={0} />
              <YAxis tick={getAxis()} axisLine={axisLine} tickLine={false} label={labelDark('Score')} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 13, fontWeight: 700, paddingTop: 6 }} formatter={(value) => <span style={{ color: isDarkMode ? '#e2e8f0' : '#1e293b', fontWeight: 800, fontSize: 13 }}>{value}</span>} />
              <Bar dataKey="demand" fill="#2563eb" name="Demand" radius={[3, 3, 0, 0]} />
              <Bar dataKey="supply" fill="#7c3aed" name="Supply" radius={[3, 3, 0, 0]} />
              <Bar dataKey="gap" fill="#ef4444" name="Gap" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Demand Forecasting */}
      <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-[#1e293b] border-[#475569]' : 'bg-white border-slate-200'}`}>
        <div className={`px-4 py-2.5 border-b flex items-center gap-2 ${isDarkMode ? 'border-[#475569] bg-[#0f172a]/60' : 'border-slate-200 bg-slate-50'}`}>
          <TrendingUp size={16} className="text-emerald-600" />
          <span className={`text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Demand Forecasting</span>
        </div>
        <div className="p-3">
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={forecastData} margin={{ top: 8, right: 15, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="name" tick={{ ...getXAxis(), fontSize: 13 }} axisLine={axisLine} tickLine={false} label={{ value: 'Pincode', position: 'insideBottom', offset: -2, style: { fontSize: 13, fontWeight: 700, fill: isDarkMode ? '#e2e8f0' : '#1e293b' } }} interval={0} angle={-30} textAnchor="end" height={44} />
              <YAxis tick={getAxis()} axisLine={axisLine} tickLine={false} label={labelDark('Demand Score')} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 13, fontWeight: 700, paddingTop: 6 }} formatter={(value) => <span style={{ color: isDarkMode ? '#e2e8f0' : '#1e293b', fontWeight: 800, fontSize: 13 }}>{value}</span>} />
              <Line type="monotone" dataKey="currentDemand" stroke="#2563eb" name="Current Demand" strokeWidth={2.5} dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
              <Line type="monotone" dataKey="projectedDemand" stroke="#10b981" name="Projected Demand" strokeWidth={2.5} strokeDasharray="8 4" dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Market Gap Distribution */}
      <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-[#1e293b] border-[#475569]' : 'bg-white border-slate-200'}`}>
        <div className={`px-4 py-2.5 border-b flex items-center gap-2 ${isDarkMode ? 'border-[#475569] bg-[#0f172a]/60' : 'border-slate-200 bg-slate-50'}`}>
          <Activity size={16} className="text-red-600" />
          <span className={`text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Market Gap Score by Category</span>
        </div>
        <div className="p-3">
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={gapChartData} barCategoryGap="22%" margin={{ top: 8, right: 15, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="name" tick={{ ...getXAxis(), fontSize: 13 }} axisLine={axisLine} tickLine={false} angle={-35} textAnchor="end" height={54} interval={0} />
              <YAxis tick={getAxis()} axisLine={axisLine} tickLine={false} label={labelDark('Avg Score')} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 13, fontWeight: 700, paddingTop: 6 }} formatter={(value) => <span style={{ color: isDarkMode ? '#e2e8f0' : '#1e293b', fontWeight: 800, fontSize: 13 }}>{value}</span>} />
              <Bar dataKey="score" name="Avg Market Gap" radius={[3, 3, 0, 0]}>
                {gapChartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-[#1e293b] border-[#475569]' : 'bg-white border-slate-200'}`}>
        <div className={`px-4 py-2.5 border-b flex items-center gap-2 ${isDarkMode ? 'border-[#475569] bg-[#0f172a]/60' : 'border-slate-200 bg-slate-50'}`}>
          <PieIcon size={16} className="text-violet-600" />
          <span className={`text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Category Gap Share</span>
        </div>
        <div className="p-3">
          <ResponsiveContainer width="100%" height={360}>
            <PieChart>
              <Pie data={gapChartData} cx="50%" cy="50%" outerRadius={110} innerRadius={45} paddingAngle={2} dataKey="score">
                {gapChartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} stroke={isDarkMode ? '#1e293b' : '#ffffff'} strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 13, fontWeight: 700, paddingTop: 8 }}
                formatter={(value) => <span style={{ color: isDarkMode ? '#e2e8f0' : '#1e293b', fontWeight: 800, fontSize: 13 }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default ChartsSection;
