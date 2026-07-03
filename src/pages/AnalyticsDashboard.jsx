import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { analyticsAPI } from '../services/api';
import { 
  BarChart3, Target, TrendingUp, AlertTriangle, MapPin, Users,
  DollarSign, Activity, CheckCircle, ArrowRight, PieChart, LineChart,
  Globe, Database, Zap, Award, Clock, Eye, FileText
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
          <p className={`${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
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
          <div className="text-5xl mb-4">⚠️</div>
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

  // No data yet — user hasn't searched any pincodes
  if (!analyticsData || analyticsData.marketCoverage.totalAreas === 0) {
    return (
      <div className={`min-h-[calc(100vh-70px)] flex items-center justify-center ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <div className="text-center max-w-md p-8">
          <div className="text-5xl mb-4">📊</div>
          <h2 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
            No Analytics Data Yet
          </h2>
          <p className={`mb-6 opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
            Analytics are generated from real pincode searches. Search pincodes on the Dashboard to start building your dataset.
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
    <div className={`min-h-[calc(100vh-70px)] p-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
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

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Globe, label: 'Market Coverage', value: `${marketCoverage.percentage}%`, color: 'text-blue-500', detail: `${marketCoverage.covered}/${marketCoverage.total} Districts` },
            { icon: Database, label: 'Data Completeness', value: `${dataQuality.overall}%`, color: 'text-green-500', detail: `${dataQuality.areasWithCompleteData} complete areas` },
            { icon: Activity, label: 'Total Areas', value: marketCoverage.totalAreas, color: 'text-purple-500', detail: 'Pincodes in database' },
            { icon: Target, label: 'High Opportunity', value: businessOpportunities.high, color: 'text-orange-500', detail: 'Areas with gap score ≥70' }
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + (index * 0.1) }}
              className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
            >
              <metric.icon className={`${metric.color} mb-3`} size={24} />
              <p className={`text-sm opacity-70 mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{metric.label}</p>
              <p className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                {metric.value}
              </p>
              <p className={`text-xs opacity-50 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{metric.detail}</p>
            </motion.div>
          ))}
        </div>

        {/* Market Coverage — Districts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="text-[#2563eb]" size={24} />
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Districts With Data
            </h3>
          </div>

          {marketCoverage.districts.length === 0 ? (
            <p className={`opacity-60 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              No districts covered yet. Search pincodes to populate data.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketCoverage.districts.map((district, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + (index * 0.05) }}
                  className={`p-4 rounded-xl border flex items-center gap-3 ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}
                >
                  <CheckCircle className="text-green-500" size={20} />
                  <span className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{district}</span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Business Opportunities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Zap className="text-[#2563eb]" size={24} />
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Business Opportunity Distribution
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'High Opportunity', count: businessOpportunities.high, color: 'bg-green-500', desc: 'Market gap score ≥ 70' },
              { label: 'Medium Opportunity', count: businessOpportunities.medium, color: 'bg-yellow-500', desc: 'Market gap score 40–69' },
              { label: 'Lower Opportunity', count: businessOpportunities.low, color: 'bg-red-400', desc: 'Market gap score < 40' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + (index * 0.1) }}
                className={`p-6 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{item.label}</span>
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                </div>
                <div className="text-4xl font-extrabold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent">
                  {item.count}
                </div>
                <p className={`text-sm opacity-60 mt-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* High Growth & High Risk Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* High Growth Areas */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="text-green-500" size={24} />
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Top Growth Areas
              </h3>
            </div>

            {highGrowthAreas.length === 0 ? (
              <p className={`opacity-60 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Search more pincodes to see growth area rankings.
              </p>
            ) : (
              <div className="space-y-4">
                {highGrowthAreas.map((area, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + (index * 0.08) }}
                    className={`p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}
                  >
                    <div>
                      <h4 className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{area.name}</h4>
                      <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                        {area.district} · Score: {area.score}
                      </p>
                    </div>
                    <span className="text-green-500 font-bold text-lg">{area.growth}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* High Risk Areas */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="text-orange-500" size={24} />
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Higher Risk Areas
              </h3>
            </div>

            {highRiskAreas.length === 0 ? (
              <p className={`opacity-60 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Search more pincodes to see risk area rankings.
              </p>
            ) : (
              <div className="space-y-4">
                {highRiskAreas.map((area, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + (index * 0.08) }}
                    className={`p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}
                  >
                    <div>
                      <h4 className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{area.name}</h4>
                      <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                        {area.district} · Score: {area.score}
                      </p>
                    </div>
                    <span className="text-orange-500 text-sm font-semibold">{area.risk}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Link
            to="/dashboard"
            className={`p-6 rounded-2xl border flex items-center gap-4 transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center">
              <MapPin className="text-white" size={24} />
            </div>
            <div>
              <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Explore Areas</h4>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Browse locations</p>
            </div>
            <ArrowRight className={`ml-auto ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={20} />
          </Link>

          <Link
            to="/ai-recommendations"
            className={`p-6 rounded-2xl border flex items-center gap-4 transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center">
              <Zap className="text-white" size={24} />
            </div>
            <div>
              <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>AI Insights</h4>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Get recommendations</p>
            </div>
            <ArrowRight className={`ml-auto ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={20} />
          </Link>

          <Link
            to="/reports"
            className={`p-6 rounded-2xl border flex items-center gap-4 transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center">
              <FileText className="text-white" size={24} />
            </div>
            <div>
              <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Generate Reports</h4>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Export analytics</p>
            </div>
            <ArrowRight className={`ml-auto ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={20} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
