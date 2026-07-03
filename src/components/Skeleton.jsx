import { useTheme } from '../contexts/ThemeContext';

function Skeleton({ className = '', variant = 'text', width, height }) {
  const { isDarkMode } = useTheme();
  const base = `animate-pulse rounded ${isDarkMode ? 'bg-[#1e293b]' : 'bg-gray-200'}`;
  const dims = {};
  if (width) dims.width = typeof width === 'number' ? `${width}px` : width;
  if (height) dims.height = typeof height === 'number' ? `${height}px` : height;

  if (variant === 'circular') {
    return <div className={`${base} rounded-full ${className}`} style={{ width: width || 40, height: height || 40, ...dims }} />;
  }
  if (variant === 'rect') {
    return <div className={`${base} ${className}`} style={{ width: width || '100%', height: height || 120, ...dims }} />;
  }
  return <div className={`${base} h-4 ${className}`} style={dims} />;
}

export function CardSkeleton() {
  return (
    <div className={`p-4 rounded-xl border ${useTheme().isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-white border-gray-200'}`}>
      <Skeleton variant="text" width="60%" className="mb-3" />
      <Skeleton variant="text" width="40%" className="mb-2" />
      <Skeleton variant="text" width="80%" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} variant="text" className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  const { isDarkMode } = useTheme();
  return (
    <div className={`min-h-[calc(100vh-120px)] p-4 lg:p-8 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        <Skeleton variant="text" width="250px" height={32} className="mb-6" />
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
        <Skeleton variant="rect" height={300} className="mb-4" />
        <div className="grid md:grid-cols-2 gap-4">
          <CardSkeleton /><CardSkeleton />
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
