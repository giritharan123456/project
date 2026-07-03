import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { contentAPI } from '../services/api';
import { PageSkeleton } from '../components/Skeleton';
import { 
  Search, BarChart3, TrendingUp, MapPin, Users, Zap, 
  CheckCircle, Star, MessageSquare, Mail, Phone, ArrowRight,
  Play, ChevronDown, Menu, X, Mic, Target, Lightbulb, Shield,
  Globe, Clock, Award, Heart, ArrowUpRight, Sun, Moon
} from 'lucide-react';

function Landing() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeFaq, setActiveFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Content from backend API
  const [faqs, setFaqs] = useState([]);
  const [features, setFeatures] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [howItWorks, setHowItWorks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch landing page content from backend API
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await contentAPI.getLandingContent();
        const content = response.data;
        
        setFaqs(content.faqs || []);
        setFeatures(content.features || []);
        setBenefits(content.benefits || []);
        setReviews(content.reviews || []);
        setHowItWorks(content.howItWorks || []);
        setStats(content.stats || {});
      } catch (error) {
        console.error('Error fetching landing content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl ${isDarkMode ? 'bg-[#0f172a]/80 border-[#334155]' : 'bg-[#f8fafc]/80 border-[#e2e8f0]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Target className="text-[#2563eb]" size={32} />
              <span className="text-xl font-bold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent">
                Market Gap Finder
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className={`text-sm font-medium hover:text-[#2563eb] transition-colors ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Features</a>
              <a href="#how-it-works" className={`text-sm font-medium hover:text-[#2563eb] transition-colors ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>How It Works</a>
              <a href="#reviews" className={`text-sm font-medium hover:text-[#2563eb] transition-colors ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Reviews</a>
              <a href="#faq" className={`text-sm font-medium hover:text-[#2563eb] transition-colors ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>FAQ</a>
              <a href="#contact" className={`text-sm font-medium hover:text-[#2563eb] transition-colors ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Contact</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-[#f1f5f9] hover:bg-[#1e293b]' : 'text-[#1e293b] hover:bg-[#ffffff]'}`}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link to="/login" className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDarkMode ? 'text-[#f1f5f9] hover:bg-[#1e293b]' : 'text-[#1e293b] hover:bg-[#ffffff]'}`}>
                Login
              </Link>
              <Link to="/signup" className="px-4 py-2 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                Sign Up
              </Link>
              <Link to="/admin-login" className="px-4 py-2 bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                Admin
              </Link>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`md:hidden border-t p-4 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
          >
            <div className="flex flex-col gap-4">
              <a href="#features" className={`text-sm font-medium ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Features</a>
              <a href="#how-it-works" className={`text-sm font-medium ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>How It Works</a>
              <a href="#reviews" className={`text-sm font-medium ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Reviews</a>
              <a href="#faq" className={`text-sm font-medium ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>FAQ</a>
              <a href="#contact" className={`text-sm font-medium ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Contact</a>
              <div className="flex gap-2 pt-4 border-t">
                <Link to="/login" className="flex-1 px-4 py-2 rounded-lg font-medium text-center border">Login</Link>
                <Link to="/signup" className="flex-1 px-4 py-2 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-lg font-medium text-center">Sign Up</Link>
                <Link to="/admin-login" className="flex-1 px-4 py-2 bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white rounded-lg font-medium text-center">Admin</Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-[#2563eb] text-sm font-medium mb-6">
                <Zap size={16} />
                <span>AI-Powered Market Intelligence</span>
              </div>
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Find Your Next
                <span className="block bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent">
                  Business Opportunity
                </span>
              </h1>
              <p className={`text-lg mb-8 opacity-80 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                AI-powered platform to identify underserved business opportunities with real market intelligence.
                Make data-driven decisions for your next business venture.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/signup" className="px-8 py-4 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-xl font-semibold text-center hover:opacity-90 transition-opacity shadow-lg">
                  Get Started Free
                  <ArrowRight className="inline ml-2" size={20} />
                </Link>
                <Link to="/login" className={`px-8 py-4 rounded-xl font-semibold text-center border-2 transition-colors ${isDarkMode ? 'text-[#f1f5f9] border-[#334155] hover:bg-[#1e293b]' : 'text-[#1e293b] border-[#e2e8f0] hover:bg-[#ffffff]'}`}>
                  View Demo
                  <Play className="inline ml-2" size={20} />
                </Link>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2563eb] to-[#7c3aed] border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold">
                      {i}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                    Trusted by {stats.entrepreneurs || 'entrepreneurs'}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <div className={`p-8 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'} shadow-2xl`}>
                  <div className="flex items-center gap-2 mb-6">
                    <Search className="text-[#2563eb]" size={24} />
                    <input 
                      type="text" 
                      placeholder="Search by pincode or area..." 
                      className={`flex-1 px-4 py-3 rounded-lg border bg-transparent outline-none focus:border-[#2563eb] transition-colors ${isDarkMode ? 'text-[#f1f5f9] border-[#334155]' : 'text-[#1e293b] border-[#e2e8f0]'}`}
                    />
                    <button className="p-3 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-lg hover:opacity-90 transition-opacity">
                      <Mic size={20} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                      <p className={`text-sm opacity-70 mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Market Gap Score</p>
                      <p className="text-2xl font-bold text-[#2563eb]">92%</p>
                    </div>
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                      <p className={`text-sm opacity-70 mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Opportunities</p>
                      <p className="text-2xl font-bold text-[#7c3aed]">156</p>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                    <p className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Top Opportunity</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Business Opportunity</p>
                        <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>View analysis for details</p>
                      </div>
                      <ArrowRight className="text-[#2563eb]" size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Powerful Features
            </h2>
            <p className={`text-lg opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Everything you need to make smart business decisions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.length > 0 ? features.map((feature, index) => {
              const icons = [BarChart3, TrendingUp, MapPin, Users, Zap, Target];
              const FeatureIcon = icons[index % icons.length] || BarChart3;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center mb-4">
                    <FeatureIcon className="text-white" size={24} />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                    {feature.title}
                  </h3>
                  <p className={`opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                    {feature.desc}
                  </p>
                </motion.div>
              );
            }) : (
              <p className={`text-center opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Loading features...</p>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Why Choose Market Gap Finder?
              </h2>
              <div className="space-y-6">
                {benefits.length > 0 ? benefits.map((benefit, index) => {
                  const icons = [CheckCircle, Clock, Shield, Award];
                  const BenefitIcon = icons[index % icons.length] || CheckCircle;
                  
  if (loading) return <PageSkeleton />;

  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center flex-shrink-0">
                        <BenefitIcon className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className={`font-bold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                          {benefit.title}
                        </h3>
                        <p className={`opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                          {benefit.desc}
                        </p>
                      </div>
                    </div>
                  );
                }) : (
                  <p className={`opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Loading benefits...</p>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`p-8 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
            >
              <div className="space-y-6">
                {howItWorks.length > 0 ? howItWorks.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center text-white font-bold flex-shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <h3 className={`font-bold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                        {step.title}
                      </h3>
                      <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                )) : (
                  <p className={`opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Loading steps...</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              What Our Users Say
            </h2>
            <p className={`text-lg opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Trusted by entrepreneurs and investors worldwide
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.length > 0 ? reviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className={`mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  "{review.text}"
                </p>
                <div>
                  <p className={`font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                    {review.name}
                  </p>
                  <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                    {review.role}
                  </p>
                </div>
              </motion.div>
            )) : (
              <p className={`text-center opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Loading reviews...</p>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.length > 0 ? faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className={`font-semibold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                    {faq.question}
                  </span>
                  <ChevronDown className={`transition-transform ${activeFaq === index ? 'rotate-180' : ''}`} size={20} />
                </button>
                {activeFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-[#334155]' : 'border-[#e2e8f0]'}`}
                  >
                    <p className={`opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )) : (
              <p className={`text-center opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Loading FAQs...</p>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Get In Touch
            </h2>
            <p className={`text-lg opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Have questions? We'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`p-6 rounded-2xl border text-center ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
            >
              <Mail className="text-[#2563eb] mx-auto mb-4" size={32} />
              <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Email Us</h3>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>support@marketgapfinder.com</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={`p-6 rounded-2xl border text-center ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
            >
              <Phone className="text-[#2563eb] mx-auto mb-4" size={32} />
              <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Call Us</h3>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>+91 98765 43210</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={`p-6 rounded-2xl border text-center ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
            >
              <MessageSquare className="text-[#2563eb] mx-auto mb-4" size={32} />
              <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Live Chat</h3>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Available 24/7</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`max-w-2xl mx-auto p-8 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
          >
            <div className="grid gap-4">
              <input 
                type="text" 
                placeholder="Your Name" 
                className={`px-4 py-3 rounded-lg border bg-transparent outline-none focus:border-[#2563eb] transition-colors ${isDarkMode ? 'text-[#f1f5f9] border-[#334155]' : 'text-[#1e293b] border-[#e2e8f0]'}`}
              />
              <input 
                type="email" 
                placeholder="Your Email" 
                className={`px-4 py-3 rounded-lg border bg-transparent outline-none focus:border-[#2563eb] transition-colors ${isDarkMode ? 'text-[#f1f5f9] border-[#334155]' : 'text-[#1e293b] border-[#e2e8f0]'}`}
              />
              <textarea 
                placeholder="Your Message" 
                rows={4}
                className={`px-4 py-3 rounded-lg border bg-transparent outline-none focus:border-[#2563eb] transition-colors resize-none ${isDarkMode ? 'text-[#f1f5f9] border-[#334155]' : 'text-[#1e293b] border-[#e2e8f0]'}`}
              />
              <button className="px-8 py-3 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Send Message
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-4 sm:px-6 lg:px-8 border-t ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Target className="text-[#2563eb]" size={24} />
                <span className="font-bold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent">
                  Market Gap Finder
                </span>
              </div>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                AI-powered platform to identify underserved business opportunities with real market intelligence.
              </p>
            </div>
            <div>
              <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className={`text-sm opacity-70 hover:opacity-100 transition-opacity ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Features</a></li>
                <li><a href="#pricing" className={`text-sm opacity-70 hover:opacity-100 transition-opacity ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Pricing</a></li>
                <li><a href="#faq" className={`text-sm opacity-70 hover:opacity-100 transition-opacity ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Company</h4>
              <ul className="space-y-2">
                <li><a href="#about" className={`text-sm opacity-70 hover:opacity-100 transition-opacity ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>About</a></li>
                <li><a href="#contact" className={`text-sm opacity-70 hover:opacity-100 transition-opacity ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Contact</a></li>
                <li><a href="#careers" className={`text-sm opacity-70 hover:opacity-100 transition-opacity ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Legal</h4>
              <ul className="space-y-2">
                <li><a href="#privacy" className={`text-sm opacity-70 hover:opacity-100 transition-opacity ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Privacy Policy</a></li>
                <li><a href="#terms" className={`text-sm opacity-70 hover:opacity-100 transition-opacity ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className={`pt-8 border-t ${isDarkMode ? 'border-[#334155]' : 'border-[#e2e8f0]'}`}>
            <p className={`text-center text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              © 2024 Market Gap Finder. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
