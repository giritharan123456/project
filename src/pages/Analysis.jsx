import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { BarChart3, TrendingUp, MapPin, Users, Target, Calculator } from 'lucide-react';

function Analysis() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-[calc(100vh-70px)] p-12 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      <div className={`max-w-[1200px] mx-auto p-10 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-[#ffffff] border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}>
        <motion.h1
          className={`text-[2.5rem] mb-2 font-extrabold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          📊 Market Gap Analysis Methodology
        </motion.h1>
        <motion.p 
          className={`text-lg mb-8 opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Understanding how we identify business opportunities using data-driven analysis
        </motion.p>
        
        <div className="flex flex-col gap-8">
          <motion.div 
            className={`p-6 rounded-xl border border-l-4 transition-all duration-300 ${isDarkMode ? 'bg-[#0f172a] border-[#334155] border-l-[#2563eb] hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-[#f8fafc] border-[#e2e8f0] border-l-[#2563eb] hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ x: 5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="text-[#2563eb]" size={28} />
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Market Gap Score Formula</h2>
            </div>
            <div className={`p-4 rounded-xl text-center border-2 mb-4 ${isDarkMode ? 'bg-[#1e293b] border-[#2563eb]' : 'bg-[#ffffff] border-[#2563eb]'}`}>
              <code className="text-[#2563eb] text-lg font-semibold">Market Gap Score = Demand Score - Competition Score</code>
            </div>
            <p className={`leading-relaxed m-0 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              The Market Gap Score ranges from 0-100, where higher scores indicate better business opportunities. 
              A score above 70 suggests a high-potential area with demand exceeding supply.
            </p>
            <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <p className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Example Calculation:</p>
              <p className={`text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                If T. Nagar has a Pharmacy demand score of 92 and 4 competitors (competition score of 10), 
                the Market Gap Score = 92 - 10 = 82 (High Opportunity)
              </p>
            </div>
          </motion.div>

          <motion.div 
            className={`p-6 rounded-xl border border-l-4 transition-all duration-300 ${isDarkMode ? 'bg-[#0f172a] border-[#334155] border-l-[#2563eb] hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-[#f8fafc] border-[#e2e8f0] border-l-[#2563eb] hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ x: 5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Target className="text-[#2563eb]" size={28} />
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Key Analysis Factors</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e293b]' : 'bg-[#ffffff]'}`}>
                <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Population Size</h3>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Larger populations indicate higher market potential</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e293b]' : 'bg-[#ffffff]'}`}>
                <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Population Growth</h3>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Growing areas show future demand increases</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e293b]' : 'bg-[#ffffff]'}`}>
                <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Competitor Count</h3>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Fewer competitors mean less market saturation</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e293b]' : 'bg-[#ffffff]'}`}>
                <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Income Levels</h3>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Higher income areas support premium businesses</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className={`p-6 rounded-xl border border-l-4 transition-all duration-300 ${isDarkMode ? 'bg-[#0f172a] border-[#334155] border-l-[#2563eb] hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-[#f8fafc] border-[#e2e8f0] border-l-[#2563eb] hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ x: 5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-[#2563eb]" size={28} />
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Opportunity Levels</h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">
                <span className="w-5 h-5 rounded-full bg-red-500"></span>
                <div>
                  <span className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>High Opportunity (≥80)</span>
                  <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Excellent business potential, low competition</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500">
                <span className="w-5 h-5 rounded-full bg-amber-500"></span>
                <div>
                  <span className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Medium Opportunity (70-79)</span>
                  <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Good potential with moderate competition</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500">
                <span className="w-5 h-5 rounded-full bg-emerald-500"></span>
                <div>
                  <span className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Low Opportunity (&lt;70)</span>
                  <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Market may be saturated or demand is low</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className={`p-6 rounded-xl border border-l-4 transition-all duration-300 ${isDarkMode ? 'bg-[#0f172a] border-[#334155] border-l-[#2563eb] hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-[#f8fafc] border-[#e2e8f0] border-l-[#2563eb] hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ x: 5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="text-[#2563eb]" size={28} />
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Data Sources</h2>
            </div>
            <ul className="list-none p-0 m-0 space-y-2">
              <li className={`py-2 pl-6 flex items-center gap-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                <span className="text-[#2563eb]">•</span> Census population data
              </li>
              <li className={`py-2 pl-6 flex items-center gap-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                <span className="text-[#2563eb]">•</span> Google Maps business listings
              </li>
              <li className={`py-2 pl-6 flex items-center gap-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                <span className="text-[#2563eb]">•</span> Business directories and registries
              </li>
              <li className={`py-2 pl-6 flex items-center gap-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                <span className="text-[#2563eb]">•</span> Demographic and income data
              </li>
              <li className={`py-2 pl-6 flex items-center gap-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                <span className="text-[#2563eb]">•</span> Search trend analytics
              </li>
            </ul>
          </motion.div>

          <motion.div 
            className="mt-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link to="/dashboard" className="inline-block bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white py-4 px-10 rounded-full no-underline font-bold text-lg transition-all duration-300 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] active:-translate-y-0.5">
              Apply Analysis to Dashboard
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Analysis;
