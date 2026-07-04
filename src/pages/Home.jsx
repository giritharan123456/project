import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useDistrict } from '../contexts/DistrictContext';
import { contentAPI } from '../services/api';
import { MapPin, ArrowRight, LogIn, UserPlus, Shield } from 'lucide-react';
import { PageSkeleton } from '../components/Skeleton';

function Home() {
  const { isDarkMode } = useTheme();
  const { selectedDistrict, districts } = useDistrict();
  
  const currentDistrict = districts.find(d => d._id === selectedDistrict);
  const districtName = currentDistrict?.name || 'No district selected';

  // Content from backend API
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch home page content from backend API
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await contentAPI.getHomeContent();
        setContent(response.data);
      } catch (error) {
        console.error('Error fetching home content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) return <PageSkeleton />;

  return (
    <div className={`min-h-[calc(100vh-70px)] flex items-center justify-center p-8 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      <div className={`max-w-[1200px] text-center ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
          <motion.h1
              className="text-[3.5rem] font-extrabold mb-4 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent leading-tight"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {content?.title || '🚀 MarketVision AI'}
            </motion.h1>
            <motion.p 
              className="text-2xl mb-8 opacity-80 font-medium"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {content?.subtitle || 'AI-powered market intelligence for identifying business opportunities'}
            </motion.p>
            <motion.div 
              className={`p-8 rounded-2xl mb-12 border backdrop-blur-xl ${isDarkMode ? 'bg-[#1e293b] border-[#334155] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-[#ffffff] border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-lg leading-relaxed m-0 opacity-90">
                {content?.description || 'An advanced AI-powered platform that analyzes market data, demographics, and demand patterns to identify untapped business opportunities. Perfect for entrepreneurs, investors, and business strategists looking for data-driven insights.'}
              </p>
        </motion.div>
        <motion.div 
          className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.div 
            className={`p-8 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)] hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-[#ffffff] border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-xl mb-3 font-bold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent">📊 Pincode Analysis</h3>
            <p className="text-sm opacity-80 m-0 leading-relaxed">Analyze market gaps by specific pincodes across all districts</p>
          </motion.div>
          <motion.div 
            className={`p-8 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)] hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-[#ffffff] border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-xl mb-3 font-bold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent">📈 Demand Forecasting</h3>
            <p className="text-sm opacity-80 m-0 leading-relaxed">Project future demand based on population growth and search trends</p>
          </motion.div>
          <motion.div 
            className={`p-8 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)] hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-[#ffffff] border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-xl mb-3 font-bold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent">🗺️ Heat Maps</h3>
            <p className="text-sm opacity-80 m-0 leading-relaxed">Interactive visualization of market opportunities</p>
          </motion.div>
          <motion.div 
            className={`p-8 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)] hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'bg-[#ffffff] border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'}`}
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-xl mb-3 font-bold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent">📋 Reports</h3>
            <p className="text-sm opacity-80 m-0 leading-relaxed">Export comprehensive CSV reports with all analysis data</p>
          </motion.div>
        </motion.div>
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link to="/login" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white py-4 px-8 rounded-full no-underline font-bold text-lg transition-all duration-300 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] active:-translate-y-0.5">
            <LogIn size={20} />
            Login
          </Link>
          <Link to="/signup" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#10b981] to-[#059669] text-white py-4 px-8 rounded-full no-underline font-bold text-lg transition-all duration-300 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] active:-translate-y-0.5">
            <UserPlus size={20} />
            Sign Up
          </Link>
          <Link to="/admin-login" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white py-4 px-8 rounded-full no-underline font-bold text-lg transition-all duration-300 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] active:-translate-y-0.5">
            <Shield size={20} />
            Admin Login
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;
