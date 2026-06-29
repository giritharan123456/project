import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-xl border-b shadow-lg ${
      isDarkMode 
        ? 'bg-card-dark/80 border-border-dark shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' 
        : 'bg-card-light/80 border-border-light shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'
    }`}>
      <div className="max-w-[1600px] mx-auto px-8 py-3 flex justify-between items-center">
        <Link to="/home" className={`flex items-center gap-3 text-xl font-bold no-underline transition-all duration-300 ${
          isDarkMode ? 'text-text-dark' : 'text-text-light'
        }`}>
          <span className="text-2xl">🇮🇳</span>
          <span className="bg-gradient-to-r from-primary-blue to-primary-purple bg-clip-text text-transparent">TN Market Gap Finder</span>
        </Link>
        <ul className="flex list-none m-0 p-0 gap-2">
          <li className="m-0">
            <Link to="/dashboard" className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg transition-all duration-300 bg-transparent no-underline ${
              isDarkMode ? 'text-text-dark hover:bg-gradient-to-r hover:from-primary-blue hover:to-primary-purple hover:text-white hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'text-text-light hover:bg-gradient-to-r hover:from-primary-blue hover:to-primary-purple hover:text-white hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'
            }`}>
              <span className="text-lg">📊</span>
              <span className="hidden md:inline">Dashboard</span>
            </Link>
          </li>
          <li className="m-0">
            <Link to="/ai-recommendations" className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg transition-all duration-300 bg-transparent no-underline ${
              isDarkMode ? 'text-text-dark hover:bg-gradient-to-r hover:from-primary-blue hover:to-primary-purple hover:text-white hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'text-text-light hover:bg-gradient-to-r hover:from-primary-blue hover:to-primary-purple hover:text-white hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'
            }`}>
              <span className="text-lg">🤖</span>
              <span className="hidden md:inline">AI</span>
            </Link>
          </li>
          <li className="m-0">
            <Link to="/forecast" className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg transition-all duration-300 bg-transparent no-underline ${
              isDarkMode ? 'text-text-dark hover:bg-gradient-to-r hover:from-primary-blue hover:to-primary-purple hover:text-white hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'text-text-light hover:bg-gradient-to-r hover:from-primary-blue hover:to-primary-purple hover:text-white hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'
            }`}>
              <span className="text-lg">📈</span>
              <span className="hidden md:inline">Forecast</span>
            </Link>
          </li>
          <li className="m-0">
            <Link to="/comparison" className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg transition-all duration-300 bg-transparent no-underline ${
              isDarkMode ? 'text-text-dark hover:bg-gradient-to-r hover:from-primary-blue hover:to-primary-purple hover:text-white hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'text-text-light hover:bg-gradient-to-r hover:from-primary-blue hover:to-primary-purple hover:text-white hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'
            }`}>
              <span className="text-lg">⚖️</span>
              <span className="hidden md:inline">Compare</span>
            </Link>
          </li>
          <li className="m-0">
            <Link to="/notifications" className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg transition-all duration-300 bg-transparent no-underline ${
              isDarkMode ? 'text-text-dark hover:bg-gradient-to-r hover:from-primary-blue hover:to-primary-purple hover:text-white hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'text-text-light hover:bg-gradient-to-r hover:from-primary-blue hover:to-primary-purple hover:text-white hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'
            }`}>
              <span className="text-lg">�</span>
              <span className="hidden md:inline">Alerts</span>
            </Link>
          </li>
          <li className="m-0">
            <Link to="/workspace" className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg transition-all duration-300 bg-transparent no-underline ${
              isDarkMode ? 'text-text-dark hover:bg-gradient-to-r hover:from-primary-blue hover:to-primary-purple hover:text-white hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'text-text-light hover:bg-gradient-to-r hover:from-primary-blue hover:to-primary-purple hover:text-white hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'
            }`}>
              <span className="text-lg">👤</span>
              <span className="hidden md:inline">Workspace</span>
            </Link>
          </li>
          <li className="m-0">
            <Link to="/analytics" className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg transition-all duration-300 bg-transparent no-underline ${
              isDarkMode ? 'text-text-dark hover:bg-gradient-to-r hover:from-primary-blue hover:to-primary-purple hover:text-white hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'text-text-light hover:bg-gradient-to-r hover:from-primary-blue hover:to-primary-purple hover:text-white hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'
            }`}>
              <span className="text-lg">�</span>
              <span className="hidden md:inline">Analytics</span>
            </Link>
          </li>
          <li className="m-0">
            <Link to="/reports" className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg transition-all duration-300 bg-transparent no-underline ${
              isDarkMode ? 'text-text-dark hover:bg-gradient-to-r hover:from-primary-blue hover:to-primary-purple hover:text-white hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'text-text-light hover:bg-gradient-to-r hover:from-primary-blue hover:to-primary-purple hover:text-white hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'
            }`}>
              <span className="text-lg">📋</span>
              <span className="hidden md:inline">Reports</span>
            </Link>
          </li>
          <li className="m-0">
            <Link to="/about" className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg transition-all duration-300 bg-transparent no-underline ${
              isDarkMode ? 'text-text-dark hover:bg-gradient-to-r hover:from-primary-blue hover:to-primary-purple hover:text-white hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' : 'text-text-light hover:bg-gradient-to-r hover:from-primary-blue hover:to-primary-purple hover:text-white hover:-translate-y-0.5 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]'
            }`}>
              <span className="text-lg">ℹ️</span>
              <span className="hidden md:inline">About</span>
            </Link>
          </li>
        </ul>
        <div className="flex items-center gap-3">
          {user && (
            <span className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${
              isDarkMode 
                ? 'bg-card-dark border border-border-dark text-text-dark' 
                : 'bg-card-light border border-border-light text-text-light'
            }`}>
              <span className="text-lg">👤</span>
              <span className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">{user.name}</span>
            </span>
          )}
          <button 
            className={`text-xl px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-center ${
              isDarkMode 
                ? 'bg-card-dark border border-border-dark text-text-dark hover:bg-gradient-to-r hover:from-primary-blue hover:to-primary-purple hover:text-white hover:border-transparent hover:scale-110' 
                : 'bg-card-light border border-border-light text-text-light hover:bg-gradient-to-r hover:from-primary-blue hover:to-primary-purple hover:text-white hover:border-transparent hover:scale-110'
            }`} 
            onClick={toggleTheme} 
            aria-label="Toggle theme"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button 
            className={`text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 flex items-center gap-2 ${
              isDarkMode 
                ? 'bg-card-dark border border-border-dark text-text-dark hover:bg-red-500 hover:text-white hover:border-red-500 hover:-translate-y-0.5' 
                : 'bg-card-light border border-border-light text-text-light hover:bg-red-500 hover:text-white hover:border-red-500 hover:-translate-y-0.5'
            }`} 
            onClick={handleLogout} 
            aria-label="Logout"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
