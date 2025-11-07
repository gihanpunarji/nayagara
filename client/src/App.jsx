import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Import layout components
import Header from "./components/customer/layout/Header";
import Sidebar from "./components/customer/layout/Sidebar";
import Footer from "./components/customer/layout/Footer";
import MobileLayout from "./components/customer/layout/MobileLayout";

// Import page components
import HeroSection from "./components/customer/sections/HeroSection";
import NewArrivals from "./components/customer/sections/NewArrivals";
import ProductGrid from "./components/customer/sections/ProductGrid";
import ServicesSection from "./components/customer/sections/ServicesSection";
import Newsletter from "./components/customer/sections/Newsletter";
import MobileHome from "./pages/MobileHome";
import CustomerAccount from "./components/customer/pages/Account";

import api from "./api/axios";

// Desktop HomePage Component
const DesktopHomePage = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  showCategories,
  setShowCategories,
  mainCategories,
  quickLinks,
  serverStatus
}) => {
  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header Component */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        showCategories={showCategories}
        setShowCategories={setShowCategories}
        mainCategories={mainCategories}
        quickLinks={quickLinks}
        serverStatus={serverStatus}
      />

      {/* Main Container */}
      <div className="max-w-[85%] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Component */}
          <Sidebar mainCategories={mainCategories} />

          {/* Main Content */}
          <div className="flex-1">
            {/* Hero Section */}
            <HeroSection />

            {/* Flash Sale Section */}
            <NewArrivals />

            {/* Product Grid */}
            <ProductGrid />

            {/* Services Section */}
            <ServicesSection />
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <Newsletter />

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

// Main App Component with Responsive Layout
const App = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showCategories, setShowCategories] = useState(false);
  const [serverStatus, setServerStatus] = useState("Checking...");
  const { user, isSeller, loading } = useAuth(); // User state for authentication
  const navigate = useNavigate();

  // Server connection check
  const checkServerConnection = async () => {
    try {
      const res = api.get("/health");
      setServerStatus("Connected");
    } catch (error) {
      setServerStatus("Server not connected");
    }
  };

  useEffect(() => {
    checkServerConnection();
    const interval = setInterval(checkServerConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  // Redirect sellers to their dashboard if they access the home page
  useEffect(() => {
    if (!loading && isSeller) {
      console.log('Seller detected on home page, redirecting to dashboard');
      navigate('/seller/dashboard', { replace: true });
    }
  }, [isSeller, loading, navigate]);

  const [mainCategories, setMainCategories] = useState([]);

  const categoryMeta = {
  electronics: {
    icon: "📱",
    subcats: ["Mobile Phones", "Laptops", "TVs", "Cameras"],
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },
  fashion: {
    icon: "👔",
    subcats: ["Men's Wear", "Women's Wear", "Shoes", "Accessories"],
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },
  groceries: {
    icon: "🛒",
    subcats: ["Fruits", "Vegetables", "Snacks", "Beverages"],
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e17d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },
  furniture: {
    icon: "🏠",
    subcats: ["Living Room", "Bedroom", "Office", "Outdoor"],
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },
  sports: {
    icon: "⚽",
    subcats: ["Cricket", "Football", "Fitness", "Outdoor"],
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },
};

  const quickLinks = [

    { name: "New Arrivals", href: "#" },
    { name: "Best Sellers", href: "#" },
   { name: "Nayagara Water", href: "/nayagara_water" },
  ];

  // Responsive Layout Component
  const ResponsiveLayout = ({ children }) => {
    const location = useLocation();
    const isAuthPage = location.pathname.includes('/login') || location.pathname.includes('/register');

    // For auth pages, don't use any layout wrapper
    if (isAuthPage) {
      return children;
    }

    return (
      <>
        {/* Desktop Layout */}
        <div className="hidden md:block">
          {children}
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <MobileLayout user={user}>
            {location.pathname.startsWith('/account') ? <CustomerAccount /> : children}
          </MobileLayout>
        </div>
      </>
    );
  };

  const Watermark = () => (
  <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
    <h1 className="text-[86px] font-bold text-black opacity-70 select-none">
      UNDER DEVELOPMENT
    </h1>
  </div>
);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
      </div>
    );
  }

  // Don't render home content if user is a seller (they'll be redirected)
  if (isSeller) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to seller dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveLayout>
        {location.pathname !== "/nayagara-water" && <Watermark />}

      {/* Desktop Home */}
      <div className="hidden md:block">
        <DesktopHomePage
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          showCategories={showCategories}
          setShowCategories={setShowCategories}
          mainCategories={mainCategories}
          quickLinks={quickLinks}
          serverStatus={serverStatus}
        />
      </div>
      {/* Mobile Home */}
      <div className="md:hidden">
        <MobileHome />
      </div>
    </ResponsiveLayout>
  );
};

export default App;