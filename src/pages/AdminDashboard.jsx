import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const AdminDashboard = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    } else {
      // If not admin, redirect to admin login
      navigate('/admin-login');
    }
  }, [isAdmin, navigate]);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      if (response.success) {
        setStats(response.data);
      } else {
        // Set default stats if API fails
        setStats({
          districts: 0,
          areas: 0,
          businessCategories: 0,
          totalUsers: 0,
          admins: 0,
          guests: 0
        });
      }
    } catch (error) {
      // Set default stats on error
      setStats({
        districts: 0,
        areas: 0,
        businessCategories: 0,
        totalUsers: 0,
        admins: 0,
        guests: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0f172a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`${color} rounded-lg p-6 text-white shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#1e293b]">
      <div className="bg-white dark:bg-[#1e293b] shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome, {user?.name}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
          {['overview', 'districts', 'areas', 'categories', 'users'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium capitalize whitespace-nowrap ${
                activeTab === tab
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && stats && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Total Districts"
                value={stats.districts}
                icon="📍"
                color="bg-blue-500"
              />
              <StatCard
                title="Total Areas"
                value={stats.areas}
                icon="🏘️"
                color="bg-green-500"
              />
              <StatCard
                title="Business Categories"
                value={stats.businessCategories}
                icon="🏪"
                color="bg-purple-500"
              />
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon="👥"
                color="bg-orange-500"
              />
              <StatCard
                title="Admins"
                value={stats.admins}
                icon="👑"
                color="bg-red-500"
              />
              <StatCard
                title="Guest Users"
                value={stats.guests}
                icon="👻"
                color="bg-gray-500"
              />
            </div>

            <div className="mt-8 bg-white dark:bg-[#1e293b] rounded-lg shadow p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab('districts')}
                  className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Manage Districts
                </button>
                <button
                  onClick={() => setActiveTab('areas')}
                  className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition"
                >
                  Manage Areas
                </button>
                <button
                  onClick={() => setActiveTab('categories')}
                  className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition"
                >
                  Manage Categories
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className="bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition"
                >
                  Manage Users
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'districts' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">District Management</h2>
            <div className="bg-white dark:bg-[#1e293b] rounded-lg shadow p-6">
              <p className="text-gray-600 dark:text-gray-400">Manage your districts, add new ones, or edit existing data.</p>
              <button
                onClick={() => navigate('/admin/districts')}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Open District Management →
              </button>
            </div>
          </div>
        )}

        {activeTab === 'areas' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Area Management</h2>
            <div className="bg-white dark:bg-[#1e293b] rounded-lg shadow p-6">
              <p className="text-gray-600 dark:text-gray-400">Manage areas, assign districts, and update area data.</p>
              <button
                onClick={() => navigate('/admin/areas')}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Open Area Management →
              </button>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Business Category Management</h2>
            <div className="bg-white dark:bg-[#1e293b] rounded-lg shadow p-6">
              <p className="text-gray-600 dark:text-gray-400">Add, edit, or remove business categories.</p>
              <button
                onClick={() => navigate('/admin/categories')}
                className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Open Category Management →
              </button>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">User Management</h2>
            <div className="bg-white dark:bg-[#1e293b] rounded-lg shadow p-6">
              <p className="text-gray-600 dark:text-gray-400">View and manage user accounts and roles.</p>
              <button
                onClick={() => navigate('/admin/users')}
                className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
              >
                Open User Management →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
