import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  TrendingUp, TrendingDown, Calendar, BarChart3, LineChart, 
  PieChart, Users, DollarSign, Target, ArrowLeft, Download,
  Filter, ChevronDown, Info, Zap, AlertCircle, CheckCircle, Building2, Road
} from 'lucide-react';

function Forecast() {
  const { isDarkMode } = useTheme();
  const [timeframe, setTimeframe] = useState('5years');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Mock data - will be replaced by backend forecasts
  const forecastData = {
    population: {
      current: 125000,
      year1: 128000,
      year3: 135000,
      year5: 145000,
      year10: 170000,
      growthRate: 3.2
    },
    demand: {
      current: 85,
      year1: 88,
      year3: 92,
      year5: 95,
      year10: 98,
      growthRate: 2.8
    },
    competition: {
      current: 78,
      year1: 80,
      year3: 85,
      year5: 88,
      year10: 92,
      growthRate: 1.8
    },
    revenue: {
      current: 8.5,
      year1: 9.2,
      year3: 10.5,
      year5: 12.0,
      year10: 15.5,
      growthRate: 7.2
    }
  };

  const futureTrends = [
    { trend: 'Population Growth', impact: 'Positive', confidence: 85, icon: Users },
    { trend: 'Commercial Development', impact: 'Positive', confidence: 78, icon: Building2 },
    { trend: 'Infrastructure Expansion', impact: 'Positive', confidence: 72, icon: Road },
    { trend: 'Competition Increase', impact: 'Negative', confidence: 65, icon: TrendingUp },
    { trend: 'Consumer Spending', impact: 'Positive', confidence: 80, icon: DollarSign }
  ];

  const predictions = [
    {
      year: '2025',
      population: '128K',
      demand: '88%',
      competition: '80%',
      revenue: '₹9.2L'
    },
    {
      year: '2027',
      population: '135K',
      demand: '92%',
      competition: '85%',
      revenue: '₹10.5L'
    },
    {
      year: '2030',
      population: '145K',
      demand: '95%',
      competition: '88%',
      revenue: '₹12.0L'
    },
    {
      year: '2035',
      population: '170K',
      demand: '98%',
      competition: '92%',
      revenue: '₹15.5L'
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
          <Link 
            to="/dashboard"
            className={`inline-flex items-center gap-2 mb-4 font-medium hover:text-[#2563eb] transition-colors ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="text-[#2563eb]" size={28} />
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  Market Forecast
                </h1>
              </div>
              <p className={`text-lg opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Predictive analytics for future market trends
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className={`px-4 py-2 pr-10 rounded-lg border bg-transparent outline-none focus:border-[#2563eb] transition-colors appearance-none cursor-pointer ${isDarkMode ? 'text-[#f1f5f9] border-[#334155]' : 'text-[#1e293b] border-[#e2e8f0]'}`}
                >
                  <option value="5years">5 Years</option>
                  <option value="10years">10 Years</option>
                </select>
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={16} />
              </div>
              <button className={`p-3 rounded-xl border transition-colors ${isDarkMode ? 'text-[#f1f5f9] border-[#334155] hover:bg-[#1e293b]' : 'text-[#1e293b] border-[#e2e8f0] hover:bg-[#ffffff]'}`}>
                <Download size={20} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Forecast Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Users, label: 'Population Forecast', current: forecastData.population.current.toLocaleString(), future: forecastData.population.year5.toLocaleString(), growth: `+${forecastData.population.growthRate}%`, color: 'text-blue-500' },
            { icon: Target, label: 'Demand Forecast', current: `${forecastData.demand.current}%`, future: `${forecastData.demand.year5}%`, growth: `+${forecastData.demand.growthRate}%`, color: 'text-green-500' },
            { icon: TrendingUp, label: 'Competition Forecast', current: `${forecastData.competition.current}%`, future: `${forecastData.competition.year5}%`, growth: `+${forecastData.competition.growthRate}%`, color: 'text-orange-500' },
            { icon: DollarSign, label: 'Revenue Forecast', current: `₹${forecastData.revenue.current}L`, future: `₹${forecastData.revenue.year5}L`, growth: `+${forecastData.revenue.growthRate}%`, color: 'text-purple-500' }
          ].map((forecast, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + (index * 0.1) }}
              className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
            >
              <forecast.icon className={`${forecast.color} mb-3`} size={24} />
              <p className={`text-sm opacity-70 mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{forecast.label}</p>
              <div className="flex items-end gap-2 mb-2">
                <span className={`text-2xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {forecast.current}
                </span>
                <TrendingUp className="text-green-500 mb-1" size={16} />
                <span className={`text-lg font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {forecast.future}
                </span>
              </div>
              <span className="text-sm text-green-500 font-semibold">{forecast.growth} growth</span>
            </motion.div>
          ))}
        </div>

        {/* 5-Year Prediction Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <LineChart className="text-[#2563eb]" size={24} />
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                5-Year Prediction
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Info className={`opacity-50 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={16} />
              <span className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Based on historical data and AI models
              </span>
            </div>
          </div>

          {/* Simplified Chart Visualization */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Population Growth</span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {forecastData.population.current.toLocaleString()} → {forecastData.population.year5.toLocaleString()}
                </span>
              </div>
              <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Demand Growth</span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {forecastData.demand.current}% → {forecastData.demand.year5}%
                </span>
              </div>
              <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '95%' }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Competition Growth</span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {forecastData.competition.current}% → {forecastData.competition.year5}%
                </span>
              </div>
              <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '88%' }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Revenue Growth</span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  ₹{forecastData.revenue.current}L → ₹{forecastData.revenue.year5}L
                </span>
              </div>
              <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, delay: 0.9 }}
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Year-by-Year Predictions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="text-[#2563eb]" size={24} />
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Year-by-Year Predictions
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-[#334155]' : 'border-[#e2e8f0]'}`}>
                  <th className={`text-left p-4 font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Year</th>
                  <th className={`text-left p-4 font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Population</th>
                  <th className={`text-left p-4 font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Demand</th>
                  <th className={`text-left p-4 font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Competition</th>
                  <th className={`text-left p-4 font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((prediction, index) => (
                  <motion.tr
                    key={prediction.year}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + (index * 0.1) }}
                    className={`border-b ${isDarkMode ? 'border-[#334155]' : 'border-[#e2e8f0]'} hover:bg-opacity-50 ${isDarkMode ? 'hover:bg-[#1e293b]' : 'hover:bg-[#ffffff]'}`}
                  >
                    <td className={`p-4 font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{prediction.year}</td>
                    <td className={`p-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{prediction.population}</td>
                    <td className={`p-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{prediction.demand}</td>
                    <td className={`p-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{prediction.competition}</td>
                    <td className={`p-4 font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{prediction.revenue}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Future Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Zap className="text-[#2563eb]" size={24} />
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Future Trends Analysis
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {futureTrends.map((trend, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + (index * 0.1) }}
                className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${trend.impact === 'Positive' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                    <trend.icon className={trend.impact === 'Positive' ? 'text-green-500' : 'text-red-500'} size={20} />
                  </div>
                  <div>
                    <p className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{trend.trend}</p>
                    <span className={`text-xs ${trend.impact === 'Positive' ? 'text-green-500' : 'text-red-500'}`}>
                      {trend.impact} Impact
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Confidence</span>
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{trend.confidence}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-2">
                  <div 
                    className={`h-full rounded-full ${trend.impact === 'Positive' ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${trend.confidence}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Confidence Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="text-[#2563eb]" size={24} />
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Forecast Confidence
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-extrabold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent mb-2">
                82%
              </div>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Overall Accuracy
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent mb-2">
                78%
              </div>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Data Quality
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent mb-2">
                85%
              </div>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Model Precision
              </p>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className={`p-6 rounded-2xl border border-l-4 ${isDarkMode ? 'bg-blue-900/20 border-blue-500' : 'bg-blue-50 border-blue-500'}`}
        >
          <div className="flex items-start gap-4">
            <AlertCircle className="text-blue-500 flex-shrink-0" size={24} />
            <div>
              <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Forecast Disclaimer
              </h4>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                These forecasts are based on historical data, market trends, and AI predictive models. 
                Actual results may vary due to unforeseen economic factors, policy changes, or market conditions. 
                Use these predictions as guidance and conduct your own due diligence before making business decisions.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Forecast;
