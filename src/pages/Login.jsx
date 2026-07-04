import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register, guestLogin, handleGoogleCallback } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: localStorage.getItem('rememberedEmail') || '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('rememberedEmail'));

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    
    if (error) {
      setError(error === 'oauth_failed' ? 'Google sign-in failed. Please try again.' : 
               error === 'google_oauth_not_configured' ? 'Google sign-in is not configured.' :
               error === 'google_auth_failed' ? 'Google authentication failed.' :
               'An error occurred during sign-in.');
      return;
    }
    
    if (token) {
      setLoading(true);
      handleGoogleCallback(token).then(result => {
        if (result?.success) {
          navigate('/dashboard');
        } else {
          setError(result?.message || 'Failed to complete Google sign-in');
        }
      }).catch(() => {
        setError('Failed to complete Google sign-in');
      }).finally(() => setLoading(false));
      return;
    }
    
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
    }
  }, [searchParams, handleGoogleCallback, navigate]);

  const handleGoogleSignIn = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const handleGuestAccess = async () => {
    setLoading(true);
    try {
      const result = await guestLogin();
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Guest access failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        if (formData.email && formData.password) {
          if (rememberMe) {
            localStorage.setItem('rememberedEmail', formData.email);
          } else {
            localStorage.removeItem('rememberedEmail');
          }
          const result = await login(formData.email, formData.password);
          if (result.success) {
            navigate('/dashboard');
          } else {
            setError(result.message || 'Login failed');
          }
        } else {
          setError('Please fill in all fields');
        }
      } else {
        // Handle signup
        if (formData.email && formData.password && formData.name && formData.confirmPassword) {
          if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
          }
          const result = await register(formData.name, formData.email, formData.password);
          if (result.success) {
            navigate('/dashboard');
          } else {
            setError(result.message || 'Registration failed');
          }
        } else {
          setError('Please fill in all fields');
        }
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

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-center relative overflow-hidden bg-gradient-to-br from-[#667eea] to-[#764ba2]">
      <div className="absolute top-0 left-0 right-0 bottom-0 z-0">
        <div className="relative w-full h-full">
          <div className="absolute rounded-full opacity-10 animate-[float_6s_ease-in-out_infinite] bg-white w-[300px] h-[300px] -top-[100px] -left-[100px]" style={{ animationDelay: '0s' }}></div>
          <div className="absolute rounded-full opacity-10 animate-[float_6s_ease-in-out_infinite] bg-white w-[200px] h-[200px] -bottom-[50px] -right-[50px]" style={{ animationDelay: '2s' }}></div>
          <div className="absolute rounded-full opacity-10 animate-[float_6s_ease-in-out_infinite] bg-white w-[150px] h-[150px] top-1/2 right-[20%]" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>

      <motion.div
        className="relative z-10 bg-white rounded-3xl p-12 w-full max-w-[450px] m-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-[#666] text-sm">
            {isLogin ? 'Sign in to continue to Market Gap Finder' : 'Join us to discover market opportunities'}
          </p>
        </div>

        <div className="flex gap-2 mb-8 bg-[#f5f5f5] p-1 rounded-xl">
          <button
            className={`flex-1 py-3 border-none bg-transparent text-[#666] text-sm font-semibold cursor-pointer rounded-lg transition-all duration-300 ${isLogin ? 'bg-white text-[#667eea] shadow-[0_2px_8px_rgba(0,0,0,0.1)]' : 'hover:text-[#333]'}`}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-3 border-none bg-transparent text-[#666] text-sm font-semibold cursor-pointer rounded-lg transition-all duration-300 ${!isLogin ? 'bg-white text-[#667eea] shadow-[0_2px_8px_rgba(0,0,0,0.1)]' : 'hover:text-[#333]'}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-5 mb-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-semibold text-[#333]">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="p-3.5 border-2 border-[#e0e0e0] rounded-xl text-base transition-all duration-300 outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] placeholder:text-[#999]"
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold text-[#333]">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="p-3.5 border-2 border-[#e0e0e0] rounded-xl text-base transition-all duration-300 outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] placeholder:text-[#999]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-semibold text-[#333]">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="p-3.5 border-2 border-[#e0e0e0] rounded-xl text-base transition-all duration-300 outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] placeholder:text-[#999]"
            />
          </div>

          {!isLogin && (
            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-[#333]">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                className="p-3.5 border-2 border-[#e0e0e0] rounded-xl text-base transition-all duration-300 outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] placeholder:text-[#999]"
              />
            </div>
          )}

          {isLogin && (
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-[#666]">
                <input type="checkbox" className="w-4 h-4 cursor-pointer" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-[#667eea] no-underline font-semibold transition-colors duration-300 hover:text-[#764ba2]">Forgot password?</Link>
            </div>
          )}

          <button type="submit" disabled={loading} className="py-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-none rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(102,126,234,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(102,126,234,0.4)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="flex items-center my-6 text-[#999] text-sm">
          <div className="flex-1 h-px bg-[#e0e0e0]"></div>
          <span className="px-4">or continue with</span>
          <div className="flex-1 h-px bg-[#e0e0e0]"></div>
        </div>

        <button className="flex items-center justify-center gap-3 p-3.5 bg-white border-2 border-[#e0e0e0] rounded-xl text-base font-semibold text-[#333] cursor-pointer transition-all duration-300 mb-4 hover:border-[#667eea] hover:bg-[#f8f9ff] hover:-translate-y-0.5" onClick={handleGoogleSignIn}>
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>

        <button className="flex items-center justify-center gap-3 p-3.5 bg-[#f8f9ff] border-2 border-[#667eea] rounded-xl text-base font-semibold text-[#667eea] cursor-pointer transition-all duration-300 mb-6 hover:bg-[#667eea] hover:text-white hover:-translate-y-0.5" onClick={handleGuestAccess}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Continue as Guest</span>
        </button>

        <div className="text-center text-sm text-[#666]">
          <p className="m-0">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={toggleMode} className="bg-none border-none text-[#667eea] font-semibold cursor-pointer p-0 text-sm transition-colors duration-300 hover:text-[#764ba2]">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
