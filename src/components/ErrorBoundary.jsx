import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isDark = document.documentElement.classList.contains('dark');
      const bg = isDark ? 'bg-[#0f172a]' : 'bg-[#f8fafc]';
      const cardBg = isDark ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]';
      const text = isDark ? 'text-[#f1f5f9]' : 'text-[#1e293b]';
      const muted = isDark ? 'text-[#94a3b8]' : 'text-[#64748b]';

      return (
        <div className={`min-h-screen flex items-center justify-center p-8 ${bg}`}>
          <div className={`max-w-md w-full p-8 rounded-2xl border shadow-lg text-center ${cardBg}`}>
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className={`text-2xl font-bold mb-3 ${text}`}>Something went wrong</h2>
            <p className={`mb-2 ${muted}`}>
              {this.props.message || 'An unexpected error occurred while rendering this page.'}
            </p>
            {this.state.error && (
              <p className={`text-xs mb-6 font-mono p-3 rounded-lg ${isDark ? 'bg-black/30 text-red-400' : 'bg-red-50 text-red-600'}`}>
                {this.state.error.message}
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563eb] text-white rounded-xl font-medium hover:bg-[#1d4ed8] transition-colors"
              >
                <RefreshCw size={16} />
                Retry
              </button>
              <button
                onClick={this.handleReload}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium border transition-colors ${isDark ? 'border-[#334155] text-[#f1f5f9] hover:bg-[#334155]' : 'border-[#e2e8f0] text-[#1e293b] hover:bg-[#f1f5f9]'}`}
              >
                <RefreshCw size={16} />
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
