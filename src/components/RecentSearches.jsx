import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const RecentSearches = ({ searches, onSearch, onClear }) => {
  const { isDarkMode } = useTheme();

  if (!searches || searches.length === 0) {
    return null;
  }

  return (
    <div className={`p-4 rounded-xl border mb-4 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}>
      <div className="flex justify-between items-center mb-3">
        <h4 className={`text-sm font-semibold flex items-center gap-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
          <Clock size={16} />
          Recent Searches
        </h4>
        <button
          onClick={onClear}
          className={`text-xs px-2 py-1 rounded-lg transition-colors ${isDarkMode ? 'text-[#f1f5f9] hover:bg-white/10' : 'text-[#1e293b] hover:bg-black/5'}`}
        >
          Clear All
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {searches.slice(0, 5).map((search, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => onSearch(search)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${isDarkMode ? 'bg-[#0f172a] border-[#334155] text-[#f1f5f9] hover:border-[#2563eb]' : 'bg-[#f8fafc] border-[#e2e8f0] text-[#1e293b] hover:border-[#2563eb]'}`}
          >
            {search}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
