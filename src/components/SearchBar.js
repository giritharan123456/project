import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

function SearchBar({ onSearch, placeholder = "Search by area or pincode..." }) {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className={`p-6 rounded-xl border mb-6 transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-card-light border-border-light shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`flex-1 p-3 border-2 rounded-xl text-base transition-all duration-300 outline-none ${isDarkMode ? 'bg-bg-dark border-border-dark text-text-dark focus:border-primary-blue focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] placeholder:text-text-dark/50' : 'bg-bg-light border-border-light text-text-light focus:border-primary-blue focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] placeholder:text-text-light/50'}`}
        />
        <button type="submit" className="px-6 py-3 bg-gradient-to-r from-primary-blue to-primary-purple text-white border-none rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(102,126,234,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(102,126,234,0.4)] active:translate-y-0">
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
