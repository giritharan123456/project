import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

function SearchBar({ onSearch, placeholder = "Search by area or pincode...", suggestions = [] }) {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className={`p-6 rounded-xl border mb-6 transition-all duration-300 relative ${isDarkMode ? 'bg-card-dark border-border-dark shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-card-light border-border-light shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => setShowSuggestions(searchTerm.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className={`w-full p-3 pl-10 border-2 rounded-xl text-base transition-all duration-300 outline-none ${isDarkMode ? 'bg-bg-dark border-border-dark text-text-dark focus:border-primary-blue focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] placeholder:text-text-dark/50' : 'bg-bg-light border-border-light text-text-light focus:border-primary-blue focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] placeholder:text-text-light/50'}`}
          />
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-text-dark/50' : 'text-text-light/50'}`} size={18} />
          
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setShowSuggestions(false);
              }}
              className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isDarkMode ? 'text-text-dark/50 hover:text-text-dark' : 'text-text-light/50 hover:text-text-light'}`}
            >
              <X size={16} />
            </button>
          )}
          
          <AnimatePresence>
            {showSuggestions && filteredSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-lg z-50 max-h-60 overflow-y-auto ${isDarkMode ? 'bg-card-dark border-border-dark' : 'bg-card-light border-border-light'}`}
              >
                {filteredSuggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`w-full text-left px-4 py-3 transition-colors ${isDarkMode ? 'text-text-dark hover:bg-white/10' : 'text-text-light hover:bg-black/5'}`}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button type="submit" className="px-6 py-3 bg-gradient-to-r from-primary-blue to-primary-purple text-white border-none rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(102,126,234,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(102,126,234,0.4)] active:translate-y-0">
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
