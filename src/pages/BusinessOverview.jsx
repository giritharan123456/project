import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Store, TrendingUp, TrendingDown, BarChart3, PieChart, 
  ArrowLeft, Filter, Search, ChevronDown, Star, MapPin,
  Phone, Clock, Building2, Utensils, Coffee, ShoppingBag,
  Scissors, Briefcase, Heart, Share2, Grid, List, AlertCircle
} from 'lucide-react';

function BusinessOverview() {
  const { isDarkMode } = useTheme();
  const { pincode } = useParams();
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Mock data - will be replaced by backend
  const businessData = {
    totalBusinesses: 847,
    competitorDensity: 'High',
    marketSaturation: 78,
    businessTrend: 'Growing',
    popularCategories: [
      { name: 'Restaurants', count: 245, growth: 12, icon: Utensils },
      { name: 'Retail', count: 189, growth: 8, icon: ShoppingBag },
      { name: 'Services', count: 156, growth: 15, icon: Scissors },
      { name: 'Cafes', count: 78, growth: 20, icon: Coffee },
      { name: 'Offices', count: 45, growth: 5, icon: Briefcase },
      { name: 'Others', count: 134, growth: 10, icon: Store }
    ]
  };

  const businesses = [
    {
      id: 1,
      name: 'Saravana Bhavan',
      category: 'Restaurants',
      rating: 4.5,
      reviews: 2340,
      established: 1981,
      status: 'Open',
      distance: '0.2 km',
      phone: '+91 44 2345 6789',
      hours: '6:00 AM - 10:00 PM'
    },
    {
      id: 2,
      name: 'Pothys Boutique',
      category: 'Retail',
      rating: 4.7,
      reviews: 1890,
      established: 1995,
      status: 'Open',
      distance: '0.3 km',
      phone: '+91 44 2345 6790',
      hours: '10:00 AM - 9:00 PM'
    },
    {
      id: 3,
      name: 'Cafe Coffee Day',
      category: 'Cafes',
      rating: 4.2,
      reviews: 890,
      established: 2010,
      status: 'Open',
      distance: '0.1 km',
      phone: '+91 44 2345 6791',
      hours: '8:00 AM - 11:00 PM'
    },
    {
      id: 4,
      name: 'Lakme Salon',
      category: 'Services',
      rating: 4.4,
      reviews: 567,
      established: 2005,
      status: 'Open',
      distance: '0.4 km',
      phone: '+91 44 2345 6792',
      hours: '9:00 AM - 8:00 PM'
    },
    {
      id: 5,
      name: 'Titan Showroom',
      category: 'Retail',
      rating: 4.6,
      reviews: 1234,
      established: 2000,
      status: 'Open',
      distance: '0.5 km',
      phone: '+91 44 2345 6793',
      hours: '10:00 AM - 8:00 PM'
    },
    {
      id: 6,
      name: 'Baskin Robbins',
      category: 'Cafes',
      rating: 4.3,
      reviews: 456,
      established: 2015,
      status: 'Open',
      distance: '0.2 km',
      phone: '+91 44 2345 6794',
      hours: '10:00 AM - 10:00 PM'
    }
  ];

  const categories = ['All', ...businessData.popularCategories.map(c => c.name)];

  const filteredBusinesses = selectedCategory === 'All' 
    ? businesses 
    : businesses.filter(b => b.category === selectedCategory);

  const getCategoryIcon = (category) => {
    const cat = businessData.popularCategories.find(c => c.name === category);
    return cat ? cat.icon : Store;
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
                <Store className="text-[#2563eb]" size={28} />
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  Business Overview
                </h1>
              </div>
              <p className={`text-lg opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Pincode: {pincode || '600017'}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className={`p-3 rounded-xl border transition-colors ${isDarkMode ? 'text-[#f1f5f9] border-[#334155] hover:bg-[#1e293b]' : 'text-[#1e293b] border-[#e2e8f0] hover:bg-[#ffffff]'}`}>
                <Heart size={20} />
              </button>
              <button className={`p-3 rounded-xl border transition-colors ${isDarkMode ? 'text-[#f1f5f9] border-[#334155] hover:bg-[#1e293b]' : 'text-[#1e293b] border-[#e2e8f0] hover:bg-[#ffffff]'}`}>
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Store, label: 'Total Businesses', value: businessData.totalBusinesses, color: 'text-blue-500' },
            { icon: BarChart3, label: 'Competitor Density', value: businessData.competitorDensity, color: 'text-purple-500' },
            { icon: PieChart, label: 'Market Saturation', value: `${businessData.marketSaturation}%`, color: 'text-orange-500' },
            { icon: TrendingUp, label: 'Business Trend', value: businessData.businessTrend, color: 'text-green-500' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + (index * 0.1) }}
              className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
            >
              <stat.icon className={`${stat.color} mb-3`} size={24} />
              <p className={`text-sm opacity-70 mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{stat.label}</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Popular Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="text-[#2563eb]" size={24} />
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Popular Business Categories
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {businessData.popularCategories.map((category, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className={`p-4 rounded-xl border text-center ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] rounded-lg flex items-center justify-center mx-auto mb-3">
                  <category.icon className="text-white" size={24} />
                </div>
                <p className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {category.name}
                </p>
                <div className="flex items-center justify-center gap-1">
                  <span className={`text-lg font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                    {category.count}
                  </span>
                  <TrendingUp className="text-green-500" size={14} />
                  <span className="text-xs text-green-500">{category.growth}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Filters and View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-[#f1f5f9] opacity-50' : 'text-[#1e293b] opacity-50'}`} size={20} />
                <input
                  type="text"
                  placeholder="Search businesses..."
                  className={`pl-10 pr-4 py-2 rounded-lg border bg-transparent outline-none focus:border-[#2563eb] transition-colors ${isDarkMode ? 'text-[#f1f5f9] border-[#334155]' : 'text-[#1e293b] border-[#e2e8f0]'}`}
                />
              </div>
              
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`px-4 py-2 pr-10 rounded-lg border bg-transparent outline-none focus:border-[#2563eb] transition-colors appearance-none cursor-pointer ${isDarkMode ? 'text-[#f1f5f9] border-[#334155]' : 'text-[#1e293b] border-[#e2e8f0]'}`}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={16} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#2563eb] text-white' : isDarkMode ? 'text-[#f1f5f9] hover:bg-[#1e293b]' : 'text-[#1e293b] hover:bg-[#ffffff]'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#2563eb] text-white' : isDarkMode ? 'text-[#f1f5f9] hover:bg-[#1e293b]' : 'text-[#1e293b] hover:bg-[#ffffff]'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Business List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Existing Businesses ({filteredBusinesses.length})
            </h3>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBusinesses.map((business, index) => {
                const CategoryIcon = getCategoryIcon(business.category);
                return (
                  <motion.div
                    key={business.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + (index * 0.1) }}
                    whileHover={{ scale: 1.02 }}
                    className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] rounded-xl flex items-center justify-center">
                        <CategoryIcon className="text-white" size={24} />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${business.status === 'Open' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {business.status}
                      </span>
                    </div>
                    
                    <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      {business.name}
                    </h4>
                    <p className={`text-sm opacity-70 mb-3 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      {business.category}
                    </p>
                    
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="text-yellow-500 fill-yellow-500" size={16} />
                      <span className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                        {business.rating}
                      </span>
                      <span className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                        ({business.reviews} reviews)
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className={`flex items-center gap-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                        <MapPin size={14} />
                        <span>{business.distance}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                        <Clock size={14} />
                        <span>{business.hours}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                        <Building2 size={14} />
                        <span>Since {business.established}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBusinesses.map((business, index) => {
                const CategoryIcon = getCategoryIcon(business.category);
                return (
                  <motion.div
                    key={business.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + (index * 0.1) }}
                    className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] rounded-xl flex items-center justify-center flex-shrink-0">
                        <CategoryIcon className="text-white" size={32} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className={`font-bold text-lg ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                              {business.name}
                            </h4>
                            <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                              {business.category}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${business.status === 'Open' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {business.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="text-yellow-500 fill-yellow-500" size={16} />
                            <span className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                              {business.rating}
                            </span>
                            <span className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                              ({business.reviews} reviews)
                            </span>
                          </div>
                          <span className={`text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                            Since {business.established}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className={`flex items-center gap-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                            <MapPin size={14} />
                            <span>{business.distance}</span>
                          </div>
                          <div className={`flex items-center gap-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                            <Clock size={14} />
                            <span>{business.hours}</span>
                          </div>
                          <div className={`flex items-center gap-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                            <Phone size={14} />
                            <span>{business.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Market Saturation Warning */}
        {businessData.marketSaturation > 70 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className={`mt-8 p-6 rounded-2xl border border-l-4 ${isDarkMode ? 'bg-orange-900/20 border-orange-500' : 'bg-orange-50 border-orange-500'}`}
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="text-orange-500 flex-shrink-0" size={24} />
              <div>
                <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  High Market Saturation
                </h4>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  This area has {businessData.marketSaturation}% market saturation. Consider exploring nearby areas with lower competition for better business opportunities.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default BusinessOverview;
