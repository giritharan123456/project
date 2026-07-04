import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useDistrict } from '../contexts/DistrictContext';
import { contentAPI, areasAPI, districtsAPI } from '../services/api';
import { Target, Lightbulb, MapPin, BarChart3, Users, Zap, CheckCircle, TrendingUp, ArrowRight, Brain, FileText } from 'lucide-react';

const CATEGORIES = [
  'Grocery & Supermarket', 'Pharmacy & Healthcare', 'Education & Tutoring',
  'Food & Restaurants', 'Clothing & Fashion', 'Electronics & Mobile',
  'Beauty & Personal Care', 'Automobile Services', 'Professional Services',
  'Home & Furniture', 'Sports & Fitness', 'Entertainment & Leisure'
];

function About() {
  const { isDarkMode } = useTheme();
  const { selectedDistrict, districts, setDistricts } = useDistrict();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ districts: 0, areas: 0, categories: CATEGORIES.length });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [contentRes, areasRes, districtsRes] = await Promise.allSettled([
          contentAPI.getAboutContent(),
          areasAPI.getAll(),
          districtsAPI.getAll()
        ]);

        if (contentRes.status === 'fulfilled') {
          setContent(contentRes.value.data);
        }

        const totalAreas = areasRes.status === 'fulfilled' ? (areasRes.value.data?.length || areasRes.value.count || 0) : 0;
        const districtList = districtsRes.status === 'fulfilled' ? (districtsRes.value.data || []) : [];
        const totalDistricts = districtList.length || districts.length;

        if (districtList.length > 0 && districts.length === 0) {
          setDistricts(districtList);
        }

        setStats({
          districts: totalDistricts,
          areas: totalAreas || content?.stats?.areas || 0,
          categories: CATEGORIES.length
        });
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [districts.length]);

  const displayStats = useMemo(() => [
    { label: 'Districts Covered', value: stats.districts, icon: MapPin, color: '#2563eb' },
    { label: 'Areas Analyzed', value: stats.areas, icon: BarChart3, color: '#7c3aed' },
    { label: 'Business Categories', value: stats.categories, icon: Users, color: '#059669' }
  ], [stats]);

  const steps = [
    { step: '01', title: 'Select Your Area', desc: 'Choose a district and pincode to analyze market opportunities in your target location', icon: MapPin },
    { step: '02', title: 'Analyze the Data', desc: 'Our AI scores demand, competition, and market gaps across all business categories', icon: Brain },
    { step: '03', title: 'Take Action', desc: 'Export reports, get AI recommendations, and make data-driven business decisions', icon: TrendingUp }
  ];

  return (
    <div className={`min-h-[calc(100vh-70px)] p-6 md:p-12 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      <div className="max-w-[1200px] mx-auto space-y-8">

        {loading ? (
          <div className={`p-10 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
            <div className="flex flex-col items-center gap-4 py-20">
              <div className="w-10 h-10 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin" />
              <p className={`text-sm ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>Loading platform data...</p>
            </div>
          </div>
        ) : (
          <>
            <motion.div
              className={`p-8 md:p-10 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className={`text-3xl md:text-[2.5rem] mb-3 font-extrabold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent`}>
                {content?.title || 'About MarketVision AI'}
              </h1>
              <p className={`text-lg opacity-70 leading-relaxed ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                {content?.description || 'AI-powered platform for identifying business opportunities with real market intelligence'}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {displayStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className={`p-6 rounded-xl border text-center transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + (i * 0.1) }}
                  whileHover={{ y: -3 }}
                >
                  <stat.icon size={28} className="mx-auto mb-2" style={{ color: stat.color }} />
                  <p className={`text-3xl font-extrabold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                    {stat.value}
                  </p>
                  <p className={`text-sm font-semibold mt-1 ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              className={`p-8 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className={`text-2xl font-bold mb-6 text-center ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {steps.map((s, i) => (
                  <div key={s.step} className="flex flex-col items-center text-center gap-3">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg`}
                      style={{ background: `linear-gradient(135deg, ${i === 0 ? '#2563eb' : i === 1 ? '#7c3aed' : '#059669'}, ${i === 0 ? '#1d4ed8' : i === 1 ? '#6d28d9' : '#047857'})` }}>
                      {s.step}
                    </div>
                    <h3 className={`font-bold text-lg ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{s.title}</h3>
                    <p className={`text-sm opacity-70 leading-relaxed ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className={`p-6 rounded-xl border-l-4 border-l-[#ef4444] transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border border-[#334155]' : 'bg-white border border-[#e2e8f0]'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Target className="text-[#ef4444]" size={28} />
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>The Problem</h2>
              </div>
              <p className={`leading-relaxed m-0 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                {content?.problem || 'Entrepreneurs and franchise companies often struggle to identify where demand exists but competition is low. Most business decisions are based on assumptions rather than data, leading to high failure rates.'}
              </p>
            </motion.div>

            <motion.div
              className={`p-6 rounded-xl border-l-4 border-l-[#059669] transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border border-[#334155]' : 'bg-white border border-[#e2e8f0]'}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Lightbulb className="text-[#059669]" size={28} />
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Our Solution</h2>
              </div>
              <p className={`leading-relaxed m-0 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                {content?.solution || 'MarketVision AI analyzes market data, demographics, and demand patterns to identify underserved business opportunities. We provide actionable insights backed by real data to help entrepreneurs, investors, and business strategists make informed decisions.'}
              </p>
            </motion.div>

            <motion.div
              className={`p-8 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="text-[#2563eb]" size={28} />
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Key Features</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(content?.features || [
                  'Real-time market data from government APIs',
                  'Algorithmic market gap scoring',
                  'District-wise business opportunity analysis',
                  'Pincode-level market insights'
                ]).map((feature, i) => (
                  <div key={i} className={`flex items-start gap-3 p-4 rounded-lg ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                    <CheckCircle className="text-[#059669] mt-0.5 shrink-0" size={18} />
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className={`p-6 rounded-xl border transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="text-[#7c3aed]" size={28} />
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Covered Districts</h2>
                <span className={`ml-auto text-sm font-semibold px-3 py-1 rounded-full ${isDarkMode ? 'bg-[#7c3aed]/20 text-[#a78bfa]' : 'bg-[#7c3aed]/10 text-[#7c3aed]'}`}>
                  {stats.districts} Districts
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {districts.length > 0 ? districts.map((district, index) => (
                  <motion.span
                    key={district._id}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-transform duration-300 ${isDarkMode ? 'bg-[#0f172a] text-[#f1f5f9] border border-[#334155]' : 'bg-[#f8fafc] text-[#1e293b] border border-[#e2e8f0]'}`}
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.8 + (index * 0.02) }}
                  >
                    {district.name}
                  </motion.span>
                )) : (
                  <span className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Loading districts...</span>
                )}
              </div>
            </motion.div>

            <motion.div
              className={`p-6 rounded-xl border transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Business Categories Analyzed</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {CATEGORIES.map((cat, i) => (
                  <div key={cat} className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium ${isDarkMode ? 'bg-[#0f172a] text-[#f1f5f9]' : 'bg-[#f8fafc] text-[#1e293b]'}`}>
                    <Zap size={14} className="text-[#f59e0b] shrink-0" />
                    {cat}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 py-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Link to="/dashboard" className="flex items-center gap-2 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white py-3.5 px-8 rounded-full no-underline font-bold text-base transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-xl active:-translate-y-0.5">
                <BarChart3 size={18} />
                Explore Dashboard
              </Link>
              <Link to="/ai-recommendations" className={`flex items-center gap-2 py-3.5 px-8 rounded-full no-underline font-bold text-base border-2 transition-all duration-300 hover:-translate-y-1 ${isDarkMode ? 'border-[#334155] text-[#f1f5f9] hover:bg-[#0f172a]' : 'border-[#e2e8f0] text-[#1e293b] hover:bg-[#f8fafc]'}`}>
                <Brain size={18} />
                Get AI Insights
              </Link>
              <Link to="/reports" className={`flex items-center gap-2 py-3.5 px-8 rounded-full no-underline font-bold text-base border-2 transition-all duration-300 hover:-translate-y-1 ${isDarkMode ? 'border-[#334155] text-[#f1f5f9] hover:bg-[#0f172a]' : 'border-[#e2e8f0] text-[#1e293b] hover:bg-[#f8fafc]'}`}>
                <FileText size={18} />
                View Reports
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

export default About;
