import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { FileText, Download, BarChart3, MapPin, Users, Calendar, Filter } from 'lucide-react';

function Reports() {
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
          📋 Export Reports
        </motion.h1>
        <motion.p 
          className={`text-lg mb-8 opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Download comprehensive market gap analysis reports in PDF format for offline review and business planning
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
              <FileText className="text-[#2563eb]" size={28} />
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Report Features</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e293b]' : 'bg-[#ffffff]'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="text-[#2563eb]" size={20} />
                  <h3 className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Pincode Analysis</h3>
                </div>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Detailed market gap data with competitor counts and demand scores</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e293b]' : 'bg-[#ffffff]'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="text-[#2563eb]" size={20} />
                  <h3 className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Geographic Data</h3>
                </div>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Location coordinates and geographic distribution of opportunities</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e293b]' : 'bg-[#ffffff]'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="text-[#2563eb]" size={20} />
                  <h3 className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Demographics</h3>
                </div>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Population data, growth rates, and income level classifications</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e293b]' : 'bg-[#ffffff]'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="text-[#2563eb]" size={20} />
                  <h3 className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Category Filters</h3>
                </div>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Business category-wise analysis and opportunity scores</p>
              </div>
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
              <Download className="text-[#2563eb]" size={28} />
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>How to Export</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold flex-shrink-0`}>1</div>
                <div>
                  <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Navigate to Dashboard</h3>
                  <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Go to the Dashboard page to access the export feature</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold flex-shrink-0`}>2</div>
                <div>
                  <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Select District & Filter</h3>
                  <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Choose your target district and apply business category filters</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold flex-shrink-0`}>3</div>
                <div>
                  <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Click Export as PDF</h3>
                  <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Use the Export Report section at the bottom of the dashboard</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold flex-shrink-0`}>4</div>
                <div>
                  <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Download Report</h3>
                  <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>PDF report will be automatically downloaded to your device</p>
                </div>
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
              <Calendar className="text-[#2563eb]" size={28} />
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Report Contents</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}>
                <span className={`block font-bold text-sm mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>District Overview</span>
                <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Selected district summary</span>
              </div>
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}>
                <span className={`block font-bold text-sm mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Pincode Details</span>
                <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>All pincodes with data</span>
              </div>
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}>
                <span className={`block font-bold text-sm mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Market Gap Scores</span>
                <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Opportunity scores per category</span>
              </div>
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}>
                <span className={`block font-bold text-sm mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Competitor Analysis</span>
                <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Existing business counts</span>
              </div>
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}>
                <span className={`block font-bold text-sm mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Population Data</span>
                <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Size and growth rates</span>
              </div>
              <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}>
                <span className={`block font-bold text-sm mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Export Date</span>
                <span className={`block text-xs opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Report generation timestamp</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="mt-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link to="/dashboard" className="inline-block bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white py-4 px-10 rounded-full no-underline font-bold text-lg transition-all duration-300 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] active:-translate-y-0.5">
              Go to Dashboard to Export Report
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
