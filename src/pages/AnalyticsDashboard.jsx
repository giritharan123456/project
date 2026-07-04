import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { analyticsAPI } from '../services/api';
import {
  BarChart3, Target, TrendingUp, AlertTriangle, MapPin, Users,
  Globe, Database, Zap, CheckCircle, ArrowRight, FileText, Brain,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';

function AnalyticsDashboard() {
  const { isDarkMode } = useTheme();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await analyticsAPI.getOverview();
        setAnalyticsData(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className={`min-h-[calc(100vh-70px)] flex items-center justify-center ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={`font-medium ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>Loading analytics from database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-[calc(100vh-70px)] flex items-center justify-center ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <div className="text-center max-w-md p-8">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          <h2 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
            Unable to Load Analytics
          </h2>
          <p className={`mb-6 ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData || analyticsData.marketCoverage.totalAreas === 0) {
    return (
      <div className={`min-h-[calc(100vh-70px)] flex items-center justify-center ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <div className="text-center max-w-md p-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="text-blue-500" size={32} />
          </div>
          <h2 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
            No Analytics Data Yet
          </h2>
          <p className={`mb-6 ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>
            Analytics are generated from real area data. Search areas on the Dashboard to start building your dataset.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            <MapPin size={18} />
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { marketCoverage, dataQuality, businessOpportunities, highGrowthAreas, highRiskAreas } = analyticsData;
  const totalOpp = businessOpportunities.high + businessOpportunities.medium + businessOpportunities.low;

  return (
    <div className={`min-h-[calc(100vh-70px)] transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>

      <div className={`relative overflow-hidden ${isDarkMode ? 'bg-[#0f172a]' : 'bg-gradient-to-br from-[#1e3a5f] via-[#1e293b] to-[#0f172a]'}`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#2563eb] rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#7c3aed] rounded-full blur-[150px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="text-[#60a5fa]" size={36} />
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                Analytics Dashboard
              </h1>
            </div>
            <p className="text-lg text-white/70 max-w-2xl">
              Real-time insights computed from <span className="text-white font-bold">{marketCoverage.totalAreas}</span> area{marketCoverage.totalAreas !== 1 ? 's' : ''} across <span className="text-white font-bold">{marketCoverage.covered}</span> district{marketCoverage.covered !== 1 ? 's' : ''}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 space-y-8">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Globe, label: 'Market Coverage', value: `${Number(marketCoverage.percentage || 0).toFixed(2)}%`, color: '#2563eb', gradient: 'from-[#2563eb] to-[#1d4ed8]', detail: `${marketCoverage.covered}/${marketCoverage.total} Districts` },
            { icon: Database, label: 'Data Completeness', value: `${Number(dataQuality.overall || 0).toFixed(2)}%`, color: '#059669', gradient: 'from-[#059669] to-[#047857]', detail: `${dataQuality.areasWithCompleteData} complete areas` },
            { icon: Target, label: 'High Opportunity', value: businessOpportunities.high, color: '#f59e0b', gradient: 'from-[#f59e0b] to-[#d97706]', detail: 'Areas with gap score ≥70' },
            { icon: Users, label: 'Total Areas', value: marketCoverage.totalAreas, color: '#7c3aed', gradient: 'from-[#7c3aed] to-[#6d28d9]', detail: 'Pincodes in database' }
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + (index * 0.1) }}
              whileHover={{ y: -4 }}
              className={`relative p-5 rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-xl ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}
            >
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${metric.gradient} opacity-10 rounded-bl-[50px]`} />
              <metric.icon size={26} className="mb-3" style={{ color: metric.color }} />
              <p className={`text-xs font-semibold mb-1 uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{metric.label}</p>
              <p className={`text-3xl font-extrabold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{metric.value}</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{metric.detail}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`p-6 md:p-8 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#2563eb]/10 flex items-center justify-center">
              <Zap className="text-[#2563eb]" size={22} />
            </div>
            <div>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Business Opportunity Distribution
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{totalOpp} total areas analyzed</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'High Opportunity', count: businessOpportunities.high, color: '#059669', icon: ArrowUpRight, desc: 'Market gap score ≥ 70', pct: totalOpp > 0 ? ((businessOpportunities.high / totalOpp) * 100).toFixed(1) : '0' },
              { label: 'Medium Opportunity', count: businessOpportunities.medium, color: '#f59e0b', icon: Target, desc: 'Market gap score 40–69', pct: totalOpp > 0 ? ((businessOpportunities.medium / totalOpp) * 100).toFixed(1) : '0' },
              { label: 'Lower Opportunity', count: businessOpportunities.low, color: '#ef4444', icon: ArrowDownRight, desc: 'Market gap score < 40', pct: totalOpp > 0 ? ((businessOpportunities.low / totalOpp) * 100).toFixed(1) : '0' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + (index * 0.1) }}
                className={`p-5 rounded-xl border transition-all hover:shadow-md ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                      <item.icon size={16} style={{ color: item.color }} />
                    </div>
                    <span className={`font-semibold text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{item.label}</span>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: `${item.color}15`, color: item.color }}>{item.pct}%</span>
                </div>
                <p className="text-3xl font-extrabold mb-1" style={{ color: item.color }}>{item.count}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
                <div className="mt-3 h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="text-green-500" size={22} />
              </div>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Top Growth Areas
              </h3>
            </div>
            {highGrowthAreas.length === 0 ? (
              <p className={`py-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Search more areas to see growth area rankings.
              </p>
            ) : (
              <div className="space-y-3">
                {highGrowthAreas.map((area, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + (index * 0.05) }}
                    className={`p-4 rounded-xl border flex items-center gap-4 ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${index === 0 ? 'bg-yellow-400 text-yellow-900' : index === 1 ? 'bg-gray-300 text-gray-700' : index === 2 ? 'bg-orange-300 text-orange-800' : isDarkMode ? 'bg-[#1e293b] text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-bold truncate ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{area.name}</h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {area.district} · Score: {Number(area.score).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-green-500 font-bold text-lg">{Number(area.growth).toFixed(2)}%</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>growth</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <AlertTriangle className="text-orange-500" size={22} />
              </div>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Higher Risk Areas
              </h3>
            </div>
            {highRiskAreas.length === 0 ? (
              <p className={`py-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Search more areas to see risk area rankings.
              </p>
            ) : (
              <div className="space-y-3">
                {highRiskAreas.map((area, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + (index * 0.05) }}
                    className={`p-4 rounded-xl border flex items-center gap-4 ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600'}`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-bold truncate ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{area.name}</h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {area.district} · Score: {Number(area.score).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-500">
                        {area.risk}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className={`p-6 md:p-8 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/10 flex items-center justify-center">
              <MapPin className="text-[#7c3aed]" size={22} />
            </div>
            <div>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Districts With Data
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{marketCoverage.districts.length} districts covered</p>
            </div>
          </div>
          {marketCoverage.districts.length === 0 ? (
            <p className={`py-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No districts covered yet. Search areas to populate data.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {marketCoverage.districts.map((district, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.0 + (index * 0.02) }}
                  className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all ${isDarkMode ? 'bg-[#0f172a] text-[#f1f5f9] border border-[#334155] hover:border-[#7c3aed]' : 'bg-[#f8fafc] text-[#1e293b] border border-[#e2e8f0] hover:border-[#7c3aed]'}`}
                >
                  <CheckCircle className="text-green-500 shrink-0" size={16} />
                  <span className="truncate">{district}</span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className={`p-8 rounded-2xl border ${isDarkMode ? 'bg-gradient-to-br from-[#1e293b] to-[#0f172a] border-[#334155]' : 'bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] border-[#e2e8f0]'}`}
        >
          <h2 className={`text-2xl font-bold mb-3 text-center ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Dive Deeper Into Your Data</h2>
          <p className={`text-center mb-6 max-w-xl mx-auto ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>
            Explore areas, get AI-powered recommendations, or generate detailed reports
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/dashboard"
              className={`p-5 rounded-2xl border flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-lg ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center shrink-0">
                <MapPin className="text-white" size={22} />
              </div>
              <div className="min-w-0">
                <h4 className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Explore Areas</h4>
                <p className={`text-sm opacity-70 truncate ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Browse locations</p>
              </div>
              <ArrowRight className={`ml-auto shrink-0 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={20} />
            </Link>

            <Link
              to="/ai-recommendations"
              className={`p-5 rounded-2xl border flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-lg ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center shrink-0">
                <Brain className="text-white" size={22} />
              </div>
              <div className="min-w-0">
                <h4 className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>AI Insights</h4>
                <p className={`text-sm opacity-70 truncate ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Get recommendations</p>
              </div>
              <ArrowRight className={`ml-auto shrink-0 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={20} />
            </Link>

            <Link
              to="/reports"
              className={`p-5 rounded-2xl border flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-lg ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center shrink-0">
                <FileText className="text-white" size={22} />
              </div>
              <div className="min-w-0">
                <h4 className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Generate Reports</h4>
                <p className={`text-sm opacity-70 truncate ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Export analytics</p>
              </div>
              <ArrowRight className={`ml-auto shrink-0 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={20} />
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

export default AnalyticsDashboard;
