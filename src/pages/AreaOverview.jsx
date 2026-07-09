import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { areasAPI, favoriteAPI, shareAPI } from '../services/api';
import EmptyState from '../components/EmptyState';
import { averageOfValues, toPlainObject, NO_DATA_LABEL } from '../utils/dataUtils';
import {
  MapPin, Users, TrendingUp, DollarSign, Briefcase, GraduationCap,
  Building, Car, Navigation, Star, ArrowLeft, Share2, Heart, BarChart3,
  Home, Store, Activity, ChevronRight
} from 'lucide-react';

function AreaOverview() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const { pincode: routePincode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiArea, setApiArea] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchArea = async () => {
      if (!routePincode) return;
      try {
        setLoading(true);
        setError(null);
        const response = await areasAPI.getByPincode(routePincode);
        setApiArea(response.data || null);
        if (!response.data) {
          setError(`Data for pincode ${routePincode} will be loaded from government APIs. Please try again or select a different pincode.`);
        }
      } catch (err) {
        setApiArea(null);
        setError(err.message || 'Failed to load area data.');
      } finally {
        setLoading(false);
      }
    };
    fetchArea();
  }, [routePincode]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!user || !apiArea) return;
      try {
        const res = await favoriteAPI.check('area', apiArea._id);
        setIsFavorite(res.isFavorite);
      } catch (err) {
        // Ignore
      }
    };
    checkFavorite();
  }, [user, apiArea]);

  const handleFavorite = async () => {
    if (!user) {
      alert('Please login to save favorites');
      return;
    }
    try {
      if (isFavorite) {
        await favoriteAPI.remove('area', apiArea._id);
        setIsFavorite(false);
      } else {
        await favoriteAPI.add('area', apiArea._id, {
          name: apiArea.name,
          pincode: apiArea.pincode,
          district: apiArea.district?.name || apiArea.district
        });
        setIsFavorite(true);
      }
    } catch (err) {
      alert(err.message || 'Failed to update favorite');
    }
  };

  const handleShare = async () => {
    if (!user) {
      alert('Please login to share');
      return;
    }
    try {
      const res = await shareAPI.create('area', apiArea._id, {
        name: apiArea.name,
        pincode: apiArea.pincode,
        district: apiArea.district?.name || apiArea.district
      });
      const url = `${window.location.origin}/share/${res.data.shareToken}`;
      setShareLink(url);
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert(err.message || 'Failed to create share link');
    }
  };

  if (!routePincode) {
    return (
      <div className={`min-h-[calc(100vh-70px)] p-6 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <EmptyState type="noData" message="No pincode specified. Search a pincode on the Dashboard." actionText="Go to Dashboard" onAction={() => navigate('/dashboard')} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-[calc(100vh-70px)] p-6 flex items-center justify-center ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2563eb] mx-auto mb-4"></div>
          <p className={isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}>Fetching census and map data...</p>
        </div>
      </div>
    );
  }

  if (error || !apiArea) {
    return (
      <div className={`min-h-[calc(100vh-70px)] p-6 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <EmptyState type={error ? 'error' : 'noData'} message={error || `Data for pincode ${routePincode} will be loaded from government APIs. Please try again or select a different pincode.`} actionText="Go to Dashboard" onAction={() => navigate('/dashboard')} />
      </div>
    );
  }

  const marketGapScores = toPlainObject(apiArea.marketGapScores);
  const competitors = toPlainObject(apiArea.competitors);
  const marketScore = averageOfValues(marketGapScores);

  const areaData = {
    name: apiArea.name || NO_DATA_LABEL,
    district: apiArea.district?.name || NO_DATA_LABEL,
    pincode: apiArea.pincode || routePincode,
    population: apiArea.population,
    populationGrowth: apiArea.populationGrowth,
    incomeLevel: apiArea.incomeLevel || NO_DATA_LABEL,
    employment: null,
    literacy: null,
    ageDistribution: null,
    residentialCommercial: null,
    traffic: apiArea.urbanDevelopment != null ? (apiArea.urbanDevelopment >= 70 ? 'High' : apiArea.urbanDevelopment >= 40 ? 'Medium' : 'Low') : NO_DATA_LABEL,
    landmarks: [],
    marketScore: marketScore != null ? Math.round(marketScore) : null,
  };

  const nearbyBusinesses = Object.entries(competitors).map(([category, count]) => ({
    category,
    count: Number(count) || 0,
    icon: Store,
    color: 'bg-blue-500',
  }));

  return (
    <div className={`min-h-[calc(100vh-70px)] p-4 sm:p-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
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
                <MapPin className="text-[#2563eb]" size={28} />
                <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {areaData.name}
                </h1>
              </div>
              <p className={`text-sm sm:text-base md:text-lg opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                {areaData.district} • {areaData.pincode}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button 
                onClick={handleFavorite}
                className={`p-3 rounded-xl border transition-colors ${isFavorite ? 'bg-red-500 text-white border-red-500' : isDarkMode ? 'text-[#f1f5f9] border-[#334155] hover:bg-[#1e293b]' : 'text-[#1e293b] border-[#e2e8f0] hover:bg-gray-100'}`}
              >
                <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
              <button 
                onClick={handleShare}
                title={copied ? 'Copied!' : 'Share'}
                className={`p-3 rounded-xl border transition-colors ${copied ? 'bg-green-500 text-white border-green-500' : isDarkMode ? 'text-[#f1f5f9] border-[#334155] hover:bg-[#1e293b]' : 'text-[#1e293b] border-[#e2e8f0] hover:bg-gray-100'}`}
              >
                <Share2 size={20} />
              </button>
              <Link 
                to={`/business-overview/${areaData.pincode}`}
                className="px-6 py-3 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
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
          className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Market Opportunity Score
              </h2>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Overall business potential based on demand and competition analysis
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-5xl font-extrabold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent">
                  {areaData.marketScore != null ? areaData.marketScore : NO_DATA_LABEL}
                </div>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  out of 100
                </p>
              </div>
              <div className={`px-4 py-2 rounded-full font-semibold ${areaData.marketScore != null && areaData.marketScore >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : areaData.marketScore != null && areaData.marketScore >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : areaData.marketScore != null ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-600'}`}>
                {areaData.marketScore != null ? (areaData.marketScore >= 80 ? 'High Opportunity' : areaData.marketScore >= 60 ? 'Medium Opportunity' : 'Low Opportunity') : NO_DATA_LABEL}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Users, label: 'Population', value: areaData.population != null ? areaData.population.toLocaleString() : NO_DATA_LABEL, suffix: '', color: 'text-blue-500', bgLight: 'bg-blue-50', bgDark: 'bg-blue-900/20', borderLight: 'border-blue-200', borderDark: 'border-blue-800/30' },
            { icon: TrendingUp, label: 'Population Growth', value: areaData.populationGrowth != null ? Number(areaData.populationGrowth).toFixed(2) : NO_DATA_LABEL, suffix: areaData.populationGrowth != null ? '%' : '', color: 'text-green-500', bgLight: 'bg-green-50', bgDark: 'bg-green-900/20', borderLight: 'border-green-200', borderDark: 'border-green-800/30' },
            { icon: DollarSign, label: 'Income Level', value: areaData.incomeLevel, suffix: '', color: 'text-amber-500', bgLight: 'bg-amber-50', bgDark: 'bg-amber-900/20', borderLight: 'border-amber-200', borderDark: 'border-amber-800/30' },
            { icon: Briefcase, label: 'Urban Development', value: apiArea.urbanDevelopment != null ? apiArea.urbanDevelopment : NO_DATA_LABEL, suffix: apiArea.urbanDevelopment != null ? '/100' : '', color: 'text-purple-500', bgLight: 'bg-purple-50', bgDark: 'bg-purple-900/20', borderLight: 'border-purple-200', borderDark: 'border-purple-800/30' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (index * 0.1) }}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${
                isDarkMode 
                  ? `bg-[#1e293b] ${stat.borderDark} hover:border-opacity-100` 
                  : `bg-white ${stat.borderLight} hover:shadow-md`
              }`}
            >
              <div className={`inline-flex p-2.5 rounded-xl mb-3 ${isDarkMode ? stat.bgDark : stat.bgLight}`}>
                <stat.icon className={stat.color} size={22} />
              </div>
              <p className={`text-xs font-medium mb-1 uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
              <p className={`text-2xl font-extrabold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
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
            className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="text-[#2563eb]" size={24} />
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Literacy Rate
              </h3>
            </div>
            <div className="text-center mb-4">
              <div className="text-4xl font-extrabold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent">
                {areaData.literacy != null ? `${Number(areaData.literacy).toFixed(2)}%` : NO_DATA_LABEL}
              </div>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                {areaData.literacy != null ? 'Population is literate' : 'Census literacy data not available from API'}
              </p>
            </div>
            {areaData.literacy != null && (
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#2563eb] to-[#7c3aed] rounded-full transition-all duration-1000"
                style={{ width: `${areaData.literacy}%` }}
              />
            </div>
            )}
          </motion.div>

          {/* Age Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <Users className="text-[#2563eb]" size={24} />
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Age Distribution
              </h3>
            </div>
            <div className="space-y-4">
              {areaData.ageDistribution ? Object.entries(areaData.ageDistribution).map(([age, percentage], index) => (
                <div key={age}>
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      {age} years
                    </span>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      {percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#2563eb] to-[#7c3aed] rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )) : (
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{NO_DATA_LABEL}</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Residential vs Commercial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Building className="text-[#2563eb]" size={24} />
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Residential vs Commercial
            </h3>
          </div>
          {areaData.residentialCommercial ? (
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Home className="text-green-500" size={20} />
                <span className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Residential</span>
              </div>
              <div className="text-3xl font-bold text-green-500 mb-2">{Number(areaData.residentialCommercial.residential || 0).toFixed(2)}%</div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${Number(areaData.residentialCommercial.residential || 0).toFixed(2)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Store className="text-blue-500" size={20} />
                <span className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Commercial</span>
              </div>
              <div className="text-3xl font-bold text-blue-500 mb-2">{Number(areaData.residentialCommercial.commercial || 0).toFixed(2)}%</div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Number(areaData.residentialCommercial.commercial || 0).toFixed(2)}%` }} />
              </div>
            </div>
          </div>
          ) : (
            <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{NO_DATA_LABEL}</p>
          )}
        </motion.div>

        {/* Traffic & Nearby Landmarks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <Car className="text-[#2563eb]" size={24} />
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Traffic Level
              </h3>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${areaData.traffic === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : areaData.traffic === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
              <Activity size={16} />
              {areaData.traffic} Traffic
            </div>
            <p className={`text-sm opacity-70 mt-3 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Based on vehicle density and footfall analysis
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <Navigation className="text-[#2563eb]" size={24} />
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Nearby Landmarks
              </h3>
            </div>
            <div className="space-y-3">
              {areaData.landmarks.length > 0 ? areaData.landmarks.map((landmark, index) => (
                <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                  <Star className="text-yellow-500" size={16} />
                  <span className={`text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{landmark}</span>
                </div>
              )) : (
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{NO_DATA_LABEL}</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Nearby Business Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Store className="text-[#2563eb]" size={24} />
              <h3 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Nearby Business Categories
              </h3>
            </div>
            <Link 
              to={`/business-overview/${areaData.pincode}`}
              className="text-[#2563eb] font-semibold hover:underline flex items-center gap-1"
            >
              View All
              <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {nearbyBusinesses.length > 0 ? nearbyBusinesses.map((business, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className={`p-4 rounded-xl border text-center ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}
              >
                <div className={`w-12 h-12 ${business.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  <business.icon className="text-white" size={24} />
                </div>
                <p className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {business.category}
                </p>
                <p className={`text-lg font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {business.count}
                </p>
              </motion.div>
            )) : (
              <p className={`col-span-full text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{NO_DATA_LABEL}</p>
            )}
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
            className={`p-6 rounded-2xl border flex items-center gap-4 transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div>
              <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Business Overview</h4>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>View existing businesses</p>
            </div>
          </Link>

          <Link 
            to="/analysis"
            className={`p-6 rounded-2xl border flex items-center gap-4 transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center">
              <Activity className="text-white" size={24} />
            </div>
            <div>
              <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Market Analysis</h4>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Detailed market insights</p>
            </div>
          </Link>

          <Link 
            to="/ai-recommendations"
            className={`p-6 rounded-2xl border flex items-center gap-4 transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center">
              <Star className="text-white" size={24} />
            </div>
            <div>
              <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>AI Recommendations</h4>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Get smart suggestions</p>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default AreaOverview;
