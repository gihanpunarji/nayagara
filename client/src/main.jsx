import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";

// Auth Context and Route Protection
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/shared/auth/ProtectedRoute.jsx";
import AuthRoute from "./components/shared/auth/AuthRoute.jsx";
import ErrorBoundary from "./components/shared/error/ErrorBoundary.jsx";

// Customer Components
import Home from "./components/customer/pages/Home.jsx";
import CustomerLogin from "./components/customer/auth/Login.jsx";
import CustomerRegister from "./components/customer/auth/Register.jsx";
import ForgotPassword from "./components/customer/auth/ForgotPassword.jsx";
import ResetPassword from "./components/customer/auth/ResetPassword.jsx";
import ShoppingCart from "./components/customer/pages/ShoppingCart.jsx";
import ProductDetails from "./components/customer/pages/ProductDetails.jsx";
import SearchPage from "./components/customer/pages/SearchPage.jsx";
import CustomerAccount from "./components/customer/pages/Account.jsx";
import Checkout from "./components/customer/pages/Checkout.jsx";
import ShopPage from "./components/customer/pages/ShopPage.jsx";
import AdvancedSearch from "./components/customer/pages/AdvancedSearch.jsx";
import PageWrapper from "./components/customer/layout/PageWrapper.jsx";
import ProductView from "./components/customer/pages/ProductView.jsx";
import NewArrivals from "./components/customer/pages/NewArrivals.jsx";
import FlashSale from "./components/customer/pages/FlashSale.jsx";
import DailyDeals from "./components/customer/pages/DailyDeals.jsx";
import TopRated from "./components/customer/pages/TopRated.jsx";
import AboutUs from "./components/customer/pages/AboutUs.jsx";
import OurBusiness from "./components/customer/pages/OurBusiness.jsx";
import BuyerProtection from "./components/customer/pages/BuyerProtection.jsx";
import ChatView from "./components/customer/pages/ChatView.jsx";
import ChatList from "./components/customer/pages/ChatList.jsx";
import NayagaraWaterHome from "./components/customer/pages/Nayagara_water_home.jsx";

// Advertisement Components
// import PostAd from "./components/customer/pages/PostAd.jsx";
import AdDetails from "./components/customer/pages/AdDetails.jsx";
import AdListings from "./components/customer/pages/AdListings.jsx";

// Seller Components
import SellerLogin from "./components/seller/auth/SellerLogin.jsx";
import SellerMobileVerify from "./components/seller/auth/SellerMobileVerify.jsx";
import SellerProducts from "./components/seller/pages/Products.jsx";
import SellerAddProduct from "./components/seller/pages/AddProduct.jsx";
import SellerEditProduct from "./components/seller/pages/EditProduct.jsx";
import SellerOrders from "./components/seller/pages/Orders.jsx";
import SellerPayments from "./components/seller/pages/Payments.jsx";
import SellerCustomers from "./components/seller/pages/Customers.jsx";
import SellerAnalytics from "./components/seller/pages/Analytics.jsx";
import SellerSettings from "./components/seller/pages/Settings.jsx";
import SellerHelp from "./components/seller/pages/Help.jsx";
import SellerMessages from "./components/seller/pages/Messages.jsx";

// Admin Components
import AdminLogin from "./components/admin/auth/AdminLogin.jsx";
import AdminDashboard from "./components/admin/pages/Dashboard.jsx";
import AdminCustomers from "./components/admin/pages/Customers.jsx";
import AdminSellers from "./components/admin/pages/Sellers.jsx";
import AdminProducts from "./components/admin/pages/Products.jsx";
import AdminOrders from "./components/admin/pages/Orders.jsx";
import AdminAnalytics from "./components/admin/pages/Analytics.jsx";
import AdManagement from "./components/admin/pages/AdManagement.jsx";

// Shared Components
import NotFound from "./components/shared/error/NotFound.jsx";
import ServerError from "./components/shared/error/ServerError.jsx";
import NetworkError from "./components/shared/error/NetworkError.jsx";
import AccessDenied from "./components/shared/error/AccessDenied.jsx";
import Dashboard from "./components/seller/pages/Dashboard.jsx";
import SellerRegistration from "./components/seller/auth/SellerRegistration.jsx";
import AdminProtectedRoute from "./components/admin/auth/AdminProtectedRoute.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Admin Routes - WITHOUT AuthProvider */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              // <AdminProtectedRoute>
                <AdminDashboard />
              // </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              // <AdminProtectedRoute>
                <AdminCustomers />
              // </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/sellers"
            element={
              // <AdminProtectedRoute>
                <AdminSellers />
              // </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              // <AdminProtectedRoute>
                <AdminProducts />
              // </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              // <AdminProtectedRoute>
                <AdminOrders />
              // </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              // <AdminProtectedRoute>
                <AdminAnalytics />
              // </AdminProtectedRoute>
            }
          />

          {/* All other routes WITH AuthProvider */}
          <Route
            path="/*"
            element={
              <AuthProvider>
                <Routes>
                  {/* Customer Routes */}
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/login"
                    element={
                      <AuthRoute>
                        <CustomerLogin />
                      </AuthRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <AuthRoute>
                        <CustomerRegister />
                      </AuthRoute>
                    }
                  />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  {/* Seller Routes */}
                  <Route path="/seller-login" element={<SellerLogin />} />
                  <Route
                    path="/seller/verify-mobile"
                    element={<SellerMobileVerify />}
                  />
                  <Route
                    path="/seller/register"
                    element={<SellerRegistration />}
                  />
                  <Route
                    path="/cart"
                    element={
                      <PageWrapper>
                        <ShoppingCart />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/product/:id"
                    element={
                      <PageWrapper>
                        <ProductView />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/new-arrivals"
                    element={
                      <PageWrapper>
                        <NewArrivals />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/flash-sale"
                    element={
                      <PageWrapper>
                        <FlashSale />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/daily-deals"
                    element={
                      <PageWrapper>
                        <DailyDeals />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/deals"
                    element={
                      <PageWrapper>
                        <DailyDeals />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/top-rated"
                    element={
                      <PageWrapper>
                        <TopRated />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/about-us"
                    element={
                      <PageWrapper>
                        <AboutUs />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/our-business"
                    element={
                      <PageWrapper>
                        <OurBusiness />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/buyer-protection"
                    element={
                      <PageWrapper>
                        <BuyerProtection />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/chat/:sellerId/:productId"
                    element={
                      <ProtectedRoute>
                        <ChatView />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/messages"
                    element={
                      <ProtectedRoute>
                        <PageWrapper>
                          <ChatList />
                        </PageWrapper>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/search"
                    element={
                      <PageWrapper>
                        <SearchPage />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/shop"
                    element={
                      <PageWrapper>
                        <ShopPage />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/advanced-search"
                    element={
                      <PageWrapper>
                        <AdvancedSearch />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/account"
                    element={
                      <ProtectedRoute>
                        <PageWrapper>
                          <CustomerAccount />
                        </PageWrapper>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <PageWrapper>
                          <Checkout />
                        </PageWrapper>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/nayagara_water"
                    element={
                      <PageWrapper>
                        <NayagaraWaterHome />
                      </PageWrapper>
                    }
                  />

                  {/* Seller Routes */}
                  <Route path="/seller/login" element={<SellerLogin />} />
                  <Route path="/seller/dashboard" element={<Dashboard />} />
                  <Route path="/seller/products" element={<SellerProducts />} />
                  <Route
                    path="/seller/products/add"
                    element={<SellerAddProduct />}
                  />
                  <Route
                    path="/seller/products/edit/:id"
                    element={<SellerEditProduct />}
                  />
                  <Route path="/seller/orders" element={<SellerOrders />} />
                  <Route
                    path="/seller/customers"
                    element={<SellerCustomers />}
                  />
                  <Route path="/seller/payments" element={<SellerPayments />} />
                  <Route
                    path="/seller/analytics"
                    element={<SellerAnalytics />}
                  />
                  <Route path="/seller/messages" element={<SellerMessages />} />
                  <Route path="/seller/settings" element={<SellerSettings />} />
                  <Route path="/seller/help" element={<SellerHelp />} />

                  {/* Error Routes */}
                  <Route path="/error/server" element={<ServerError />} />
                  <Route path="/error/network" element={<NetworkError />} />
                  <Route
                    path="/error/access-denied"
                    element={<AccessDenied />}
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AuthProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
