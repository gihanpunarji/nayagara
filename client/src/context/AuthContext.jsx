import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  // Clear authentication data
  const clearAuth = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_role');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setUserRole(null);
  }, []);

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      const role = localStorage.getItem('user_role');

      if (token && userData && role) {
        // Verify token is still valid by making a test API call
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        try {
          // For now, assume token is valid if it exists in localStorage
          // In production, you should verify with backend
          setUser(JSON.parse(userData));
          setUserRole(role);
        } catch (error) {
          // Token is invalid, clear auth
          clearAuth();
        }
      } else {
        clearAuth();
      }
    } catch (error) {
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, [clearAuth]);

  // Real-time localStorage monitoring
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Only handle changes from other tabs/windows (the storage event doesn't fire for same-tab changes)
      if (e.key === 'token' || e.key === 'user' || e.key === 'user_role') {
        if (!e.newValue) {
          // Item was deleted - logout user
          setUser(null);
          setUserRole(null);
          delete api.defaults.headers.common['Authorization'];
        } else {
          // Item was modified - recheck auth
          checkAuth();
        }
      }
    };

    // Listen for localStorage changes from other tabs/windows
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAuth]);

  // Handle logout
  const handleLogout = () => {
    clearAuth();
  };

  // Initialize auth check
  useEffect(() => {
    checkAuth();
  }, []);

  // Customer login
  const loginCustomer = useCallback(async (emailOrMobile, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { emailOrMobile, password });
      const { user: userData, token } = response.data;

      // Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('user_role', 'customer');

      // Set API header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Update state
      setUser(userData);
      setUserRole('customer');

      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Customer register
  const registerCustomer = useCallback(async (userData) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', userData);
      const { user: newUser, token } = response.data;

      // Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('user_role', 'customer');

      // Set API header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Update state
      setUser(newUser);
      setUserRole('customer');

      return { success: true, user: newUser };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    handleLogout();
  }, []);

  const value = useMemo(() => ({
    // State
    user,
    userRole,
    loading,

    // Authentication status
    isAuthenticated: !!user,
    isCustomer: userRole === 'customer',

    // Actions
    loginCustomer,
    registerCustomer,
    logout,
    checkAuth
  }), [user, userRole, loading, loginCustomer, registerCustomer, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};