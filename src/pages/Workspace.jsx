import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  User, Heart, Clock, FileText, MapPin, BarChart3, Settings,
  Bell, Moon, Sun, ChevronRight, Search, Plus, X, Calendar,
  Download, Trash2, Edit, Eye, Star, TrendingUp, Award
} from 'lucide-react';

function Workspace() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');

  // Mock data - will be replaced by backend
  const userProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    memberSince: 'January 2024',
    plan: 'Pro',
    avatar: 'JD'
  };

  const favoriteLocations = [
    { id: 1, name: 'T. Nagar', pincode: '600017', score: 92, district: 'Chennai' },
    { id: 2, name: 'Anna Nagar', pincode: '600040', score: 85, district: 'Chennai' },
    { id: 3, name: 'Velachery', pincode: '600042', score: 82, district: 'Chennai' }
  ];

  const savedComparisons = [
    { id: 1, name: 'Chennai Central Areas', date: '2024-01-15', areas: ['T. Nagar', 'Anna Nagar', 'Mylapore'] },
    { id: 2, name: 'Coimbatore Retail Zones', date: '2024-01-10', areas: ['Gandhipuram', 'RS Puram'] }
  ];

  const savedReports = [
    { id: 1, name: 'T. Nagar Market Analysis', date: '2024-01-20', type: 'PDF' },
    { id: 2, name: 'Chennai District Overview', date: '2024-01-18', type: 'PDF' }
  ];

  const searchHistory = [
    { id: 1, query: 'T. Nagar restaurants', date: '2 hours ago' },
    { id: 2, query: 'Anna Nagar retail', date: '1 day ago' },
    { id: 3, query: 'Velachery cafes', date: '3 days ago' },
    { id: 4, query: 'Adyar pharmacies', date: '1 week ago' }
  ];

  const recentlyViewed = [
    { id: 1, name: 'T. Nagar', type: 'Area', date: '2 hours ago' },
    { id: 2, name: 'Anna Nagar', type: 'Area', date: '1 day ago' },
    { id: 3, name: 'Specialty Coffee Shop', type: 'Recommendation', date: '2 days ago' }
  ];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'comparisons', label: 'Comparisons', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'history', label: 'Search History', icon: Clock },
    { id: 'recent', label: 'Recently Viewed', icon: Eye },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className={`min-h-[calc(100vh-70px)] p-6 transition-colors duration-300 ${isDarkMode ? 'bg-bg-dark' : 'bg-bg-light'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <User className="text-primary-blue" size={32} />
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
              Personal Workspace
            </h1>
          </div>
          <p className={`text-lg opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
            Manage your saved items, preferences, and account settings
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-2 rounded-2xl border mb-8 flex flex-wrap gap-2 ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-primary-blue text-white' : isDarkMode ? 'text-text-dark hover:bg-card-dark' : 'text-text-light hover:bg-card-light'}`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}>
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary-blue to-primary-purple flex items-center justify-center text-white text-4xl font-bold">
                  {userProfile.avatar}
                </div>
                
                <div className="flex-1">
                  <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                    {userProfile.name}
                  </h2>
                  <p className={`text-lg opacity-70 mb-4 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                    {userProfile.email}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-bg-dark' : 'bg-bg-light'}`}>
                      <p className={`text-sm opacity-70 mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Member Since</p>
                      <p className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{userProfile.memberSince}</p>
                    </div>
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-bg-dark' : 'bg-bg-light'}`}>
                      <p className={`text-sm opacity-70 mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Plan</p>
                      <p className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{userProfile.plan}</p>
                    </div>
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-bg-dark' : 'bg-bg-light'}`}>
                      <p className={`text-sm opacity-70 mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Saved Areas</p>
                      <p className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{favoriteLocations.length}</p>
                    </div>
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-bg-dark' : 'bg-bg-light'}`}>
                      <p className={`text-sm opacity-70 mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Reports</p>
                      <p className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{savedReports.length}</p>
                    </div>
                  </div>

                  <button className="px-6 py-3 bg-gradient-to-r from-primary-blue to-primary-purple text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
                    <Edit size={18} />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                  Favorite Locations ({favoriteLocations.length})
                </h3>
              </div>
              
              {favoriteLocations.map(location => (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-6 rounded-2xl border flex items-center justify-between ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-blue to-primary-purple flex items-center justify-center">
                      <MapPin className="text-white" size={24} />
                    </div>
                    <div>
                      <h4 className={`font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{location.name}</h4>
                      <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                        {location.district} • {location.pincode}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-2xl font-bold bg-gradient-to-r from-primary-blue to-primary-purple bg-clip-text text-transparent">
                        {location.score}
                      </div>
                      <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Score</p>
                    </div>
                    <Link 
                      to={`/area-overview/${location.pincode}`}
                      className="text-primary-blue hover:underline"
                    >
                      <ChevronRight size={24} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Comparisons Tab */}
          {activeTab === 'comparisons' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                  Saved Comparisons ({savedComparisons.length})
                </h3>
                <Link 
                  to="/comparison"
                  className="text-primary-blue font-semibold hover:underline flex items-center gap-1"
                >
                  <Plus size={16} />
                  New Comparison
                </Link>
              </div>
              
              {savedComparisons.map(comparison => (
                <motion.div
                  key={comparison.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className={`font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{comparison.name}</h4>
                      <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                        {comparison.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className={`p-2 rounded-lg ${isDarkMode ? 'text-text-dark hover:bg-card-dark' : 'text-text-light hover:bg-card-light'}`}>
                        <Download size={18} />
                      </button>
                      <button className={`p-2 rounded-lg ${isDarkMode ? 'text-text-dark hover:bg-card-dark' : 'text-text-light hover:bg-card-light'}`}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {comparison.areas.map((area, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-bg-dark text-text-dark border border-border-dark' : 'bg-bg-light text-text-light border border-border-light'}`}
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                  Saved Reports ({savedReports.length})
                </h3>
              </div>
              
              {savedReports.map(report => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-6 rounded-2xl border flex items-center justify-between ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-blue to-primary-purple flex items-center justify-center">
                      <FileText className="text-white" size={24} />
                    </div>
                    <div>
                      <h4 className={`font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{report.name}</h4>
                      <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                        {report.date} • {report.type}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className={`p-2 rounded-lg ${isDarkMode ? 'text-text-dark hover:bg-card-dark' : 'text-text-light hover:bg-card-light'}`}>
                      <Download size={18} />
                    </button>
                    <button className={`p-2 rounded-lg ${isDarkMode ? 'text-text-dark hover:bg-card-dark' : 'text-text-light hover:bg-card-light'}`}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Search History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                  Search History ({searchHistory.length})
                </h3>
                <button className="text-red-500 text-sm font-semibold hover:underline">
                  Clear All
                </button>
              </div>
              
              {searchHistory.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}
                >
                  <div className="flex items-center gap-3">
                    <Search className={`opacity-50 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`} size={18} />
                    <span className={`font-medium ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{item.query}</span>
                  </div>
                  <span className={`text-sm opacity-50 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{item.date}</span>
                </motion.div>
              ))}
            </div>
          )}

          {/* Recently Viewed Tab */}
          {activeTab === 'recent' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                  Recently Viewed ({recentlyViewed.length})
                </h3>
              </div>
              
              {recentlyViewed.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}
                >
                  <div className="flex items-center gap-3">
                    <Eye className={`opacity-50 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`} size={18} />
                    <div>
                      <span className={`font-medium ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{item.name}</span>
                      <span className={`text-sm opacity-50 ml-2 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                        • {item.type}
                      </span>
                    </div>
                  </div>
                  <span className={`text-sm opacity-50 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{item.date}</span>
                </motion.div>
              ))}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}>
                <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                  Appearance
                </h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isDarkMode ? <Moon size={24} /> : <Sun size={24} />}
                    <div>
                      <p className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Dark Mode</p>
                      <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                        Toggle between light and dark theme
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`w-14 h-8 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-primary-blue' : 'bg-gray-300'}`}
                  >
                    <div className={`w-6 h-6 rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}>
                <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                  Notifications
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Market Updates</p>
                      <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                        Get notified about market changes
                      </p>
                    </div>
                    <button className={`w-14 h-8 rounded-full p-1 transition-colors bg-primary-blue`}>
                      <div className="w-6 h-6 rounded-full bg-white transition-transform translate-x-6" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Business Opportunities</p>
                      <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                        New opportunities in your areas
                      </p>
                    </div>
                    <button className={`w-14 h-8 rounded-full p-1 transition-colors bg-primary-blue`}>
                      <div className="w-6 h-6 rounded-full bg-white transition-transform translate-x-6" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Forecast Updates</p>
                      <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                        Changes in demand forecasts
                      </p>
                    </div>
                    <button className={`w-14 h-8 rounded-full p-1 transition-colors bg-gray-300`}>
                      <div className="w-6 h-6 rounded-full bg-white transition-transform translate-x-0" />
                    </button>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}>
                <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                  Account
                </h3>
                
                <div className="space-y-4">
                  <button className="w-full p-4 rounded-xl border flex items-center justify-between transition-colors hover:border-primary-blue">
                    <span className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Change Password</span>
                    <ChevronRight className={`opacity-50 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`} size={20} />
                  </button>
                  
                  <button className="w-full p-4 rounded-xl border flex items-center justify-between transition-colors hover:border-primary-blue">
                    <span className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Privacy Settings</span>
                    <ChevronRight className={`opacity-50 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`} size={20} />
                  </button>
                  
                  <button className="w-full p-4 rounded-xl border flex items-center justify-between transition-colors hover:border-red-500 hover:text-red-500">
                    <span className="font-semibold text-red-500">Delete Account</span>
                    <ChevronRight className="opacity-50" size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Workspace;
