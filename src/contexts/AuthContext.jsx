import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage and validate token with server
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
          // Validate token with server
          try {
            const response = await authAPI.getProfile();
            if (response.success) {
              const parsedUser = response.user;
              setIsAuthenticated(true);
              setUser(parsedUser);
              localStorage.setItem('user', JSON.stringify(parsedUser));
            } else {
              // Token invalid, clear localStorage
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
          } catch {
            // Token validation failed, clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.user);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
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
      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.user);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
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
      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.user);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const handleGoogleCallback = async (token) => {
    try {
      localStorage.setItem('token', token);
      const response = await authAPI.getProfile();
      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        return { success: true };
      }
      localStorage.removeItem('token');
      return { success: false, message: response.message || 'Failed to get profile' };
    } catch (error) {
      localStorage.removeItem('token');
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
