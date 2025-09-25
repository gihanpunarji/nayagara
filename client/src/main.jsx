import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
<<<<<<< HEAD

// Customer Components
import Home from './components/customer/pages/Home.jsx'
import CustomerLogin from './components/customer/auth/Login.jsx'
import CustomerRegister from './components/customer/auth/Register.jsx'
import ForgotPassword from './components/customer/auth/ForgotPassword.jsx'
import ResetPassword from './components/customer/auth/ResetPassword.jsx'
import ShoppingCart from './components/customer/pages/ShoppingCart.jsx'
import ProductDetails from './components/customer/pages/ProductDetails.jsx'
import SearchPage from './components/customer/pages/SearchPage.jsx'
import CustomerAccount from './components/customer/pages/Account.jsx'
import Checkout from './components/customer/pages/Checkout.jsx'
import ShopPage from './components/customer/pages/ShopPage.jsx'
import AdvancedSearch from './components/customer/pages/AdvancedSearch.jsx'
import PageWrapper from './components/customer/layout/PageWrapper.jsx'

// Seller Components
import SellerLogin from './components/seller/auth/Login.jsx'
import SellerDashboard from './components/seller/pages/Dashboard.jsx'

// Admin Components
import AdminLogin from './components/admin/auth/Login.jsx'
import AdminDashboard from './components/admin/pages/Dashboard.jsx'

// Shared Components
import NotFound from './components/shared/error/NotFound.jsx'
import ServerError from './components/shared/error/ServerError.jsx'
import NetworkError from './components/shared/error/NetworkError.jsx'
import AccessDenied from './components/shared/error/AccessDenied.jsx'
=======
import App from './App.jsx'
import CustomerRegistration from './components/ui/CustomerRegistration.jsx'
import CustomerLogin from './components/ui/CustomerLogin.jsx'
import ForgotPassword from './components/ui/ForgotPassword.jsx'
import ResetPassword from './components/ui/ResetPassword.jsx'
import ShoppingCart from './components/pages/ShoppingCart.jsx'
import ProductDetails from './components/pages/ProductDetails.jsx'
import SearchPage from './components/pages/SearchPage.jsx'
import CustomerAccount from './components/pages/CustomerAccount.jsx'
import Checkout from './components/pages/Checkout.jsx'
import ShopPage from './components/pages/ShopPage.jsx'
import PageWrapper from './components/layout/PageWrapper.jsx'
import SellerRegistration from './components/ui/seller/SellerRegistration.jsx'
import SellerLogin from './components/ui/seller/SellerLogin.jsx'
>>>>>>> 834882985a1aafadb002748b1bb3899e7862656b

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Customer Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<CustomerLogin />} />
        <Route path='/register' element={<CustomerRegister />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/sell' element={<SellerRegistration />} />
        <Route path="/seller-login" element={<SellerLogin />} />
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
        <Route path='/seller/dashboard' element={<SellerDashboard />} />

        {/* Admin Routes */}
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin/dashboard' element={<AdminDashboard />} />

        {/* Error Routes */}
        <Route path='/error/server' element={<ServerError />} />
        <Route path='/error/network' element={<NetworkError />} />
        <Route path='/error/access-denied' element={<AccessDenied />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
