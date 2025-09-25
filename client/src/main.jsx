import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";

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
    <BrowserRouter>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/register" element={<CustomerRegister />} />
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
            <ProductDetails />
          </PageWrapper>
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
          <PageWrapper>
            <CustomerAccount />
          </PageWrapper>
        } />
        <Route path='/checkout' element={
          <PageWrapper>
            <Checkout />
          </PageWrapper>
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
    </BrowserRouter>
  </StrictMode>
);
