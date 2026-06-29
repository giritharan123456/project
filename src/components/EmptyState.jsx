import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Search, FileText, AlertCircle } from 'lucide-react';

const EmptyState = ({ type = 'noData', message = '', actionText = '', onAction = null }) => {
  const { isDarkMode } = useTheme();
  
  const config = {
    noData: {
      icon: <FileText size={64} />,
      title: 'No Data Found',
      defaultMessage: 'We couldn\'t find any data matching your criteria. Try adjusting your filters or search terms.'
    },
    noResults: {
      icon: <Search size={64} />,
      title: 'No Results Found',
      defaultMessage: 'No results match your search. Try different keywords or check your spelling.'
    },
    error: {
      icon: <AlertCircle size={64} />,
      title: 'Something Went Wrong',
      defaultMessage: 'An error occurred while loading data. Please try again later.'
    }
  };

  const { icon, title, defaultMessage } = config[type] || config.noData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center p-12 rounded-2xl ${
        isDarkMode ? 'bg-[#1e293b]' : 'bg-[#ffffff]'
      }`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className={`p-6 rounded-full mb-6 ${
          isDarkMode ? 'bg-white/5' : 'bg-black/5'
        }`}
      >
        <div className={`text-[#2563eb] opacity-50`}>
          {icon}
        </div>
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`text-2xl font-semibold mb-3 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}
      >
        {title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`text-center max-w-md mb-6 ${isDarkMode ? 'text-[#f1f5f9] opacity-70' : 'text-[#1e293b] opacity-70'}`}
      >
        {message || defaultMessage}
      </motion.p>
      
      {actionText && onAction && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={onAction}
          className="px-6 py-3 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          {actionText}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;
