import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';

function RecentlyViewed({ isDarkMode }) {
  const [items, setItems] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('recentlyViewed') || '[]'); } catch { return []; }
  });

  React.useEffect(() => {
    const handler = () => {
      try { setItems(JSON.parse(localStorage.getItem('recentlyViewed') || '[]')); } catch { setItems([]); }
    };
    window.addEventListener('recentlyViewedUpdated', handler);
    return () => window.removeEventListener('recentlyViewedUpdated', handler);
  }, []);

  if (items.length === 0) return null;

  const b = (light, dark) => isDarkMode ? dark : light;
  const clear = () => { localStorage.removeItem('recentlyViewed'); setItems([]); };

  return (
    <div className={`p-4 rounded-xl border ${b('bg-white border-gray-200', 'bg-[#1e293b] border-[#334155]')}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-[#2563eb]" />
          <h3 className={`font-semibold text-sm ${b('text-gray-900', 'text-white')}`}>Recently Viewed</h3>
        </div>
        {items.length > 0 && (
          <button onClick={clear} className="text-xs text-red-400 hover:text-red-300">Clear</button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.slice(0, 6).map((item, i) => (
          <Link key={i} to={`/business-overview/${item.pincode}`}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${b('bg-gray-100 text-gray-700 hover:bg-gray-200', 'bg-[#0f172a] text-gray-300 hover:bg-[#0f172a]/80')}`}>
            <span>{item.areaName || item.pincode}</span>
            <span className="opacity-50">({item.pincode})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RecentlyViewed;
