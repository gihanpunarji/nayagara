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

// Seller Components
import SellerLogin from "./components/seller/auth/SellerLogin.jsx";
import SellerMobileVerify from "./components/seller/auth/SellerMobileVerify.jsx";

// Admin Components
import AdminLogin from "./components/admin/auth/Login.jsx";
import AdminDashboard from "./components/admin/pages/Dashboard.jsx";

// Shared Components
import NotFound from './components/shared/error/NotFound.jsx'
import ServerError from './components/shared/error/ServerError.jsx'
import NetworkError from './components/shared/error/NetworkError.jsx'
import AccessDenied from './components/shared/error/AccessDenied.jsx'
import Dashboard from './components/seller/pages/Dashboard.jsx'
import SellerRegistration from "./components/seller/auth/SellerRegistration.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthRoute><CustomerLogin /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><CustomerRegister /></AuthRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Seller Routes */}
        <Route path="/seller-login" element={<SellerLogin />} />
        <Route path='/seller/verify-mobile' element={<SellerMobileVerify />} />
        <Route path='/seller/register' element={<SellerRegistration />} />
        <Route path='/cart' element={
          <PageWrapper>
            <ShoppingCart />
          </PageWrapper>
        } />
        <Route path='/product/:id' element={
          <PageWrapper>
            <ProductView />
          </PageWrapper>
        } />
        <Route path='/new-arrivals' element={
          <PageWrapper>
            <NewArrivals />
          </PageWrapper>
        } />
        <Route path='/flash-sale' element={
          <PageWrapper>
            <FlashSale />
          </PageWrapper>
        } />
        <Route path='/daily-deals' element={
          <PageWrapper>
            <DailyDeals />
          </PageWrapper>
        } />
        <Route path='/deals' element={
          <PageWrapper>
            <DailyDeals />
          </PageWrapper>
        } />
        <Route path='/top-rated' element={
          <PageWrapper>
            <TopRated />
          </PageWrapper>
        } />
        <Route path='/about-us' element={
          <PageWrapper>
            <AboutUs />
          </PageWrapper>
        } />
        <Route path='/our-business' element={
          <PageWrapper>
            <OurBusiness />
          </PageWrapper>
        } />
        <Route path='/buyer-protection' element={
          <PageWrapper>
            <BuyerProtection />
          </PageWrapper>
        } />
        <Route path='/chat/:sellerId/:productId' element={
          <ProtectedRoute>
            <ChatView />
          </ProtectedRoute>
        } />
        <Route path='/messages' element={
          <ProtectedRoute>
            <PageWrapper>
              <ChatList />
            </PageWrapper>
          </ProtectedRoute>
        } />
        <Route path='/search' element={
          <PageWrapper>
            <SearchPage />
          </PageWrapper>
        } />
        <Route path='/shop' element={
          <PageWrapper>
            <ShopPage />
          </PageWrapper>
        } />
        <Route path='/advanced-search' element={
          <PageWrapper>
            <AdvancedSearch />
          </PageWrapper>
        } />
        <Route path='/account' element={
          <ProtectedRoute>
            <PageWrapper>
              <CustomerAccount />
            </PageWrapper>
          </ProtectedRoute>
        } />
        <Route path='/checkout' element={
          <ProtectedRoute>
            <PageWrapper>
              <Checkout />
            </PageWrapper>
          </ProtectedRoute>
        } />

        {/* Seller Routes */}
        <Route path='/seller/login' element={<SellerLogin />} />
        <Route path='/seller/dashboard' element={<Dashboard />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Error Routes */}
        <Route path="/error/server" element={<ServerError />} />
        <Route path="/error/network" element={<NetworkError />} />
        <Route path="/error/access-denied" element={<AccessDenied />} />
        <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
