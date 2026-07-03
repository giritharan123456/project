import React, { memo, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { notificationsAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/analysis', label: 'Analysis', icon: '🔍' },
  { path: '/forecast', label: 'Forecast', icon: '📈' },
  { path: '/comparison', label: 'Compare', icon: '⚖️' },
  { path: '/ai-recommendations', label: 'AI Insights', icon: '🤖' },
  { path: '/reports', label: 'Reports', icon: '📋' },
  { path: '/about', label: 'About', icon: 'ℹ️' },
  { path: '/category-explorer', label: 'Explorer', icon: '🔬' },
  { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { path: '/matrix', label: 'Matrix', icon: '📐' },
  { path: '/investment-estimator', label: 'Invest', icon: '💰' },
];

function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const userMenuRef = useRef(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchNotifCount = async () => {
      try {
        const res = await notificationsAPI.getAll({ limit: 1 });
        if (res.success && res.unreadCount) setNotifCount(res.unreadCount);
      } catch (err) { console.error('Failed to fetch notifications:', err); }
    };
    if (user) fetchNotifCount();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeMenus = () => {
    setShowUserMenu(false);
    setShowMobileNav(false);
  };

  const b = (light, dark) => isDarkMode ? dark : light;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${b('bg-white/95 shadow-sm border-b border-gray-200', 'bg-[#0f172a]/95 shadow-lg border-b border-[#1e293b]')}`}>
      {/* Top Bar */}
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-16 gap-4">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 no-underline flex-shrink-0" onClick={closeMenus}>
            <span className="text-2xl">🇮🇳</span>
            <span className="text-lg lg:text-xl font-bold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent whitespace-nowrap">
              MarketVision AI
            </span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-4">
            <div className="flex w-full rounded-lg overflow-hidden border focus-within:ring-2 focus-within:ring-[#2563eb]/40 transition-shadow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pincode, area, or category..."
                className={`flex-1 px-4 py-2 text-sm outline-none border-none ${b('bg-gray-50 text-gray-900 placeholder-gray-400', 'bg-[#1e293b] text-gray-100 placeholder-gray-500')}`}
              />
              <button type="submit" className={`px-4 py-2 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white text-sm font-medium hover:opacity-90 transition-opacity`}>
                Search
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Mobile Search Toggle */}
            <button onClick={() => setShowMobileNav(!showMobileNav)} className={`md:hidden p-2 rounded-lg ${b('hover:bg-gray-100 text-gray-700', 'hover:bg-[#1e293b] text-gray-300')}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>

            {/* Theme Toggle */}
            <button onClick={toggleTheme} className={`p-2 rounded-lg text-lg ${b('hover:bg-gray-100', 'hover:bg-[#1e293b]')}`} aria-label="Toggle theme">
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {/* Notifications */}
            <Link to="/notifications" className={`relative p-2 rounded-lg ${b('hover:bg-gray-100', 'hover:bg-[#1e293b]')}`}>
              <span className="text-lg">🔔</span>
              {notifCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {notifCount > 9 ? '9+' : notifCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setShowUserMenu(!showUserMenu)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${b('hover:bg-gray-100 border border-gray-200', 'hover:bg-[#1e293b] border border-[#1e293b]')}`}>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center text-white text-xs font-bold">
                    {(user.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className={`hidden lg:block text-sm font-medium max-w-[100px] truncate ${b('text-gray-700', 'text-gray-200')}`}>
                    {user.name || 'User'}
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''} ${b('text-gray-500', 'text-gray-400')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl border overflow-hidden ${b('bg-white border-gray-200', 'bg-[#1e293b] border-[#334155]')}`}>
                      <div className={`px-4 py-3 border-b ${b('border-gray-100', 'border-[#334155]')}`}>
                        <p className={`text-sm font-semibold ${b('text-gray-900', 'text-white')}`}>{user.name || 'User'}</p>
                        <p className={`text-xs ${b('text-gray-500', 'text-gray-400')}`}>{user.email || ''}</p>
                      </div>
                      <div className="py-1">
                        <Link to="/profile" onClick={closeMenus} className={`flex items-center gap-3 px-4 py-2.5 text-sm ${b('text-gray-700 hover:bg-gray-50', 'text-gray-300 hover:bg-[#0f172a]')}`}><span>👤</span> My Profile</Link>
                        <Link to="/workspace" onClick={closeMenus} className={`flex items-center gap-3 px-4 py-2.5 text-sm ${b('text-gray-700 hover:bg-gray-50', 'text-gray-300 hover:bg-[#0f172a]')}`}><span>⭐</span> My Favorites</Link>
                        <Link to="/notifications" onClick={closeMenus} className={`flex items-center gap-3 px-4 py-2.5 text-sm ${b('text-gray-700 hover:bg-gray-50', 'text-gray-300 hover:bg-[#0f172a]')}`}><span>🔔</span> Notifications</Link>
                        {isAdmin && (
                          <Link to="/admin" onClick={closeMenus} className={`flex items-center gap-3 px-4 py-2.5 text-sm ${b('text-amber-600 hover:bg-amber-50', 'text-amber-400 hover:bg-[#0f172a]')}`}><span>⚙️</span> Admin Panel</Link>
                        )}
                        <hr className={`my-1 ${b('border-gray-100', 'border-[#334155]')}`} />
                        <button onClick={() => { closeMenus(); handleLogout(); }} className={`flex items-center gap-3 px-4 py-2.5 text-sm w-full text-left ${b('text-red-600 hover:bg-red-50', 'text-red-400 hover:bg-[#0f172a]')}`}><span>🚪</span> Logout</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className={`px-3 py-1.5 text-sm font-medium rounded-lg ${b('text-gray-700 hover:bg-gray-100', 'text-gray-300 hover:bg-[#1e293b]')}`}>Login</Link>
                <Link to="/signup" className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search (visible only when toggled) */}
      <AnimatePresence>
        {showMobileNav && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className={`md:hidden overflow-hidden border-t ${b('border-gray-200 bg-white', 'border-[#1e293b] bg-[#0f172a]')}`}>
            <div className="p-4">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="flex rounded-lg overflow-hidden border">
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search pincode, area..." className={`flex-1 px-4 py-2 text-sm outline-none ${b('bg-gray-50 text-gray-900', 'bg-[#1e293b] text-gray-100')}`} />
                  <button type="submit" className="px-4 py-2 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white text-sm">Go</button>
                </div>
              </form>
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map(link => (
                  <Link key={link.path} to={link.path} onClick={closeMenus} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${b('text-gray-700 hover:bg-gray-100', 'text-gray-300 hover:bg-[#1e293b]')} ${location.pathname === link.path ? (b('bg-blue-50 text-blue-700', 'bg-blue-900/20 text-blue-400')) : ''}`}>
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Secondary Navigation */}
      <div className={`hidden md:block border-t ${b('border-gray-100 bg-gray-50/50', 'border-[#1e293b] bg-[#0f172a]/50')}`}>
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-hide">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap no-underline transition-colors ${
                location.pathname === link.path
                  ? (b('bg-blue-100 text-blue-700', 'bg-blue-900/30 text-blue-400'))
                  : (b('text-gray-600 hover:text-gray-900 hover:bg-gray-100', 'text-gray-400 hover:text-gray-200 hover:bg-[#1e293b]'))
              }`}>
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
            <Link to="/analytics" className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap no-underline transition-colors ${
              location.pathname === '/analytics'
                ? (b('bg-blue-100 text-blue-700', 'bg-blue-900/30 text-blue-400'))
                : (b('text-gray-600 hover:text-gray-900 hover:bg-gray-100', 'text-gray-400 hover:text-gray-200 hover:bg-[#1e293b]'))
            }`}>
              <span>📊</span><span>Analytics</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default memo(Navbar);
