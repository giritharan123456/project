import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

function Reports() {
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
          📋 Reports
        </motion.h1>
        <motion.p 
          className={`text-lg mb-8 opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Export and download comprehensive market gap analysis reports
        </motion.p>
        
        <div className="flex flex-col gap-8">
          <motion.div 
            className={`p-6 rounded-xl border border-l-4 transition-all duration-300 ${isDarkMode ? 'bg-bg-dark border-border-dark border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-bg-light border-border-light border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ x: 5 }}
          >
            <h2 className={`text-2xl mb-4 font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Export Features</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
              <motion.div 
                className={`p-6 rounded-xl border backdrop-blur-xl transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)] hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-card-light border-border-light shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
                whileHover={{ scale: 1.05, y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-4xl mb-3">📊</div>
                <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Pincode Analysis</h3>
                <p className={`text-sm opacity-80 m-0 leading-relaxed ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Detailed pincode-wise market gap data with competitor counts and demand scores</p>
              </motion.div>
              <motion.div 
                className={`p-6 rounded-xl border backdrop-blur-xl transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)] hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-card-light border-border-light shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
                whileHover={{ scale: 1.05, y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-4xl mb-3">📈</div>
                <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Demand Forecasting</h3>
                <p className={`text-sm opacity-80 m-0 leading-relaxed ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Current and projected demand data based on population growth trends</p>
              </motion.div>
              <motion.div 
                className={`p-6 rounded-xl border backdrop-blur-xl transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)] hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-card-light border-border-light shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
                whileHover={{ scale: 1.05, y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-4xl mb-3">🗺️</div>
                <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Geographic Data</h3>
                <p className={`text-sm opacity-80 m-0 leading-relaxed ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Location coordinates and geographic distribution of market opportunities</p>
              </motion.div>
              <motion.div 
                className={`p-6 rounded-xl border backdrop-blur-xl transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)] hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-card-light border-border-light shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
                whileHover={{ scale: 1.05, y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-4xl mb-3">👥</div>
                <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Demographics</h3>
                <p className={`text-sm opacity-80 m-0 leading-relaxed ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Population data, growth rates, and income level classifications</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className={`p-6 rounded-xl border border-l-4 transition-all duration-300 ${isDarkMode ? 'bg-bg-dark border-border-dark border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-bg-light border-border-light border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ x: 5 }}
          >
            <h2 className={`text-2xl mb-4 font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Report Contents</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
              <motion.div 
                className={`p-4 rounded-lg border transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark hover:-translate-y-1' : 'bg-card-light border-border-light hover:-translate-y-1'}`}
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className={`block font-bold text-sm mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Pincode</span>
                <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Postal code identifier</span>
              </motion.div>
              <motion.div 
                className={`p-4 rounded-lg border transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark hover:-translate-y-1' : 'bg-card-light border-border-light hover:-translate-y-1'}`}
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className={`block font-bold text-sm mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Area</span>
                <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Location name</span>
              </motion.div>
              <motion.div 
                className={`p-4 rounded-lg border transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark hover:-translate-y-1' : 'bg-card-light border-border-light hover:-translate-y-1'}`}
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className={`block font-bold text-sm mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>District</span>
                <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Administrative district</span>
              </motion.div>
              <motion.div 
                className={`p-4 rounded-lg border transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark hover:-translate-y-1' : 'bg-card-light border-border-light hover:-translate-y-1'}`}
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className={`block font-bold text-sm mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Business Category</span>
                <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Type of business</span>
              </motion.div>
              <motion.div 
                className={`p-4 rounded-lg border transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark hover:-translate-y-1' : 'bg-card-light border-border-light hover:-translate-y-1'}`}
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className={`block font-bold text-sm mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Competitors</span>
                <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Number of existing businesses</span>
              </motion.div>
              <motion.div 
                className={`p-4 rounded-lg border transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark hover:-translate-y-1' : 'bg-card-light border-border-light hover:-translate-y-1'}`}
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className={`block font-bold text-sm mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Demand Score</span>
                <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Market demand index (0-100)</span>
              </motion.div>
              <motion.div 
                className={`p-4 rounded-lg border transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark hover:-translate-y-1' : 'bg-card-light border-border-light hover:-translate-y-1'}`}
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className={`block font-bold text-sm mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Market Gap Score</span>
                <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Opportunity score (0-100)</span>
              </motion.div>
              <motion.div 
                className={`p-4 rounded-lg border transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark hover:-translate-y-1' : 'bg-card-light border-border-light hover:-translate-y-1'}`}
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className={`block font-bold text-sm mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Population</span>
                <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Total population count</span>
              </motion.div>
              <motion.div 
                className={`p-4 rounded-lg border transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark hover:-translate-y-1' : 'bg-card-light border-border-light hover:-translate-y-1'}`}
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className={`block font-bold text-sm mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Population Growth</span>
                <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Annual growth percentage</span>
              </motion.div>
              <motion.div 
                className={`p-4 rounded-lg border transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark hover:-translate-y-1' : 'bg-card-light border-border-light hover:-translate-y-1'}`}
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className={`block font-bold text-sm mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Income Level</span>
                <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Economic classification</span>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="mt-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link to="/dashboard" className="inline-block bg-gradient-to-r from-primary-blue to-primary-purple text-white py-4 px-10 rounded-full no-underline font-bold text-lg transition-all duration-300 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] active:-translate-y-0.5">
              Go to Dashboard to Export
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
