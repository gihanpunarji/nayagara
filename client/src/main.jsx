import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";

// Context Providers
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import AxiosInterceptorManager from "./api/AxiosInterceptorManager.jsx";
import AdminAxiosInterceptor from "./api/AdminAxiosInterceptor.jsx";
import ErrorBoundary from "./components/shared/error/ErrorBoundary.jsx";

// Route Components
import CustomerRoutes from "./routes/CustomerRoutes.jsx";
import SellerRoutes from "./routes/SellerRoutes.jsx";

// Admin Components
import AdminLogin from "./components/admin/auth/AdminLogin.jsx";
import AdminDashboard from "./components/admin/pages/Dashboard.jsx";
import AdminCustomers from "./components/admin/pages/Customers.jsx";
import AdminSellers from "./components/admin/pages/Sellers.jsx";
import AdminProducts from "./components/admin/pages/Products.jsx";
import AdminOrders from "./components/admin/pages/Orders.jsx";
import AdminAnalytics from "./components/admin/pages/Analytics.jsx";
import AdManagement from "./components/admin/pages/AdManagement.jsx";
import AdminCategories from "./components/admin/pages/Categories.jsx";
import AdminInventory from "./components/admin/pages/Inventory.jsx";
import AdminPromotions from "./components/admin/pages/PromotionsDiscounts.jsx";
import AdminPayments from "./components/admin/pages/Payments.jsx";
import AdminShipping from "./components/admin/pages/Shipping.jsx";
import AdminNotifications from "./components/admin/pages/Notifications.jsx";
import AdminBanners from "./components/admin/pages/BannerSlider.jsx";
import Referral from "./components/admin/pages/Referral.jsx";
import SellerDetails from "./components/admin/pages/SellerDetails.jsx";
import AdminProtectedRoute from "./components/admin/auth/AdminProtectedRoute.jsx";

// Subdomain Detection
import { getSubdomain, isSellerSubDomain, isCustomerSubDomain } from "./utils/subdomain.js";

// Determine which routes to render based on subdomain
const AppRoutes = () => {
  const subdomain = getSubdomain();
  const isSellerSub = isSellerSubDomain();
  const isCustomerSub = isCustomerSubDomain();

  // If there's a subdomain but it's not valid (not 'sellers' or 'www'), show error
  if (subdomain && !isSellerSub && !isCustomerSub) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Invalid Subdomain</h1>
          <p className="text-gray-600 mb-6">
            The subdomain "<span className="font-semibold">{subdomain}</span>" does not exist.
          </p>
          <a
            href={`${window.location.protocol}//nayagara.lk`}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Go to main site
          </a>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <AxiosInterceptorManager>
        <CartProvider>
          {isSellerSub ? <SellerRoutes /> : <CustomerRoutes />}
        </CartProvider>
      </AxiosInterceptorManager>
    </AuthProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Admin Routes - Separate from subdomain logic */}
          <Route
            path="/admin/*"
            element={
              <AdminAxiosInterceptor>
                <Routes>
                  <Route path="/login" element={<AdminLogin />} />
                  <Route
                    path="/dashboard"
                    element={
                      <AdminProtectedRoute>
                        <AdminDashboard />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/customers"
                    element={
                      <AdminProtectedRoute>
                        <AdminCustomers />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/sellers"
                    element={
                      <AdminProtectedRoute>
                        <AdminSellers />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/seller/:id"
                    element={
                      <AdminProtectedRoute>
                        <SellerDetails />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/products"
                    element={
                      <AdminProtectedRoute>
                        <AdminProducts />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <AdminProtectedRoute>
                        <AdminOrders />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <AdminProtectedRoute>
                        <AdminAnalytics />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/advertisements"
                    element={
                      <AdminProtectedRoute>
                        <AdManagement />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/categories"
                    element={
                      <AdminProtectedRoute>
                        <AdminCategories />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/inventory"
                    element={
                      <AdminProtectedRoute>
                        <AdminInventory />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/promotions"
                    element={
                      <AdminProtectedRoute>
                        <AdminPromotions />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/payments"
                    element={
                      <AdminProtectedRoute>
                        <AdminPayments />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/shipping"
                    element={
                      <AdminProtectedRoute>
                        <AdminShipping />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/notifications"
                    element={
                      <AdminProtectedRoute>
                        <AdminNotifications />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/banners"
                    element={
                      <AdminProtectedRoute>
                        <AdminBanners />
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/referrals"
                    element={
                      <AdminProtectedRoute>
                        <Referral />
                      </AdminProtectedRoute>
                    }
                  />
                </Routes>
              </AdminAxiosInterceptor>
            }
          />

          {/* All other routes - Customer or Seller based on subdomain */}
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
