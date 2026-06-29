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
    <div className={`min-h-[calc(100vh-70px)] p-6 transition-colors duration-300 ${isDarkMode ? 'bg-bg-dark' : 'bg-bg-light'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="text-primary-blue" size={32} />
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
              AI-Powered Recommendations
            </h1>
          </div>
          <p className={`text-lg opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
            Intelligent business suggestions based on market analysis
          </p>
        </motion.div>

        {/* Top Recommendation Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-8 rounded-3xl border-2 mb-8 relative overflow-hidden ${isDarkMode ? 'bg-card-dark border-primary-blue' : 'bg-card-light border-primary-blue'}`}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-r from-primary-blue to-primary-purple rounded-full opacity-10 blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Award className="text-yellow-500" size={24} />
              <span className="text-yellow-500 font-bold">Top Recommendation</span>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
              <div>
                <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                  {topRecommendation.business}
                </h2>
                <p className={`text-lg opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                  {topRecommendation.category}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-primary-blue to-primary-purple bg-clip-text text-transparent">
                    {topRecommendation.successProbability}%
                  </div>
                  <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                    Success Probability
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl mb-6 ${isDarkMode ? 'bg-bg-dark' : 'bg-bg-light'}`}>
              <div className="flex items-start gap-3">
                <Lightbulb className="text-primary-blue flex-shrink-0" size={20} />
                <p className={`text-sm ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                  <span className="font-semibold">Why Recommended:</span> {topRecommendation.whyRecommended}
                </p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-bg-dark' : 'bg-bg-light'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="text-green-500" size={20} />
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Investment</span>
                </div>
                <p className={`text-xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                  {topRecommendation.investment}
                </p>
              </div>
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-bg-dark' : 'bg-bg-light'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="text-blue-500" size={20} />
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Expected Customers</span>
                </div>
                <p className={`text-xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                  {topRecommendation.expectedCustomers}
                </p>
              </div>
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-bg-dark' : 'bg-bg-light'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="text-purple-500" size={20} />
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Expected Revenue</span>
                </div>
                <p className={`text-xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                  {topRecommendation.expectedRevenue}
                </p>
              </div>
            </div>

            {/* Advantages & Challenges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="text-green-500" size={20} />
                  <h3 className={`font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Advantages</h3>
                </div>
                <ul className="space-y-2">
                  {topRecommendation.advantages.map((advantage, index) => (
                    <li key={index} className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                      <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                      {advantage}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="text-orange-500" size={20} />
                  <h3 className={`font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Challenges</h3>
                </div>
                <ul className="space-y-2">
                  {topRecommendation.challenges.map((challenge, index) => (
                    <li key={index} className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                      <AlertTriangle className="text-orange-500 flex-shrink-0 mt-0.5" size={16} />
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Future Demand */}
            <div className={`p-4 rounded-xl mb-6 ${isDarkMode ? 'bg-bg-dark' : 'bg-bg-light'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="text-primary-blue" size={20} />
                  <span className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Future Demand</span>
                </div>
                <span className="text-green-500 font-bold">{topRecommendation.futureDemand}</span>
              </div>
            </div>

            {/* Alternative Ideas */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="text-primary-blue" size={20} />
                <h3 className={`font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Alternative Ideas</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {topRecommendation.alternativeIdeas.map((idea, index) => (
                  <span
                    key={index}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${isDarkMode ? 'bg-bg-dark text-text-dark border border-border-dark' : 'bg-bg-light text-text-light border border-border-light'}`}
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
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
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
                className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-card-dark border-border-dark hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-card-light border-border-light hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Star className="text-yellow-500 fill-yellow-500" size={20} />
                  <span className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                    {recommendation.business}
                  </span>
                </div>
                <p className={`text-sm opacity-70 mb-4 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                  {recommendation.category}
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Investment</span>
                    <span className={`text-sm font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                      {recommendation.investment}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Success Rate</span>
                    <span className={`text-sm font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                      {recommendation.successProbability}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Revenue</span>
                    <span className={`text-sm font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                      {recommendation.expectedRevenue}
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-4">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-blue to-primary-purple rounded-full"
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
          className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-primary-blue" size={24} />
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
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
              <div key={index} className={`p-4 rounded-xl ${isDarkMode ? 'bg-bg-dark' : 'bg-bg-light'}`}>
                <insight.icon className={`${insight.color} mb-2`} size={20} />
                <p className={`text-sm opacity-70 mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{insight.label}</p>
                <p className={`text-xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{insight.value}</p>
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
            className={`p-6 rounded-2xl border flex items-center gap-4 transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-card-dark border-border-dark hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-card-light border-border-light hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-blue to-primary-purple flex items-center justify-center">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>View Forecast</h4>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>5-year predictions</p>
            </div>
            <ChevronRight className={`ml-auto ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`} size={20} />
          </Link>

          <Link 
            to="/comparison"
            className={`p-6 rounded-2xl border flex items-center gap-4 transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-card-dark border-border-dark hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-card-light border-border-light hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-blue to-primary-purple flex items-center justify-center">
              <PieChart className="text-white" size={24} />
            </div>
            <div>
              <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Compare Areas</h4>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Side-by-side analysis</p>
            </div>
            <ChevronRight className={`ml-auto ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`} size={20} />
          </Link>

          <Link 
            to="/reports"
            className={`p-6 rounded-2xl border flex items-center gap-4 transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-card-dark border-border-dark hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-card-light border-border-light hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-blue to-primary-purple flex items-center justify-center">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Export Report</h4>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Download PDF</p>
            </div>
            <ChevronRight className={`ml-auto ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`} size={20} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default AIRecommendations;
