import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { authAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

function ForgotPassword() {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetUrl, setResetUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await authAPI.forgotPassword({ email });
      if (res.success) {
        setMessage(res.message);
        if (res.resetUrl) setResetUrl(res.resetUrl);
      } else {
        setError(res.message || 'Request failed');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center relative overflow-hidden bg-gradient-to-br from-[#667eea] to-[#764ba2]">
      <motion.div
        className={`relative z-10 rounded-3xl p-6 sm:p-10 w-full max-w-[450px] m-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] ${isDarkMode ? 'bg-[#1e293b]' : 'bg-white'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Forgot Password
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-[#666]'}`}>
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {error && (
          <div className={`mb-6 p-3 rounded-lg text-sm flex items-center gap-2 ${isDarkMode ? 'bg-red-900/30 border border-red-800 text-red-300' : 'bg-red-50 border border-red-200 text-red-600'}`}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {message && (
          <div className={`mb-6 p-3 rounded-lg text-sm flex items-center gap-2 ${isDarkMode ? 'bg-green-900/30 border border-green-800 text-green-300' : 'bg-green-50 border border-green-200 text-green-600'}`}>
            <CheckCircle size={16} /> {message}
          </div>
        )}

        {resetUrl && import.meta.env.DEV && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs break-all">
            <strong>Dev mode:</strong> Use this link to reset your password:<br />
            <a href={resetUrl} className="underline">{resetUrl}</a>
          </div>
        )}

        <form className="flex flex-col gap-5 mb-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#333]'}`}>Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]" size={20} />
              <input
                type="email" id="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" required
                className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl text-base outline-none focus:border-[#667eea] placeholder:text-[#999] ${isDarkMode ? 'bg-[#0f172a] border-[#334155] text-white' : 'border-[#e0e0e0]'}`}
              />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="py-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-none rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(102,126,234,0.3)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="text-center">
          <Link to="/login" className="text-[#667eea] no-underline font-semibold text-sm inline-flex items-center gap-1 hover:text-[#764ba2]">
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
