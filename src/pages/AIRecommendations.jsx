import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Sparkles, TrendingUp, DollarSign, Users, Target, CheckCircle,
  AlertTriangle, ArrowRight, Star, Lightbulb, BarChart3, PieChart,
  Clock, Award, Zap, Heart, Share2, BookOpen, ChevronRight
} from 'lucide-react';

function AIRecommendations() {
  const { isDarkMode } = useTheme();

  // Mock data - will be replaced by backend AI recommendations
  const topRecommendation = {
    business: 'Specialty Coffee Shop',
    category: 'Food & Beverage',
    investment: '₹15-25 Lakhs',
    expectedCustomers: '150-250/day',
    expectedRevenue: '₹8-12 Lakhs/month',
    successProbability: 87,
    whyRecommended: 'High foot traffic area with growing young population, limited competition in premium coffee segment',
    advantages: [
      'Growing coffee culture in the area',
      'High disposable income of target audience',
      'Limited premium coffee competition',
      'Proximity to offices and colleges'
    ],
    challenges: [
      'High initial investment required',
      'Skilled barista staffing needed',
      'Seasonal demand fluctuations'
    ],
    futureDemand: 'Growing rapidly (+25% YoY)',
    alternativeIdeas: [
      'Quick Service Restaurant',
      'Bakery & Cafe',
      'Health Food Store'
    ]
  };

  const otherRecommendations = [
    {
      business: 'Organic Grocery Store',
      category: 'Retail',
      investment: '₹10-15 Lakhs',
      successProbability: 78,
      expectedRevenue: '₹5-8 Lakhs/month'
    },
    {
      business: 'Fitness Center',
      category: 'Health & Wellness',
      investment: '₹20-30 Lakhs',
      successProbability: 72,
      expectedRevenue: '₹6-10 Lakhs/month'
    },
    {
      business: 'Co-working Space',
      category: 'Services',
      investment: '₹25-35 Lakhs',
      successProbability: 68,
      expectedRevenue: '₹8-12 Lakhs/month'
    }
  ];

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
            <Sparkles className="text-[#2563eb]" size={32} />
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              AI-Powered Recommendations
            </h1>
          </div>
          <p className={`text-lg opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
            Intelligent business suggestions based on market analysis
          </p>
        </motion.div>

        {/* Top Recommendation Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-8 rounded-3xl border-2 mb-8 relative overflow-hidden ${isDarkMode ? 'bg-[#1e293b] border-[#2563eb]' : 'bg-[#ffffff] border-[#2563eb]'}`}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] rounded-full opacity-10 blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Award className="text-yellow-500" size={24} />
              <span className="text-yellow-500 font-bold">Top Recommendation</span>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
              <div>
                <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {topRecommendation.business}
                </h2>
                <p className={`text-lg opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {topRecommendation.category}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent">
                    {topRecommendation.successProbability}%
                  </div>
                  <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                    Success Probability
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl mb-6 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
              <div className="flex items-start gap-3">
                <Lightbulb className="text-[#2563eb] flex-shrink-0" size={20} />
                <p className={`text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  <span className="font-semibold">Why Recommended:</span> {topRecommendation.whyRecommended}
                </p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="text-green-500" size={20} />
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Investment</span>
                </div>
                <p className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {topRecommendation.investment}
                </p>
              </div>
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="text-blue-500" size={20} />
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Expected Customers</span>
                </div>
                <p className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {topRecommendation.expectedCustomers}
                </p>
              </div>
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="text-purple-500" size={20} />
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Expected Revenue</span>
                </div>
                <p className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {topRecommendation.expectedRevenue}
                </p>
              </div>
            </div>

            {/* Advantages & Challenges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="text-green-500" size={20} />
                  <h3 className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Advantages</h3>
                </div>
                <ul className="space-y-2">
                  {topRecommendation.advantages.map((advantage, index) => (
                    <li key={index} className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                      {advantage}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="text-orange-500" size={20} />
                  <h3 className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Challenges</h3>
                </div>
                <ul className="space-y-2">
                  {topRecommendation.challenges.map((challenge, index) => (
                    <li key={index} className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      <AlertTriangle className="text-orange-500 flex-shrink-0 mt-0.5" size={16} />
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Future Demand */}
            <div className={`p-4 rounded-xl mb-6 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="text-[#2563eb]" size={20} />
                  <span className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Future Demand</span>
                </div>
                <span className="text-green-500 font-bold">{topRecommendation.futureDemand}</span>
              </div>
            </div>

            {/* Alternative Ideas */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="text-[#2563eb]" size={20} />
                <h3 className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Alternative Ideas</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {topRecommendation.alternativeIdeas.map((idea, index) => (
                  <span
                    key={index}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${isDarkMode ? 'bg-[#0f172a] text-[#f1f5f9] border border-[#334155]' : 'bg-[#f8fafc] text-[#1e293b] border border-[#e2e8f0]'}`}
                  >
                    {idea}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Other Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
            Other Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherRecommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (index * 0.1) }}
                whileHover={{ scale: 1.02 }}
                className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Star className="text-yellow-500 fill-yellow-500" size={20} />
                  <span className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                    {recommendation.business}
                  </span>
                </div>
                <p className={`text-sm opacity-70 mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {recommendation.category}
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Investment</span>
                    <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      {recommendation.investment}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Success Rate</span>
                    <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      {recommendation.successProbability}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Revenue</span>
                    <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      {recommendation.expectedRevenue}
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-4">
                  <div 
                    className="h-full bg-gradient-to-r from-[#2563eb] to-[#7c3aed] rounded-full"
                    style={{ width: `${recommendation.successProbability}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-[#2563eb]" size={24} />
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              AI Market Insights
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: TrendingUp, label: 'Market Growth', value: '+23%', color: 'text-green-500' },
              { icon: Users, label: 'Target Audience', value: '45K', color: 'text-blue-500' },
              { icon: DollarSign, label: 'Avg. Spend', value: '₹850', color: 'text-purple-500' },
              { icon: Target, label: 'Competition', value: 'Low', color: 'text-orange-500' }
            ].map((insight, index) => (
              <div key={index} className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                <insight.icon className={`${insight.color} mb-2`} size={20} />
                <p className={`text-sm opacity-70 mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{insight.label}</p>
                <p className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{insight.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Link 
            to="/forecast"
            className={`p-6 rounded-2xl border flex items-center gap-4 transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>View Forecast</h4>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>5-year predictions</p>
            </div>
            <ChevronRight className={`ml-auto ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={20} />
          </Link>

          <Link 
            to="/comparison"
            className={`p-6 rounded-2xl border flex items-center gap-4 transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center">
              <PieChart className="text-white" size={24} />
            </div>
            <div>
              <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Compare Areas</h4>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Side-by-side analysis</p>
            </div>
            <ChevronRight className={`ml-auto ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={20} />
          </Link>

          <Link 
            to="/reports"
            className={`p-6 rounded-2xl border flex items-center gap-4 transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Export Report</h4>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Download PDF</p>
            </div>
            <ChevronRight className={`ml-auto ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={20} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default AIRecommendations;
