import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

function RealTimeDashboard({ data, onUpdate }) {
  const { isDarkMode } = useTheme();
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLastUpdated(new Date());
    setIsRefreshing(false);
    if (onUpdateRef.current) {
      onUpdateRef.current();
    }
  }, []);

  useEffect(() => {
    let intervalId;
    if (isAutoRefresh) {
      intervalId = setInterval(handleRefresh, refreshInterval * 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAutoRefresh, refreshInterval, handleRefresh]);

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
      className={`p-4 sm:p-6 rounded-xl border mb-6 transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-[#ffffff] border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isAutoRefresh ? 'bg-emerald-500/20' : 'bg-gray-500/20'}`}>
            <span className={`w-2 h-2 rounded-full ${isAutoRefresh ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`}></span>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              {isAutoRefresh ? 'Live Updates' : 'Paused'}
            </span>
          </div>
          <span className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Last updated: {getTimeSinceUpdate()}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            className={`px-3 py-2 border-2 rounded-lg text-sm transition-all duration-300 outline-none cursor-pointer ${isDarkMode ? 'bg-[#0f172a] border-[#334155] text-[#f1f5f9] focus:border-[#2563eb]' : 'bg-[#f8fafc] border-[#e2e8f0] text-[#1e293b] focus:border-[#2563eb]'}`}
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
            className={`px-3 py-2 border-2 rounded-lg text-lg transition-all duration-300 ${isAutoRefresh ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : `${isDarkMode ? 'bg-[#0f172a] border-[#334155] text-[#f1f5f9] hover:border-[#2563eb]' : 'bg-[#f8fafc] border-[#e2e8f0] text-[#1e293b] hover:border-[#2563eb]'}`}`}
            onClick={handleToggleRefresh}
            aria-label={isAutoRefresh ? 'Pause auto-refresh' : 'Enable auto-refresh'}
          >
            {isAutoRefresh ? '⏸' : '▶'}
          </button>
          
          <button 
            className={`px-3 py-2 border-2 rounded-lg text-lg transition-all duration-300 ${isDarkMode ? 'bg-[#0f172a] border-[#334155] text-[#f1f5f9] hover:border-[#2563eb] hover:rotate-180' : 'bg-[#f8fafc] border-[#e2e8f0] text-[#1e293b] hover:border-[#2563eb] hover:rotate-180'} ${isRefreshing ? 'animate-spin' : ''}`}
            onClick={handleRefresh}
            disabled={isRefreshing}
            aria-label="Refresh now"
          >
            🔄
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4">
        <div className={`p-4 rounded-lg border text-center ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
          <span className={`block text-xs font-semibold mb-2 opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Data Points</span>
          <span className={`block text-2xl font-bold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent`}>{data?.length || 0}</span>
        </div>
        <div className={`p-4 rounded-lg border text-center ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
          <span className={`block text-xs font-semibold mb-2 opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Update Rate</span>
          <span className={`block text-2xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{isAutoRefresh ? `${refreshInterval}s` : 'Manual'}</span>
        </div>
        <div className={`p-4 rounded-lg border text-center ${isDarkMode ? 'bg-[#0f172a] border-[#334155]' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
          <span className={`block text-xs font-semibold mb-2 opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Status</span>
          <span className={`block text-2xl font-bold ${isAutoRefresh ? 'text-emerald-500' : 'text-gray-500'}`}>
            {isAutoRefresh ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default RealTimeDashboard;
