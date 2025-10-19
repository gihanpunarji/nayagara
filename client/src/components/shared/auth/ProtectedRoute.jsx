import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import LoginPromptModal from '../ui/LoginPromptModal';

const ProtectedRoute = ({ children, requiredRole = null, promptOnRedirect = false }) => {
  const { isAuthenticated, loading, userRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showPrompt, setShowPrompt] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (promptOnRedirect) {
      const handleConfirm = () => {
        setShowPrompt(false);
        navigate('/login', { state: { from: location }, replace: true });
      };

      return <LoginPromptModal isOpen={showPrompt} onConfirm={handleConfirm} />;
    } else {
      const redirectPath = location.pathname.includes('/seller') ? '/seller/login' : '/login';
      return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }
  }

  // Check role-based access
  if (requiredRole && userRole !== requiredRole) {
    // Redirect based on user role
    if (userRole === 'seller') {
      return <Navigate to="/seller/dashboard" replace />;
    } else if (userRole === 'customer') {
      return <Navigate to="/" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;