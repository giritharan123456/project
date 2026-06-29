import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Bell, TrendingUp, Store, Users, AlertTriangle, Calendar,
  Check, CheckCheck, Filter, Search, ChevronDown, ArrowRight,
  MapPin, DollarSign, Star, Clock, X, Zap
} from 'lucide-react';

function Notifications() {
  const { isDarkMode } = useTheme();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock notifications - will be replaced by backend
  const notifications = [
    {
      id: 1,
      type: 'market',
      title: 'New Market Opportunity in T. Nagar',
      message: 'Market gap score increased to 92% due to reduced competition in the area.',
      time: '2 hours ago',
      read: false,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      id: 2,
      type: 'business',
      title: '5 New Businesses Opened in Anna Nagar',
      message: 'New restaurants and retail stores have opened in the area, affecting competition levels.',
      time: '5 hours ago',
      read: false,
      icon: Store,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      id: 3,
      type: 'population',
      title: 'Population Growth Alert: Velachery',
      message: 'Population has grown by 15% in the last quarter, indicating increased demand potential.',
      time: '1 day ago',
      read: true,
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      id: 4,
      type: 'competition',
      title: 'Competition Increased in Adyar',
      message: 'Market saturation has reached 85% in the retail sector. Consider alternative locations.',
      time: '2 days ago',
      read: true,
      icon: AlertTriangle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30'
    },
    {
      id: 5,
      type: 'forecast',
      title: 'Forecast Update: Madurai',
      message: '5-year demand forecast has been updated. Expected growth of 28% in the food sector.',
      time: '3 days ago',
      read: true,
      icon: Calendar,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900/30'
    },
    {
      id: 6,
      type: 'market',
      title: 'High Opportunity Area Identified',
      message: 'Perambur shows 88% market opportunity score with low competition levels.',
      time: '4 days ago',
      read: true,
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
    },
    {
      id: 7,
      type: 'business',
      title: 'Business Closure Alert',
      message: '3 major competitors have closed in Mylapore, creating new opportunities.',
      time: '5 days ago',
      read: true,
      icon: Store,
      color: 'text-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/30'
    },
    {
      id: 8,
      type: 'forecast',
      title: 'Revenue Forecast Updated',
      message: 'Revenue projections for Coimbatore have been revised upward by 12%.',
      time: '1 week ago',
      read: true,
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    }
  ];

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
                          (filter === 'unread' && !notification.read) ||
                          (filter === 'read' && notification.read);
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    // Will be replaced with backend call
  };

  const markAllAsRead = () => {
    // Will be replaced with backend call
  };

  const deleteNotification = (id) => {
    // Will be replaced with backend call
  };

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
                  {unreadCount} unread notifications
                </p>
              </div>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <CheckCheck size={18} />
                Mark All Read
              </button>
            )}
          </div>
        </motion.div>

        {/* Filters and Search */}
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
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all' ? 'bg-[#2563eb] text-white' : isDarkMode ? 'text-[#f1f5f9] hover:bg-[#1e293b]' : 'text-[#1e293b] hover:bg-[#ffffff]'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'unread' ? 'bg-[#2563eb] text-white' : isDarkMode ? 'text-[#f1f5f9] hover:bg-[#1e293b]' : 'text-[#1e293b] hover:bg-[#ffffff]'}`}
              >
                Unread
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'read' ? 'bg-[#2563eb] text-white' : isDarkMode ? 'text-[#f1f5f9] hover:bg-[#1e293b]' : 'text-[#1e293b] hover:bg-[#ffffff]'}`}
              >
                Read
              </button>
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
          {filteredNotifications.length === 0 ? (
            <div className={`p-12 rounded-2xl border text-center ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}>
              <Bell className={`mx-auto mb-4 opacity-50 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`} size={48} />
              <p className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                No notifications found
              </p>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                {searchQuery ? 'Try a different search term' : 'You\'re all caught up!'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (index * 0.05) }}
                className={`p-6 rounded-2xl border relative ${!notification.read ? 'border-l-4 border-l-[#2563eb]' : ''} ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}
              >
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className={`absolute top-4 right-4 p-1 rounded-lg transition-colors ${isDarkMode ? 'text-[#f1f5f9] hover:bg-[#1e293b]' : 'text-[#1e293b] hover:bg-[#ffffff]'}`}
                >
                  <X size={16} />
                </button>

                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${notification.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <notification.icon className={notification.color} size={24} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-bold ${!notification.read ? 'text-[#2563eb]' : ''} ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-[#2563eb] rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                    
                    <p className={`text-sm opacity-70 mb-3 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm opacity-50">
                        <Clock size={14} />
                        <span className={isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}>
                          {notification.time}
                        </span>
                      </div>
                      
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-[#2563eb] text-sm font-medium hover:underline flex items-center gap-1"
                        >
                          <Check size={14} />
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
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
            {[
              { icon: TrendingUp, label: 'Market', color: 'text-green-500' },
              { icon: Store, label: 'Business', color: 'text-blue-500' },
              { icon: Users, label: 'Population', color: 'text-purple-500' },
              { icon: AlertTriangle, label: 'Competition', color: 'text-orange-500' },
              { icon: Calendar, label: 'Forecast', color: 'text-cyan-500' },
              { icon: Star, label: 'Opportunity', color: 'text-yellow-500' }
            ].map((type, index) => (
              <div key={index} className="flex items-center gap-2">
                <type.icon className={type.color} size={16} />
                <span className={`text-sm ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>{type.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
        >
          <div className={`p-6 rounded-2xl border flex items-center gap-4 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center">
              <Zap className="text-white" size={24} />
            </div>
            <div>
              <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Smart Alerts</h4>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                AI-powered notifications
              </p>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border flex items-center gap-4 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center">
              <MapPin className="text-white" size={24} />
            </div>
            <div>
              <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Location-Based</h4>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Updates for your areas
              </p>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border flex items-center gap-4 ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#ffffff] border-[#e2e8f0]'}`}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#7c3aed] flex items-center justify-center">
              <Clock className="text-white" size={24} />
            </div>
            <div>
              <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>Real-Time</h4>
              <p className={`text-sm opacity-70 ${isDarkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                Instant updates
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Notifications;
