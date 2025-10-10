import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Import layout components
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";
import MobileLayout from "./components/layout/MobileLayout";

// Import page components
import HeroSection from "./components/sections/HeroSection";
import FlashSale from "./components/sections/FlashSale";
import ProductGrid from "./components/sections/ProductGrid";
import ServicesSection from "./components/sections/ServicesSection";
import Newsletter from "./components/sections/Newsletter";
import MobileHome from "./components/pages/MobileHome";
// import CustomerLogin from "./components/ui/CustomerLogin";
// import CustomerRegistration from "./components/ui/CustomerRegistration";
// import ShoppingCart from "./components/pages/ShoppingCart";
// import ProductDetails from "./components/pages/ProductDetails";

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

  // TEMPORARILY DISABLED TO STOP INFINITE RELOAD
  // useEffect(() => {
  // const fetchCategories = async () => {
  //   try {
  //     const res = await api.get("/categories");
  //     const mapped = res.data.map((cat) => ({
  //       name: cat.name,
  //       icon: categoryMeta[cat.slug]?.icon || "❓",
  //       subcats: categoryMeta[cat.slug]?.subcats || [],
  //       image: categoryMeta[cat.slug]?.image || "https://via.placeholder.com/300",
  //     }));
  //     console.log(mapped);
  //     setMainCategories(mapped);
  //   } catch (err) {
  //     console.error("Error fetching categories", err);
  //   }
  // };

  // fetchCategories();
  // }, []);

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
    { name: "Daily Deals", href: "#" },
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
            {children}
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