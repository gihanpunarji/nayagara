import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Import layout components
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import Footer from "../layout/Footer";
import MobileLayout from "../../shared/layout/MobileLayout";

// Import page components
import HeroSection from "../sections/HeroSection";
import FlashSale from "../sections/FlashSale";
import ProductGrid from "../sections/ProductGrid";
import ServicesSection from "../sections/ServicesSection";
import Newsletter from "../sections/Newsletter";
import MobileHome from "./MobileHome";
import CustomerLogin from "../auth/Login";
import CustomerRegistration from "../auth/Register";
import ShoppingCart from "./ShoppingCart";
import ProductDetails from "./ProductDetails";

import api from "../../../api/axios";

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
      <div className="mx-auto px-4 sm:px-8 lg:px-16 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Component */}
          <Sidebar mainCategories={mainCategories} />

          {/* Main Content */}
          <div className="flex-1">
            {/* Hero Section */}
            <HeroSection />

            {/* Flash Sale Section */}
            <FlashSale />

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
  const [user, setUser] = useState(null); // User state for authentication

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

  // Categories data
  const mainCategories = [
    {
      name: "Electronics",
      icon: "📱",
      subcats: ["Mobile Phones", "Laptops", "TVs", "Cameras"],
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Vehicles",
      icon: "🚗",
      subcats: ["Cars", "Motorcycles", "Parts", "Accessories"],
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Fashion",
      icon: "👔",
      subcats: ["Men's Wear", "Women's Wear", "Shoes", "Accessories"],
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Home & Living",
      icon: "🏠",
      subcats: ["Furniture", "Appliances", "Decor", "Kitchen"],
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Beauty & Health",
      icon: "💄",
      subcats: ["Skincare", "Makeup", "Supplements", "Fitness"],
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Sports",
      icon: "⚽",
      subcats: ["Cricket", "Football", "Fitness", "Outdoor"],
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Books & Media",
      icon: "📚",
      subcats: ["Educational", "Fiction", "Children", "Software"],
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Services",
      icon: "🔧",
      subcats: ["Home Services", "Professional", "Events", "Education"],
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
  ];

  const quickLinks = [
    { name: "Daily Deals", href: "#" },
    { name: "New Arrivals", href: "#" },
    { name: "Best Sellers", href: "#" },
    { name: "Nayagara Water", href: "https://nayagara.lk/" },
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
            {children}
          </MobileLayout>
        </div>
      </>
    );
  };

  return (
    <ResponsiveLayout>
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
