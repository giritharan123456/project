import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function Pagination({ page, totalPages, onPageChange, isDarkMode }) {
  if (totalPages <= 1) return null;

  const b = (light, dark) => isDarkMode ? dark : light;
  const getPages = () => {
    const delta = 2;
    const range = [];
    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) range.push(i);
    if (range[0] > 1) range.unshift(1);
    if (range[0] > 2) range.splice(1, 0, '...');
    if (range[range.length - 1] < totalPages) range.push(totalPages);
    if (range[range.length - 2] < totalPages - 1) range.splice(range.length - 1, 0, '...');
    return range;
  };

  return (
    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center justify-center gap-1 mt-6 min-w-max">
        <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}
          className={`p-2.5 rounded-lg disabled:opacity-30 ${b('hover:bg-gray-100 text-gray-700', 'hover:bg-[#1e293b] text-gray-300')}`}>
          <ChevronLeft size={18} />
        </button>
        {getPages().map((p, i) => (
          <button key={i} onClick={() => typeof p === 'number' && onPageChange(p)}
            className={`min-h-[44px] min-w-[44px] w-10 h-10 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-[#2563eb] text-white' : b('text-gray-700 hover:bg-gray-100', 'text-gray-300 hover:bg-[#1e293b]')} ${typeof p !== 'number' ? 'cursor-default' : ''}`}>
            {p}
          </button>
        ))}
        <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}
          className={`p-2.5 rounded-lg disabled:opacity-30 ${b('hover:bg-gray-100 text-gray-700', 'hover:bg-[#1e293b] text-gray-300')}`}>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
