import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

function FilterPanel({ onFilter, selectedCategory, categories }) {
  const { isDarkMode } = useTheme();
  // 'all' is a UI filter option, not hardcoded data
  const allCategories = ['all', ...categories.map(cat => cat.name)];

  return (
    <div className={`p-6 rounded-xl border mb-6 transition-all duration-300 sticky top-4 z-30 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-[#ffffff] border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}>
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Filter by Business Category</h3>
      <div className="flex flex-wrap gap-2">
        {allCategories.map((category) => (
          <button
            key={category}
            className={`px-5 py-2.5 border-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-300 ${
              selectedCategory === category 
                ? 'bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white border-transparent shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' 
                : `${isDarkMode ? 'bg-[#1e293b] border-[#334155] text-[#f1f5f9] hover:border-[#2563eb] hover:text-[#2563eb] hover:-translate-y-0.5' : 'bg-[#ffffff] border-[#e2e8f0] text-[#1e293b] hover:border-[#2563eb] hover:text-[#2563eb] hover:-translate-y-0.5'}`
            }`}
            onClick={() => onFilter(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterPanel;
