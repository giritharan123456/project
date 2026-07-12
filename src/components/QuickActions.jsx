import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, RefreshCw, GitCompare, Filter, Map } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function QuickActions({ onRefresh }) {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const actions = [
    { icon: GitCompare, label: 'Compare', color: 'from-blue-500 to-blue-600', onClick: () => navigate('/comparison') },
    { icon: BarChart3, label: 'Analytics', color: 'from-violet-500 to-violet-600', onClick: () => navigate('/analytics') },
    { icon: Map, label: 'Map View', color: 'from-emerald-500 to-emerald-600', onClick: () => navigate('/analysis') },
    { icon: RefreshCw, label: 'Refresh', color: 'from-rose-500 to-rose-600', onClick: onRefresh },
    { icon: Filter, label: 'Forecast', color: 'from-cyan-500 to-cyan-600', onClick: () => navigate('/forecast') },
  ];

  return (
    <div className="flex gap-1 sm:gap-1.5">
      {actions.map((action, i) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.04 }}
          onClick={action.onClick}
          title={action.label}
          className={`flex items-center gap-1 px-2.5 py-1.5 min-h-[44px] rounded-lg text-[10px] sm:text-xs font-bold transition-all duration-200 whitespace-nowrap ${
            isDarkMode
              ? 'bg-[#0f172a] border border-[#475569] text-slate-300 hover:border-blue-500 hover:text-blue-400'
              : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600'
          }`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <action.icon size={14} />
          <span className="hidden sm:inline">{action.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
