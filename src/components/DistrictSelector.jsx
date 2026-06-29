import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

function DistrictSelector({ districts, selectedDistrict, onDistrictChange }) {
  const { isDarkMode } = useTheme();
  return (
    <div className={`p-6 rounded-xl border transition-all duration-300 ${isDarkMode ? 'bg-card-dark border-border-dark shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-card-light border-border-light shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}>
      <label htmlFor="district-select" className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-text-dark' : 'text-text-light'}`}>Select District:</label>
      <select 
        id="district-select"
        value={selectedDistrict}
        onChange={(e) => onDistrictChange(e.target.value)}
        className={`w-full p-3 border-2 rounded-xl text-base transition-all duration-300 outline-none cursor-pointer ${isDarkMode ? 'bg-bg-dark border-border-dark text-text-dark focus:border-primary-blue focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]' : 'bg-bg-light border-border-light text-text-light focus:border-primary-blue focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]'}`}
      >
        {districts.map(district => (
          <option key={district} value={district}>
            {district}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DistrictSelector;
