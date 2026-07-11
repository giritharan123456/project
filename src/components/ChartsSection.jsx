import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { BarChart3, TrendingUp, PieChart as PieIcon, Activity, Table2 } from 'lucide-react';
import EmptyState from './EmptyState';
import { averageOfValues, toPlainObject } from '../utils/dataUtils';
import ChartTooltip from './ChartTooltip';

const COLORS = ['#2563eb', '#7c3aed', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#8b5cf6', '#ec4899'];

function ChartsSection({ businessCategories, selectedCategory, pincodeData }) {
  const { isDarkMode } = useTheme();
  const [showTable, setShowTable] = useState({});

  if (!pincodeData || pincodeData.length === 0 || !businessCategories || businessCategories.length === 0) {
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
      projectedDemand: avgDemand !== null ? Math.round((avgDemand * (1 + (growth / 100))) * 100) / 100 : 0,
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
  const legendStyle = { fontSize: 12, fontWeight: 700, paddingTop: 6 };
  const legendFormatter = (value) => <span style={{ color: isDarkMode ? '#e2e8f0' : '#1e293b', fontWeight: 800, fontSize: 12 }}>{value}</span>;

  const toggleTable = (key) => setShowTable(prev => ({ ...prev, [key]: !prev[key] }));

  const thClass = `px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-extrabold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`;
  const tdClass = `px-2 sm:px-3 py-2 text-xs sm:text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`;

  return (
    <div className="space-y-0">
      {/* Demand vs Supply */}
      <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-[#1e293b] border-[#475569]' : 'bg-white border-slate-200'}`}>
        <div className={`px-3 sm:px-4 py-2.5 border-b flex items-center justify-between ${isDarkMode ? 'border-[#475569] bg-[#0f172a]/60' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-blue-600" />
            <span className={`text-sm sm:text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Demand vs Supply Analysis</span>
          </div>
          <button onClick={() => toggleTable('dvs')} className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${showTable.dvs ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-[#0f172a] text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-800'}`}>
            <Table2 size={14} />
          </button>
        </div>
        {showTable.dvs ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[400px]">
              <thead><tr className={isDarkMode ? 'bg-[#0f172a]/60' : 'bg-slate-50'}>
                <th className={thClass}>Category</th>
                <th className={`${thClass} hidden sm:table-cell`}>Demand</th>
                <th className={`${thClass} hidden sm:table-cell`}>Supply</th>
                <th className={thClass}>Gap</th>
              </tr></thead>
              <tbody>
                {filteredCategories.map((cat, i) => (
                  <tr key={i} className={`border-t ${isDarkMode ? 'border-[#334155]' : 'border-slate-100'}`}>
                    <td className={`${tdClass} font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{cat.name}</td>
                    <td className={`${tdClass} hidden sm:table-cell`}>{cat.demand ?? '-'}</td>
                    <td className={`${tdClass} hidden sm:table-cell`}>{cat.supply ?? '-'}</td>
                    <td className={tdClass}>
                      <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${cat.gap >= 50 ? 'bg-emerald-900/30 text-emerald-400' : cat.gap >= 25 ? 'bg-amber-900/30 text-amber-400' : 'bg-red-900/30 text-red-400'}`}>{cat.gap ?? '-'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-2 sm:p-3">
            {filteredCategories.length > 0 ? (
              <ResponsiveContainer width="100%" height={280} minHeight={200}>
                <BarChart data={filteredCategories} barGap={2} barCategoryGap="18%" margin={{ top: 8, right: 15, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                  <XAxis dataKey="name" tick={{ ...getXAxis(), fontSize: 11 }} axisLine={axisLine} tickLine={false} angle={-25} textAnchor="end" height={48} interval={0} />
                  <YAxis tick={getAxis()} axisLine={axisLine} tickLine={false} label={labelDark('Score')} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={legendStyle} formatter={legendFormatter} />
                  <Bar dataKey="demand" fill="#2563eb" name="Demand" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="supply" fill="#7c3aed" name="Supply" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="gap" fill="#ef4444" name="Gap" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className={`text-center py-8 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>No demand data available.</p>
            )}
          </div>
        )}
      </div>

      {/* Demand Forecasting */}
      <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-[#1e293b] border-[#475569]' : 'bg-white border-slate-200'}`}>
        <div className={`px-3 sm:px-4 py-2.5 border-b flex items-center justify-between ${isDarkMode ? 'border-[#475569] bg-[#0f172a]/60' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-600" />
            <span className={`text-sm sm:text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Demand Forecasting</span>
          </div>
          <button onClick={() => toggleTable('df')} className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${showTable.df ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-[#0f172a] text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-800'}`}>
            <Table2 size={14} />
          </button>
        </div>
        {showTable.df ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[300px]">
              <thead><tr className={isDarkMode ? 'bg-[#0f172a]/60' : 'bg-slate-50'}>
                <th className={thClass}>Pincode</th>
                <th className={thClass}>Current</th>
                <th className={thClass}>Projected</th>
              </tr></thead>
              <tbody>
                {forecastData.map((d, i) => (
                  <tr key={i} className={`border-t ${isDarkMode ? 'border-[#334155]' : 'border-slate-100'}`}>
                    <td className={`${tdClass} font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{d.name}</td>
                    <td className={`${tdClass} text-blue-500`}>{d.currentDemand}</td>
                    <td className={`${tdClass} text-emerald-500`}>{d.projectedDemand}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-2 sm:p-3">
            {forecastData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280} minHeight={200}>
                <LineChart data={forecastData} margin={{ top: 8, right: 15, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                  <XAxis dataKey="name" tick={{ ...getXAxis(), fontSize: 11 }} axisLine={axisLine} tickLine={false} interval={0} angle={-30} textAnchor="end" height={44} />
                  <YAxis tick={getAxis()} axisLine={axisLine} tickLine={false} label={labelDark('Demand Score')} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={legendStyle} formatter={legendFormatter} />
                  <Line type="monotone" dataKey="currentDemand" stroke="#2563eb" name="Current Demand" strokeWidth={2.5} dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
                  <Line type="monotone" dataKey="projectedDemand" stroke="#10b981" name="Projected Demand" strokeWidth={2.5} strokeDasharray="8 4" dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className={`text-center py-8 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>No forecast data available.</p>
            )}
          </div>
        )}
      </div>

      {/* Market Gap Distribution */}
      <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-[#1e293b] border-[#475569]' : 'bg-white border-slate-200'}`}>
        <div className={`px-3 sm:px-4 py-2.5 border-b flex items-center justify-between ${isDarkMode ? 'border-[#475569] bg-[#0f172a]/60' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-red-600" />
            <span className={`text-sm sm:text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Market Gap Score by Category</span>
          </div>
          <button onClick={() => toggleTable('mgs')} className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${showTable.mgs ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-[#0f172a] text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-800'}`}>
            <Table2 size={14} />
          </button>
        </div>
        {showTable.mgs ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[250px]">
              <thead><tr className={isDarkMode ? 'bg-[#0f172a]/60' : 'bg-slate-50'}>
                <th className={thClass}>Category</th>
                <th className={thClass}>Avg Gap Score</th>
              </tr></thead>
              <tbody>
                {gapChartData.map((d, i) => (
                  <tr key={i} className={`border-t ${isDarkMode ? 'border-[#334155]' : 'border-slate-100'}`}>
                    <td className={`${tdClass} font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{d.fullName || d.name}</td>
                    <td className={tdClass}>
                      <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${d.score >= 65 ? 'bg-emerald-900/30 text-emerald-400' : d.score >= 40 ? 'bg-amber-900/30 text-amber-400' : 'bg-red-900/30 text-red-400'}`}>{d.score}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-2 sm:p-3">
            {gapChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280} minHeight={200}>
                <BarChart data={gapChartData} barCategoryGap="22%" margin={{ top: 8, right: 15, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                  <XAxis dataKey="name" tick={{ ...getXAxis(), fontSize: 11 }} axisLine={axisLine} tickLine={false} angle={-35} textAnchor="end" height={54} interval={0} />
                  <YAxis tick={getAxis()} axisLine={axisLine} tickLine={false} label={labelDark('Avg Score')} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={legendStyle} formatter={legendFormatter} />
                  <Bar dataKey="score" name="Avg Market Gap" radius={[3, 3, 0, 0]}>
                    {gapChartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className={`text-center py-8 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>No gap data available.</p>
            )}
          </div>
        )}
      </div>

      {/* Pie Chart */}
      <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-[#1e293b] border-[#475569]' : 'bg-white border-slate-200'}`}>
        <div className={`px-3 sm:px-4 py-2.5 border-b flex items-center justify-between ${isDarkMode ? 'border-[#475569] bg-[#0f172a]/60' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex items-center gap-2">
            <PieIcon size={16} className="text-violet-600" />
            <span className={`text-sm sm:text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Category Gap Share</span>
          </div>
          <button onClick={() => toggleTable('cgs')} className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${showTable.cgs ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-[#0f172a] text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-800'}`}>
            <Table2 size={14} />
          </button>
        </div>
        {showTable.cgs ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[250px]">
              <thead><tr className={isDarkMode ? 'bg-[#0f172a]/60' : 'bg-slate-50'}>
                <th className={thClass}>Category</th>
                <th className={thClass}>Gap Score</th>
                <th className={`${thClass} hidden sm:table-cell`}>Share %</th>
              </tr></thead>
              <tbody>
                {gapChartData.map((d, i) => {
                  const total = gapChartData.reduce((s, g) => s + g.score, 0);
                  const pct = total > 0 ? ((d.score / total) * 100).toFixed(1) : '0';
                  return (
                    <tr key={i} className={`border-t ${isDarkMode ? 'border-[#334155]' : 'border-slate-100'}`}>
                      <td className={`${tdClass} font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        {d.fullName || d.name}
                      </td>
                      <td className={tdClass}>{d.score}</td>
                      <td className={`${tdClass} hidden sm:table-cell`}>{pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-2 sm:p-3">
            {gapChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={gapChartData} cx="50%" cy="50%" outerRadius={100} innerRadius={40} paddingAngle={2} dataKey="score">
                    {gapChartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} stroke={isDarkMode ? '#1e293b' : '#ffffff'} strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, fontWeight: 700, paddingTop: 8 }} formatter={legendFormatter} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className={`text-center py-8 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>No category data available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChartsSection;
