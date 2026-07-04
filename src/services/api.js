const API_BASE_URL = import.meta.env.VITE_API_URL;

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'API request failed' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const errorMsg = (error && error.message) || String(error);
    console.error('API call error:', errorMsg);
    
    // Check if it's a network error
    if (errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError')) {
      throw new Error('Unable to connect to the server. Please check your internet connection and ensure the backend is running.');
    }
    
    throw error;
  }
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
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/notifications${queryString ? `?${queryString}` : ''}`);
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
  chat: async (message) => {
    return apiCall('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
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

