import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const AnimatedCard = ({ children, hoverEffect = true, expandable = false, isExpanded = false, onClick }) => {
  const { isDarkMode } = useTheme();

  const glassStyle = {
    background: isDarkMode 
      ? 'rgba(30, 41, 59, 0.7)' 
      : 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    boxShadow: isDarkMode 
      ? '0 8px 32px 0 rgba(0, 0, 0, 0.3)' 
      : '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  };

  const hoverProps = hoverEffect ? {
    whileHover: { 
      y: -5,
      boxShadow: isDarkMode 
        ? '0 0 20px rgba(124, 58, 237, 0.3)' 
        : '0 0 20px rgba(37, 99, 235, 0.2)'
    }
  } : {};

  return (
    <motion.div
      style={glassStyle}
      className={`rounded-xl overflow-hidden transition-colors duration-300 ${isDarkMode ? 'text-text-dark' : 'text-text-light'} ${expandable ? 'cursor-pointer' : ''}`}
      {...hoverProps}
      layout
      onClick={onClick}
    >
      <div className="p-6">
        {children}
      </div>
    </motion.div>
  );
};

export default AnimatedCard;
