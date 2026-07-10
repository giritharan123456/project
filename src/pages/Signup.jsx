import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, 
  AlertCircle, Target, Zap, Shield, Globe
} from 'lucide-react';

function Signup() {
  const { isDarkMode } = useTheme();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const result = await register(formData.name, formData.email, formData.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrors({ form: result.message || 'Registration failed' });
      }
    } catch (err) {
      setErrors({ form: err.message || 'Registration failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-3 sm:p-4 lg:p-8 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] rounded-full opacity-20 blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-r from-[#7c3aed] to-[#2563eb] rounded-full opacity-20 blur-3xl" />
            
            <div className={`relative p-8 sm:p-12 rounded-3xl border-2 backdrop-blur-xl ${isDarkMode ? 'bg-[#1e293b] border-[#2563eb]' : 'bg-[#ffffff] border-[#2563eb]'}`}>
              <div className="flex items-center gap-3 mb-8">
                <Target className="text-[#2563eb] size-32 sm:size-40" />
                <div>
                  <h1 className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent`}>
                    MarketVision AI
                  </h1>
                  <p className={`text-xs sm:text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                    Data-driven business intelligence
                  </p>
                </div>
              </div>

              <div className="space-y-5 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center flex-shrink-0">
                    <Zap className="text-white size-20 sm:size-24" />
                  </div>
                  <div>
                    <h3 className={`font-bold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>AI-Powered Insights</h3>
                    <p className={`text-xs sm:text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      Get intelligent recommendations powered by advanced AI algorithms
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center flex-shrink-0">
                    <Shield className="text-white size-20 sm:size-24" />
                  </div>
                  <div>
                    <h3 className={`font-bold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Data-Driven Decisions</h3>
                    <p className={`text-xs sm:text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      Make informed business decisions backed by real market data
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center flex-shrink-0">
                    <Globe className="text-white size-20 sm:size-24" />
                  </div>
                  <div>
                    <h3 className={`font-bold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Comprehensive Coverage</h3>
                    <p className={`text-xs sm:text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      Access data across all major districts
                    </p>
                  </div>
                </div>
              </div>

              <div className={`mt-6 sm:mt-8 p-3 sm:p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                <p className={`text-xs sm:text-sm font-semibold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  Already have an account?
                </p>
                <Link 
                  to="/login" 
                  className="text-[#2563eb] font-semibold hover:underline inline-flex items-center gap-1"
                >
                  Login here <ArrowRight size={14} className="sm:size-16" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Signup Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={`p-4 sm:p-6 lg:p-8 rounded-3xl border backdrop-blur-xl ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}>
            <div className="text-center mb-6 sm:mb-8">
              <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Create Account
              </h2>
              <p className={`text-xs sm:text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Join thousands of entrepreneurs making data-driven decisions
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className={`block text-xs sm:text-sm font-semibold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  Full Name
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-[#f1f5f9] opacity-50' : 'text-[#1e293b] opacity-50'} size-[18px] sm:size-5`} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl border bg-transparent outline-none focus:border-[#2563eb] transition-colors ${isDarkMode ? 'text-[#f1f5f9] border-[#334155]' : 'text-[#1e293b] border-[#e2e8f0]'} ${errors.name ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={10} className="sm:size-12" /> {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-semibold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-[#f1f5f9] opacity-50' : 'text-[#1e293b] opacity-50'} size-[18px] sm:size-5`} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={`w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl border bg-transparent outline-none focus:border-[#2563eb] transition-colors ${isDarkMode ? 'text-[#f1f5f9] border-[#334155]' : 'text-[#1e293b] border-[#e2e8f0]'} ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={10} className="sm:size-12" /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-semibold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  Password
                </label>
<div className="relative">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-[#f1f5f9] opacity-50' : 'text-[#1e293b] opacity-50'} size-[18px] sm:size-5`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className={`w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl border bg-transparent outline-none focus:border-[#2563eb] transition-colors ${isDarkMode ? 'text-[#f1f5f9] border-[#334155]' : 'text-[#1e293b] border-[#e2e8f0]'} ${errors.password ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-[#f1f5f9] opacity-50' : 'text-[#1e293b] opacity-50'}`}
                  >
                    {showPassword ? <EyeOff size={18} className="sm:size-20" /> : <Eye size={18} className="sm:size-20" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={10} className="sm:size-12" /> {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-semibold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  Confirm Password
                </label>
<div className="relative">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-[#f1f5f9] opacity-50' : 'text-[#1e293b] opacity-50'} size-[18px] sm:size-5`} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={`w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl border bg-transparent outline-none focus:border-[#2563eb] transition-colors ${isDarkMode ? 'text-[#f1f5f9] border-[#334155]' : 'text-[#1e293b] border-[#e2e8f0]'} ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-[#f1f5f9] opacity-50' : 'text-[#1e293b] opacity-50'}`}
                  >
                    {showConfirmPassword ? <EyeOff size={18} className="sm:size-20" /> : <Eye size={18} className="sm:size-20" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={10} className="sm:size-12" /> {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className={`p-3 sm:p-4 rounded-xl ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
                <p className={`text-[10px] sm:text-xs font-semibold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  Password requirements:
                </p>
                <ul className="space-y-1">
                  <li className={`text-[10px] sm:text-xs flex items-center gap-1.5 ${formData.password.length >= 8 ? 'text-green-500' : 'opacity-50'}`}>
                    <CheckCircle size={10} className="sm:size-12" /> At least 8 characters
                  </li>
                  <li className={`text-[10px] sm:text-xs flex items-center gap-1.5 ${/[A-Z]/.test(formData.password) ? 'text-green-500' : 'opacity-50'}`}>
                    <CheckCircle size={10} className="sm:size-12" /> One uppercase letter
                  </li>
                  <li className={`text-[10px] sm:text-xs flex items-center gap-1.5 ${/[0-9]/.test(formData.password) ? 'text-green-500' : 'opacity-50'}`}>
                    <CheckCircle size={10} className="sm:size-12" /> One number
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} className="sm:size-20" />
                  </>
                )}
              </button>

              <div className="text-center">
                <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#2563eb] font-semibold hover:underline">
                    Login
                  </Link>
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${isDarkMode ? 'border-[#334155]' : 'border-[#e2e8f0]'}`} />
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className={`px-3 ${isDarkMode ? 'bg-[#1e293b] text-[#f1f5f9]' : 'bg-[#ffffff] text-[#1e293b]'}`}>
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || '/api'}/auth/google`}
                  className={`py-2.5 sm:py-3 rounded-xl border font-semibold transition-colors flex items-center justify-center gap-2 ${isDarkMode ? 'text-[#f1f5f9] border-[#334155] hover:bg-[#1e293b]' : 'text-[#1e293b] border-[#e2e8f0] hover:bg-[#ffffff]'}`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  disabled
                  className={`py-2.5 sm:py-3 rounded-xl border font-semibold transition-colors flex items-center justify-center gap-2 opacity-50 cursor-not-allowed ${isDarkMode ? 'text-[#f1f5f9] border-[#334155]' : 'text-[#1e293b] border-[#e2e8f0]'}`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </button>
              </div>
            </form>
          </div>

          {/* Mobile branding */}
          <div className="lg:hidden mt-6 sm:mt-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
              <Target className="text-[#2563eb] size-28 sm:size-32" />
              <span className={`text-lg sm:text-xl font-bold bg-gradient-to-r from-[#2563eb] to-[#7c3aed] bg-clip-text text-transparent`}>
                MarketVision AI
              </span>
            </div>
            <p className={`text-xs sm:text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Data-driven platform for identifying business opportunities
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Signup;
