import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

const Tooltip = ({ content, children, position = 'top' }) => {
  const { isDarkMode } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-flex items-center gap-1 cursor-help"
      >
        {children}
        <Info size={14} className={`opacity-50 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`} />
      </div>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`absolute ${positionClasses[position]} w-64 p-3 rounded-lg shadow-lg z-50 ${
              isDarkMode ? 'bg-card-dark border-border-dark border' : 'bg-card-light border-border-light border'
            }`}
          >
            <p className={`text-sm ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
              {content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
