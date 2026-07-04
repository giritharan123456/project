import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { analyticsAPI } from '../services/api';
import {
  BarChart3, Target, TrendingUp, AlertTriangle, MapPin, Users,
  Globe, Database, Zap, CheckCircle, ArrowRight, FileText, Brain
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2563eb] mx-auto mb-4" />
          <p className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
            Loading analytics from database...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-[calc(100vh-70px)] flex items-center justify-center ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <div className="text-center max-w-md p-8">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          <h2 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
            Unable to Load Analytics
          </h2>
          <p className={`mb-6 opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{error}</p>
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
          <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="text-blue-500" size={32} />
          </div>
          <h2 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
            No Analytics Data Yet
          </h2>
          <p className={`mb-6 opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
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

  return (
    <div className={`min-h-[calc(100vh-70px)] p-6 md:p-10 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      <div className="max-w-7xl mx-auto space-y-8">

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="text-[#2563eb]" size={32} />
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Analytics Dashboard
            </h1>
          </div>
          <p className={`text-lg opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
            Real-time insights computed from {marketCoverage.totalAreas} area{marketCoverage.totalAreas !== 1 ? 's' : ''} across {marketCoverage.covered} district{marketCoverage.covered !== 1 ? 's' : ''}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Globe, label: 'Market Coverage', value: `${Number(marketCoverage.percentage || 0).toFixed(2)}%`, color: '#2563eb', detail: `${marketCoverage.covered}/${marketCoverage.total} Districts` },
            { icon: Database, label: 'Data Completeness', value: `${Number(dataQuality.overall || 0).toFixed(2)}%`, color: '#059669', detail: `${dataQuality.areasWithCompleteData} complete areas` },
            { icon: Target, label: 'High Opportunity', value: businessOpportunities.high, color: '#f59e0b', detail: 'Areas with gap score ≥70' },
            { icon: Users, label: 'Total Areas', value: marketCoverage.totalAreas, color: '#7c3aed', detail: 'Pincodes in database' }
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + (index * 0.1) }}
              whileHover={{ y: -3 }}
              className={`p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}
            >
              <metric.icon size={24} className="mb-2" style={{ color: metric.color }} />
              <p className={`text-xs font-medium mb-1 uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{metric.label}</p>
              <p className={`text-2xl font-extrabold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{metric.value}</p>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{metric.detail}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Zap className="text-[#2563eb]" size={24} />
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Business Opportunity Distribution
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'High Opportunity', count: businessOpportunities.high, color: '#059669', bg: 'bg-green-500/10', desc: 'Market gap score ≥ 70' },
              { label: 'Medium Opportunity', count: businessOpportunities.medium, color: '#f59e0b', bg: 'bg-yellow-500/10', desc: 'Market gap score 40–69' },
              { label: 'Lower Opportunity', count: businessOpportunities.low, color: '#ef4444', bg: 'bg-red-500/10', desc: 'Market gap score < 40' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + (index * 0.1) }}
                className={`p-5 rounded-xl border ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{item.label}</span>
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }} />
                </div>
                <p className="text-3xl font-extrabold" style={{ color: item.color }}>{item.count}</p>
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
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
              <TrendingUp className="text-green-500" size={24} />
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Top Growth Areas
              </h3>
            </div>
            {highGrowthAreas.length === 0 ? (
              <p className={`opacity-60 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
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
                    className={`p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}
                  >
                    <div>
                      <h4 className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{area.name}</h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {area.district} · Score: {Number(area.score).toFixed(2)}
                      </p>
                    </div>
                    <span className="text-green-500 font-bold text-lg">{Number(area.growth).toFixed(2)}%</span>
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
              <AlertTriangle className="text-orange-500" size={24} />
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Higher Risk Areas
              </h3>
            </div>
            {highRiskAreas.length === 0 ? (
              <p className={`opacity-60 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
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
                    className={`p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}
                  >
                    <div>
                      <h4 className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{area.name}</h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {area.district} · Score: {Number(area.score).toFixed(2)}
                      </p>
                    </div>
                    <span className="text-orange-500 font-semibold text-sm">{area.risk}</span>
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
          className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}
        >
          <div className="flex items-center gap-3 mb-5">
            <MapPin className="text-[#7c3aed]" size={24} />
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Districts With Data
            </h3>
            <span className={`ml-auto text-sm font-bold px-3 py-1 rounded-full ${isDarkMode ? 'bg-[#7c3aed]/20 text-[#a78bfa]' : 'bg-[#7c3aed]/10 text-[#7c3aed]'}`}>
              {marketCoverage.districts.length}
            </span>
          </div>
          {marketCoverage.districts.length === 0 ? (
            <p className={`opacity-60 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
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
                  className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${isDarkMode ? 'bg-[#0f172a] text-[#f1f5f9] border border-[#334155]' : 'bg-[#f8fafc] text-[#1e293b] border border-[#e2e8f0]'}`}
                >
                  <CheckCircle className="text-green-500 shrink-0" size={16} />
                  {district}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
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
        </motion.div>

      </div>
    </div>
  );
}

export default AnalyticsDashboard;
