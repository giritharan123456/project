import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useDistrict } from '../contexts/DistrictContext';

function DistrictSelector({ districts }) {
  const { isDarkMode } = useTheme();
  const { selectedDistrict, setSelectedDistrict } = useDistrict();
  
  return (
    <div className={`p-6 rounded-xl border transition-all duration-300 ${isDarkMode ? 'bg-[#1e293b] border-[#334155] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.2)]' : 'bg-[#ffffff] border-[#e2e8f0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'}`}>
      <label htmlFor="district-select" className={`block text-sm font-semibold mb-3 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Select District:</label>
      <select 
        id="district-select"
        value={selectedDistrict ?? ''}
        onChange={(e) => setSelectedDistrict(e.target.value)}
        className={`w-full p-3 border-2 rounded-xl text-base transition-all duration-300 outline-none cursor-pointer ${isDarkMode ? 'bg-[#0f172a] border-[#334155] text-[#f1f5f9] focus:border-[#2563eb] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]' : 'bg-[#f8fafc] border-[#e2e8f0] text-[#1e293b] focus:border-[#2563eb] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]'}`}
      >
        {districts.map(district => (
          <option key={district._id || district} value={district._id || district}>
            {district.name || district}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DistrictSelector;
