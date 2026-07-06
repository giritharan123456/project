import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Sun, Moon, User, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function WelcomeHeader() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const getGreeting = () => {
    const h = time.getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = () => {
    return time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
  };

  const userName = user?.name || user?.email?.split('@')[0] || 'Guest';

  return (
    <motion.header
      className={`sticky top-0 z-40 border-b-2 transition-colors ${
        isDarkMode ? 'bg-[#1e293b] border-blue-500/30' : 'bg-white border-blue-200'
      }`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Greeting */}
          <div className="flex items-center gap-3 min-w-0">
            <div className={`hidden sm:flex items-center justify-center w-10 h-10 rounded-xl ${
              isDarkMode ? 'bg-blue-900/40' : 'bg-blue-50'
            }`}>
              <User size={20} className="text-blue-600" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm md:text-base font-extrabold tracking-tight truncate">
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  {getGreeting()}, {userName}
                </span>
              </h1>
              <div className="flex items-center gap-2 text-[10px] md:text-xs">
                <span className={`font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  MarketVision AI Dashboard
                </span>
                <span className={`hidden sm:inline ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>|</span>
                <span className={`hidden sm:flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  <Clock size={10} />
                  {formatDate()}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotif(!showNotif)}
                className={`relative p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-[#0f172a] text-slate-300' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              {showNotif && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`absolute right-0 top-full mt-2 w-72 rounded-xl border-2 shadow-xl z-50 overflow-hidden ${
                    isDarkMode ? 'bg-[#1e293b] border-[#475569]' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className={`p-3 border-b-2 ${isDarkMode ? 'border-[#475569]' : 'border-slate-100'}`}>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-4 text-center">
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>No new notifications</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setShowNotif(false); navigate('/notifications'); }}
                    className={`w-full p-2.5 text-xs font-bold text-center transition-colors ${
                      isDarkMode ? 'text-blue-400 hover:bg-[#0f172a]' : 'text-blue-600 hover:bg-slate-50'
                    }`}
                  >
                    View All Notifications
                  </button>
                </motion.div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-[#0f172a] text-amber-400' : 'hover:bg-slate-100 text-slate-600'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
