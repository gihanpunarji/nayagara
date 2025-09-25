// 🔐 EXAMPLE: Authentication Context
// This shows how to create global authentication state
// Wrap your app: <AuthProvider><App /></AuthProvider>
// Use in components: const { user, login, logout } = useAuth();

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // 'customer', 'seller', 'admin'

  // Check for existing auth on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for different token types
        const customerToken = localStorage.getItem('token');
        const sellerToken = localStorage.getItem('seller_token');
        const adminToken = localStorage.getItem('admin_token');

        let token = null;
        let role = null;

        if (customerToken) {
          token = customerToken;
          role = 'customer';
        } else if (sellerToken) {
          token = sellerToken;
          role = 'seller';
        } else if (adminToken) {
          token = adminToken;
          role = 'admin';
        }

        if (token) {
          // Set default auth header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Verify token with backend
          const response = await api.get(`/${role}/profile`);
          setUser(response.data.user);
          setUserRole(role);
        }
      } catch (error) {
        // Token is invalid, clear it
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Customer login
  const loginCustomer = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;

      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(user);
      setUserRole('customer');

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    } finally {
      setLoading(false);
    }
  };

  // Seller login
  const loginSeller = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/seller/auth/login', { email, password });
      const { user, token } = response.data;

      localStorage.setItem('seller_token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(user);
      setUserRole('seller');

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    } finally {
      setLoading(false);
    }
  };

  // Admin login
  const loginAdmin = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/admin/auth/login', { email, password });
      const { user, token } = response.data;

      localStorage.setItem('admin_token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(user);
      setUserRole('admin');

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    } finally {
      setLoading(false);
    }
  };

  // Register customer
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', userData);
      const { user, token } = response.data;

      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(user);
      setUserRole('customer');

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    } finally {
      setLoading(false);
    }
  };

  // Clear authentication
  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('seller_token');
    localStorage.removeItem('admin_token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setUserRole(null);
  };

  // Logout
  const logout = async () => {
    try {
      // Call logout endpoint to invalidate token on server
      if (userRole) {
        await api.post(`/${userRole}/auth/logout`);
      }
    } catch (error) {
      // Continue with logout even if server call fails
      console.error('Logout error:', error);
    } finally {
      clearAuth();
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await api.put(`/${userRole}/profile`, userData);
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Update failed'
      };
    }
  };

  const value = {
    // State
    user,
    userRole,
    loading,

    // Authentication status
    isAuthenticated: !!user,
    isCustomer: userRole === 'customer',
    isSeller: userRole === 'seller',
    isAdmin: userRole === 'admin',

    // Actions
    loginCustomer,
    loginSeller,
    loginAdmin,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 🎯 HOW TO USE:
/*
// 1. Wrap your app in index.js or App.js:
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <YourAppComponents />
    </AuthProvider>
  );
}

// 2. Use in any component:
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, isAuthenticated, logout, userRole } = useAuth();

  if (!isAuthenticated) {
    return (
      <div>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    );
  }

  return (
    <div>
      <span>Welcome, {user.name}!</span>
      <span>Role: {userRole}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

function LoginForm() {
  const { loginCustomer, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await loginCustomer(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      alert(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
*/