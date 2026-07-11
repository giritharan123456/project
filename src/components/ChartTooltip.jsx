import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ChartTooltip = ({ active, payload, label }) => {
  const { isDarkMode } = useTheme();
  if (!active || !payload) return null;
  return (
    <div className={`p-3 rounded-lg shadow-xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-gray-200'}`}>
      <p className="font-semibold text-sm mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: <span className="font-bold">{typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}</span>
        </p>
      ))}
    </div>
  );
};

export default ChartTooltip;
