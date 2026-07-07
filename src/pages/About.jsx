import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useDistrict } from '../contexts/DistrictContext';
import { contentAPI, areasAPI, districtsAPI } from '../services/api';
import { Target, Lightbulb, MapPin, BarChart3, Users, Zap, CheckCircle, TrendingUp, Brain, FileText, ArrowRight, Shield, Globe, Database, Lock } from 'lucide-react';

const CATEGORIES = [
  { name: 'Grocery & Supermarket', icon: '🛒' },
  { name: 'Pharmacy & Healthcare', icon: '💊' },
  { name: 'Education & Tutoring', icon: '📚' },
  { name: 'Food & Restaurants', icon: '🍽️' },
  { name: 'Clothing & Fashion', icon: '👕' },
  { name: 'Electronics & Mobile', icon: '📱' },
  { name: 'Beauty & Personal Care', icon: '💄' },
  { name: 'Automobile Services', icon: '🚗' },
  { name: 'Professional Services', icon: '💼' },
  { name: 'Home & Furniture', icon: '🏠' },
  { name: 'Sports & Fitness', icon: '⚽' },
  { name: 'Entertainment & Leisure', icon: '🎬' }
];

function About() {
  const { isDarkMode } = useTheme();
  const { districts, setDistricts } = useDistrict();
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
        /* silent fail */
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const displayStats = useMemo(() => [
    { label: 'Districts Covered', value: stats.districts, icon: MapPin, color: '#2563eb', gradient: 'from-[#2563eb] to-[#1d4ed8]' },
    { label: 'Areas Analyzed', value: stats.areas, icon: BarChart3, color: '#7c3aed', gradient: 'from-[#7c3aed] to-[#6d28d9]' },
    { label: 'Business Categories', value: stats.categories, icon: Users, color: '#059669', gradient: 'from-[#059669] to-[#047857]' }
  ], [stats]);

  const steps = [
    { step: '01', title: 'Select Your Area', desc: 'Choose a district and pincode to analyze market opportunities in your target location', icon: MapPin, color: '#2563eb' },
    { step: '02', title: 'Analyze the Data', desc: 'Our AI scores demand, competition, and market gaps across all business categories', icon: Brain, color: '#7c3aed' },
    { step: '03', title: 'Take Action', desc: 'Export reports, get AI recommendations, and make data-driven business decisions', icon: TrendingUp, color: '#059669' }
  ];

  const features = [
    { icon: Database, title: 'Real Market Data', desc: 'Government data from Census API and OpenStreetMap', color: '#2563eb' },
    { icon: Zap, title: 'AI-Powered Scoring', desc: 'Algorithmic market gap scoring (0-100) for each category', color: '#7c3aed' },
    { icon: BarChart3, title: 'District Analysis', desc: 'Opportunity analysis across 38 districts and 380+ areas', color: '#059669' },
    { icon: Shield, title: 'Competitor Tracking', desc: 'Category-wise competitor count and density analysis', color: '#f59e0b' },
    { icon: Globe, title: 'Interactive Maps', desc: 'Visual geographic opportunity heat maps', color: '#ef4444' },
    { icon: FileText, title: 'Export Reports', desc: 'PDF and CSV export with detailed breakdowns', color: '#06b6d4' }
  ];

  if (loading) {
    return (
      <div className={`min-h-[calc(100vh-70px)] flex items-center justify-center ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={`font-medium ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>Loading platform data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-[calc(100vh-70px)] transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>

      <div className={`relative overflow-hidden ${isDarkMode ? 'bg-[#0f172a]' : 'bg-gradient-to-br from-[#1e3a5f] via-[#1e293b] to-[#0f172a]'}`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#2563eb] rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#7c3aed] rounded-full blur-[150px]" />
        </div>
        <div className="relative max-w-[1200px] mx-auto px-6 md:px-12 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
              <span className="text-white/80 text-sm font-medium">Live Market Intelligence Platform</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
              About <span className="bg-gradient-to-r from-[#60a5fa] to-[#a78bfa] bg-clip-text text-transparent">MarketVision AI</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-8">
              AI-powered platform identifying business opportunities with real market intelligence across {stats.districts} districts and {stats.areas} areas
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 bg-white text-[#1e293b] py-3.5 px-8 rounded-full no-underline font-bold text-base transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-xl">
                <BarChart3 size={18} />
                Explore Dashboard
                <ArrowRight size={16} />
              </Link>
              <Link to="/ai-recommendations" className="flex items-center gap-2 bg-white/10 border border-white/30 text-white py-3.5 px-8 rounded-full no-underline font-bold text-base transition-all duration-300 hover:bg-white/20 hover:-translate-y-1">
                <Brain size={18} />
                Get AI Insights
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12 space-y-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className={`relative p-6 rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-xl ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + (i * 0.1) }}
              whileHover={{ y: -5 }}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-bl-[60px]`} />
              <stat.icon size={32} className="mb-3" style={{ color: stat.color }} />
              <p className={`text-4xl font-extrabold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                {stat.value}
              </p>
              <p className={`text-sm font-semibold ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className={`p-8 md:p-10 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className={`text-2xl md:text-3xl font-bold mb-8 text-center ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#059669] opacity-30" />
            {steps.map((s, i) => (
              <div key={s.step} className="flex flex-col items-center text-center gap-4 relative">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg" style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}dd)` }}>
                    <s.icon size={28} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center">
                    <span className="text-xs font-bold" style={{ color: s.color }}>{s.step}</span>
                  </div>
                </div>
                <div>
                  <h3 className={`font-bold text-lg mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{s.title}</h3>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            className={`p-6 md:p-8 rounded-2xl border-l-4 border-l-[#ef4444] ${isDarkMode ? 'bg-[#1e293b] border border-[#334155]' : 'bg-white border border-[#e2e8f0]'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Target className="text-[#ef4444]" size={22} />
              </div>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>The Problem</h2>
            </div>
            <p className={`leading-relaxed m-0 ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>
              {content?.problem || 'Entrepreneurs and franchise companies often struggle to identify where demand exists but competition is low. Most business decisions are based on assumptions rather than data, leading to high failure rates.'}
            </p>
          </motion.div>

          <motion.div
            className={`p-6 md:p-8 rounded-2xl border-l-4 border-l-[#059669] ${isDarkMode ? 'bg-[#1e293b] border border-[#334155]' : 'bg-white border border-[#e2e8f0]'}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Lightbulb className="text-[#059669]" size={22} />
              </div>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Our Solution</h2>
            </div>
            <p className={`leading-relaxed m-0 ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>
              {content?.solution || 'MarketVision AI analyzes market data, demographics, and demand patterns to identify underserved business opportunities. We provide actionable insights backed by real data to help entrepreneurs, investors, and business strategists make informed decisions.'}
            </p>
          </motion.div>
        </div>

        <motion.div
          className={`p-8 md:p-10 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className={`text-2xl md:text-3xl font-bold mb-8 text-center ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className={`p-5 rounded-xl border transition-all duration-300 hover:shadow-md ${isDarkMode ? 'bg-[#0f172a] border-[#334155] hover:border-[#475569]' : 'bg-[#f8fafc] border-[#e2e8f0] hover:border-[#cbd5e1]'}`}
                whileHover={{ y: -3 }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${f.color}15` }}>
                  <f.icon size={20} style={{ color: f.color }} />
                </div>
                <h3 className={`font-bold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{f.title}</h3>
                <p className={`text-sm ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className={`p-8 md:p-10 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MapPin className="text-[#7c3aed]" size={24} />
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Covered Districts</h2>
            </div>
            <span className={`text-sm font-bold px-4 py-2 rounded-full ${isDarkMode ? 'bg-[#7c3aed]/20 text-[#a78bfa]' : 'bg-[#7c3aed]/10 text-[#7c3aed]'}`}>
              {stats.districts} Total
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {districts.length > 0 ? districts.map((district, index) => (
              <motion.div
                key={district._id}
                className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all duration-200 ${isDarkMode ? 'bg-[#0f172a] text-[#f1f5f9] border border-[#334155] hover:border-[#7c3aed]' : 'bg-[#f8fafc] text-[#1e293b] border border-[#e2e8f0] hover:border-[#7c3aed]'}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.8 + (index * 0.02) }}
                whileHover={{ scale: 1.02 }}
              >
                <MapPin size={14} className="text-[#7c3aed] shrink-0" />
                {district.name}
              </motion.div>
            )) : (
              <p className={`text-sm col-span-full ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>Loading districts...</p>
            )}
          </div>
        </motion.div>

        <motion.div
          className={`p-8 md:p-10 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Zap className="text-[#f59e0b]" size={24} />
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Business Categories</h2>
            </div>
            <span className={`text-sm font-bold px-4 py-2 rounded-full ${isDarkMode ? 'bg-[#f59e0b]/20 text-[#fbbf24]' : 'bg-[#f59e0b]/10 text-[#d97706]'}`}>
              {stats.categories} Categories
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.name}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all duration-200 ${isDarkMode ? 'bg-[#0f172a] border border-[#334155] hover:border-[#f59e0b]' : 'bg-[#f8fafc] border border-[#e2e8f0] hover:border-[#f59e0b]'}`}
                whileHover={{ y: -3 }}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className={`text-xs font-semibold leading-tight ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{cat.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className={`p-8 rounded-2xl border ${isDarkMode ? 'bg-gradient-to-br from-[#1e293b] to-[#0f172a] border-[#334155]' : 'bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] border-[#e2e8f0]'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <h2 className={`text-2xl font-bold mb-3 text-center ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Ready to Find Business Opportunities?</h2>
          <p className={`text-center mb-6 max-w-xl mx-auto ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>
            Start analyzing market gaps across {stats.districts} districts and {stats.areas} areas with AI-powered insights
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white py-3.5 px-8 rounded-full no-underline font-bold text-base transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-xl">
              <BarChart3 size={18} />
              Explore Dashboard
              <ArrowRight size={16} />
            </Link>
            <Link to="/ai-recommendations" className={`flex items-center gap-2 py-3.5 px-8 rounded-full no-underline font-bold text-base border-2 transition-all duration-300 hover:-translate-y-1 ${isDarkMode ? 'border-[#334155] text-[#f1f5f9] hover:bg-[#0f172a]' : 'border-[#e2e8f0] text-[#1e293b] hover:bg-white'}`}>
              <Brain size={18} />
              Get AI Recommendations
            </Link>
            <Link to="/reports" className={`flex items-center gap-2 py-3.5 px-8 rounded-full no-underline font-bold text-base border-2 transition-all duration-300 hover:-translate-y-1 ${isDarkMode ? 'border-[#334155] text-[#f1f5f9] hover:bg-[#0f172a]' : 'border-[#e2e8f0] text-[#1e293b] hover:bg-white'}`}>
              <FileText size={18} />
              View Reports
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

export default About;
