import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

function FilterPanel({ onFilter, selectedCategory, categories }) {
  const { isDarkMode } = useTheme();
  const allCategories = ['all', ...categories.map(cat => cat.name)];

  return (
    <div className={`p-6 rounded-xl border mb-6 transition-all duration-300 sticky top-4 z-30 ${isDarkMode ? 'bg-card-dark border-border-dark shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-card-light border-border-light shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}>
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Filter by Business Category</h3>
      <div className="flex flex-wrap gap-2">
        {allCategories.map((category) => (
          <button
            key={category}
            className={`px-5 py-2.5 border-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-300 ${
              selectedCategory === category 
                ? 'bg-gradient-to-r from-primary-blue to-primary-purple text-white border-transparent shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]' 
                : `${isDarkMode ? 'bg-card-dark border-border-dark text-text-dark hover:border-primary-blue hover:text-primary-blue hover:-translate-y-0.5' : 'bg-card-light border-border-light text-text-light hover:border-primary-blue hover:text-primary-blue hover:-translate-y-0.5'}`
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
