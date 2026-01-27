import { Routes, Route } from "react-router-dom";

// Customer Components
import Home from "../components/customer/pages/Home.jsx";
import CustomerLogin from "../components/customer/auth/Login.jsx";
import CustomerRegister from "../components/customer/auth/Register.jsx";
import ForgotPassword from "../components/customer/auth/ForgotPassword.jsx";
import ResetPassword from "../components/customer/auth/ResetPassword.jsx";
import ShoppingCart from "../components/customer/pages/ShoppingCart.jsx";
import SearchPage from "../components/customer/pages/SearchPage.jsx";
import CustomerAccount from "../components/customer/pages/Account.jsx";
import Checkout from "../components/customer/pages/Checkout.jsx";
import ShopPage from "../components/customer/pages/ShopPage.jsx";
import AdvancedSearch from "../components/customer/pages/AdvancedSearch.jsx";
import PageWrapper from "../components/customer/layout/PageWrapper.jsx";
import { ProductView } from "../components/customer/pages/ProductView.jsx";
import NewArrivals from "../components/customer/sections/NewArrivals.jsx";
import AboutUs from "../components/customer/pages/AboutUs.jsx";
import OurBusiness from "../components/customer/pages/OurBusiness.jsx";
import BuyerProtection from "../components/customer/pages/BuyerProtection.jsx";
import ChatView from "../components/customer/pages/ChatView.jsx";
import NayagaraWaterHome from "../components/customer/pages/Nayagara_water_home.jsx";
import HelpCenter from "../components/customer/pages/HelpCenter.jsx";
import RefundPolicy from "../components/customer/pages/RefundPolicy.jsx";
import SystemPrivacy from "../components/customer/pages/SystemPrivacy.jsx";
import TermsConditions from "../components/customer/pages/TermsConditions.jsx";
import PostAd from "../components/customer/pages/PostAd.jsx";
import OrderSuccess from "../components/customer/pages/OrderSuccess.jsx";

// Auth & Protection
import AuthRoute from "../components/shared/auth/AuthRoute.jsx";
import ProtectedRoute from "../components/shared/auth/ProtectedRoute.jsx";

// Error Pages
import NotFound from "../components/shared/error/NotFound.jsx";
import ServerError from "../components/shared/error/ServerError.jsx";
import NetworkError from "../components/shared/error/NetworkError.jsx";
import AccessDenied from "../components/shared/error/AccessDenied.jsx";

const CustomerRoutes = () => {
  return (
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
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/order-success"
        element={
          <ProtectedRoute>
            <OrderSuccess />
          </ProtectedRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
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
            <NewArrivals />
          </PageWrapper>
        }
      />
      <Route
        path="/daily-deals"
        element={
          <PageWrapper>{/* <DailyDeals /> */}</PageWrapper>
        }
      />
      <Route
        path="/deals"
        element={
          <PageWrapper>{/* <DailyDeals /> */}</PageWrapper>
        }
      />
      <Route
        path="/top-rated"
        element={
          <PageWrapper>{/* <TopRated /> */}</PageWrapper>
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
          <ProtectedRoute requiredRole="customer">
            <ChatView />
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
          <ProtectedRoute requiredRole="customer">
            <PageWrapper>
              <CustomerAccount />
            </PageWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/post-ad"
        element={
          <ProtectedRoute requiredRole="customer">
            <PageWrapper>
              <PostAd />
            </PageWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute requiredRole="customer" promptOnRedirect={true}>
            <PageWrapper>
              <Checkout />
            </PageWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/nayagara-water"
        element={
          <PageWrapper>
            <NayagaraWaterHome />
          </PageWrapper>
        }
      />
      <Route
        path="/help-center"
        element={
          <PageWrapper>
            <HelpCenter />
          </PageWrapper>
        }
      />
      <Route
        path="/refund-policy"
        element={
          <PageWrapper>
            <RefundPolicy />
          </PageWrapper>
        }
      />
      <Route
        path="/privacy-policy"
        element={
          <PageWrapper>
            <SystemPrivacy />
          </PageWrapper>
        }
      />
      <Route
        path="/terms-conditions"
        element={
          <PageWrapper>
            <TermsConditions />
          </PageWrapper>
        }
      />

      <Route
        path="/contact-admin"
        element={
          <PageWrapper>
            <AdminPortfolio />
          </PageWrapper>
        }
      />

      {/* Error Routes */}
      <Route path="/error/server" element={<ServerError />} />
      <Route path="/error/network" element={<NetworkError />} />
      <Route path="/error/access-denied" element={<AccessDenied />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default CustomerRoutes;
