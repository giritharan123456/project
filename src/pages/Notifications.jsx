import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { notificationsAPI } from '../services/api';
import {
  Bell, TrendingUp, Store, Users, AlertTriangle, Calendar,
  Check, CheckCheck, Search, MapPin, DollarSign, Star,
  Clock, X, Zap
} from 'lucide-react';

// UI configuration should come from backend API
const TYPE_CONFIG = {
  market:      { icon: TrendingUp, color: 'text-green-500',  bg: 'bg-green-100 dark:bg-green-900/30' },
  business:    { icon: Store,      color: 'text-blue-500',   bg: 'bg-blue-100 dark:bg-blue-900/30' },
  population:  { icon: Users,      color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  competition: { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  forecast:    { icon: Calendar,   color: 'text-cyan-500',   bg: 'bg-cyan-100 dark:bg-cyan-900/30' },
  area_loaded: { icon: MapPin,     color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
};

// Format ISO date to human-readable relative time
const formatRelative = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

function Notifications() {
  const { isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationsAPI.getAll();
      setNotifications(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationsAPI.delete(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
    }
  };

  const filtered = notifications.filter(n => {
    const matchFilter =
      filter === 'all' ||
      (filter === 'unread' && !n.read) ||
      (filter === 'read' && n.read);
    const matchSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  // ── Loading ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className={`min-h-[calc(100vh-70px)] flex items-center justify-center ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2563eb] mx-auto mb-4" />
          <p className={isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}>Loading notifications...</p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className={`min-h-[calc(100vh-70px)] flex items-center justify-center ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <div className="text-center max-w-md p-8">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
            Unable to Load Notifications
          </h2>
          <p className={`mb-6 opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{error}</p>
          <button
            onClick={fetchNotifications}
            className="px-6 py-3 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-[calc(100vh-70px)] p-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="text-[#2563eb]" size={32} />
              <div>
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  Notifications
                </h1>
                <p className={`text-lg opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                  {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <CheckCheck size={18} />
                Mark All Read
              </button>
            )}
          </div>
        </motion.div>

        {/* Filters & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-2xl border mb-8 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-[#f1f5f9] opacity-50' : 'text-[#1e293b] opacity-50'}`} size={20} />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border bg-transparent outline-none focus:border-[#2563eb] transition-colors ${isDarkMode ? 'text-[#f1f5f9] border-[#334155]' : 'text-[#1e293b] border-[#e2e8f0]'}`}
              />
            </div>

            <div className="flex items-center gap-2">
              {['all', 'unread', 'read'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${filter === f ? 'bg-[#2563eb] text-white' : isDarkMode ? 'text-[#f1f5f9] hover:bg-white/10' : 'text-[#1e293b] hover:bg-black/5'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Notifications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filtered.length === 0 ? (
            <div className={`p-16 rounded-2xl border text-center ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}>
              <Bell className={`mx-auto mb-4 opacity-30 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={56} />
              <p className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                {searchQuery ? 'No matching notifications' : notifications.length === 0 ? 'No notifications yet' : 'Nothing to show'}
              </p>
              <p className={`opacity-60 mb-6 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                {searchQuery
                  ? 'Try a different search term.'
                  : notifications.length === 0
                    ? 'Notifications are generated when you search pincodes. Start exploring pincodes on the Dashboard.'
                    : 'Switch to "All" to see all notifications.'}
              </p>
              {notifications.length === 0 && (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  <MapPin size={18} />
                  Go to Dashboard
                </Link>
              )}
            </div>
          ) : (
            <AnimatePresence>
              {filtered.map((notification, index) => {
                const cfg = TYPE_CONFIG[notification.type] || TYPE_CONFIG.market;
                const IconComp = cfg.icon;
                return (
                  <motion.div
                    key={notification._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className={`p-6 rounded-2xl border relative ${!notification.read ? 'border-l-4 border-l-[#2563eb]' : ''} ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
                  >
                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(notification._id)}
                      className={`absolute top-4 right-4 p-1 rounded-lg transition-colors ${isDarkMode ? 'text-[#f1f5f9] opacity-50 hover:opacity-100 hover:bg-white/10' : 'text-[#1e293b] opacity-50 hover:opacity-100 hover:bg-black/5'}`}
                    >
                      <X size={16} />
                    </button>

                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                        <IconComp className={cfg.color} size={24} />
                      </div>

                      <div className="flex-1 pr-6">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className={`font-bold ${!notification.read ? 'text-[#2563eb]' : isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-[#2563eb] rounded-full flex-shrink-0 mt-1.5 ml-2" />
                          )}
                        </div>

                        <p className={`text-sm opacity-70 mb-3 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className={`flex items-center gap-1.5 text-sm opacity-50 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                            <Clock size={13} />
                            <span>{formatRelative(notification.createdAt)}</span>
                          </div>

                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="text-[#2563eb] text-sm font-medium hover:underline flex items-center gap-1"
                            >
                              <Check size={13} />
                              Mark as read
                            </button>
                          )}
                        </div>

                        {/* Area metadata chip */}
                        {notification.metadata?.pincode && (
                          <div className="mt-3">
                            <Link
                              to={`/area-overview/${notification.metadata.pincode}`}
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${isDarkMode ? 'bg-white/10 text-[#f1f5f9] hover:bg-white/20' : 'bg-black/5 text-[#1e293b] hover:bg-black/10'}`}
                            >
                              <MapPin size={11} />
                              {notification.metadata.areaName || notification.metadata.pincode}
                              {notification.metadata.districtName ? ` · ${notification.metadata.districtName}` : ''}
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Notification Types Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`mt-8 p-6 rounded-2xl border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
        >
          <h3 className={`font-bold mb-4 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
            Notification Types
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
              const Icon = cfg.icon;
              return (
                <div key={key} className="flex items-center gap-2">
                  <Icon className={cfg.color} size={16} />
                  <span className={`text-sm capitalize ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                    {key.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Notifications;
