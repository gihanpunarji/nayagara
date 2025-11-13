import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../../../api/axios';

const AdminProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const tokenDataString = localStorage.getItem('admin_token');
      if (tokenDataString) {
        try {
          // New format: { token: "...", timestamp: ... }
          const tokenData = JSON.parse(tokenDataString);
          const { token, timestamp } = tokenData;

          const tenDaysInMillis = 10 * 24 * 60 * 60 * 1000;
          const now = new Date().getTime();

          if (now - timestamp > tenDaysInMillis) {
            localStorage.removeItem('admin_token');
            setIsAuthenticated(false);
          } else {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setIsAuthenticated(true);
          }
        } catch (error) {
          // Old format: "eyJhbGciOi..."
          // If parsing fails, it's likely the old raw token string.
          // For simplicity, we'll treat it as valid for this session
          // and the next login will store it in the new format.
          api.defaults.headers.common['Authorization'] = `Bearer ${tokenDataString}`;
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;