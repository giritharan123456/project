import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ChartTooltip from './ChartTooltip';

const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a', '#0891b2', '#d946ef', '#0ea5e9'];

function AnalyticsPanel({ pincodeData, selectedDistrict }) {
  const { isDarkMode } = useTheme();
  const { addToast } = useToast();

  const hasData = pincodeData && pincodeData.length > 0;

  // ═══ REAL DATA: Category Distribution ═══
  const categoryDistribution = useMemo(() => {
    if (!hasData) return [];
    const categoryCounts = {};
    let totalSlots = 0;
    pincodeData.forEach(p => {
      const scores = p.marketGapScores || {};
      totalSlots += Object.keys(scores).length;
      Object.keys(scores).forEach(cat => {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });
    });
    return Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
      percentage: totalSlots > 0 ? Number(((count / totalSlots) * 100).toFixed(2)) : 0
    })).sort((a, b) => b.count - a.count);
  }, [pincodeData, hasData]);

  // ═══ REAL DATA: Performance Metrics ═══
  const performanceMetrics = useMemo(() => {
    if (!hasData) return [];

    const avgGap = pincodeData.reduce((sum, p) => {
      const scores = Object.values(p.marketGapScores || {});
      return sum + (scores.length > 0 ? scores.reduce((s, v) => s + (Number(v) || 0), 0) / scores.length : 0);
    }, 0) / pincodeData.length;

    const avgDemand = pincodeData.reduce((sum, p) => {
      const scores = Object.values(p.demandScores || {});
      return sum + (scores.length > 0 ? scores.reduce((s, v) => s + (Number(v) || 0), 0) / scores.length : 0);
    }, 0) / pincodeData.length;

    const avgCompetition = pincodeData.reduce((sum, p) => {
      const comps = Object.values(p.competitors || {});
      return sum + (comps.length > 0 ? comps.reduce((s, v) => s + (Number(v) || 0), 0) / comps.length : 0);
    }, 0) / pincodeData.length;

    const completeDataAreas = pincodeData.filter(p =>
      p.population > 0 &&
      Object.keys(p.marketGapScores || {}).length > 0 &&
      Object.keys(p.demandScores || {}).length > 0
    ).length;

    const highOppAreas = pincodeData.filter(p => (p.opportunityScore ?? 0) >= 70).length;

    return [
      {
        name: 'Data Completeness',
        value: Number(((completeDataAreas / pincodeData.length) * 100).toFixed(2)),
        target: 100,
        color: COLORS[0],
        detail: `${completeDataAreas}/${pincodeData.length} areas`
      },
      {
        name: 'Avg Market Gap',
        value: Number(avgGap.toFixed(2)),
        target: 100,
        color: COLORS[1],
        detail: `Across all categories`
      },
      {
        name: 'Avg Demand Index',
        value: Number(avgDemand.toFixed(2)),
        target: 100,
        color: COLORS[2],
        detail: `Consumer demand level`
      },
      {
        name: 'High Opportunity Areas',
        value: Number(((highOppAreas / pincodeData.length) * 100).toFixed(2)),
        target: 100,
        color: COLORS[3],
        detail: `${highOppAreas} areas scored ≥70`
      },
      {
        name: 'Competition Density',
        value: Number(Math.min(100, avgCompetition).toFixed(2)),
        target: 100,
        color: COLORS[4],
        detail: `Avg competitors per area`
      }
    ];
  }, [pincodeData, hasData]);

  // ═══ REAL DATA: District Comparison ═══
  const districtComparison = useMemo(() => {
    if (!hasData) return [];
    const districtMap = {};
    pincodeData.forEach(p => {
      const d = p.district || 'Unknown';
      if (!districtMap[d]) districtMap[d] = [];
      districtMap[d].push(p);
    });
    return Object.entries(districtMap).map(([district, areas]) => {
      const avgGap = areas.reduce((sum, p) => {
        const scores = Object.values(p.marketGapScores || {});
        return sum + (scores.length > 0 ? scores.reduce((s, v) => s + (Number(v) || 0), 0) / scores.length : 0);
      }, 0) / areas.length;
      const totalPop = areas.reduce((sum, p) => sum + (Number(p.population) || 0), 0);
      const avgGrowth = areas.reduce((sum, p) => sum + (Number(p.populationGrowth) || 0), 0) / areas.length;
      return {
        district,
        avgGap: Number(avgGap.toFixed(2)),
        totalPopulation: Math.round(totalPop / 1000),
        avgGrowth: Number(avgGrowth.toFixed(2))
      };
    });
  }, [pincodeData, hasData]);

  // ═══ REAL DATA: Key Insights ═══
  const insights = useMemo(() => {
    if (!hasData) return { topDistrict: null, avgGrowth: 0, growingAreas: 0, topCategory: null, coverage: '0', withComplete: 0 };

    const districtScores = {};
    pincodeData.forEach(p => {
      const d = p.district || 'Unknown';
      if (!districtScores[d]) districtScores[d] = { total: 0, count: 0 };
      const gap = Object.values(p.marketGapScores || {}).reduce((s, v) => s + (Number(v) || 0), 0) / (Object.keys(p.marketGapScores || {}).length || 1);
      districtScores[d].total += gap;
      districtScores[d].count += 1;
    });
    const topDistrict = Object.entries(districtScores)
      .map(([name, data]) => ({ name, avg: data.total / data.count }))
      .sort((a, b) => b.avg - a.avg)[0];

    const avgGrowth = pincodeData.reduce((sum, p) => sum + (Number(p.populationGrowth) || 0), 0) / pincodeData.length;
    const growingAreas = pincodeData.filter(p => (Number(p.populationGrowth) || 0) > 1.5).length;

    const catDemand = {};
    pincodeData.forEach(p => {
      Object.entries(p.demandScores || {}).forEach(([cat, score]) => {
        if (!catDemand[cat]) catDemand[cat] = { demand: 0, count: 0 };
        catDemand[cat].demand += Number(score) || 0;
        catDemand[cat].count += 1;
      });
    });
    const topCategory = Object.entries(catDemand)
      .map(([name, data]) => ({ name, gap: data.demand / data.count }))
      .sort((a, b) => b.gap - a.gap)[0];

    const withComplete = pincodeData.filter(p =>
      p.population > 0 &&
      Object.keys(p.marketGapScores || {}).length > 0 &&
      Object.keys(p.demandScores || {}).length > 0
    ).length;

    return {
      topDistrict,
      avgGrowth,
      growingAreas,
      topCategory,
      coverage: ((withComplete / pincodeData.length) * 100).toFixed(2),
      withComplete
    };
  }, [pincodeData, hasData]);

  const handleExportReport = () => {
    if (!hasData) { addToast('No data to export', 'warning'); return; }
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;

      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, pageWidth, 24, 'F');
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text('MarketVision AI — Analytics Report', margin, 10);
      doc.setFontSize(9);
      doc.text(`District: ${selectedDistrict} | Generated: ${new Date().toLocaleDateString('en-IN')}`, margin, 17);

      const totalPop = pincodeData.reduce((s, p) => s + (Number(p.population) || 0), 0);
      const avgGrowth = (pincodeData.reduce((s, p) => s + (Number(p.populationGrowth) || 0), 0) / pincodeData.length).toFixed(2);

      autoTable(doc, {
        startY: 30,
        head: [['Metric', 'Value']],
        body: [
          ['Areas Analyzed', String(pincodeData.length)],
          ['Total Population', totalPop.toLocaleString()],
          ['Average Growth', `${avgGrowth}%`],
        ],
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [37, 99, 235], textColor: 255 },
        margin: { left: margin, right: margin },
      });

      autoTable(doc, {
        startY: (doc.lastAutoTable?.finalY || 30) + 10,
        head: [['Area', 'Pincode', 'Population', 'Growth %', 'Income Level']],
        body: pincodeData.map(p => [
          (p.area || '').substring(0, 25),
          p.pincode || '',
          (Number(p.population) || 0).toLocaleString(),
          `${(Number(p.populationGrowth) || 0).toFixed(2)}%`,
          p.incomeLevel || '-',
        ]),
        styles: { fontSize: 7, cellPadding: 2 },
        headStyles: { fillColor: [37, 99, 235], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { left: margin, right: margin },
      });

      doc.save(`analytics-${selectedDistrict}.pdf`);
      addToast('Analytics PDF exported successfully', 'success');
    } catch { addToast('Export failed', 'error'); }
  };

  return (
    <div className={`p-3 rounded-xl border mb-1 transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#475569]' : 'bg-white border-slate-200'}`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <h3 className={`text-lg sm:text-xl font-bold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>📊 Analytics — {selectedDistrict || 'All Districts'}</h3>
        <div className="flex gap-2">
          <button disabled={!hasData} className={`px-4 py-2 border-2 rounded-lg transition-all duration-300 ${!hasData ? 'opacity-40 cursor-not-allowed' : ''} ${isDarkMode ? 'bg-[#0f172a] border-[#334155] text-[#f1f5f9] hover:border-[#2563eb]' : 'bg-[#f8fafc] border-[#e2e8f0] text-[#1e293b] hover:border-[#2563eb]'}`} onClick={handleExportReport}>📥 Export</button>
        </div>
      </div>

      {!hasData && (
        <p className={`text-sm text-center py-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Select a district with data to view analytics.</p>
      )}

      {hasData && (
        <>
          {/* Row 1: Category Distribution + Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <motion.div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <h4 className={`text-base font-semibold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Category Distribution</h4>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={categoryDistribution} cx="50%" cy="50%" outerRadius={100} innerRadius={40} paddingAngle={2} dataKey="count">
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={isDarkMode ? '#1e293b' : '#ffffff'} strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 13, fontWeight: 700, paddingTop: 8 }} formatter={(value) => <span style={{ color: isDarkMode ? '#e2e8f0' : '#1e293b', fontWeight: 800, fontSize: 13 }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <h4 className={`text-base font-semibold mb-3 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Performance Metrics</h4>
              <div className="space-y-3">
                {performanceMetrics.map((metric, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{metric.name}</span>
                      <span className="text-sm font-bold" style={{ color: metric.color }}>{metric.value.toFixed(2)}%</span>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div className="h-full transition-all duration-300" style={{ width: `${Math.min(100, metric.value)}%`, background: metric.color }}></div>
                    </div>
                    <span className={`text-[11px] opacity-60 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{metric.detail}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Row 2: District Comparison */}
          <motion.div className={`p-3 rounded-lg border mt-2 ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <h4 className={`text-base font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>District Comparison</h4>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={districtComparison} margin={{ top: 8, right: 15, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#475569' : '#cbd5e1'} vertical={false} />
                <XAxis dataKey="district" tick={{ fontSize: 13, fontWeight: 700, fill: isDarkMode ? '#e2e8f0' : '#1e293b' }} axisLine={{ stroke: isDarkMode ? '#64748b' : '#94a3b8' }} tickLine={false} angle={-50} textAnchor="end" height={65} interval={0} />
                <YAxis tick={{ fontSize: 13, fontWeight: 700, fill: isDarkMode ? '#e2e8f0' : '#1e293b' }} axisLine={{ stroke: isDarkMode ? '#64748b' : '#94a3b8' }} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="avgGap" fill="#2563eb" name="Avg Gap Score" radius={[3, 3, 0, 0]} />
                <Bar dataKey="totalPopulation" fill="#7c3aed" name="Population (K)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="avgGrowth" fill="#10b981" name="Growth %" radius={[3, 3, 0, 0]} />
                <Legend wrapperStyle={{ fontSize: 13, fontWeight: 700, paddingTop: 8 }} formatter={(value) => <span style={{ color: isDarkMode ? '#e2e8f0' : '#1e293b', fontWeight: 800, fontSize: 13 }}>{value}</span>} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Row 3: Key Insights */}
          <motion.div className={`p-3 rounded-lg border mt-2 ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <h4 className={`text-base font-semibold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Key Insights Summary</h4>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2">
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
                <div className="text-2xl mb-2">🎯</div>
                <h5 className={`font-bold text-base ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Top District</h5>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  <span className="font-bold">{insights.topDistrict?.name || 'N/A'}</span>
                  <span className="opacity-70"> — Gap: {Number(insights.topDistrict?.avg || 0).toFixed(2)}</span>
                </p>
              </div>
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
                <div className="text-2xl mb-2">📈</div>
                <h5 className={`font-bold text-base ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Growth Trend</h5>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  <span className="font-bold">{insights.avgGrowth.toFixed(2)}%</span>
                  <span className="opacity-70"> — {insights.growingAreas} fast-growing areas</span>
                </p>
              </div>
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
                <div className="text-2xl mb-2">💡</div>
                <h5 className={`font-bold text-base ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Top Opportunity</h5>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  <span className="font-bold">{insights.topCategory?.name || 'N/A'}</span>
                  <span className="opacity-70"> — Score: {Number(insights.topCategory?.gap || 0).toFixed(2)}</span>
                </p>
              </div>
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
                <div className="text-2xl mb-2">⚡</div>
                <h5 className={`font-bold text-base ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Data Coverage</h5>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  <span className="font-bold">{insights.coverage}%</span>
                  <span className="opacity-70"> — {insights.withComplete}/{pincodeData.length} areas</span>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

export default AnalyticsPanel;
