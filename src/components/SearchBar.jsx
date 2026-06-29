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
    <div className={`p-6 rounded-xl border mb-6 transition-all duration-300 relative ${isDarkMode ? 'bg-[#1e293b] border-[#334155] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-[#ffffff] border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}>
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
            className={`w-full p-3 pl-10 border-2 rounded-xl text-base transition-all duration-300 outline-none ${isDarkMode ? 'bg-[#0f172a] border-[#334155] text-[#f1f5f9] focus:border-[#2563eb] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] placeholder:text-[#f1f5f9]/50' : 'bg-[#f8fafc] border-[#e2e8f0] text-[#1e293b] focus:border-[#2563eb] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] placeholder:text-[#1e293b]/50'}`}
          />
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-[#f1f5f9]/50' : 'text-[#1e293b]/50'}`} size={18} />
          
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setShowSuggestions(false);
              }}
              className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isDarkMode ? 'text-[#f1f5f9]/50 hover:text-[#f1f5f9]' : 'text-[#1e293b]/50 hover:text-[#1e293b]'}`}
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
                className={`absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-lg z-50 max-h-60 overflow-y-auto ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
              >
                {filteredSuggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`w-full text-left px-4 py-3 transition-colors ${isDarkMode ? 'text-[#f1f5f9] hover:bg-white/10' : 'text-[#1e293b] hover:bg-black/5'}`}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button type="submit" className="px-6 py-3 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white border-none rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(102,126,234,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(102,126,234,0.4)] active:translate-y-0">
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
