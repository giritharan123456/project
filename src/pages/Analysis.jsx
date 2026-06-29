import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { BarChart3, TrendingUp, MapPin, Users, Target, Calculator } from 'lucide-react';

function Analysis() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-[calc(100vh-70px)] p-12 transition-colors duration-300 ${isDarkMode ? 'bg-bg-dark' : 'bg-bg-light'}`}>
      <div className={`max-w-[1200px] mx-auto p-10 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-card-light border-border-light shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}>
        <motion.h1
          className={`text-[2.5rem] mb-2 font-extrabold bg-gradient-to-r from-primary-blue to-primary-purple bg-clip-text text-transparent ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          📊 Market Gap Analysis Methodology
        </motion.h1>
        <motion.p 
          className={`text-lg mb-8 opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Understanding how we identify business opportunities using data-driven analysis
        </motion.p>
        
        <div className="flex flex-col gap-8">
          <motion.div 
            className={`p-6 rounded-xl border border-l-4 transition-all duration-300 ${isDarkMode ? 'bg-bg-dark border-border-dark border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-bg-light border-border-light border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ x: 5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="text-primary-blue" size={28} />
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Market Gap Score Formula</h2>
            </div>
            <div className={`p-4 rounded-xl text-center border-2 mb-4 ${isDarkMode ? 'bg-card-dark border-primary-blue' : 'bg-card-light border-primary-blue'}`}>
              <code className="text-primary-blue text-lg font-semibold">Market Gap Score = Demand Score - Competition Score</code>
            </div>
            <p className={`leading-relaxed m-0 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
              The Market Gap Score ranges from 0-100, where higher scores indicate better business opportunities. 
              A score above 70 suggests a high-potential area with demand exceeding supply.
            </p>
            <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <p className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Example Calculation:</p>
              <p className={`text-sm ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                If T. Nagar has a Pharmacy demand score of 92 and 4 competitors (competition score of 10), 
                the Market Gap Score = 92 - 10 = 82 (High Opportunity)
              </p>
            </div>
          </motion.div>

          <motion.div 
            className={`p-6 rounded-xl border border-l-4 transition-all duration-300 ${isDarkMode ? 'bg-bg-dark border-border-dark border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-bg-light border-border-light border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ x: 5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Target className="text-primary-blue" size={28} />
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Key Analysis Factors</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-card-dark' : 'bg-card-light'}`}>
                <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Population Size</h3>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Larger populations indicate higher market potential</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-card-dark' : 'bg-card-light'}`}>
                <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Population Growth</h3>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Growing areas show future demand increases</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-card-dark' : 'bg-card-light'}`}>
                <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Competitor Count</h3>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Fewer competitors mean less market saturation</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-card-dark' : 'bg-card-light'}`}>
                <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Income Levels</h3>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Higher income areas support premium businesses</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className={`p-6 rounded-xl border border-l-4 transition-all duration-300 ${isDarkMode ? 'bg-bg-dark border-border-dark border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-bg-light border-border-light border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ x: 5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-primary-blue" size={28} />
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Opportunity Levels</h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">
                <span className="w-5 h-5 rounded-full bg-red-500"></span>
                <div>
                  <span className={`font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>High Opportunity (≥80)</span>
                  <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Excellent business potential, low competition</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500">
                <span className="w-5 h-5 rounded-full bg-amber-500"></span>
                <div>
                  <span className={`font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Medium Opportunity (70-79)</span>
                  <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Good potential with moderate competition</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500">
                <span className="w-5 h-5 rounded-full bg-emerald-500"></span>
                <div>
                  <span className={`font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Low Opportunity (&lt;70)</span>
                  <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Market may be saturated or demand is low</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className={`p-6 rounded-xl border border-l-4 transition-all duration-300 ${isDarkMode ? 'bg-bg-dark border-border-dark border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-bg-light border-border-light border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ x: 5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="text-primary-blue" size={28} />
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Data Sources</h2>
            </div>
            <ul className="list-none p-0 m-0 space-y-2">
              <li className={`py-2 pl-6 flex items-center gap-2 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                <span className="text-primary-blue">•</span> Census population data
              </li>
              <li className={`py-2 pl-6 flex items-center gap-2 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                <span className="text-primary-blue">•</span> Google Maps business listings
              </li>
              <li className={`py-2 pl-6 flex items-center gap-2 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                <span className="text-primary-blue">•</span> Business directories and registries
              </li>
              <li className={`py-2 pl-6 flex items-center gap-2 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                <span className="text-primary-blue">•</span> Demographic and income data
              </li>
              <li className={`py-2 pl-6 flex items-center gap-2 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                <span className="text-primary-blue">•</span> Search trend analytics
              </li>
            </ul>
          </motion.div>

          <motion.div 
            className="mt-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link to="/dashboard" className="inline-block bg-gradient-to-r from-primary-blue to-primary-purple text-white py-4 px-10 rounded-full no-underline font-bold text-lg transition-all duration-300 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] active:-translate-y-0.5">
              Apply Analysis to Dashboard
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Analysis;
