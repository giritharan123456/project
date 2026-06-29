import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  BarChart3, Target, TrendingUp, AlertTriangle, MapPin, Users,
  DollarSign, Activity, CheckCircle, ArrowRight, PieChart, LineChart,
  Globe, Database, Zap, Award, Clock, Eye, FileText
} from 'lucide-react';

function AnalyticsDashboard() {
  const { isDarkMode } = useTheme();

  // Mock analytics data - will be replaced by backend
  const analyticsData = {
    marketCoverage: {
      total: 6,
      covered: 6,
      percentage: 100,
      districts: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Erode']
    },
    dataQuality: {
      overall: 92,
      business: 95,
      population: 90,
      demand: 89
    },
    forecastPrecision: {
      overall: 82,
      population: 85,
      demand: 80,
      competition: 81
    },
    analysisAccuracy: {
      overall: 88,
      marketGap: 90,
      competitor: 85,
      opportunity: 89
    },
    businessOpportunities: {
      high: 45,
      medium: 78,
      low: 23
    },
    highGrowthAreas: [
      { name: 'T. Nagar', score: 92, growth: '+15%' },
      { name: 'Anna Nagar', score: 88, growth: '+12%' },
      { name: 'Velachery', score: 85, growth: '+18%' },
      { name: 'Mylapore', score: 82, growth: '+10%' }
    ],
    highRiskAreas: [
      { name: 'Adyar', score: 65, risk: 'High Competition' },
      { name: 'Perambur', score: 68, risk: 'Market Saturation' },
      { name: 'Kodambakkam', score: 70, risk: 'Low Demand' }
    ]
  };

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
                Overview of platform performance and data insights
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Globe, label: 'Market Coverage', value: `${analyticsData.marketCoverage.percentage}%`, color: 'text-blue-500', detail: `${analyticsData.marketCoverage.covered}/${analyticsData.marketCoverage.total} Districts` },
            { icon: Database, label: 'Data Quality', value: `${analyticsData.dataQuality.overall}%`, color: 'text-green-500', detail: 'Overall accuracy' },
            { icon: Activity, label: 'Forecast Precision', value: `${analyticsData.forecastPrecision.overall}%`, color: 'text-purple-500', detail: 'Model accuracy' },
            { icon: Target, label: 'Analysis Accuracy', value: `${analyticsData.analysisAccuracy.overall}%`, color: 'text-orange-500', detail: 'Prediction success' }
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

        {/* Market Coverage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="text-[#2563eb]" size={24} />
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Market Coverage
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyticsData.marketCoverage.districts.map((district, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + (index * 0.1) }}
                className={`p-4 rounded-xl border flex items-center gap-3 ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}
              >
                <CheckCircle className="text-green-500" size={20} />
                <span className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{district}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Data Quality Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Database className="text-[#2563eb]" size={24} />
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Data Quality Breakdown
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Business Data', value: analyticsData.dataQuality.business, color: 'from-blue-500 to-blue-600' },
              { label: 'Population Data', value: analyticsData.dataQuality.population, color: 'from-green-500 to-green-600' },
              { label: 'Demand Indicators', value: analyticsData.dataQuality.demand, color: 'from-purple-500 to-purple-600' }
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{item.label}</span>
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{item.value}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, delay: 0.7 + (index * 0.1) }}
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
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
              Business Opportunities
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'High Opportunity', count: analyticsData.businessOpportunities.high, color: 'bg-green-500' },
              { label: 'Medium Opportunity', count: analyticsData.businessOpportunities.medium, color: 'bg-yellow-500' },
              { label: 'Low Opportunity', count: analyticsData.businessOpportunities.low, color: 'bg-red-500' }
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
                <p className={`text-sm opacity-70 mt-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  Areas identified
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
                High Growth Areas
              </h3>
            </div>

            <div className="space-y-4">
              {analyticsData.highGrowthAreas.map((area, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + (index * 0.1) }}
                  className={`p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}
                >
                  <div>
                    <h4 className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{area.name}</h4>
                    <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Score: {area.score}</p>
                  </div>
                  <span className="text-green-500 font-bold">{area.growth}</span>
                </motion.div>
              ))}
            </div>
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
                High Risk Areas
              </h3>
            </div>

            <div className="space-y-4">
              {analyticsData.highRiskAreas.map((area, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + (index * 0.1) }}
                  className={`p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}
                >
                  <div>
                    <h4 className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{area.name}</h4>
                    <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Score: {area.score}</p>
                  </div>
                  <span className="text-orange-500 text-sm font-medium">{area.risk}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Platform Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Award className="text-[#2563eb]" size={24} />
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Platform Performance
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, label: 'Total Users', value: '12,450', change: '+15%' },
              { icon: Eye, label: 'Page Views', value: '45,230', change: '+22%' },
              { icon: Clock, label: 'Avg. Session', value: '8m 30s', change: '+5%' },
              { icon: CheckCircle, label: 'Success Rate', value: '94%', change: '+2%' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + (index * 0.1) }}
                className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}
              >
                <stat.icon className="text-[#2563eb] mb-2" size={20} />
                <p className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{stat.value}</p>
                <p className={`text-sm opacity-70 mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{stat.label}</p>
                <span className="text-green-500 text-sm font-semibold">{stat.change}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
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
