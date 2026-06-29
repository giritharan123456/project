import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Clock, X } from 'lucide-react';

const RecentSearches = ({ searches, onSearch, onClear }) => {
  const { isDarkMode } = useTheme();

  if (!searches || searches.length === 0) {
    return null;
  }

  return (
    <div className={`p-4 rounded-xl border mb-4 ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}>
      <div className="flex justify-between items-center mb-3">
        <h4 className={`text-sm font-semibold flex items-center gap-2 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
          <Clock size={16} />
          Recent Searches
        </h4>
        <button
          onClick={onClear}
          className={`text-xs px-2 py-1 rounded-lg transition-colors ${isDarkMode ? 'text-text-dark hover:bg-white/10' : 'text-text-light hover:bg-black/5'}`}
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
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${isDarkMode ? 'bg-bg-dark border-border-dark text-text-dark hover:border-primary-blue' : 'bg-bg-light border-border-light text-text-light hover:border-primary-blue'}`}
          >
            {search}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
