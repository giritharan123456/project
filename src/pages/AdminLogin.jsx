import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        // Check if user is admin
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (user?.role === 'admin') {
          navigate('/admin');
        } else {
          setError('Access denied. Admin privileges required.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-center relative overflow-hidden bg-gradient-to-br from-red-600 to-red-900">
      <div className="absolute top-0 left-0 right-0 bottom-0 z-0">
        <div className="relative w-full h-full">
          <div className="absolute rounded-full opacity-10 animate-[float_6s_ease-in-out_infinite] bg-white w-[300px] h-[300px] -top-[100px] -left-[100px]" style={{ animationDelay: '0s' }}></div>
          <div className="absolute rounded-full opacity-10 animate-[float_6s_ease-in-out_infinite] bg-white w-[200px] h-[200px] -bottom-[50px] -right-[50px]" style={{ animationDelay: '2s' }}></div>
          <div className="absolute rounded-full opacity-10 animate-[float_6s_ease-in-out_infinite] bg-white w-[150px] h-[150px] top-1/2 right-[20%]" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>

      <motion.div
        className={`relative z-10 rounded-3xl p-6 sm:p-10 w-full max-w-[450px] m-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] ${isDarkMode ? 'bg-[#1e293b]' : 'bg-white'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">👑</div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-red-600 to-red-900 bg-clip-text text-transparent">
            Admin Portal
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-[#666]'}`}>
            Secure access for administrators only
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-5 mb-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#333]'}`}>Admin Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              required
              className={`p-3.5 border-2 rounded-xl text-base transition-all duration-300 outline-none focus:border-red-600 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)] placeholder:text-[#999] ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-[#e0e0e0]'}`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-[#333]'}`}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter admin password"
              required
              className={`p-3.5 border-2 rounded-xl text-base transition-all duration-300 outline-none focus:border-red-600 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)] placeholder:text-[#999] ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-[#e0e0e0]'}`}
            />
          </div>

          <button type="submit" disabled={loading} className="py-4 bg-gradient-to-r from-red-600 to-red-900 text-white border-none rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(220,38,38,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(220,38,38,0.4)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Authenticating...' : 'Access Admin Panel'}
          </button>
        </form>

        <div className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-[#666]'}`}>
          <p className="m-0">
            <button 
              onClick={() => navigate('/')}
              className="bg-none border-none text-red-600 font-semibold cursor-pointer p-0 text-sm transition-colors duration-300 hover:text-red-900"
            >
              ← Back to Home
            </button>
          </p>
        </div>

        <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <p className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            🔒 This portal is restricted to authorized administrators only. 
            All access attempts are logged.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
