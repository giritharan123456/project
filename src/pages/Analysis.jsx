import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

function Analysis() {
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
          📊 Market Gap Analysis
        </motion.h1>
        <motion.p 
          className={`text-lg mb-8 opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Detailed analysis methodologies and calculations
        </motion.p>
        
        <div className="flex flex-col gap-8">
          <motion.div 
            className={`p-6 rounded-xl border border-l-4 transition-all duration-300 ${isDarkMode ? 'bg-bg-dark border-border-dark border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-bg-light border-border-light border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ x: 5 }}
          >
            <h2 className={`text-2xl mb-4 font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Market Gap Score Formula</h2>
            <div className={`p-4 rounded-xl text-center border-2 ${isDarkMode ? 'bg-card-dark border-primary-blue' : 'bg-card-light border-primary-blue'}`}>
              <code className="text-primary-blue text-lg font-semibold">Market Gap Score = Demand Score - Competition Score</code>
            </div>
            <p className={`leading-relaxed m-0 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Higher score indicates better business opportunity.</p>
          </motion.div>

          <motion.div 
            className={`p-6 rounded-xl border border-l-4 transition-all duration-300 ${isDarkMode ? 'bg-bg-dark border-border-dark border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-bg-light border-border-light border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ x: 5 }}
          >
            <h2 className={`text-2xl mb-4 font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Data Collection Sources</h2>
            <ul className="list-none p-0 m-0">
              <li className={`py-2 pl-6 relative ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Census population data</li>
              <li className={`py-2 pl-6 relative ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Google Maps business listings</li>
              <li className={`py-2 pl-6 relative ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Business directories</li>
              <li className={`py-2 pl-6 relative ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Demographic and income data</li>
              <li className={`py-2 pl-6 relative ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Infrastructure information</li>
            </ul>
          </motion.div>

          <motion.div 
            className={`p-6 rounded-xl border border-l-4 transition-all duration-300 ${isDarkMode ? 'bg-bg-dark border-border-dark border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-bg-light border-border-light border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ x: 5 }}
          >
            <h2 className={`text-2xl mb-4 font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Business Density Calculation</h2>
            <div className={`p-4 rounded-xl text-center border-2 ${isDarkMode ? 'bg-card-dark border-primary-blue' : 'bg-card-light border-primary-blue'}`}>
              <code className="text-primary-blue text-lg font-semibold">Business Density = Number of Businesses / Population</code>
            </div>
            <p className={`leading-relaxed m-0 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}><strong>Example:</strong> Pincode 600100 with 1,20,000 population and 18 restaurants has a restaurant density of 0.00015 restaurants per person.</p>
          </motion.div>

          <motion.div 
            className={`p-6 rounded-xl border border-l-4 transition-all duration-300 ${isDarkMode ? 'bg-bg-dark border-border-dark border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-bg-light border-border-light border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ x: 5 }}
          >
            <h2 className={`text-2xl mb-4 font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Demand Signal Factors</h2>
            <ul className="list-none p-0 m-0">
              <li className={`py-2 pl-6 relative ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Population size</li>
              <li className={`py-2 pl-6 relative ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Population growth rate</li>
              <li className={`py-2 pl-6 relative ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Nearby residential projects</li>
              <li className={`py-2 pl-6 relative ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Search trends</li>
              <li className={`py-2 pl-6 relative ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Competitor count</li>
              <li className={`py-2 pl-6 relative ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Income levels</li>
              <li className={`py-2 pl-6 relative ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Urban development indicators</li>
            </ul>
          </motion.div>

          <motion.div 
            className={`p-6 rounded-xl border border-l-4 transition-all duration-300 ${isDarkMode ? 'bg-bg-dark border-border-dark border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-bg-light border-border-light border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ x: 5 }}
          >
            <h2 className={`text-2xl mb-4 font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Opportunity Levels</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="w-5 h-5 rounded-full bg-red-500"></span>
                <span className={`font-medium ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>High Opportunity (Market Gap Score ≥ 80)</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-5 h-5 rounded-full bg-amber-500"></span>
                <span className={`font-medium ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Medium Opportunity (Market Gap Score 70-79)</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-5 h-5 rounded-full bg-emerald-500"></span>
                <span className={`font-medium ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Low Opportunity (Market Gap Score &lt; 70)</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="mt-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Link to="/dashboard" className="inline-block bg-gradient-to-r from-primary-blue to-primary-purple text-white py-4 px-10 rounded-full no-underline font-bold text-lg transition-all duration-300 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] active:-translate-y-0.5">
              View Dashboard Analysis
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Analysis;
