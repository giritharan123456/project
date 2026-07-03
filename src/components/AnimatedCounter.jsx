import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

const AnimatedCounter = ({ value, duration = 2, decimals = 0, prefix = '', suffix = '' }) => {
  const { isDarkMode } = useTheme();
  const [count, setCount] = useState(0);
  const targetValue = (typeof value === 'number' && !isNaN(value)) ? value : 0;

  useEffect(() => {
    let startTime;
    setCount(0);
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = easeOutQuart * targetValue;
      
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(targetValue);
      }
    };
    
    requestAnimationFrame(animate);
  }, [targetValue, duration]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}
    >
      {prefix}{decimals > 0 ? count.toFixed(decimals) : Math.round(count).toLocaleString()}{suffix}
    </motion.span>
  );
};

export default AnimatedCounter;
