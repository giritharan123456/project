import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
          try {
            const response = await authAPI.getProfile();
            if (!mountedRef.current) return;
            if (response.success) {
              const parsedUser = response.user;
              setIsAuthenticated(true);
              setUser(parsedUser);
              try { localStorage.setItem('user', JSON.stringify(parsedUser)); } catch {}
            } else {
              try { localStorage.removeItem('token'); localStorage.removeItem('user'); } catch {}
            }
          } catch {
            if (!mountedRef.current) return;
            try { localStorage.removeItem('token'); localStorage.removeItem('user'); } catch {}
          }
        }
      } catch {
        try { localStorage.removeItem('token'); localStorage.removeItem('user'); } catch {}
      }
      if (mountedRef.current) {
        setLoading(false);
      }
    };

    initAuth();
    return () => { mountedRef.current = false; };
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      if (!mountedRef.current) return { success: false, message: 'Component unmounted' };
      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.user);
        try { localStorage.setItem('token', response.token); localStorage.setItem('user', JSON.stringify(response.user)); } catch {}
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      const errorMessage = error.message || error.toString() || 'Login failed';
      return { success: false, message: errorMessage };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await authAPI.register({ name, email, password });
      if (!mountedRef.current) return { success: false, message: 'Component unmounted' };
      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.user);
        try { localStorage.setItem('token', response.token); localStorage.setItem('user', JSON.stringify(response.user)); } catch {}
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const guestLogin = async () => {
    try {
      const response = await authAPI.guestLogin();
      if (!mountedRef.current) return { success: false, message: 'Component unmounted' };
      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.user);
        try { localStorage.setItem('token', response.token); localStorage.setItem('user', JSON.stringify(response.user)); } catch {}
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const handleGoogleCallback = async (token) => {
    try {
      try { localStorage.setItem('token', token); } catch {}
      const response = await authAPI.getProfile();
      if (!mountedRef.current) return { success: false, message: 'Component unmounted' };
      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.user);
        try { localStorage.setItem('user', JSON.stringify(response.user)); } catch {}
        return { success: true };
      }
      try { localStorage.removeItem('token'); } catch {}
      return { success: false, message: response.message || 'Failed to get profile' };
    } catch (error) {
      try { localStorage.removeItem('token'); } catch {}
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // Server-side revocation best-effort
    }
    setIsAuthenticated(false);
    setUser(null);
    try { localStorage.removeItem('token'); localStorage.removeItem('user'); } catch {}
  };

  const isAdmin = user?.role === 'admin';
  const isGuest = user?.isGuest === true;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, register, guestLogin, handleGoogleCallback, logout, isAdmin, isGuest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
