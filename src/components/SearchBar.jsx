import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { historyAPI } from '../services/api';

function SearchBar({ onSearch, placeholder = "Search by area or pincode...", suggestions = [], district, category, value }) {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const blurTimeoutRef = useRef(null);

  useEffect(() => {
    if (value !== undefined) setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    };
  }, []);

  const filteredSuggestions = suggestions.filter(suggestion =>
    String(suggestion).toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5);

  const saveToHistory = (query, resultCount) => {
    if (!query || !query.trim()) return;
    const isPincode = /^\d{5,6}$/.test(query.trim());
    historyAPI.addSearch({
      query: query.trim(),
      type: isPincode ? 'pincode' : 'general',
      district: district || '',
      category: category || '',
      resultCount: resultCount || 0,
    }).catch(() => { /* history save not critical */ });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      saveToHistory(searchTerm, 0);
    }
    onSearch(searchTerm);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    saveToHistory(suggestion, 0);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex gap-2">
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
            onBlur={() => { blurTimeoutRef.current = setTimeout(() => setShowSuggestions(false), 200); }}
            className={`w-full px-3 py-2 pl-9 border-2 rounded-lg text-sm transition-all duration-200 outline-none ${
              isDarkMode
                ? 'bg-[#0f172a] border-[#475569] text-white focus:border-blue-500 placeholder:text-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 placeholder:text-slate-400'
            }`}
          />
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} size={15} />
          {searchTerm && (
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setShowSuggestions(false); }}
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}
            >
              <X size={14} />
            </button>
          )}
          <AnimatePresence>
            {showSuggestions && filteredSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className={`absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-xl z-50 max-h-48 overflow-y-auto ${
                  isDarkMode ? 'bg-[#1e293b] border-[#475569]' : 'bg-white border-slate-200'
                }`}
              >
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      isDarkMode ? 'text-white hover:bg-white/10' : 'text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          type="submit"
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex-shrink-0 ${
            isDarkMode
              ? 'bg-blue-600 text-white hover:bg-blue-500'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
