import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

function Home() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-[calc(100vh-70px)] flex items-center justify-center p-8 transition-colors duration-300 ${isDarkMode ? 'bg-bg-dark' : 'bg-bg-light'}`}>
      <div className={`max-w-[1200px] text-center ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
        <motion.h1
          className="text-[3.5rem] font-extrabold mb-4 bg-gradient-to-r from-primary-blue to-primary-purple bg-clip-text text-transparent leading-tight"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🇮🇳 Tamil Nadu Market Gap Finder
        </motion.h1>
        <motion.p 
          className="text-2xl mb-8 opacity-80 font-medium"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Identify underserved business opportunities across Tamil Nadu pincodes
        </motion.p>
        <motion.div 
          className={`p-8 rounded-2xl mb-12 border backdrop-blur-xl ${isDarkMode ? 'bg-card-dark border-border-dark shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-card-light border-border-light shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-lg leading-relaxed m-0 opacity-90">
            A data analytics platform that analyzes business density, population, and demand indicators 
            across Tamil Nadu pincodes to identify underserved business opportunities.
          </p>
        </motion.div>
        <motion.div 
          className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.div 
            className={`p-8 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)] hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-card-light border-border-light shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-xl mb-3 font-bold bg-gradient-to-r from-primary-blue to-primary-purple bg-clip-text text-transparent">📊 Pincode Analysis</h3>
            <p className="text-sm opacity-80 m-0 leading-relaxed">Analyze market gaps by specific pincodes across Tamil Nadu</p>
          </motion.div>
          <motion.div 
            className={`p-8 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)] hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-card-light border-border-light shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-xl mb-3 font-bold bg-gradient-to-r from-primary-blue to-primary-purple bg-clip-text text-transparent">📈 Demand Forecasting</h3>
            <p className="text-sm opacity-80 m-0 leading-relaxed">Project future demand based on population growth and search trends</p>
          </motion.div>
          <motion.div 
            className={`p-8 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)] hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-card-light border-border-light shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-xl mb-3 font-bold bg-gradient-to-r from-primary-blue to-primary-purple bg-clip-text text-transparent">🗺️ Heat Maps</h3>
            <p className="text-sm opacity-80 m-0 leading-relaxed">Interactive visualization of market opportunities</p>
          </motion.div>
          <motion.div 
            className={`p-8 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)] hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-card-light border-border-light shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-xl mb-3 font-bold bg-gradient-to-r from-primary-blue to-primary-purple bg-clip-text text-transparent">📋 Reports</h3>
            <p className="text-sm opacity-80 m-0 leading-relaxed">Export comprehensive CSV reports with all analysis data</p>
          </motion.div>
        </motion.div>
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link to="/dashboard" className="inline-block bg-gradient-to-r from-primary-blue to-primary-purple text-white py-5 px-12 rounded-full no-underline font-bold text-lg transition-all duration-300 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] active:-translate-y-0.5">
            Go to Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;
