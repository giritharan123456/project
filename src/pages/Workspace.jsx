import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { workspaceAPI } from '../services/api';
import { 
  User, Heart, Clock, FileText, BarChart3, Settings,
  ChevronRight, Eye, Trash2, Download, Edit, MapPin,
  Plus, Search, Moon, Sun
} from 'lucide-react';

function Workspace() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { error: toastError } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);

  const [userProfile, setUserProfile] = useState({
    name: 'User',
    email: '',
    avatar: 'U',
    memberSince: '',
    plan: 'Free'
  });
  const [favoriteLocations, setFavoriteLocations] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [savedReports, setSavedReports] = useState([]);
  const [savedComparisons, setSavedComparisons] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { setLoading(false); return; }
        
        const [profileRes, favsRes, historyRes] = await Promise.allSettled([
          workspaceAPI.getProfile(),
          workspaceAPI.getFavorites(),
          workspaceAPI.getSearchHistory()
        ]);
        
        if (profileRes.status === 'fulfilled' && profileRes.value?.data) {
          const p = profileRes.value.data;
          setUserProfile({
            name: p.name || 'User',
            email: p.email || '',
            avatar: (p.name || 'U').charAt(0).toUpperCase(),
            memberSince: p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '',
            plan: p.plan || 'Free'
          });
        }
        if (favsRes.status === 'fulfilled' && favsRes.value?.data) {
          setFavoriteLocations(favsRes.value.data);
        }
        if (historyRes.status === 'fulfilled' && historyRes.value?.data) {
          setSearchHistory(historyRes.value.data);
        }
      } catch (err) {
        toastError('Failed to load workspace data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'history', label: 'Search History', icon: Clock },
    { id: 'comparisons', label: 'Comparisons', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'recent', label: 'Recently Viewed', icon: Eye },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className={`min-h-[calc(100vh-70px)] p-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <User className="text-[#2563eb]" size={32} />
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Personal Workspace
            </h1>
          </div>
          <p className={`text-lg opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
            Manage your saved items, preferences, and account settings
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-2 rounded-2xl  border mb-8 flex flex-wrap gap-2 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-[#2563eb] text-white' : isDarkMode ? 'text-[#f1f5f9] hover:bg-[#1e293b]' : 'text-[#1e293b] hover:bg-[#ffffff]'}`}
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
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}>
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center text-white text-4xl font-bold">
                  {userProfile.avatar}
                </div>
                
                <div className="flex-1">
                  <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                    {userProfile.name}
                  </h2>
                  <p className={`text-lg opacity-70 mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                    {userProfile.email}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                      <p className={`text-sm opacity-70 mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Member Since</p>
                      <p className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{userProfile.memberSince}</p>
                    </div>
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                      <p className={`text-sm opacity-70 mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Plan</p>
                      <p className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{userProfile.plan}</p>
                    </div>
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                      <p className={`text-sm opacity-70 mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Saved Areas</p>
                      <p className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{favoriteLocations.length}</p>
                    </div>
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                      <p className={`text-sm opacity-70 mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Reports</p>
                      <p className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{savedReports.length}</p>
                    </div>
                  </div>

                  <button className="px-6 py-3 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
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
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  Favorite Locations ({favoriteLocations.length})
                </h3>
              </div>
              
              {favoriteLocations.map(location => (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-6 rounded-2xl border flex items-center justify-between ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center">
                      <MapPin className="text-white" size={24} />
                    </div>
                    <div>
                      <h4 className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{location.name}</h4>
                      <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                        {location.district} • {location.pincode}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-2xl font-bold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent">
                        {location.score}
                      </div>
                      <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Score</p>
                    </div>
                    <Link 
                      to={`/area-overview/${location.pincode}`}
                      className="text-[#2563eb] hover:underline"
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
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  Saved Comparisons ({savedComparisons.length})
                </h3>
                <Link 
                  to="/comparison"
                  className="text-[#2563eb] font-semibold hover:underline flex items-center gap-1"
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
                  className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{comparison.name}</h4>
                      <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                        {comparison.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button disabled className={`p-2 rounded-lg opacity-50 cursor-not-allowed ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                        <Download size={18} />
                      </button>
                      <button disabled className={`p-2 rounded-lg opacity-50 cursor-not-allowed ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {comparison.areas.map((area, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-[#0f172a] text-[#f1f5f9] border border-[#334155]' : 'bg-[#f8fafc] text-[#1e293b] border border-[#e2e8f0]'}`}
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
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  Saved Reports ({savedReports.length})
                </h3>
              </div>
              
              {savedReports.map(report => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-6 rounded-2xl border flex items-center justify-between ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center">
                      <FileText className="text-white" size={24} />
                    </div>
                    <div>
                      <h4 className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{report.name}</h4>
                      <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                        {report.date} • {report.type}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className={`p-2 rounded-lg ${isDarkMode ? 'text-[#f1f5f9] hover:bg-[#1e293b]' : 'text-[#1e293b] hover:bg-[#ffffff]'}`}>
                      <Download size={18} />
                    </button>
                    <button className={`p-2 rounded-lg ${isDarkMode ? 'text-[#f1f5f9] hover:bg-[#1e293b]' : 'text-[#1e293b] hover:bg-[#ffffff]'}`}>
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
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  Search History ({searchHistory.length})
                </h3>
                <button onClick={() => setSearchHistory([])} className="text-red-500 text-sm font-semibold hover:underline">
                  Clear All
                </button>
              </div>
              
              {searchHistory.map(item => (
                <motion.div
                  key={item.id || item._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
                >
                  <div className="flex items-center gap-3">
                    <Search className={`opacity-50 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={18} />
                    <span className={`font-medium ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{item.pincode || item.query || 'N/A'}</span>
                    {item.areaName && <span className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{item.areaName}</span>}
                  </div>
                  <span className={`text-sm opacity-50 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : item.date || ''}</span>
                </motion.div>
              ))}
            </div>
          )}

          {/* Recently Viewed Tab */}
          {activeTab === 'recent' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  Recently Viewed ({recentlyViewed.length})
                </h3>
              </div>
              
              {recentlyViewed.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
                >
                  <div className="flex items-center gap-3">
                    <Eye className={`opacity-50 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={18} />
                    <div>
                      <span className={`font-medium ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{item.name}</span>
                      <span className={`text-sm opacity-50 ml-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                        • {item.type}
                      </span>
                    </div>
                  </div>
                  <span className={`text-sm opacity-50 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{item.date}</span>
                </motion.div>
              ))}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}>
                <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  Appearance
                </h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isDarkMode ? <Moon size={24} /> : <Sun size={24} />}
                    <div>
                      <p className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Dark Mode</p>
                      <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                        Toggle between light and dark theme
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`w-14 h-8 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-[#2563eb]' : 'bg-gray-300'}`}
                  >
                    <div className={`w-6 h-6 rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}>
                <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  Notifications
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Market Updates</p>
                      <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                        Get notified about market changes
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>Coming Soon</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Business Opportunities</p>
                      <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                        New opportunities in your areas
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>Coming Soon</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Forecast Updates</p>
                      <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                        Changes in demand forecasts
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>Coming Soon</span>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}>
                <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  Account
                </h3>
                
                <div className="space-y-4">
                  <div className={`w-full p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? 'border-[#334155] opacity-60' : 'border-[#e2e8f0] opacity-60'}`}>
                    <span className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Change Password</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>Coming Soon</span>
                  </div>
                  
                  <div className={`w-full p-4 rounded-xl border flex items-center justify-between ${isDarkMode ? 'border-[#334155] opacity-60' : 'border-[#e2e8f0] opacity-60'}`}>
                    <span className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Privacy Settings</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>Coming Soon</span>
                  </div>
                  
                  <button disabled className="w-full p-4 rounded-xl border flex items-center justify-between transition-colors hover:border-red-500 hover:text-red-500 opacity-60 cursor-not-allowed">
                    <span className="font-semibold text-red-500">Delete Account</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>Coming Soon</span>
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
