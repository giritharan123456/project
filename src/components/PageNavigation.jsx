import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

function PageNavigation({ backRoute, backLabel, nextRoute, nextLabel }) {
  const { isDarkMode } = useTheme();

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t">
      {backRoute ? (
        <Link 
          to={backRoute}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            isDarkMode 
              ? 'text-[#f1f5f9] hover:bg-[#1e293b] border border-[#334155]' 
              : 'text-[#1e293b] hover:bg-[#ffffff] border border-[#e2e8f0]'
          }`}
        >
          <ChevronLeft size={20} />
          {backLabel}
        </Link>
      ) : (
        <div />
      )}
      
      {nextRoute ? (
        <Link 
          to={nextRoute}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            isDarkMode 
              ? 'text-[#f1f5f9] hover:bg-[#1e293b] border border-[#334155]' 
              : 'text-[#1e293b] hover:bg-[#ffffff] border border-[#e2e8f0]'
          }`}
        >
          {nextLabel}
          <ChevronRight size={20} />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}

export default PageNavigation;
