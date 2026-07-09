import React from 'react';

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white dark:bg-[#1e293b] p-3 rounded-lg shadow-xl border border-gray-200 dark:border-[#334155]">
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
