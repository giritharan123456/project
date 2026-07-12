const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Helper function to make API calls
const apiCall = async (endpoint, options = {}, _retryCount = 0) => {
  try {
    const token = (() => { try { return localStorage.getItem('token'); } catch { return null; } })();
  
  const defaultOptions = {
    credentials: 'include', // Include cookies for refresh token
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  const timeout = options.timeout || 30000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const signal = options.signal || controller.signal;

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...defaultOptions,
      ...options,
      signal,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    clearTimeout(timer);

    if (response.status === 401 && !endpoint.includes('/auth/refresh') && !endpoint.includes('/auth/logout') && _retryCount < 1) {
      // Try to refresh token
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshController = new AbortController();
          const refreshTimer = setTimeout(() => refreshController.abort(), 10000);
          const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            signal: refreshController.signal,
          });
          clearTimeout(refreshTimer);
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            const newToken = refreshData.accessToken || refreshData.token;
            if (newToken && typeof newToken === 'string') {
              try { localStorage.setItem('token', newToken); } catch {}
            }
            isRefreshing = false;
            processQueue(null, newToken);
            // Retry original request with new token
            return apiCall(endpoint, options, _retryCount + 1);
          } else {
            // Refresh failed, logout
            throw new Error('Session expired. Please log in again.');
          }
        } catch (refreshError) {
          isRefreshing = false;
          processQueue(refreshError, null);
          try { localStorage.removeItem('token'); localStorage.removeItem('user'); } catch {}
          window.location.href = '/login';
          throw refreshError;
        }
      } else {
        // Wait for token refresh
        try {
          const newToken = await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          // Retry with new token
          return apiCall(endpoint, options, _retryCount + 1);
        } catch (err) {
          throw err;
        }
      }
    }

    if (!response.ok) {
      let errorMsg = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorMsg;
      } catch (e) {
        if (response.status === 401) errorMsg = 'Please log in again.';
        else if (response.status === 429) errorMsg = 'Too many requests. Please wait a moment and try again.';
        else if (response.status >= 500) errorMsg = 'Server error. Please try again later.';
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timer);
    const errorMsg = (error && error.message) || String(error);

    if (errorMsg.includes('abort') || errorMsg.includes('AbortError')) {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    if (errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError')) {
      throw new Error('Unable to connect to the server. Please check your internet connection and ensure the backend is running.');
    }
    
    throw error;
  }
  } finally {}
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  guestLogin: async () => {
    return apiCall('/auth/guest', {
      method: 'POST',
    });
  },

  getProfile: async () => {
    return apiCall('/auth/profile');
  },

  updateProfile: async (userData) => {
    return apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  forgotPassword: async ({ email }) => {
    return apiCall('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token, { password }) => {
    return apiCall(`/auth/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  },

  logout: async () => {
    return apiCall('/auth/logout', {
      method: 'POST',
    });
  },
};

// Districts API
export const districtsAPI = {
  getAll: async () => {
    return apiCall('/districts');
  },

  getById: async (id) => {
    return apiCall(`/districts/${id}`);
  },
};

// Search API
export const searchAPI = {
  suggestions: async (query, district, options = {}) => {
    const params = new URLSearchParams({ query });
    if (district) params.append('district', district);
    return apiCall(`/search/suggestions?${params.toString()}`, { signal: options.signal });
  },
  areas: async (query, district, limit) => {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (district) params.set('district', district);
    if (limit) params.set('limit', String(limit));
    return apiCall(`/search/areas?${params.toString()}`);
  },
};

// Areas API
export const areasAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/areas${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return apiCall(`/areas/${id}`);
  },

  getByDistrict: async (districtId) => {
    return apiCall(`/areas/district/${districtId}`);
  },

  getByPincode: async (pincode) => {
    return apiCall(`/areas/pincode/${pincode}`);
  },
};

// Comparison API
export const comparisonAPI = {
  compare: async (areaIds) => {
    return apiCall('/comparison/compare', {
      method: 'POST',
      body: JSON.stringify({ areaIds }),
    });
  },

  save: async (areaIds, name) => {
    return apiCall('/comparison/save', {
      method: 'POST',
      body: JSON.stringify({ areaIds, name }),
    });
  },

  getSaved: async () => {
    return apiCall('/comparison/saved');
  },

  delete: async (id) => {
    return apiCall(`/comparison/${id}`, {
      method: 'DELETE',
    });
  },
};

// Admin API
export const adminAPI = {
  getStats: async () => {
    return apiCall('/admin/stats');
  },

  // District management
  getDistricts: async () => {
    return apiCall('/admin/districts');
  },

  createDistrict: async (districtData) => {
    return apiCall('/admin/districts', {
      method: 'POST',
      body: JSON.stringify(districtData),
    });
  },

  updateDistrict: async (id, districtData) => {
    return apiCall(`/admin/districts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(districtData),
    });
  },

  deleteDistrict: async (id) => {
    return apiCall(`/admin/districts/${id}`, {
      method: 'DELETE',
    });
  },

  // Area management
  getAreas: async () => {
    return apiCall('/admin/areas');
  },

  getAreasByDistrict: async (districtId) => {
    return apiCall(`/admin/areas/district/${districtId}`);
  },

  createArea: async (areaData) => {
    return apiCall('/admin/areas', {
      method: 'POST',
      body: JSON.stringify(areaData),
    });
  },

  updateArea: async (id, areaData) => {
    return apiCall(`/admin/areas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(areaData),
    });
  },

  deleteArea: async (id) => {
    return apiCall(`/admin/areas/${id}`, {
      method: 'DELETE',
    });
  },

  // Business category management
  getBusinessCategories: async () => {
    return apiCall('/admin/business-categories');
  },

  createBusinessCategory: async (categoryData) => {
    return apiCall('/admin/business-categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  updateBusinessCategory: async (id, categoryData) => {
    return apiCall(`/admin/business-categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },

  deleteBusinessCategory: async (id) => {
    return apiCall(`/admin/business-categories/${id}`, {
      method: 'DELETE',
    });
  },

  // User management
  getUsers: async () => {
    return apiCall('/admin/users');
  },

  getUserById: async (id) => {
    return apiCall(`/admin/users/${id}`);
  },

  updateUser: async (id, userData) => {
    return apiCall(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (id) => {
    return apiCall(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// Notifications API
export const notificationsAPI = {
  getAll: async (params = {}, options = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/notifications${queryString ? `?${queryString}` : ''}`, options);
  },

  markAsRead: async (id) => {
    return apiCall(`/notifications/${id}/read`, { method: 'PUT' });
  },

  markAllAsRead: async () => {
    return apiCall('/notifications/mark-all-read', { method: 'PUT' });
  },

  delete: async (id) => {
    return apiCall(`/notifications/${id}`, { method: 'DELETE' });
  },
};

// Analytics API
export const analyticsAPI = {
  getOverview: async () => {
    return apiCall('/analytics/overview');
  },

  getByDistrict: async (districtId) => {
    return apiCall(`/analytics/district/${districtId}`);
  },
};

// Workspace API
export const workspaceAPI = {
  getProfile: async () => {
    return apiCall('/workspace/profile');
  },

  getFavorites: async () => {
    return apiCall('/workspace/favorites');
  },

  addFavorite: async (areaId) => {
    return apiCall('/workspace/favorites', {
      method: 'POST',
      body: JSON.stringify({ areaId }),
    });
  },

  removeFavorite: async (areaId) => {
    return apiCall(`/workspace/favorites/${areaId}`, { method: 'DELETE' });
  },

  getSearchHistory: async () => {
    return apiCall('/workspace/search-history');
  },

  addSearchHistory: async (pincode) => {
    return apiCall('/workspace/search-history', {
      method: 'POST',
      body: JSON.stringify({ pincode }),
    });
  },

  clearSearchHistory: async () => {
    return apiCall('/workspace/search-history', { method: 'DELETE' });
  },
};

// Explorer API
export const explorerAPI = {
  getCategories: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiCall(`/explorer/categories${qs ? `?${qs}` : ''}`);
  },
  getLeaderboard: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiCall(`/explorer/leaderboard${qs ? `?${qs}` : ''}`);
  },
  getMatrix: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiCall(`/explorer/matrix${qs ? `?${qs}` : ''}`);
  },
  getEstimate: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiCall(`/explorer/estimate${qs ? `?${qs}` : ''}`);
  },
  getPincodeShops: async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiCall(`/explorer/pincode-shops${qs ? `?${qs}` : ''}`);
  },
};

// Content API
export const contentAPI = {
  getLandingContent: async () => {
    return apiCall('/content/landing');
  },

  updateLandingContent: async (contentData) => {
    return apiCall('/content/landing', {
      method: 'PUT',
      body: JSON.stringify(contentData),
    });
  },

  getAboutContent: async () => {
    return apiCall('/content/about');
  },

  updateAboutContent: async (contentData) => {
    return apiCall('/content/about', {
      method: 'PUT',
      body: JSON.stringify(contentData),
    });
  },

  getAnalysisContent: async () => {
    return apiCall('/content/analysis');
  },

  updateAnalysisContent: async (contentData) => {
    return apiCall('/content/analysis', {
      method: 'PUT',
      body: JSON.stringify(contentData),
    });
  },

  getHomeContent: async () => {
    return apiCall('/content/home');
  },

  updateHomeContent: async (contentData) => {
    return apiCall('/content/home', {
      method: 'PUT',
      body: JSON.stringify(contentData),
    });
  },
};

// AI Chat API
export const aiAPI = {
  chat: async (message, options = {}) => {
    return apiCall('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
      ...options,
    });
  },
};

// Search History API
export const historyAPI = {
  getHistory: async (page = 1, limit = 20) => {
    return apiCall(`/history?page=${page}&limit=${limit}`);
  },

  addSearch: async (data) => {
    return apiCall('/history', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  clearHistory: async () => {
    return apiCall('/history', { method: 'DELETE' });
  },
};

// Favorites API
export const favoriteAPI = {
  add: async (itemType, itemId, itemData) => {
    return apiCall('/favorites', {
      method: 'POST',
      body: JSON.stringify({ itemType, itemId, itemData }),
    });
  },

  remove: async (itemType, itemId) => {
    return apiCall(`/favorites/${itemType}/${itemId}`, { method: 'DELETE' });
  },

  getAll: async (itemType) => {
    const qs = itemType ? `?itemType=${itemType}` : '';
    return apiCall(`/favorites${qs}`);
  },

  check: async (itemType, itemId) => {
    return apiCall(`/favorites/check?itemType=${itemType}&itemId=${itemId}`);
  },
};

// Shares API
export const shareAPI = {
  create: async (itemType, itemId, itemData) => {
    return apiCall('/shares', {
      method: 'POST',
      body: JSON.stringify({ itemType, itemId, itemData }),
    });
  },

  getByToken: async (token) => {
    return apiCall(`/shares/${token}`);
  },

  getMy: async () => {
    return apiCall('/shares/my');
  },

  delete: async (id) => {
    return apiCall(`/shares/${id}`, { method: 'DELETE' });
  },
};

