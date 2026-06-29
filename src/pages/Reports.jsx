import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { FileText, Download, BarChart3, MapPin, Users, Calendar, Filter } from 'lucide-react';

function Reports() {
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
          📋 Export Reports
        </motion.h1>
        <motion.p 
          className={`text-lg mb-8 opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Download comprehensive market gap analysis reports in PDF format for offline review and business planning
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
              <FileText className="text-primary-blue" size={28} />
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Report Features</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-card-dark' : 'bg-card-light'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="text-primary-blue" size={20} />
                  <h3 className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Pincode Analysis</h3>
                </div>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Detailed market gap data with competitor counts and demand scores</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-card-dark' : 'bg-card-light'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="text-primary-blue" size={20} />
                  <h3 className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Geographic Data</h3>
                </div>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Location coordinates and geographic distribution of opportunities</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-card-dark' : 'bg-card-light'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="text-primary-blue" size={20} />
                  <h3 className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Demographics</h3>
                </div>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Population data, growth rates, and income level classifications</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-card-dark' : 'bg-card-light'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="text-primary-blue" size={20} />
                  <h3 className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Category Filters</h3>
                </div>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Business category-wise analysis and opportunity scores</p>
              </div>
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
              <Download className="text-primary-blue" size={28} />
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>How to Export</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full bg-primary-blue text-white flex items-center justify-center font-bold flex-shrink-0`}>1</div>
                <div>
                  <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Navigate to Dashboard</h3>
                  <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Go to the Dashboard page to access the export feature</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full bg-primary-blue text-white flex items-center justify-center font-bold flex-shrink-0`}>2</div>
                <div>
                  <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Select District & Filter</h3>
                  <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Choose your target district and apply business category filters</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full bg-primary-blue text-white flex items-center justify-center font-bold flex-shrink-0`}>3</div>
                <div>
                  <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Click Export as PDF</h3>
                  <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Use the Export Report section at the bottom of the dashboard</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full bg-primary-blue text-white flex items-center justify-center font-bold flex-shrink-0`}>4</div>
                <div>
                  <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Download Report</h3>
                  <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>PDF report will be automatically downloaded to your device</p>
                </div>
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
              <Calendar className="text-primary-blue" size={28} />
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Report Contents</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}>
                <span className={`block font-bold text-sm mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>District Overview</span>
                <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Selected district summary</span>
              </div>
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}>
                <span className={`block font-bold text-sm mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Pincode Details</span>
                <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>All pincodes with data</span>
              </div>
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}>
                <span className={`block font-bold text-sm mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Market Gap Scores</span>
                <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Opportunity scores per category</span>
              </div>
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}>
                <span className={`block font-bold text-sm mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Competitor Analysis</span>
                <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Existing business counts</span>
              </div>
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}>
                <span className={`block font-bold text-sm mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Population Data</span>
                <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Size and growth rates</span>
              </div>
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}>
                <span className={`block font-bold text-sm mb-1 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Export Date</span>
                <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Report generation timestamp</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="mt-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link to="/dashboard" className="inline-block bg-gradient-to-r from-primary-blue to-primary-purple text-white py-4 px-10 rounded-full no-underline font-bold text-lg transition-all duration-300 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] active:-translate-y-0.5">
              Go to Dashboard to Export Report
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
