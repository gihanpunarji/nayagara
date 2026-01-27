import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Seller Components
import SellerLogin from "../components/seller/auth/SellerLogin.jsx";
import SellerRegistration from "../components/seller/auth/SellerRegistration.jsx";
import Dashboard from "../components/seller/pages/Dashboard.jsx";
import SellerProducts from "../components/seller/pages/Products.jsx";
import SellerAddProduct from "../components/seller/pages/AddProduct.jsx";
import SellerEditProduct from "../components/seller/pages/EditProduct.jsx";
import SellerOrders from "../components/seller/pages/Orders.jsx";
import SellerPayments from "../components/seller/pages/Payments.jsx";
import SellerCustomers from "../components/seller/pages/Customers.jsx";
import SellerAnalytics from "../components/seller/pages/Analytics.jsx";
import SellerSettings from "../components/seller/pages/Settings.jsx";
import SellerHelp from "../components/seller/pages/Help.jsx";
import SellerMessages from "../components/seller/pages/Messages.jsx";

// Auth Components
import AuthRoute from "../components/shared/auth/AuthRoute.jsx";
import ProtectedRoute from "../components/shared/auth/ProtectedRoute.jsx";
import SellerMobileVerify from "../components/seller/auth/SellerMobileVerify.jsx";

const SellerRoutes = () => {
  const { isSeller, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Root redirects to seller dashboard if logged in, otherwise to login */}
      <Route
        path="/"
        element={<Navigate to={isSeller ? "/seller/dashboard" : "/seller/login"} replace />}
      />

      {/* Auth Routes */}
      <Route
        path="/seller/login"
        element={
          <AuthRoute>
            <SellerLogin />
          </AuthRoute>
        }
      />
      <Route
        path="/seller/register"
        element={
          <AuthRoute>
            <SellerRegistration />
          </AuthRoute>
        }
      />
      <Route path="/seller/verify-mobile" element={<SellerMobileVerify />} />

      {/* Protected Seller Routes */}
      <Route
        path="/seller/dashboard"
        element={
          <ProtectedRoute requiredRole="seller">
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products"
        element={
          <ProtectedRoute requiredRole="seller">
            <SellerProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products/add"
        element={
          <ProtectedRoute requiredRole="seller">
            <SellerAddProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products/edit/:id"
        element={
          <ProtectedRoute requiredRole="seller">
            <SellerEditProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/orders"
        element={
          <ProtectedRoute requiredRole="seller">
            <SellerOrders />
          </ProtectedRoute>
        }
      />
      <Route path="/seller/customers" element={<SellerCustomers />} />
      <Route path="/seller/payments" element={<SellerPayments />} />
      <Route path="/seller/analytics" element={<SellerAnalytics />} />
      <Route
        path="/seller/messages"
        element={
          <ProtectedRoute requiredRole="seller">
            <SellerMessages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/settings"
        element={
          <ProtectedRoute requiredRole="seller">
            <SellerSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/help"
        element={
          <ProtectedRoute requiredRole="seller">
            <SellerHelp />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/seller/dashboard" replace />} />
    </Routes>
  );
};

export default SellerRoutes;
