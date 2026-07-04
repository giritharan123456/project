import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useDistrict } from '../contexts/DistrictContext';
import { ChevronDown } from 'lucide-react';

function DistrictSelector({ districts }) {
  const { isDarkMode } = useTheme();
  const { selectedDistrict, setSelectedDistrict } = useDistrict();

  return (
    <div className="relative">
      <label htmlFor="district-select" className={`block text-[10px] font-extrabold uppercase tracking-wider mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
        District
      </label>
      <div className="relative">
        <select
          id="district-select"
          value={selectedDistrict ?? ''}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className={`w-full appearance-none px-3 py-2 pr-8 border-2 rounded-lg text-sm font-medium transition-all duration-200 outline-none cursor-pointer ${
            isDarkMode
              ? 'bg-[#0f172a] border-[#475569] text-white focus:border-blue-500'
              : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
          }`}
        >
          {districts.map(district => (
            <option key={district._id || district} value={district._id || district}>
              {district.name || district}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
      </div>
    </div>
  );
}

export default DistrictSelector;
