import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useDistrict } from '../contexts/DistrictContext';
import { districtsAPI, areasAPI, analyticsAPI, explorerAPI } from '../services/api';
import { transformAreaToPincodeData } from '../utils/dataUtils';
import {
  BarChart3, TrendingUp, MapPin, Users, Target, Calculator,
  AlertTriangle, DollarSign, Activity, Globe, Zap, ArrowRight, CheckCircle, XCircle
} from 'lucide-react';

function Analysis() {
  const { isDarkMode } = useTheme();
  const { selectedDistrict, districts } = useDistrict();

  const currentDistrict = districts.find(d => d._id === selectedDistrict);
  const districtName = currentDistrict?.name || 'No district selected';

  const [areas, setAreas] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedDistrict) { setLoading(false); return; }
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [areasRes, analyticsRes, catsRes] = await Promise.allSettled([
          areasAPI.getAll({ district: selectedDistrict, limit: 500 }),
          analyticsAPI.getOverview(),
          explorerAPI.getCategories({ district: selectedDistrict }),
        ]);
        if (areasRes.status === 'fulfilled') setAreas(areasRes.value?.data || []);
        if (analyticsRes.status === 'fulfilled') setAnalyticsData(analyticsRes.value?.data || null);
        if (catsRes.status === 'fulfilled') setCategories(catsRes.value?.categories || []);
      } catch { /* silent */ } finally { setLoading(false); }
    };
    fetchAll();
  }, [selectedDistrict]);

  const pincodeData = useMemo(() => areas.map(transformAreaToPincodeData).filter(Boolean), [areas]);

  const stats = useMemo(() => {
    if (!pincodeData.length) return null;
    const totalPop = pincodeData.reduce((s, p) => s + (p.population || 0), 0);
    const avgGap = pincodeData.reduce((s, p) => {
      const gaps = Object.values(p.marketGapScores || {});
      return s + (gaps.length ? gaps.reduce((a, b) => a + b, 0) / gaps.length : 0);
    }, 0) / pincodeData.length;
    const avgDemand = pincodeData.reduce((s, p) => {
      const demands = Object.values(p.demandScores || {});
      return s + (demands.length ? demands.reduce((a, b) => a + b, 0) / demands.length : 0);
    }, 0) / pincodeData.length;
    const avgCompetitors = pincodeData.reduce((s, p) => {
      const comps = Object.values(p.competitors || {});
      return s + (comps.length ? comps.reduce((a, b) => a + b, 0) / comps.length : 0);
    }, 0) / pincodeData.length;
    const highOpp = pincodeData.filter(p => {
      const gaps = Object.values(p.marketGapScores || {});
      const avg = gaps.length ? gaps.reduce((a, b) => a + b, 0) / gaps.length : 0;
      return avg >= 70;
    }).length;
    const medOpp = pincodeData.filter(p => {
      const gaps = Object.values(p.marketGapScores || {});
      const avg = gaps.length ? gaps.reduce((a, b) => a + b, 0) / gaps.length : 0;
      return avg >= 40 && avg < 70;
    }).length;
    const lowOpp = pincodeData.length - highOpp - medOpp;
    const topAreas = [...pincodeData].sort((a, b) => {
      const aGaps = Object.values(a.marketGapScores || {});
      const bGaps = Object.values(b.marketGapScores || {});
      const aAvg = aGaps.length ? aGaps.reduce((x, y) => x + y, 0) / aGaps.length : 0;
      const bAvg = bGaps.length ? bGaps.reduce((x, y) => x + y, 0) / bGaps.length : 0;
      return bAvg - aAvg;
    }).slice(0, 8);
    const riskAreas = [...pincodeData].filter(p => {
      const comps = Object.values(p.competitors || {});
      const avgC = comps.length ? comps.reduce((a, b) => a + b, 0) / comps.length : 0;
      return avgC > 5;
    }).sort((a, b) => {
      const aComps = Object.values(a.competitors || {});
      const bComps = Object.values(b.competitors || {});
      const aAvg = aComps.length ? aComps.reduce((x, y) => x + y, 0) / aComps.length : 0;
      const bAvg = bComps.length ? bComps.reduce((x, y) => x + y, 0) / bComps.length : 0;
      return bAvg - aAvg;
    }).slice(0, 5);
    return { totalPop, avgGap, avgDemand, avgCompetitors, highOpp, medOpp, lowOpp, topAreas, riskAreas };
  }, [pincodeData]);

  if (loading) {
    return (
      <div className={`min-h-[calc(100vh-70px)] flex items-center justify-center ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2563eb] mx-auto mb-4" />
          <p className={`${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Loading analysis data...</p>
        </div>
      </div>
    );
  }

  if (!selectedDistrict) {
    return (
      <div className={`min-h-[calc(100vh-70px)] flex items-center justify-center ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <div className="text-center max-w-md p-8">
          <div className="text-5xl mb-4">📊</div>
          <h2 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Select a District</h2>
          <p className={`mb-6 opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Choose a district from the dropdown above to view its market gap analysis.</p>
          <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
            <MapPin size={18} /> Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-[calc(100vh-70px)] p-6 md:p-10 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="text-[#2563eb]" size={32} />
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Market Gap Analysis
            </h1>
          </div>
          <p className={`text-lg opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
            {districtName} — {currentDistrict?.state || '—'} — {pincodeData.length} area{pincodeData.length !== 1 ? 's' : ''} analyzed
          </p>
        </motion.div>

        {/* District Overview KPIs */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users, label: 'Total Population', value: stats.totalPop.toLocaleString(), color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              { icon: MapPin, label: 'Areas Analyzed', value: pincodeData.length, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20' },
              { icon: Target, label: 'Avg Market Gap', value: Number(stats.avgGap).toFixed(2), color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
              { icon: Activity, label: 'Avg Demand', value: Number(stats.avgDemand).toFixed(2), color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
            ].map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
                className={`p-5 rounded-2xl border transition-all hover:shadow-lg ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
                <div className={`inline-flex p-2.5 rounded-xl mb-3 ${isDarkMode ? 'bg-[#0f172a]' : m.bg}`}>
                  <m.icon className={m.color} size={22} />
                </div>
                <p className={`text-xs font-medium mb-1 uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{m.label}</p>
                <p className={`text-2xl font-extrabold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{m.value}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Opportunity Distribution + Key Factors */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Opportunity Distribution */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
              <div className="flex items-center gap-3 mb-6">
                <Zap className="text-[#2563eb]" size={24} />
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Opportunity Distribution</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'High Opportunity', count: stats.highOpp, total: pincodeData.length, color: 'bg-green-500', desc: 'Gap score ≥ 70' },
                  { label: 'Medium Opportunity', count: stats.medOpp, total: pincodeData.length, color: 'bg-yellow-500', desc: 'Gap score 40–69' },
                  { label: 'Lower Opportunity', count: stats.lowOpp, total: pincodeData.length, color: 'bg-red-400', desc: 'Gap score < 40' },
                ].map((item, i) => {
                  const pct = item.total > 0 ? (item.count / item.total) * 100 : 0;
                  return (
                    <div key={i}>
                      <div className="flex justify-between mb-1">
                        <span className={`font-semibold text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{item.label}</span>
                        <span className={`text-sm font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{item.count} ({Number(pct).toFixed(2)}%)</span>
                      </div>
                      <div className={`w-full h-3 rounded-full ${isDarkMode ? 'bg-[#0f172a]' : 'bg-gray-100'}`}>
                        <div className={`h-3 rounded-full ${item.color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                      <p className={`text-xs mt-1 opacity-60 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Key Analysis Factors */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
              className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
              <div className="flex items-center gap-3 mb-6">
                <Target className="text-[#2563eb]" size={24} />
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Key Analysis Factors</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Population Size', desc: `${stats.totalPop.toLocaleString()} total`, icon: Users, color: 'text-blue-500' },
                  { label: 'Avg Competitors', desc: `${Number(stats.avgCompetitors).toFixed(2)} per area`, icon: AlertTriangle, color: 'text-orange-500' },
                  { label: 'Avg Market Gap', desc: `${Number(stats.avgGap).toFixed(2)} score`, icon: Target, color: 'text-emerald-500' },
                  { label: 'Avg Demand', desc: `${Number(stats.avgDemand).toFixed(2)} score`, icon: TrendingUp, color: 'text-violet-500' },
                ].map((f, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
                    <f.icon className={`${f.color} mb-2`} size={20} />
                    <p className={`font-bold text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{f.label}</p>
                    <p className={`text-xs opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{f.desc}</p>
                  </div>
                ))}
              </div>
              {/* Scoring Formula */}
              <div className={`mt-4 p-4 rounded-xl border-2 text-center ${isDarkMode ? 'bg-[#0f172a] border-[#2563eb]' : 'bg-[#f8fafc] border-[#2563eb]'}`}>
                <p className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>SCORING FORMULA</p>
                <code className="text-[#2563eb] text-sm font-bold">Gap Score = Demand Score − Competition Score</code>
                <p className={`text-xs mt-1 opacity-60 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Scores above 70 indicate high-potential business opportunities</p>
              </div>
            </motion.div>
          </div>
        )}

        {/* Category Analysis */}
        {categories.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="text-[#2563eb]" size={24} />
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Business Category Analysis — {districtName}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className={`border-b ${isDarkMode ? 'border-[#334155]' : 'border-[#e2e8f0]'}`}>
                    <th className={`pb-3 font-bold text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Category</th>
                    <th className={`pb-3 font-bold text-sm text-right ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Demand</th>
                    <th className={`pb-3 font-bold text-sm text-right ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Supply</th>
                    <th className={`pb-3 font-bold text-sm text-right ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Gap</th>
                    <th className={`pb-3 font-bold text-sm text-right ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Best Area</th>
                    <th className={`pb-3 font-bold text-sm text-right ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Areas</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, i) => (
                    <tr key={cat._id || i} className={`border-b ${isDarkMode ? 'border-[#334155]' : 'border-[#e2e8f0]'}`}>
                      <td className={`py-3 font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{cat.name}</td>
                      <td className={`py-3 text-right ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{Number(cat.demand || 0).toFixed(2)}</td>
                      <td className={`py-3 text-right ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{Number(cat.supply || 0).toFixed(2)}</td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          (cat.gap || 0) >= 50 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          (cat.gap || 0) >= 25 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>{Number(cat.gap || 0).toFixed(2)}</span>
                      </td>
                      <td className={`py-3 text-right text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                        {cat.bestArea?.name || '—'} {cat.bestArea?.gap ? `(${Number(cat.bestArea.gap).toFixed(2)})` : ''}
                      </td>
                      <td className={`py-3 text-right ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{cat.areaCount || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Top Opportunities */}
        {stats && stats.topAreas.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="text-green-500" size={24} />
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Top Opportunities in {districtName}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className={`border-b ${isDarkMode ? 'border-[#334155]' : 'border-[#e2e8f0]'}`}>
                    <th className={`pb-3 font-bold text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>#</th>
                    <th className={`pb-3 font-bold text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Area</th>
                    <th className={`pb-3 font-bold text-sm text-right ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Pincode</th>
                    <th className={`pb-3 font-bold text-sm text-right ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Population</th>
                    <th className={`pb-3 font-bold text-sm text-right ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Income</th>
                    <th className={`pb-3 font-bold text-sm text-right ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Avg Gap Score</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topAreas.map((area, i) => {
                    const gaps = Object.values(area.marketGapScores || {});
                    const avgGap = gaps.length ? gaps.reduce((a, b) => a + b, 0) / gaps.length : 0;
                    return (
                      <tr key={area.pincode || i} className={`border-b ${isDarkMode ? 'border-[#334155]' : 'border-[#e2e8f0]'}`}>
                        <td className="py-3">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            i === 0 ? 'bg-yellow-400 text-white' : i === 1 ? 'bg-gray-300 text-gray-700' : i === 2 ? 'bg-orange-400 text-white' : isDarkMode ? 'bg-[#0f172a] text-[#f1f5f9]' : 'bg-gray-100 text-gray-600'
                          }`}>{i + 1}</span>
                        </td>
                        <td className={`py-3 font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{area.area || area.pincode}</td>
                        <td className={`py-3 text-right ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{area.pincode}</td>
                        <td className={`py-3 text-right ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{(area.population || 0).toLocaleString()}</td>
                        <td className="py-3 text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            area.incomeLevel === 'High' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            area.incomeLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>{area.incomeLevel || '—'}</span>
                        </td>
                        <td className="py-3 text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            avgGap >= 70 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            avgGap >= 40 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>{Number(avgGap).toFixed(2)}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Risk Analysis */}
        {stats && stats.riskAreas.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="text-orange-500" size={24} />
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>High Competition Areas</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.riskAreas.map((area, i) => {
                const comps = Object.values(area.competitors || {});
                const avgComp = comps.length ? comps.reduce((a, b) => a + b, 0) / comps.length : 0;
                return (
                  <div key={area.pincode || i} className={`p-4 rounded-xl border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{area.area || area.pincode}</span>
                      <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs font-bold">
                        {Number(avgComp).toFixed(2)} competitors
                      </span>
                    </div>
                    <p className={`text-xs opacity-60 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      Pop: {(area.population || 0).toLocaleString()} · {area.incomeLevel || '—'} income
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Market Coverage from Analytics */}
        {analyticsData && analyticsData.marketCoverage && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
            className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
            <div className="flex items-center gap-3 mb-6">
              <Globe className="text-[#2563eb]" size={24} />
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Platform-Wide Market Coverage</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Districts Covered', value: `${analyticsData.marketCoverage.covered}/${analyticsData.marketCoverage.total}` },
                { label: 'Coverage', value: `${Number(analyticsData.marketCoverage.percentage || 0).toFixed(2)}%` },
                { label: 'Total Areas', value: analyticsData.marketCoverage.totalAreas },
                { label: 'Data Quality', value: `${Number(analyticsData.dataQuality?.overall || 0).toFixed(2)}%` },
              ].map((m, i) => (
                <div key={i} className={`p-4 rounded-xl text-center ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                  <p className={`text-xs font-medium mb-1 uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{m.label}</p>
                  <p className={`text-xl font-extrabold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{m.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="text-center mt-8">
          <Link to="/dashboard" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white py-4 px-10 rounded-full no-underline font-bold text-lg transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-xl active:-translate-y-0.5">
            <BarChart3 size={20} /> View Full Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default Analysis;
