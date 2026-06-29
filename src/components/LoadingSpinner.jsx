import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const { isDarkMode } = useTheme();
  
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        className={`rounded-full border-4 border-t-transparent ${sizeClasses[size]} ${
          isDarkMode ? 'border-primary-blue' : 'border-primary-blue'
        }`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`mt-4 text-sm font-medium ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
