import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { notificationsAPI } from '../services/api';
import {
  Bell, TrendingUp, Store, Users, AlertTriangle, Calendar,
  Check, CheckCheck, Search, MapPin,
  Clock, X
} from 'lucide-react';

const TYPE_CONFIG = {
  market:      { icon: TrendingUp, color: 'text-green-500',  bg: 'bg-green-100 dark:bg-green-900/30' },
  business:    { icon: Store,      color: 'text-blue-500',   bg: 'bg-blue-100 dark:bg-blue-900/30' },
  population:  { icon: Users,      color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  competition: { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  forecast:    { icon: Calendar,   color: 'text-cyan-500',   bg: 'bg-cyan-100 dark:bg-cyan-900/30' },
  area_loaded: { icon: MapPin,     color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
};

const formatRelative = (dateStr) => {
  if (!dateStr) return '';
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
    } catch (err) { /* silent fail */ }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) { /* silent fail */ }
  };

  const handleDelete = async (id) => {
    try {
      await notificationsAPI.delete(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) { /* silent fail */ }
  };

  const filtered = notifications.filter(n => {
    const matchFilter =
      filter === 'all' ||
      (filter === 'unread' && !n.read) ||
      (filter === 'read' && n.read);
    const matchSearch =
      (n.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.message || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const b = (light, dark) => isDarkMode ? dark : light;

  if (loading) {
    return (
      <div className={`min-h-[calc(100vh-70px)] flex items-center justify-center ${b('bg-[#f8fafc]', 'bg-[#0f172a]')}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#2563eb] mx-auto mb-4" />
          <p className={b('text-[#1e293b]', 'text-[#f1f5f9]')}>Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-[calc(100vh-70px)] flex items-center justify-center ${b('bg-[#f8fafc]', 'bg-[#0f172a]')}`}>
        <div className="text-center max-w-md p-8">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className={`text-xl font-bold mb-3 ${b('text-[#1e293b]', 'text-[#f1f5f9]')}`}>
            Unable to Load Notifications
          </h2>
          <p className={`mb-6 opacity-70 ${b('text-[#1e293b]', 'text-[#f1f5f9]')}`}>{error}</p>
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
    <div className={`min-h-[calc(100vh-70px)] px-3 sm:px-4 py-4 sm:py-6 transition-colors duration-300 ${b('bg-[#f8fafc]', 'bg-[#0f172a]')}`}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Bell className="text-[#2563eb]" size={32} />
              <div>
                <h1 className={`text-2xl sm:text-3xl font-bold ${b('text-[#1e293b]', 'text-[#f1f5f9]')}`}>
                  Notifications
                </h1>
                <p className={`text-sm sm:text-base opacity-70 ${b('text-[#1e293b]', 'text-[#f1f5f9]')}`}>
                  {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 text-xs sm:text-sm"
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
          className={`p-4 sm:p-6 rounded-2xl border mb-6 sm:mb-8 ${b('bg-[#ffffff] border-[#e2e8f0]', 'bg-[#1e293b] border-[#334155]')}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${b('text-[#1e293b] opacity-50', 'text-[#f1f5f9] opacity-50')}`} size={20} />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border bg-transparent outline-none focus:border-[#2563eb] transition-colors text-sm ${b('text-[#1e293b] border-[#e2e8f0]', 'text-[#f1f5f9] border-[#334155]')}`}
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {['all', 'unread', 'read'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium capitalize transition-colors text-xs sm:text-sm ${filter === f ? 'bg-[#2563eb] text-white' : b('text-[#1e293b] hover:bg-black/5', 'text-[#f1f5f9] hover:bg-white/10')}`}
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
            <div className={`p-8 sm:p-16 rounded-2xl border text-center ${b('bg-[#ffffff] border-[#e2e8f0]', 'bg-[#1e293b] border-[#334155]')}`}>
              <Bell className={`mx-auto mb-4 opacity-30 ${b('text-[#1e293b]', 'text-[#f1f5f9]')}`} size={56} />
              <p className={`text-lg sm:text-xl font-semibold mb-2 ${b('text-[#1e293b]', 'text-[#f1f5f9]')}`}>
                {searchQuery ? 'No matching notifications' : notifications.length === 0 ? 'No notifications yet' : 'Nothing to show'}
              </p>
              <p className={`opacity-60 mb-6 ${b('text-[#1e293b]', 'text-[#f1f5f9]')}`}>
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
                    className={`p-4 sm:p-6 rounded-2xl border relative ${!notification.read ? 'border-l-4 border-l-[#2563eb]' : ''} ${b('bg-[#ffffff] border-[#e2e8f0]', 'bg-[#1e293b] border-[#334155]')}`}
                  >
                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(notification._id)}
                      className={`absolute top-3 right-3 p-1 rounded-lg transition-colors ${b('text-[#1e293b] opacity-50 hover:opacity-100 hover:bg-black/5', 'text-[#f1f5f9] opacity-50 hover:opacity-100 hover:bg-white/10')}`}
                    >
                      <X size={16} />
                    </button>

                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                        <IconComp className={cfg.color} size={20} />
                      </div>

                      <div className="flex-1 pr-6">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className={`font-bold ${!notification.read ? 'text-[#2563eb]' : b('text-[#1e293b]', 'text-[#f1f5f9]')}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-[#2563eb] rounded-full flex-shrink-0 mt-1.5 ml-2" />
                          )}
                        </div>

                        <p className={`text-xs sm:text-sm opacity-70 mb-3 ${b('text-[#1e293b]', 'text-[#f1f5f9]')}`}>
                          {notification.message}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className={`flex items-center gap-1.5 text-xs opacity-50 ${b('text-[#1e293b]', 'text-[#f1f5f9]')}`}>
                            <Clock size={12} />
                            <span>{formatRelative(notification.createdAt)}</span>
                          </div>

                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="text-[#2563eb] text-xs sm:text-sm font-medium hover:underline flex items-center gap-1"
                            >
                              <Check size={12} />
                              Mark as read
                            </button>
                          )}
                        </div>

                        {/* Area metadata chip */}
                        {notification.metadata?.pincode && (
                          <div className="mt-3">
                            <Link
                              to={`/area-overview/${notification.metadata.pincode}`}
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${b('bg-black/5 text-[#1e293b] hover:bg-black/10', 'bg-white/10 text-[#f1f5f9] hover:bg-white/20')}`}
                            >
                              <MapPin size={10} />
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
          className={`mt-8 p-4 sm:p-6 rounded-2xl border ${b('bg-[#ffffff] border-[#e2e8f0]', 'bg-[#1e293b] border-[#334155]')}`}
        >
          <h3 className={`font-bold mb-4 ${b('text-[#1e293b]', 'text-[#f1f5f9]')}`}>
            Notification Types
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
              const Icon = cfg.icon;
              return (
                <div key={key} className="flex items-center gap-2">
                  <Icon className={cfg.color} size={14} />
                  <span className={`text-xs sm:text-sm capitalize ${b('text-[#1e293b]', 'text-[#f1f5f9]')}`}>
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