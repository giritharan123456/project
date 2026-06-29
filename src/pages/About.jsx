import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { Target, Lightbulb, MapPin, BarChart3, Users, Zap, CheckCircle } from 'lucide-react';

function About() {
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
          About Market Gap Finder
        </motion.h1>
        <motion.p 
          className={`text-lg mb-8 opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Data-driven platform for identifying business opportunities across Tamil Nadu
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
              <Target className="text-primary-blue" size={28} />
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>The Problem</h2>
            </div>
            <p className={`leading-relaxed m-0 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
              Entrepreneurs and franchise companies often struggle to identify where demand exists but competition is low. 
              Most business decisions are based on assumptions rather than data, leading to high failure rates. 
              Without proper market analysis, businesses invest in saturated areas or miss high-potential locations.
            </p>
          </motion.div>

          <motion.div 
            className={`p-6 rounded-xl border border-l-4 transition-all duration-300 ${isDarkMode ? 'bg-bg-dark border-border-dark border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-bg-light border-border-light border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ x: 5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="text-primary-blue" size={28} />
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Our Solution</h2>
            </div>
            <p className={`leading-relaxed m-0 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
              Market Gap Finder is a data analytics platform that analyzes business density, population, and demand 
              indicators across Tamil Nadu pincodes to identify underserved business opportunities. 
              We provide actionable insights backed by real data to help entrepreneurs make informed decisions.
            </p>
          </motion.div>

          <motion.div 
            className={`p-6 rounded-xl border border-l-4 transition-all duration-300 ${isDarkMode ? 'bg-bg-dark border-border-dark border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-bg-light border-border-light border-l-primary-blue hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ x: 5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="text-primary-blue" size={28} />
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Key Features</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-card-dark' : 'bg-card-light'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="text-primary-blue" size={20} />
                  <h3 className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Pincode-wise Analysis</h3>
                </div>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Detailed opportunity analysis for each pincode</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-card-dark' : 'bg-card-light'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="text-primary-blue" size={20} />
                  <h3 className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Competitor Tracking</h3>
                </div>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Category-wise competitor count and density</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-card-dark' : 'bg-card-light'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="text-primary-blue" size={20} />
                  <h3 className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Market Gap Scores</h3>
                </div>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Calculated opportunity scores (0-100)</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-card-dark' : 'bg-card-light'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="text-primary-blue" size={20} />
                  <h3 className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Interactive Maps</h3>
                </div>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Visual geographic opportunity heat maps</p>
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
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Covered Districts</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Erode'].map((district, index) => (
                <motion.span 
                  key={district}
                  className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-transform duration-300 ${isDarkMode ? 'bg-card-dark text-text-dark border border-border-dark' : 'bg-card-light text-text-light border border-border-light'}`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.6 + (index * 0.1) }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {district}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="mt-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Link to="/dashboard" className="inline-block bg-gradient-to-r from-primary-blue to-primary-purple text-white py-4 px-10 rounded-full no-underline font-bold text-lg transition-all duration-300 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] active:-translate-y-0.5">
              Start Exploring Opportunities
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default About;
