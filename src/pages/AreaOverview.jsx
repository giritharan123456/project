import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  MapPin, Users, TrendingUp, DollarSign, Briefcase, GraduationCap,
  Building, Car, Navigation, Star, ArrowLeft, Share2, Heart, BarChart3,
  Clock, Home, Store, Factory, Coffee, ShoppingBag, Utensils, Scissors,
  Activity, Calendar, ChevronRight, Info
} from 'lucide-react';

function AreaOverview() {
  const { isDarkMode } = useTheme();
  const { pincode } = useParams();

  // Mock data - will be replaced by backend
  const areaData = {
    name: 'T. Nagar',
    district: 'Chennai',
    pincode: pincode || '600017',
    population: 125000,
    populationGrowth: 2.3,
    incomeLevel: 'High',
    employment: 92,
    literacy: 94,
    ageDistribution: {
      '0-18': 22,
      '19-35': 35,
      '36-50': 28,
      '50+': 15
    },
    residentialCommercial: {
      residential: 45,
      commercial: 55
    },
    traffic: 'High',
    landmarks: [
      'Pondy Bazaar',
      'Ranganathan Street',
      'Usman Road',
      'T Nagar Bus Terminus',
      'Mambalam Railway Station'
    ],
    marketScore: 92
  };

  const nearbyBusinesses = [
    { category: 'Restaurants', count: 245, icon: Utensils, color: 'bg-orange-500' },
    { category: 'Retail', count: 189, icon: ShoppingBag, color: 'bg-blue-500' },
    { category: 'Services', count: 156, icon: Scissors, color: 'bg-purple-500' },
    { category: 'Cafes', count: 78, icon: Coffee, color: 'bg-amber-500' },
    { category: 'Offices', count: 45, icon: Building, color: 'bg-gray-500' },
    { category: 'Others', count: 134, icon: Store, color: 'bg-green-500' }
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
          <Link 
            to="/dashboard"
            className={`inline-flex items-center gap-2 mb-4 font-medium hover:text-primary-blue transition-colors ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="text-primary-blue" size={28} />
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                  {areaData.name}
                </h1>
              </div>
              <p className={`text-lg opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                {areaData.district} • {areaData.pincode}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className={`p-3 rounded-xl border transition-colors ${isDarkMode ? 'text-text-dark border-border-dark hover:bg-card-dark' : 'text-text-light border-border-light hover:bg-card-light'}`}>
                <Heart size={20} />
              </button>
              <button className={`p-3 rounded-xl border transition-colors ${isDarkMode ? 'text-text-dark border-border-dark hover:bg-card-dark' : 'text-text-light border-border-light hover:bg-card-light'}`}>
                <Share2 size={20} />
              </button>
              <Link 
                to={`/business-overview/${areaData.pincode}`}
                className="px-6 py-3 bg-gradient-to-r from-primary-blue to-primary-purple text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                View Businesses
                <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Market Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                Market Opportunity Score
              </h2>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                Overall business potential based on demand and competition analysis
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-5xl font-extrabold bg-gradient-to-r from-primary-blue to-primary-purple bg-clip-text text-transparent">
                  {areaData.marketScore}
                </div>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                  out of 100
                </p>
              </div>
              <div className={`px-4 py-2 rounded-full font-semibold ${areaData.marketScore >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : areaData.marketScore >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                {areaData.marketScore >= 80 ? 'High Opportunity' : areaData.marketScore >= 60 ? 'Medium Opportunity' : 'Low Opportunity'}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Users, label: 'Population', value: areaData.population.toLocaleString(), suffix: '', color: 'text-blue-500' },
            { icon: TrendingUp, label: 'Population Growth', value: areaData.populationGrowth, suffix: '%', color: 'text-green-500' },
            { icon: DollarSign, label: 'Income Level', value: areaData.incomeLevel, suffix: '', color: 'text-yellow-500' },
            { icon: Briefcase, label: 'Employment', value: areaData.employment, suffix: '%', color: 'text-purple-500' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (index * 0.1) }}
              className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}
            >
              <stat.icon className={`${stat.color} mb-3`} size={24} />
              <p className={`text-sm opacity-70 mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{stat.label}</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                {stat.value}{stat.suffix}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Demographics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="text-primary-blue" size={24} />
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                Literacy Rate
              </h3>
            </div>
            <div className="text-center mb-4">
              <div className="text-4xl font-extrabold bg-gradient-to-r from-primary-blue to-primary-purple bg-clip-text text-transparent">
                {areaData.literacy}%
              </div>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                Population is literate
              </p>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-blue to-primary-purple rounded-full transition-all duration-1000"
                style={{ width: `${areaData.literacy}%` }}
              />
            </div>
          </motion.div>

          {/* Age Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <Users className="text-primary-blue" size={24} />
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                Age Distribution
              </h3>
            </div>
            <div className="space-y-4">
              {Object.entries(areaData.ageDistribution).map(([age, percentage], index) => (
                <div key={age}>
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                      {age} years
                    </span>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                      {percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-blue to-primary-purple rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Residential vs Commercial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Building className="text-primary-blue" size={24} />
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
              Residential vs Commercial
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Home className="text-green-500" size={20} />
                <span className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Residential</span>
              </div>
              <div className="text-3xl font-bold text-green-500 mb-2">{areaData.residentialCommercial.residential}%</div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${areaData.residentialCommercial.residential}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Store className="text-blue-500" size={20} />
                <span className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Commercial</span>
              </div>
              <div className="text-3xl font-bold text-blue-500 mb-2">{areaData.residentialCommercial.commercial}%</div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${areaData.residentialCommercial.commercial}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Traffic & Nearby Landmarks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <Car className="text-primary-blue" size={24} />
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                Traffic Level
              </h3>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${areaData.traffic === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : areaData.traffic === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
              <Activity size={16} />
              {areaData.traffic} Traffic
            </div>
            <p className={`text-sm opacity-70 mt-3 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
              Based on vehicle density and footfall analysis
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <Navigation className="text-primary-blue" size={24} />
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                Nearby Landmarks
              </h3>
            </div>
            <div className="space-y-3">
              {areaData.landmarks.map((landmark, index) => (
                <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${isDarkMode ? 'bg-bg-dark' : 'bg-bg-light'}`}>
                  <Star className="text-yellow-500" size={16} />
                  <span className={`text-sm ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{landmark}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Nearby Business Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Store className="text-primary-blue" size={24} />
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                Nearby Business Categories
              </h3>
            </div>
            <Link 
              to={`/business-overview/${areaData.pincode}`}
              className="text-primary-blue font-semibold hover:underline flex items-center gap-1"
            >
              View All
              <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {nearbyBusinesses.map((business, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className={`p-4 rounded-xl border text-center ${isDarkMode ? 'bg-bg-dark border-border-dark' : 'bg-bg-light border-border-light'}`}
              >
                <div className={`w-12 h-12 ${business.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  <business.icon className="text-white" size={24} />
                </div>
                <p className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                  {business.category}
                </p>
                <p className={`text-lg font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                  {business.count}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Link 
            to={`/business-overview/${areaData.pincode}`}
            className={`p-6 rounded-2xl border flex items-center gap-4 transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-card-dark border-border-dark hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-card-light border-border-light hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-blue to-primary-purple flex items-center justify-center">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div>
              <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Business Overview</h4>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>View existing businesses</p>
            </div>
          </Link>

          <Link 
            to="/analysis"
            className={`p-6 rounded-2xl border flex items-center gap-4 transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-card-dark border-border-dark hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-card-light border-border-light hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-blue to-primary-purple flex items-center justify-center">
              <Activity className="text-white" size={24} />
            </div>
            <div>
              <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Market Analysis</h4>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Detailed market insights</p>
            </div>
          </Link>

          <Link 
            to="/ai-recommendations"
            className={`p-6 rounded-2xl border flex items-center gap-4 transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-card-dark border-border-dark hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-card-light border-border-light hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-blue to-primary-purple flex items-center justify-center">
              <Star className="text-white" size={24} />
            </div>
            <div>
              <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>AI Recommendations</h4>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Get smart suggestions</p>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default AreaOverview;
