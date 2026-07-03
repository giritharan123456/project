import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useDistrict } from '../contexts/DistrictContext';
import { contentAPI } from '../services/api';
import { Target, Lightbulb, MapPin, BarChart3, Users, Zap, CheckCircle } from 'lucide-react';

function About() {
  const { isDarkMode } = useTheme();
  const { selectedDistrict, districts } = useDistrict();
  
  const currentDistrict = districts.find(d => d._id === selectedDistrict);
  const districtName = currentDistrict?.name || 'No district selected';

  // Content from backend API
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch about page content from backend API
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await contentAPI.getAboutContent();
        setContent(response.data);
      } catch (error) {
        console.error('Error fetching about content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className={`min-h-[calc(100vh-70px)] p-12 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      <div className={`max-w-[1200px] mx-auto p-10 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-[#ffffff] border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}>

        {loading ? (
          <p className={`text-center ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Loading...</p>
        ) : (
          <>
            <motion.h1
              className={`text-[2.5rem] mb-2 font-extrabold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {content?.title || 'About Market Gap Finder'}
            </motion.h1>
            <motion.p 
              className={`text-lg mb-8 opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {content?.description || 'AI-powered platform for identifying business opportunities with real market intelligence, currently analyzing'} {districtName}
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
              <Target className="text-[#2563eb]" size={28} />
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>The Problem</h2>
            </div>
            <p className={`leading-relaxed m-0 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Entrepreneurs and franchise companies often struggle to identify where demand exists but competition is low. 
              Most business decisions are based on assumptions rather than data, leading to high failure rates. 
              Without proper market analysis, businesses invest in saturated areas or miss high-potential locations.
            </p>
          </motion.div>

          <motion.div 
            className={`p-6 rounded-xl border border-l-4 transition-all duration-300 ${isDarkMode ? 'bg-[#0f172a] border-[#334155] border-l-[#2563eb] hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-[#f8fafc] border-[#e2e8f0] border-l-[#2563eb] hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ x: 5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="text-[#2563eb]" size={28} />
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Our Solution</h2>
            </div>
            <p className={`leading-relaxed m-0 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              MarketVision AI is an advanced AI-powered platform that analyzes market data, demographics, and demand 
              patterns to identify underserved business opportunities. 
              We provide actionable insights backed by real data to help entrepreneurs, investors, and business strategists make informed decisions.
            </p>
          </motion.div>

          <motion.div 
            className={`p-6 rounded-xl border border-l-4 transition-all duration-300 ${isDarkMode ? 'bg-[#0f172a] border-[#334155] border-l-[#2563eb] hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-[#f8fafc] border-[#e2e8f0] border-l-[#2563eb] hover:translate-x-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ x: 5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="text-[#2563eb]" size={28} />
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Key Features</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e293b]' : 'bg-[#ffffff]'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="text-[#2563eb]" size={20} />
                  <h3 className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Pincode-wise Analysis</h3>
                </div>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Detailed opportunity analysis for each pincode</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e293b]' : 'bg-[#ffffff]'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="text-[#2563eb]" size={20} />
                  <h3 className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Competitor Tracking</h3>
                </div>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Category-wise competitor count and density</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e293b]' : 'bg-[#ffffff]'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="text-[#2563eb]" size={20} />
                  <h3 className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Market Gap Scores</h3>
                </div>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Calculated opportunity scores (0-100)</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1e293b]' : 'bg-[#ffffff]'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="text-[#2563eb]" size={20} />
                  <h3 className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Interactive Maps</h3>
                </div>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Visual geographic opportunity heat maps</p>
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
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Covered Districts</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {districts.length > 0 ? districts.slice(0, 12).map((district, index) => (
                <motion.span 
                  key={district._id}
                  className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-transform duration-300 ${isDarkMode ? 'bg-[#1e293b] text-[#f1f5f9] border border-[#334155]' : 'bg-[#ffffff] text-[#1e293b] border border-[#e2e8f0]'}`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.6 + (index * 0.05) }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {district.name}
                </motion.span>
              )) : (
                <span className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Loading districts...</span>
              )}
            </div>
          </motion.div>

          <motion.div 
            className="mt-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Link to="/dashboard" className="inline-block bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white py-4 px-10 rounded-full no-underline font-bold text-lg transition-all duration-300 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] active:-translate-y-0.5">
              Start Exploring Opportunities
            </Link>
          </motion.div>
          </div>
          </>
        )}
      </div>
    </div>
  );
}

export default About;
