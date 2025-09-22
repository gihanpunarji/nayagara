import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/login' element={<CustomerLogin />} />
        <Route path='/register' element={<CustomerRegistration />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
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
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
