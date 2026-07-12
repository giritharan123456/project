import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { workspaceAPI, authAPI, historyAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';

const tabs = [
  { id: 'profile', label: 'My Profile', icon: '👤' },
  { id: 'favorites', label: 'My Favorites', icon: '⭐' },
  { id: 'history', label: 'Search History', icon: '🕐' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'password', label: 'Change Password', icon: '🔑' },
];

function Profile() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [favorites, setFavorites] = useState([]);
  const [favLoading, setFavLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    const loadHistory = async () => {
      if (activeTab !== 'history') return;
      setHistoryLoading(true);
      try {
        const res = await historyAPI.getHistory();
        if (res.success) setHistory(res.data || []);
      } catch (err) {
        toast.error('Failed to load search history');
      } finally {
        setHistoryLoading(false);
      }
    };
    loadHistory();
  }, [activeTab]);

  const clearHistory = async () => {
    try {
      await historyAPI.clearHistory();
      setHistory([]);
      toast.success('Search history cleared');
    } catch (err) {
      toast.error('Failed to clear history');
    }
  };

  useEffect(() => {
    const loadFavorites = async () => {
      if (activeTab !== 'favorites') return;
      setFavLoading(true);
      try {
        const res = await workspaceAPI.getFavorites();
        if (res.success) setFavorites(res.data || []);
      } catch (err) {
        toast.error('Failed to load favorites');
      } finally {
        setFavLoading(false);
      }
    };

    loadFavorites();
  }, [activeTab]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.updateProfile({ name, email });
      if (res.success) {
        localStorage.setItem('user', JSON.stringify(res.user));
        toast.success('Profile updated successfully');
      } else {
        toast.error(res.message || 'Failed to update profile');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.updateProfile({ password: newPassword, currentPassword });
      if (res.success) {
        toast.success('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(res.message || 'Failed to change password');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const b = (light, dark) => isDarkMode ? dark : light;

  const tabContent = (content) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {content}
    </motion.div>
  );

  return (
    <div className={`min-h-[calc(100vh-120px)] p-3 sm:p-4 lg:p-8 transition-colors ${b('bg-gray-50', 'bg-[#0f172a]')}`}>
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-lg sm:text-2xl font-bold mb-4 sm:mb-6 ${b('text-gray-900', 'text-white')}`}>My Account</h1>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Sidebar */}
          <div className="sm:w-64 flex-shrink-0">
              <div className={`rounded-xl border overflow-hidden ${b('bg-white border-gray-200', 'bg-[#1e293b] border-[#334155]')}`}>
              {/* User Card */}
              <div className={`px-3 py-2 sm:px-4 sm:py-3 border-b text-center ${b('border-gray-100', 'border-[#334155]')}`}>
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center text-white text-xl sm:text-2xl font-bold mb-2">
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <p className={`font-semibold text-sm truncate ${b('text-gray-900', 'text-white')}`}>{user?.name || 'User'}</p>
                <p className={`text-xs truncate ${b('text-gray-500', 'text-gray-400')}`}>{user?.email || ''}</p>
                {user?.role === 'admin' && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-100 text-amber-700">Admin</span>
                )}
              </div>
              {/* Tabs */}
              <div className="p-1.5 sm:p-2">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all text-left ${
                      activeTab === tab.id
                        ? (b('bg-blue-50 text-blue-700', 'bg-blue-900/30 text-blue-400'))
                        : (b('text-gray-600 hover:bg-gray-50', 'text-gray-400 hover:bg-[#0f172a]'))
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className={`rounded-xl border px-3 py-2 sm:px-4 sm:py-3 ${b('bg-white border-gray-200', 'bg-[#1e293b] border-[#334155]')}`}>
              {/* My Profile */}
              {activeTab === 'profile' && tabContent(
                <div>
                  <h2 className={`text-lg font-bold mb-4 ${b('text-gray-900', 'text-white')}`}>My Profile</h2>
                  <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${b('text-gray-700', 'text-gray-300')}`}>Name</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#2563eb]/40 ${b('bg-white border-gray-300 text-gray-900', 'bg-[#0f172a] border-[#334155] text-gray-100')}`} />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${b('text-gray-700', 'text-gray-300')}`}>Email</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#2563eb]/40 ${b('bg-white border-gray-300 text-gray-900', 'bg-[#0f172a] border-[#334155] text-gray-100')}`} />
                    </div>
                    <button type="submit" disabled={loading}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>
              )}

              {/* My Favorites */}
              {activeTab === 'favorites' && tabContent(
                <div>
                  <h2 className={`text-lg font-bold mb-4 ${b('text-gray-900', 'text-white')}`}>My Favorites</h2>
                  {favLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]"></div>
                    </div>
                  ) : favorites.length === 0 ? (
                    <div className={`text-center py-12 ${b('text-gray-500', 'text-gray-400')}`}>
                      <p className="text-4xl mb-3">⭐</p>
                      <p className="font-medium mb-2">No favorites yet</p>
                      <p className="text-sm mb-4">Save areas you're interested in for quick access</p>
                      <Link to="/dashboard" className="inline-block px-4 py-2 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-lg text-sm font-medium">Browse Areas</Link>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {favorites.map((fav, i) => (
                        <Link key={i} to={`/area-overview/${fav.pincode || fav.id}`} className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border no-underline ${b('bg-white border-gray-200 hover:bg-gray-50', 'bg-[#0f172a] border-[#334155] hover:bg-[#0f172a]/80')}`}>
                          <div className="min-w-0">
                            <p className={`font-medium text-sm ${b('text-gray-900', 'text-white')}`}>{fav.name || 'Area'}</p>
                            <p className={`text-xs ${b('text-gray-500', 'text-gray-400')}`}>{fav.pincode || ''} - {fav.district || ''}</p>
                          </div>
                          <span className={b('text-gray-400', 'text-gray-500')}>→</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Search History */}
              {activeTab === 'history' && tabContent(
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-lg font-bold ${b('text-gray-900', 'text-white')}`}>Search History</h2>
                    {history.length > 0 && (
                      <button onClick={clearHistory}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                          b('text-red-600 hover:bg-red-50', 'text-red-400 hover:bg-red-900/20')
                        }`}>
                        Clear All
                      </button>
                    )}
                  </div>
                  {historyLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]"></div>
                    </div>
                  ) : history.length === 0 ? (
                    <div className={`text-center py-12 ${b('text-gray-500', 'text-gray-400')}`}>
                      <p className="text-4xl mb-3">🕐</p>
                      <p className="font-medium mb-1">No search history</p>
                      <p className="text-sm">Your recent searches will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {history.map((item, i) => (
                        <div key={item._id || i}
                          className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border transition-colors ${
                            b('bg-white border-gray-200 hover:bg-gray-50', 'bg-[#0f172a] border-[#334155] hover:bg-[#0f172a]/80')
                          }`}>
                          <span className="text-lg">
                            {item.type === 'pincode' ? '📍' : item.type === 'district' ? '🗺️' : item.type === 'category' ? '📊' : '🔍'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${b('text-gray-900', 'text-white')}`}>{item.query}</p>
                            <div className="flex items-center gap-2 text-xs">
                              {item.district && <span className={b('text-gray-500', 'text-gray-400')}>{item.district}</span>}
                              {item.pincode && <span className={b('text-gray-500', 'text-gray-400')}>{item.pincode}</span>}
                              {item.category && <span className={b('text-gray-500', 'text-gray-400')}>{item.category}</span>}
                              <span className={b('text-gray-400', 'text-gray-500')}>
                                {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Settings */}
              {activeTab === 'settings' && tabContent(
                <div>
                  <h2 className={`text-lg font-bold mb-4 ${b('text-gray-900', 'text-white')}`}>Settings</h2>
                  <div className={`p-4 rounded-lg border ${b('bg-gray-50 border-gray-200', 'bg-[#0f172a] border-[#334155]')}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium text-sm ${b('text-gray-900', 'text-white')}`}>Dark Mode</p>
                        <p className={`text-xs ${b('text-gray-500', 'text-gray-400')}`}>{isDarkMode ? 'Dark theme active' : 'Light theme active'}</p>
                      </div>
                      <button onClick={toggleTheme} className={`relative w-12 h-6 rounded-full transition-colors ${isDarkMode ? 'bg-[#2563eb]' : 'bg-gray-300'}`}>
                        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Change Password */}
              {activeTab === 'password' && tabContent(
                <div>
                  <h2 className={`text-lg font-bold mb-4 ${b('text-gray-900', 'text-white')}`}>Change Password</h2>
                  {user?.googleId && !user?.password ? (
                    <div className={`p-4 rounded-lg ${b('bg-amber-50 text-amber-700', 'bg-amber-900/20 text-amber-400')} text-sm`}>
                      You signed in with Google. Set a password to enable password login.
                    </div>
                  ) : null}
                  <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                    {user?.password ? (
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${b('text-gray-700', 'text-gray-300')}`}>Current Password</label>
                        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required
                          className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#2563eb]/40 ${b('bg-white border-gray-300 text-gray-900', 'bg-[#0f172a] border-[#334155] text-gray-100')}`} />
                      </div>
                    ) : null}
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${b('text-gray-700', 'text-gray-300')}`}>New Password</label>
                      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8}
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#2563eb]/40 ${b('bg-white border-gray-300 text-gray-900', 'bg-[#0f172a] border-[#334155] text-gray-100')}`} />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${b('text-gray-700', 'text-gray-300')}`}>Confirm New Password</label>
                      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#2563eb]/40 ${b('bg-white border-gray-300 text-gray-900', 'bg-[#0f172a] border-[#334155] text-gray-100')}`} />
                    </div>
                    <button type="submit" disabled={loading}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
