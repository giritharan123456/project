import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useTheme } from './ThemeContext';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const { isDarkMode } = useTheme();
  const [toasts, setToasts] = useState([]);
  const timeoutsRef = useRef({});

  useEffect(() => {
    return () => {
      Object.values(timeoutsRef.current).forEach(clearTimeout);
    };
  }, []);

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const toast = { id, message, type };
    setToasts(prev => {
      if (prev.length >= 5) {
        const removed = prev[0];
        if (timeoutsRef.current[removed.id]) {
          clearTimeout(timeoutsRef.current[removed.id]);
          delete timeoutsRef.current[removed.id];
        }
        return [...prev.slice(1), toast];
      }
      return [...prev, toast];
    });
    
    if (duration > 0) {
      timeoutsRef.current[id] = setTimeout(() => {
        removeToast(id);
        delete timeoutsRef.current[id];
      }, duration);
    }
    
    return id;
  };

  const removeToast = (id) => {
    if (timeoutsRef.current[id]) {
      clearTimeout(timeoutsRef.current[id]);
      delete timeoutsRef.current[id];
    }
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (message, duration) => addToast(message, 'success', duration);
  const error = (message, duration) => addToast(message, 'error', duration);
  const warning = (message, duration) => addToast(message, 'warning', duration);
  const info = (message, duration) => addToast(message, 'info', duration);

  const icons = {
    success: <CheckCircle size={20} className="text-green-500" />,
    error: <XCircle size={20} className="text-red-500" />,
    warning: <AlertCircle size={20} className="text-yellow-500" />,
    info: <Info size={20} className="text-blue-500" />
  };

  const bgColors = {
    success: 'border-green-500/30 bg-green-500/10',
    error: 'border-red-500/30 bg-red-500/10',
    warning: 'border-yellow-500/30 bg-yellow-500/10',
    info: 'border-blue-500/30 bg-blue-500/10'
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
      {children}
      
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`flex items-center gap-3 p-4 rounded-xl border shadow-lg min-w-[300px] max-w-md ${
                bgColors[toast.type]
              }`}
            >
              {icons[toast.type]}
              <p className={`flex-1 text-sm font-medium ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                className={`p-1 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-white/10 text-[#f1f5f9]' : 'hover:bg-black/10 text-[#1e293b]'
                }`}
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
