import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { areasAPI, contentAPI } from '../services/api';
import LandingPreview from '../components/LandingPreview';
import { 
  Search, BarChart3, TrendingUp, MapPin, Users, Zap, 
  CheckCircle, Star, MessageSquare, Mail, ArrowRight,
  ChevronDown, Menu, X, Target, Shield, Globe, Award, Loader2
} from 'lucide-react';

function Landing() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isAuthenticated, handleGoogleCallback } = useAuth();
  const { error: toastError } = useToast();
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPreview, setSearchPreview] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [debounceTimer, setDebounceTimer] = useState(null);

  const [faqs, setFaqs] = useState([]);
  const [features, setFeatures] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      handleGoogleCallback(token).then(result => {
        if (result && result.success) {
          navigate('/dashboard', { replace: true });
        }
      });
    }
  }, [searchParams, handleGoogleCallback, navigate]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await contentAPI.getLandingContent();
        const content = response.data;
        setFaqs(content.faqs || []);
        setFeatures(content.features || []);
        setStats(content.stats || {});
      } catch (error) {
        toastError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    if (searchQuery.trim().length < 5) {
      setSearchPreview(null);
      setSearchError('');
      return;
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      setSearchError('');
      try {
        const res = await areasAPI.getByPincode(searchQuery.trim());
        if (res.data) {
          setSearchPreview(res.data);
        } else {
          setSearchPreview(null);
          setSearchError('Area not found for this pincode');
        }
      } catch {
        setSearchPreview(null);
        setSearchError('Area not found for this pincode');
      } finally {
        setSearchLoading(false);
      }
    }, 500);
    setDebounceTimer(timer);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const pincode = searchQuery.trim();
    if (isAuthenticated) {
      navigate(`/dashboard?search=${encodeURIComponent(pincode)}`);
    } else {
      navigate(`/login?redirect=${encodeURIComponent(`/dashboard?search=${pincode}`)}`);
    }
  };

  const handlePreviewClick = () => {
    if (!searchPreview) return;
    const pincode = searchPreview.pincode || searchQuery.trim();
    if (isAuthenticated) {
      navigate(`/dashboard?search=${encodeURIComponent(pincode)}`);
    } else {
      navigate(`/login?redirect=${encodeURIComponent(`/dashboard?search=${pincode}`)}`);
    }
  };

  const handleNavigate = (pincode) => {
    if (isAuthenticated) {
      navigate(`/dashboard?search=${encodeURIComponent(pincode)}`);
    } else {
      navigate(`/login?redirect=${encodeURIComponent(`/dashboard?search=${pincode}`)}`);
    }
  };

  const defaultFeatures = [
    { title: 'Market Gap Analysis', desc: 'Identify underserved business opportunities with AI-powered market analysis across 38 districts.' },
    { title: 'Real-Time Analytics', desc: 'Access live market data, demand scores, and competition metrics for informed decisions.' },
    { title: 'Smart Forecasts', desc: '5-year population, demand, and revenue projections based on real growth trends.' },
    { title: 'Area Comparison', desc: 'Compare multiple areas side-by-side to find the best location for your business.' },
    { title: 'AI Recommendations', desc: 'Get personalized business suggestions based on market gaps and local demand.' },
    { title: 'Export Reports', desc: 'Download professional PDF and CSV reports with complete market analysis.' },
  ];

  const defaultFaqs = [
    { question: 'What is MarketVision AI?', answer: 'MarketVision AI is an AI-powered platform that helps entrepreneurs and investors identify underserved business opportunities using real market data, population trends, and competition analysis across 38 districts in Tamil Nadu.' },
    { question: 'How does the market gap analysis work?', answer: 'Our algorithm analyzes population density, income levels, urban development, existing competition, and demand scores to calculate market gap scores for 12 business categories in each area.' },
    { question: 'Is the data real or simulated?', answer: 'All data is algorithmically generated based on realistic demographic and economic parameters for 380 areas across 38 districts. The models simulate real market conditions for demonstration purposes.' },
    { question: 'Can I export the analysis?', answer: 'Yes! You can export your analysis as professional PDF reports or CSV files with complete market data, charts, and recommendations.' },
    { question: 'Is there a free trial?', answer: 'Yes, you can sign up for free and explore the platform. All core features including market analysis, forecasting, and comparisons are available.' },
  ];

  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;
  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  const platformStats = [
    { label: 'Districts Covered', value: stats.districts || '38', icon: MapPin },
    { label: 'Areas Analyzed', value: stats.areas || '380+', icon: Globe },
    { label: 'Business Categories', value: stats.categories || '12', icon: BarChart3 },
    { label: 'Data Points', value: stats.dataPoints || '4,500+', icon: TrendingUp },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl ${isDarkMode ? 'bg-[#0f172a]/80 border-[#334155]' : 'bg-[#f8fafc]/80 border-[#e2e8f0]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Target className="text-[#2563eb]" size={32} />
              <span className="text-xl font-bold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent">
                MarketVision AI
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className={`text-sm font-medium hover:text-[#2563eb] transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Features</a>
              <a href="#how-it-works" className={`text-sm font-medium hover:text-[#2563eb] transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>How It Works</a>
              <a href="#faq" className={`text-sm font-medium hover:text-[#2563eb] transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>FAQ</a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button onClick={toggleTheme} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-gray-600 hover:bg-gray-100'}`}>
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <Link to="/login" className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-[#1e293b]' : 'text-gray-700 hover:bg-gray-100'}`}>
                Login
              </Link>
              <Link to="/signup" className="px-4 py-2 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                Sign Up Free
              </Link>
            </div>

            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className={`md:hidden border-t p-4 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-gray-200'}`}>
            <div className="flex flex-col gap-3">
              <a href="#features" className="text-sm font-medium text-gray-700 dark:text-gray-300">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-gray-700 dark:text-gray-300">How It Works</a>
              <a href="#faq" className="text-sm font-medium text-gray-700 dark:text-gray-300">FAQ</a>
              <div className="flex gap-2 pt-3 border-t">
                <Link to="/login" className="flex-1 px-4 py-2 rounded-lg font-medium text-center border">Login</Link>
                <Link to="/signup" className="flex-1 px-4 py-2 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-lg font-medium text-center">Sign Up</Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-[#2563eb] rounded-full blur-[150px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#7c3aed] rounded-full blur-[150px]" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2563eb]/10 text-[#2563eb] text-sm font-semibold mb-6">
                <Zap size={16} />
                AI-Powered Market Intelligence
              </div>
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Find Your Next
                <span className="block bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent">
                  Business Opportunity
                </span>
              </h1>
              <p className={`text-lg mb-8 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Identify underserved markets, analyze competition, and make data-driven business decisions with real market intelligence across 38 districts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link to="/signup" className="px-8 py-4 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-xl font-semibold text-center hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/25">
                  Get Started Free
                  <ArrowRight className="inline ml-2" size={20} />
                </Link>
                <Link to="/login" className={`px-8 py-4 rounded-xl font-semibold text-center border-2 transition-colors ${isDarkMode ? 'text-white border-[#334155] hover:bg-[#1e293b]' : 'text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
                  View Demo Dashboard
                </Link>
              </div>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[0,1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-[#2563eb] to-[#7c3aed] border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold">
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>1000+ users</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />)}
                  <span className={`text-sm ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>4.9/5</span>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className={`p-8 rounded-3xl border shadow-2xl ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-gray-200'}`}>
                <form onSubmit={handleSearch}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#2563eb]/10 flex items-center justify-center">
                      <Search className="text-[#2563eb]" size={20} />
                    </div>
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter 6-digit pincode..." 
                      className={`flex-1 px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-[#2563eb]/40 transition-all ${isDarkMode ? 'bg-[#0f172a] text-white border-[#334155] placeholder-gray-500' : 'bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400'}`}
                    />
                    <button type="submit" className="px-6 py-3 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
                      Search
                    </button>
                  </div>
                </form>

                {/* Search Preview */}
                <AnimatePresence>
                  {searchLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2 p-3 rounded-xl mb-4 bg-blue-50 dark:bg-blue-900/20">
                      <Loader2 className="animate-spin text-blue-500" size={16} />
                      <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Searching area data...</span>
                    </motion.div>
                  )}
                  {searchError && searchQuery.trim().length >= 5 && !searchLoading && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                      className="p-3 rounded-xl mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <p className="text-sm text-red-600 dark:text-red-400 font-medium">{searchError}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {!searchPreview && !searchLoading && (
                <>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {platformStats.map((stat, i) => (
                    <div key={i} className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
                      <stat.icon className="text-[#2563eb] mb-2" size={20} />
                      <p className={`text-2xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                    </div>
                  ))}
                </div>

                <Link to="/signup" className="block w-full py-3 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-xl font-semibold text-center hover:opacity-90 transition-opacity">
                  Explore Market Data
                  <ArrowRight className="inline ml-2" size={18} />
                </Link>
                </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rich Preview Section */}
      {searchPreview && !searchLoading && (
        <section className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <LandingPreview area={searchPreview} onNavigate={() => handleNavigate(searchPreview.pincode || searchQuery.trim())} />
          </div>
        </section>
      )}

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2563eb]/10 text-[#2563eb] text-sm font-semibold mb-4">Features</span>
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Everything You Need
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Powerful tools to identify the best business opportunities in your market
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayFeatures.map((feature, index) => {
              const icons = [BarChart3, TrendingUp, MapPin, Users, Zap, Target, Globe, Shield, Award];
              const FeatureIcon = icons[index % icons.length];
              return (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className={`p-6 rounded-2xl border hover:shadow-lg transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] hover:border-[#2563eb]/50' : 'bg-white border-gray-200 hover:shadow-xl'}`}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center mb-4">
                    <FeatureIcon className="text-white" size={22} />
                  </div>
                  <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {feature.title || feature.name}
                  </h3>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {feature.desc || feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className={`py-20 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-[#1e293b]/50' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2563eb]/10 text-[#2563eb] text-sm font-semibold mb-4">Process</span>
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              How It Works
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Select Your Area', desc: 'Choose a district and pincode to analyze the local market conditions and demographics.', icon: MapPin },
              { step: '02', title: 'Analyze Market Data', desc: 'View market gap scores, demand indices, competition levels, and growth forecasts.', icon: BarChart3 },
              { step: '03', title: 'Make Decisions', desc: 'Get AI-powered recommendations and export professional reports for your business plan.', icon: TrendingUp },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.15 }} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center mx-auto mb-6">
                  <item.icon className="text-white" size={28} />
                </div>
                <div className={`text-sm font-bold mb-2 ${isDarkMode ? 'text-[#2563eb]' : 'text-[#2563eb]'}`}>Step {item.step}</div>
                <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '38', label: 'Districts', icon: MapPin },
              { value: '380+', label: 'Areas Covered', icon: Globe },
              { value: '12', label: 'Categories', icon: BarChart3 },
              { value: '4,500+', label: 'Data Points', icon: TrendingUp },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl border text-center ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-gray-200'}`}>
                <stat.icon className="text-[#2563eb] mx-auto mb-3" size={28} />
                <p className={`text-3xl font-extrabold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className={`py-20 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-[#1e293b]/50' : 'bg-gray-50'}`}>
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2563eb]/10 text-[#2563eb] text-sm font-semibold mb-4">FAQ</span>
            <h2 className={`text-3xl sm:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-3">
            {displayFaqs.map((faq, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-gray-200'}`}>
                <button onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left">
                  <span className={`font-semibold pr-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{faq.question}</span>
                  <ChevronDown className={`flex-shrink-0 transition-transform duration-200 ${activeFaq === index ? 'rotate-180' : ''} ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
                </button>
                {activeFaq === index && (
                  <div className={`px-5 pb-5 pt-0 border-t ${isDarkMode ? 'border-[#334155]' : 'border-gray-100'}`}>
                    <p className={`mt-3 text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative p-12 rounded-3xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-center overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-[80px]" />
            </div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Find Your Opportunity?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Join 1000+ entrepreneurs using MarketVision AI to make smarter business decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup" className="px-8 py-4 bg-white text-[#2563eb] rounded-xl font-bold hover:bg-gray-100 transition-colors">
                  Start Free Trial
                  <ArrowRight className="inline ml-2" size={20} />
                </Link>
                <Link to="/login" className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-colors">
                  Sign In
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-4 sm:px-6 lg:px-8 border-t ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Target className="text-[#2563eb]" size={24} />
                <span className="font-bold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent">MarketVision AI</span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                AI-powered market intelligence platform for smart business decisions.
              </p>
            </div>
            <div>
              <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Product</h4>
              <ul className="space-y-2">
                <li><Link to="/dashboard" className={`text-sm hover:text-[#2563eb] transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Dashboard</Link></li>
                <li><Link to="/about" className={`text-sm hover:text-[#2563eb] transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>About</Link></li>
                <li><a href="#faq" className={`text-sm hover:text-[#2563eb] transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Features</h4>
              <ul className="space-y-2">
                <li><Link to="/category-explorer" className={`text-sm hover:text-[#2563eb] transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Explorer</Link></li>
                <li><Link to="/forecast" className={`text-sm hover:text-[#2563eb] transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Forecasting</Link></li>
                <li><Link to="/reports" className={`text-sm hover:text-[#2563eb] transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Reports</Link></li>
              </ul>
            </div>
            <div>
              <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Account</h4>
              <ul className="space-y-2">
                <li><Link to="/login" className={`text-sm hover:text-[#2563eb] transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Login</Link></li>
                <li><Link to="/signup" className={`text-sm hover:text-[#2563eb] transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sign Up</Link></li>
                <li><Link to="/profile" className={`text-sm hover:text-[#2563eb] transition-colors ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Profile</Link></li>
              </ul>
            </div>
          </div>
          <div className={`pt-8 border-t ${isDarkMode ? 'border-[#334155]' : 'border-gray-200'}`}>
            <p className={`text-center text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              © {new Date().getFullYear()} MarketVision AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
