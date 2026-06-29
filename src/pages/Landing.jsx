import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
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

  const faqs = [
    {
      question: "What is Market Gap Finder?",
      answer: "Market Gap Finder is a data analytics platform that analyzes business density, population, and demand indicators across Tamil Nadu pincodes to identify underserved business opportunities."
    },
    {
      question: "How accurate is the data?",
      answer: "Our data is sourced from reliable government census data, Google Maps business listings, and verified business directories. We continuously update our database to ensure accuracy."
    },
    {
      question: "Can I export reports?",
      answer: "Yes, you can export comprehensive PDF reports containing all analysis data including market gap scores, competitor analysis, and demand forecasts for offline review."
    },
    {
      question: "Which districts are covered?",
      answer: "Currently, we cover Chennai, Coimbatore, Madurai, Tiruchirappalli, Salem, and Erode districts with plans to expand to all Tamil Nadu districts."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes, we offer a free guest access that allows you to explore basic features. Sign up for a free account to unlock advanced analytics and reporting features."
    }
  ];

  const features = [
    { icon: BarChart3, title: "Pincode Analysis", desc: "Detailed market gap analysis by specific pincodes" },
    { icon: TrendingUp, title: "Demand Forecasting", desc: "Project future demand based on growth trends" },
    { icon: MapPin, title: "Interactive Maps", desc: "Visual heat maps of market opportunities" },
    { icon: Users, title: "Demographics", desc: "Population data and income level analysis" },
    { icon: Zap, title: "AI Recommendations", desc: "Smart business suggestions powered by AI" },
    { icon: Target, title: "Competitor Tracking", desc: "Track existing businesses and market saturation" }
  ];

  const benefits = [
    { icon: CheckCircle, title: "Data-Driven Decisions", desc: "Make informed business decisions backed by real data" },
    { icon: Clock, title: "Save Time", desc: "Skip manual research with instant market insights" },
    { icon: Shield, title: "Reduce Risk", desc: "Identify high-potential areas with low competition" },
    { icon: Award, title: "Stay Ahead", desc: "Discover opportunities before competitors do" }
  ];

  const reviews = [
    { name: "Rajesh Kumar", role: "Restaurant Owner", rating: 5, text: "Market Gap Finder helped me find the perfect location for my new restaurant. The competitor analysis was spot on!" },
    { name: "Priya Sharma", role: "Franchise Consultant", rating: 5, text: "An essential tool for anyone looking to expand their business in Tamil Nadu. The data is incredibly accurate." },
    { name: "Suresh Babu", role: "Retail Entrepreneur", rating: 4, text: "Great platform for identifying underserved areas. The demand forecasting feature is particularly useful." }
  ];

  const howItWorks = [
    { step: 1, title: "Select Location", desc: "Choose your target district or pincode from our covered areas" },
    { step: 2, title: "Analyze Data", desc: "View comprehensive market analysis including competitors and demand" },
    { step: 3, title: "Get Insights", desc: "Receive AI-powered recommendations and opportunity scores" },
    { step: 4, title: "Make Decision", desc: "Export reports and make data-driven business decisions" }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-bg-dark' : 'bg-bg-light'}`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl ${isDarkMode ? 'bg-bg-dark/80 border-border-dark' : 'bg-bg-light/80 border-border-light'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Target className="text-primary-blue" size={32} />
              <span className={`text-xl font-bold bg-gradient-to-r from-primary-blue to-primary-purple bg-clip-text text-transparent`}>
                Market Gap Finder
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className={`text-sm font-medium hover:text-primary-blue transition-colors ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Features</a>
              <a href="#how-it-works" className={`text-sm font-medium hover:text-primary-blue transition-colors ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>How It Works</a>
              <a href="#reviews" className={`text-sm font-medium hover:text-primary-blue transition-colors ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Reviews</a>
              <a href="#faq" className={`text-sm font-medium hover:text-primary-blue transition-colors ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>FAQ</a>
              <a href="#contact" className={`text-sm font-medium hover:text-primary-blue transition-colors ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Contact</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-text-dark hover:bg-card-dark' : 'text-text-light hover:bg-card-light'}`}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link to="/login" className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDarkMode ? 'text-text-dark hover:bg-card-dark' : 'text-text-light hover:bg-card-light'}`}>
                Login
              </Link>
              <Link to="/signup" className="px-4 py-2 bg-gradient-to-r from-primary-blue to-primary-purple text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                Sign Up
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
            className={`md:hidden border-t p-4 ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}
          >
            <div className="flex flex-col gap-4">
              <a href="#features" className={`text-sm font-medium ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Features</a>
              <a href="#how-it-works" className={`text-sm font-medium ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>How It Works</a>
              <a href="#reviews" className={`text-sm font-medium ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Reviews</a>
              <a href="#faq" className={`text-sm font-medium ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>FAQ</a>
              <a href="#contact" className={`text-sm font-medium ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Contact</a>
              <div className="flex gap-2 pt-4 border-t">
                <Link to="/login" className="flex-1 px-4 py-2 rounded-lg font-medium text-center border">Login</Link>
                <Link to="/signup" className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-blue to-primary-purple text-white rounded-lg font-medium text-center">Sign Up</Link>
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary-blue text-sm font-medium mb-6">
                <Zap size={16} />
                <span>AI-Powered Market Intelligence</span>
              </div>
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                Find Your Next
                <span className="block bg-gradient-to-r from-primary-blue to-primary-purple bg-clip-text text-transparent">
                  Business Opportunity
                </span>
              </h1>
              <p className={`text-lg mb-8 opacity-80 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                Data-driven platform to identify underserved business opportunities across Tamil Nadu. 
                Make informed decisions with real market intelligence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/signup" className="px-8 py-4 bg-gradient-to-r from-primary-blue to-primary-purple text-white rounded-xl font-semibold text-center hover:opacity-90 transition-opacity shadow-lg">
                  Get Started Free
                  <ArrowRight className="inline ml-2" size={20} />
                </Link>
                <Link to="/login" className={`px-8 py-4 rounded-xl font-semibold text-center border-2 transition-colors ${isDarkMode ? 'text-text-dark border-border-dark hover:bg-card-dark' : 'text-text-light border-border-light hover:bg-card-light'}`}>
                  View Demo
                  <Play className="inline ml-2" size={20} />
                </Link>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-blue to-primary-purple border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold">
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
                  <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                    Trusted by 10,000+ entrepreneurs
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
              <div className={`relative rounded-2xl border-2 p-8 backdrop-blur-xl ${isDarkMode ? 'bg-card-dark border-primary-blue' : 'bg-card-light border-primary-blue'}`}>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-primary-blue to-primary-purple rounded-full opacity-20 blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-r from-primary-purple to-primary-blue rounded-full opacity-20 blur-2xl" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <Search className="text-primary-blue" size={24} />
                    <input 
                      type="text" 
                      placeholder="Search by district, area, or pincode..." 
                      className={`flex-1 px-4 py-3 rounded-lg border bg-transparent outline-none focus:border-primary-blue transition-colors ${isDarkMode ? 'text-text-dark border-border-dark' : 'text-text-light border-border-light'}`}
                    />
                    <button className="p-3 bg-gradient-to-r from-primary-blue to-primary-purple text-white rounded-lg hover:opacity-90 transition-opacity">
                      <Mic size={20} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-bg-dark border-border-dark' : 'bg-bg-light border-border-light'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Chennai - T. Nagar</span>
                        <span className="text-green-500 font-bold">92% Opportunity</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary-blue to-primary-purple rounded-full" style={{ width: '92%' }} />
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-bg-dark border-border-dark' : 'bg-bg-light border-border-light'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Coimbatore - Gandhipuram</span>
                        <span className="text-yellow-500 font-bold">78% Opportunity</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary-blue to-primary-purple rounded-full" style={{ width: '78%' }} />
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-bg-dark border-border-dark' : 'bg-bg-light border-border-light'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Madurai - Anna Nagar</span>
                        <span className="text-green-500 font-bold">85% Opportunity</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary-blue to-primary-purple rounded-full" style={{ width: '85%' }} />
                      </div>
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
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
              Powerful Features for Smart Decisions
            </h2>
            <p className={`text-lg opacity-70 max-w-2xl mx-auto ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
              Everything you need to identify and validate business opportunities
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-2 ${isDarkMode ? 'bg-card-dark border-border-dark hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]' : 'bg-card-light border-border-light hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]'}`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-blue to-primary-purple flex items-center justify-center mb-4">
                  <feature.icon className="text-white" size={24} />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{feature.title}</h3>
                <p className={`opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-blue/10 to-primary-purple/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
              Why Choose Market Gap Finder?
            </h2>
            <p className={`text-lg opacity-70 max-w-2xl mx-auto ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
              Stop guessing. Start growing with data-driven insights
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-blue to-primary-purple flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="text-white" size={32} />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{benefit.title}</h3>
                <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
              How It Works
            </h2>
            <p className={`text-lg opacity-70 max-w-2xl mx-auto ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
              Get started in 4 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r from-primary-blue to-primary-purple flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold`}>
                  {item.step}
                </div>
                <h3 className={`text-lg font-bold mb-2 text-center ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{item.title}</h3>
                <p className={`text-sm opacity-70 text-center ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{item.desc}</p>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-primary-blue/30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-blue/10 to-primary-purple/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
              What Our Users Say
            </h2>
            <p className={`text-lg opacity-70 max-w-2xl mx-auto ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
              Trusted by entrepreneurs across Tamil Nadu
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className={`mb-4 opacity-80 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{review.text}</p>
                <div>
                  <p className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{review.name}</p>
                  <p className={`text-sm opacity-60 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{review.role}</p>
                </div>
              </motion.div>
            ))}
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
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
              Frequently Asked Questions
            </h2>
            <p className={`text-lg opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
              Got questions? We've got answers
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className={`font-semibold ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{faq.question}</span>
                  <ChevronDown 
                    className={`transition-transform ${activeFaq === index ? 'rotate-180' : ''} ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`} 
                    size={20} 
                  />
                </button>
                {activeFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="px-6 pb-4"
                  >
                    <p className={`opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-blue/10 to-primary-purple/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
              Get In Touch
            </h2>
            <p className={`text-lg opacity-70 max-w-2xl mx-auto ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
              Have questions? We'd love to hear from you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`p-6 rounded-2xl border text-center ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}
            >
              <Mail className="text-primary-blue mx-auto mb-4" size={32} />
              <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Email Us</h3>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>support@marketgapfinder.com</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={`p-6 rounded-2xl border text-center ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}
            >
              <Phone className="text-primary-blue mx-auto mb-4" size={32} />
              <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Call Us</h3>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>+91 98765 43210</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={`p-6 rounded-2xl border text-center ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}
            >
              <MessageSquare className="text-primary-blue mx-auto mb-4" size={32} />
              <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Live Chat</h3>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Available 24/7</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`max-w-2xl mx-auto p-8 rounded-2xl border ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}
          >
            <div className="grid gap-4">
              <input 
                type="text" 
                placeholder="Your Name" 
                className={`px-4 py-3 rounded-lg border bg-transparent outline-none focus:border-primary-blue transition-colors ${isDarkMode ? 'text-text-dark border-border-dark' : 'text-text-light border-border-light'}`}
              />
              <input 
                type="email" 
                placeholder="Your Email" 
                className={`px-4 py-3 rounded-lg border bg-transparent outline-none focus:border-primary-blue transition-colors ${isDarkMode ? 'text-text-dark border-border-dark' : 'text-text-light border-border-light'}`}
              />
              <textarea 
                placeholder="Your Message" 
                rows={4}
                className={`px-4 py-3 rounded-lg border bg-transparent outline-none focus:border-primary-blue transition-colors resize-none ${isDarkMode ? 'text-text-dark border-border-dark' : 'text-text-light border-border-light'}`}
              />
              <button className="px-8 py-3 bg-gradient-to-r from-primary-blue to-primary-purple text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Send Message
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-4 sm:px-6 lg:px-8 border-t ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Target className="text-primary-blue" size={24} />
                <span className={`text-lg font-bold bg-gradient-to-r from-primary-blue to-primary-purple bg-clip-text text-transparent`}>
                  Market Gap Finder
                </span>
              </div>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
                Data-driven platform for identifying business opportunities across Tamil Nadu.
              </p>
            </div>
            <div>
              <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className={`text-sm opacity-70 hover:opacity-100 transition-opacity ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Features</a></li>
                <li><a href="#pricing" className={`text-sm opacity-70 hover:opacity-100 transition-opacity ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Pricing</a></li>
                <li><a href="#faq" className={`text-sm opacity-70 hover:opacity-100 transition-opacity ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Company</h4>
              <ul className="space-y-2">
                <li><a href="#about" className={`text-sm opacity-70 hover:opacity-100 transition-opacity ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>About</a></li>
                <li><a href="#contact" className={`text-sm opacity-70 hover:opacity-100 transition-opacity ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Contact</a></li>
                <li><a href="#careers" className={`text-sm opacity-70 hover:opacity-100 transition-opacity ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Legal</h4>
              <ul className="space-y-2">
                <li><a href="#privacy" className={`text-sm opacity-70 hover:opacity-100 transition-opacity ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Privacy Policy</a></li>
                <li><a href="#terms" className={`text-sm opacity-70 hover:opacity-100 transition-opacity ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className={`pt-8 border-t ${isDarkMode ? 'border-border-dark' : 'border-border-light'}`}>
            <p className={`text-center text-sm opacity-70 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>
              © 2024 Market Gap Finder. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
