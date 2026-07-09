import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { areasAPI } from '../services/api';
import EmptyState from '../components/EmptyState';
import { toPlainObject, averageOfValues, NO_DATA_LABEL } from '../utils/dataUtils';
import { 
  Store, TrendingUp, BarChart3, 
  ArrowLeft, Search, ChevronDown, MapPin,
  Utensils, Coffee, ShoppingBag,
  Scissors, Briefcase, Heart, Share2, Grid, List, AlertCircle, PieChart
} from 'lucide-react';

const categoryIcons = {
  Restaurants: Utensils,
  Retail: ShoppingBag,
  Services: Scissors,
  Cafes: Coffee,
  Offices: Briefcase,
};

function BusinessOverview() {
  const { isDarkMode } = useTheme();
  const { pincode: routePincode } = useParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiArea, setApiArea] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchArea = async () => {
      if (!routePincode) return;
      try {
        setLoading(true);
        setError(null);
        const response = await areasAPI.getByPincode(routePincode);
        setApiArea(response.data || null);
        if (response.data) {
          const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
          const updated = [{ pincode: routePincode, areaName: response.data.name, timestamp: Date.now() }, ...viewed.filter(v => v.pincode !== routePincode)].slice(0, 10);
          localStorage.setItem('recentlyViewed', JSON.stringify(updated));
          window.dispatchEvent(new Event('recentlyViewedUpdated'));
        } else {
          setError(`Data for pincode ${routePincode} will be loaded from government APIs. Please try again or select a different pincode.`);
        }
      } catch (err) {
        setApiArea(null);
        setError(err.message || 'Failed to load business data.');
      } finally {
        setLoading(false);
      }
    };
    fetchArea();
  }, [routePincode]);

  const competitors = apiArea ? toPlainObject(apiArea.competitors) : {};
  const totalBusinesses = Object.values(competitors).reduce((sum, v) => sum + (Number(v) || 0), 0);
  const avgGap = apiArea ? averageOfValues(toPlainObject(apiArea.marketGapScores)) : null;

  const businessData = {
    totalBusinesses: totalBusinesses || null,
    competitorDensity: totalBusinesses > 100 ? 'High' : totalBusinesses > 50 ? 'Medium' : totalBusinesses > 0 ? 'Low' : NO_DATA_LABEL,
    marketSaturation: avgGap != null ? Math.max(0, Math.min(100, 100 - avgGap)) : null,
    businessTrend: apiArea?.populationGrowth != null && apiArea.populationGrowth > 2 ? 'Growing' : apiArea?.populationGrowth != null ? 'Stable' : NO_DATA_LABEL,
    popularCategories: Object.entries(competitors).map(([name, count]) => ({
      name,
      count: Number(count) || 0,
      growth: apiArea?.populationGrowth ?? null,
      icon: categoryIcons[name] || Store,
    })),
  };

  const businesses = useMemo(() => {
    if (!apiArea) return [];
    const competitors = toPlainObject(apiArea.competitors);
    const gapScores = toPlainObject(apiArea.marketGapScores);
    const demandScores = toPlainObject(apiArea.demandScores);

    return Object.entries(competitors).map(([name, count]) => ({
      id: name,
      name: name,
      category: name,
      status: (Number(count) || 0) > 0 ? 'Active' : 'No Data',
      competitors: Number(count) || 0,
      gapScore: Number(gapScores[name]) || 0,
      demandScore: Number(demandScores[name]) || 0,
      population: apiArea.population || 0,
      growth: apiArea.populationGrowth || 0,
    })).filter(b => !searchTerm || b.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [apiArea, searchTerm]);

  if (!routePincode || loading) {
    return (
      <div className={`min-h-[calc(100vh-70px)] p-6 flex items-center justify-center ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <p className={isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}>
          {loading ? 'Loading business data from backend...' : 'No pincode specified.'}
        </p>
      </div>
    );
  }

  if (error || !apiArea) {
    return (
      <div className={`min-h-[calc(100vh-70px)] p-6 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <EmptyState type={error ? 'error' : 'noData'} message={error || NO_DATA_LABEL} actionText="Go to Dashboard" onAction={() => navigate('/dashboard')} />
      </div>
    );
  }

  // 'All' is a UI filter option, not hardcoded data
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
                Pincode: {routePincode} — {apiArea.name || NO_DATA_LABEL}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button title="Coming soon" className={`p-3 rounded-xl border transition-colors opacity-50 cursor-not-allowed ${isDarkMode ? 'text-[#f1f5f9] border-[#334155]' : 'text-[#1e293b] border-[#e2e8f0]'}`}>
                <Heart size={20} />
              </button>
              <button title="Coming soon" className={`p-3 rounded-xl border transition-colors opacity-50 cursor-not-allowed ${isDarkMode ? 'text-[#f1f5f9] border-[#334155]' : 'text-[#1e293b] border-[#e2e8f0]'}`}>
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Store, label: 'Total Businesses', value: businessData.totalBusinesses ?? NO_DATA_LABEL, color: 'text-blue-500', bgLight: 'bg-blue-50', bgDark: 'bg-blue-900/20' },
            { icon: BarChart3, label: 'Competitor Density', value: businessData.competitorDensity, color: 'text-violet-500', bgLight: 'bg-violet-50', bgDark: 'bg-violet-900/20' },
            { icon: PieChart, label: 'Market Saturation', value: `${Number(businessData.marketSaturation || 0).toFixed(2)}%`, color: 'text-amber-500', bgLight: 'bg-amber-50', bgDark: 'bg-amber-900/20' },
            { icon: TrendingUp, label: 'Business Trend', value: businessData.businessTrend, color: 'text-emerald-500', bgLight: 'bg-emerald-50', bgDark: 'bg-emerald-900/20' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + (index * 0.1) }}
              whileHover={{ y: -4 }}
              className={`p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${
                isDarkMode 
                  ? 'bg-[#1e293b] border-[#334155] hover:border-[#2563eb]/40' 
                  : 'bg-white border-[#e2e8f0] hover:border-[#2563eb]/40 hover:shadow-md'
              }`}
            >
              <div className={`inline-flex p-2.5 rounded-xl mb-3 ${isDarkMode ? stat.bgDark : stat.bgLight}`}>
                <stat.icon className={stat.color} size={22} />
              </div>
              <p className={`text-xs font-medium mb-1 uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
              <p className={`text-2xl font-extrabold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
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
                  <span className="text-xs text-green-500">{Number(category.growth || 0).toFixed(2)}%</span>
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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

          {filteredBusinesses.length === 0 ? (
            <EmptyState
              type="noData"
              message="Individual business listings are not available from census/map APIs. Category competitor counts are shown above from backend data."
            />
          ) : viewMode === 'grid' ? (
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
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${business.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {business.status}
                      </span>
                    </div>
                    
                    <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      {business.name}
                    </h4>
                    <p className={`text-sm opacity-70 mb-3 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      {business.category}
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      <div className={`flex items-center justify-between ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                        <span className="opacity-70">Competitors</span>
                        <span className="font-bold">{business.competitors}</span>
                      </div>
                      <div className={`flex items-center justify-between ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                        <span className="opacity-70">Gap Score</span>
                        <span className="font-bold">{business.gapScore.toFixed(2)}</span>
                      </div>
                      <div className={`flex items-center justify-between ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                        <span className="opacity-70">Demand Score</span>
                        <span className="font-bold">{business.demandScore.toFixed(2)}</span>
                      </div>
                      <div className={`flex items-center justify-between ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                        <span className="opacity-70">Population</span>
                        <span className="font-bold">{business.population.toLocaleString()}</span>
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
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${business.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'}`}>
                            {business.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className={`flex items-center gap-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                            <span className="opacity-70">Competitors:</span>
                            <span className="font-bold">{business.competitors}</span>
                          </div>
                          <div className={`flex items-center gap-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                            <span className="opacity-70">Gap:</span>
                            <span className="font-bold">{business.gapScore.toFixed(2)}</span>
                          </div>
                          <div className={`flex items-center gap-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                            <span className="opacity-70">Demand:</span>
                            <span className="font-bold">{business.demandScore.toFixed(2)}</span>
                          </div>
                          <div className={`flex items-center gap-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                            <span className="opacity-70">Pop:</span>
                            <span className="font-bold">{business.population.toLocaleString()}</span>
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
        {businessData.marketSaturation != null && businessData.marketSaturation > 70 && (
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
                  This area has {Number(businessData.marketSaturation || 0).toFixed(2)}% market saturation. Consider exploring nearby areas with lower competition for better business opportunities.
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
