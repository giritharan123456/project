import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

function About() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-[calc(100vh-70px)] p-12 transition-colors duration-300 ${isDarkMode ? 'bg-bg-dark' : 'bg-bg-light'}`}>
      <div className={`max-w-[900px] mx-auto p-10 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-card-light border-border-light shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}>
        <motion.h1
          className={`text-[2.5rem] mb-2 font-extrabold bg-gradient-to-r from-primary-blue to-primary-purple bg-clip-text text-transparent ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About
        </motion.h1>
        <motion.p 
          className={`text-lg mb-8 opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Tamil Nadu Market Gap Finder Project
        </motion.p>
        
        <div className="flex flex-col gap-8">
          <motion.div 
            className={`p-6 rounded-xl border border-l-4 transition-all duration-300 ${isDarkMode ? 'bg-bg-dark border-border-dark border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-bg-light border-border-light border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ x: 5 }}
          >
            <h2 className={`text-2xl mb-4 font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Problem Statement</h2>
            <p className={`leading-relaxed m-0 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
              Entrepreneurs and franchise companies often struggle to identify where demand exists 
              but competition is low. Most business decisions are based on assumptions rather than data.
            </p>
          </motion.div>

          <motion.div 
            className={`p-6 rounded-xl border border-l-4 transition-all duration-300 ${isDarkMode ? 'bg-bg-dark border-border-dark border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-bg-light border-border-light border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ x: 5 }}
          >
            <h2 className={`text-2xl mb-4 font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Solution</h2>
            <p className={`leading-relaxed m-0 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
              Build a data analytics platform that analyzes business density, population, and demand 
              indicators across Tamil Nadu pincodes to identify underserved business opportunities.
            </p>
          </motion.div>

          <motion.div 
            className={`p-6 rounded-xl border border-l-4 transition-all duration-300 ${isDarkMode ? 'bg-bg-dark border-border-dark border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-bg-light border-border-light border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ x: 5 }}
          >
            <h2 className={`text-2xl mb-4 font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Features</h2>
            <ul className="list-none p-0 m-0">
              <li className={`py-2 pl-6 relative ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Pincode-wise opportunity analysis</li>
              <li className={`py-2 pl-6 relative ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Category-wise competitor count</li>
              <li className={`py-2 pl-6 relative ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Demand forecasting</li>
              <li className={`py-2 pl-6 relative ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Market gap score calculation</li>
              <li className={`py-2 pl-6 relative ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Interactive heat maps</li>
              <li className={`py-2 pl-6 relative ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>District and business category filters</li>
              <li className={`py-2 pl-6 relative ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Exportable CSV reports</li>
            </ul>
          </motion.div>

          <motion.div 
            className={`p-6 rounded-xl border border-l-4 transition-all duration-300 ${isDarkMode ? 'bg-bg-dark border-border-dark border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-bg-light border-border-light border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ x: 5 }}
          >
            <h2 className={`text-2xl mb-4 font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Covered Districts</h2>
            <div className="flex flex-wrap gap-3">
              <motion.span 
                className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-transform duration-300 ${isDarkMode ? 'bg-card-dark text-text-dark border border-border-dark' : 'bg-card-light text-text-light border border-border-light'}`}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Chennai
              </motion.span>
              <motion.span 
                className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-transform duration-300 ${isDarkMode ? 'bg-card-dark text-text-dark border border-border-dark' : 'bg-card-light text-text-light border border-border-light'}`}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Coimbatore
              </motion.span>
              <motion.span 
                className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-transform duration-300 ${isDarkMode ? 'bg-card-dark text-text-dark border border-border-dark' : 'bg-card-light text-text-light border border-border-light'}`}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Madurai
              </motion.span>
              <motion.span 
                className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-transform duration-300 ${isDarkMode ? 'bg-card-dark text-text-dark border border-border-dark' : 'bg-card-light text-text-light border border-border-light'}`}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Tiruchirappalli
              </motion.span>
              <motion.span 
                className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-transform duration-300 ${isDarkMode ? 'bg-card-dark text-text-dark border border-border-dark' : 'bg-card-light text-text-light border border-border-light'}`}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Salem
              </motion.span>
              <motion.span 
                className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-transform duration-300 ${isDarkMode ? 'bg-card-dark text-text-dark border border-border-dark' : 'bg-card-light text-text-light border border-border-light'}`}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Erode
              </motion.span>
            </div>
          </motion.div>

          <motion.div 
            className="mt-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link to="/dashboard" className="inline-block bg-gradient-to-r from-primary-blue to-primary-purple text-white py-4 px-10 rounded-full no-underline font-bold text-lg transition-all duration-300 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] active:-translate-y-0.5">
              Explore Dashboard
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default About;
