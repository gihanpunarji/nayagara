import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const SellerRedirect = ({ children }) => {
  const { isSeller, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect if still loading authentication state
    if (loading) return;

    // If user is a seller, redirect them to seller dashboard
    if (isSeller) {
      // Allow sellers to access only seller routes
      const isSellerRoute = location.pathname.startsWith('/seller/');
      const isAuthRoute = location.pathname.includes('/login') || 
                         location.pathname.includes('/register') ||
                         location.pathname.includes('/forgot-password') ||
                         location.pathname.includes('/reset-password');

      // If seller is trying to access non-seller routes (except auth routes), redirect to dashboard
      if (!isSellerRoute && !isAuthRoute) {
        console.log('Seller detected, redirecting to dashboard from:', location.pathname);
        navigate('/seller/dashboard', { replace: true });
      }
    }
  }, [isSeller, loading, location.pathname, navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
      </div>
    );
  }

  // If seller is accessing a non-seller route, don't render children (they'll be redirected)
  if (isSeller && !location.pathname.startsWith('/seller/') && 
      !location.pathname.includes('/login') && 
      !location.pathname.includes('/register') &&
      !location.pathname.includes('/forgot-password') &&
      !location.pathname.includes('/reset-password')) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to seller dashboard...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default SellerRedirect;