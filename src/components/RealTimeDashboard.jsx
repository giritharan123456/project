import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

function RealTimeDashboard({ data, onUpdate }) {
  const { isDarkMode } = useTheme();
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let intervalId;

    if (isAutoRefresh) {
      intervalId = setInterval(() => {
        handleRefresh();
      }, refreshInterval * 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAutoRefresh, refreshInterval]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate data refresh - in production, this would call an API
    await new Promise(resolve => setTimeout(resolve, 500));
    setLastUpdated(new Date());
    setIsRefreshing(false);
    
    if (onUpdate) {
      onUpdate();
    }
  };

  const handleToggleRefresh = () => {
    setIsAutoRefresh(!isAutoRefresh);
  };

  const handleIntervalChange = (e) => {
    setRefreshInterval(parseInt(e.target.value));
  };

  const getTimeSinceUpdate = () => {
    const now = new Date();
    const diff = Math.floor((now - lastUpdated) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <motion.div 
      className={`p-6 rounded-xl border mb-6 transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-card-light border-border-light shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isAutoRefresh ? 'bg-emerald-500/20' : 'bg-gray-500/20'}`}>
            <span className={`w-2 h-2 rounded-full ${isAutoRefresh ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`}></span>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
              {isAutoRefresh ? 'Live Updates' : 'Paused'}
            </span>
          </div>
          <span className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Last updated: {getTimeSinceUpdate()}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            className={`px-3 py-2 border-2 rounded-lg text-sm transition-all duration-300 outline-none cursor-pointer ${isDarkMode ? 'bg-bg-dark border-border-dark text-text-dark focus:border-primary-blue' : 'bg-bg-light border-border-light text-text-light focus:border-primary-blue'}`}
            value={refreshInterval}
            onChange={handleIntervalChange}
          >
            <option value={15}>15s</option>
            <option value={30}>30s</option>
            <option value={60}>1m</option>
            <option value={120}>2m</option>
            <option value={300}>5m</option>
          </select>
          
          <button 
            className={`px-3 py-2 border-2 rounded-lg text-lg transition-all duration-300 ${isAutoRefresh ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : `${isDarkMode ? 'bg-bg-dark border-border-dark text-text-dark hover:border-primary-blue' : 'bg-bg-light border-border-light text-text-light hover:border-primary-blue'}`}`}
            onClick={handleToggleRefresh}
            aria-label={isAutoRefresh ? 'Pause auto-refresh' : 'Enable auto-refresh'}
          >
            {isAutoRefresh ? '⏸' : '▶'}
          </button>
          
          <button 
            className={`px-3 py-2 border-2 rounded-lg text-lg transition-all duration-300 ${isDarkMode ? 'bg-bg-dark border-border-dark text-text-dark hover:border-primary-blue hover:rotate-180' : 'bg-bg-light border-border-light text-text-light hover:border-primary-blue hover:rotate-180'} ${isRefreshing ? 'animate-spin' : ''}`}
            onClick={handleRefresh}
            disabled={isRefreshing}
            aria-label="Refresh now"
          >
            🔄
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
        <div className={`p-4 rounded-lg border text-center ${isDarkMode ? 'bg-bg-dark border-border-dark' : 'bg-bg-light border-border-light'}`}>
          <span className={`block text-xs font-semibold mb-2 opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Data Points</span>
          <span className={`block text-2xl font-bold bg-gradient-to-r from-primary-blue to-primary-purple bg-clip-text text-transparent`}>{data?.length || 0}</span>
        </div>
        <div className={`p-4 rounded-lg border text-center ${isDarkMode ? 'bg-bg-dark border-border-dark' : 'bg-bg-light border-border-light'}`}>
          <span className={`block text-xs font-semibold mb-2 opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Update Rate</span>
          <span className={`block text-2xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{isAutoRefresh ? `${refreshInterval}s` : 'Manual'}</span>
        </div>
        <div className={`p-4 rounded-lg border text-center ${isDarkMode ? 'bg-bg-dark border-border-dark' : 'bg-bg-light border-border-light'}`}>
          <span className={`block text-xs font-semibold mb-2 opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Status</span>
          <span className={`block text-2xl font-bold ${isAutoRefresh ? 'text-emerald-500' : 'text-gray-500'}`}>
            {isAutoRefresh ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default RealTimeDashboard;
