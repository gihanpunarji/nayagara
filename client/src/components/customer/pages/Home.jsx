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
  serverStatus,
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

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showCategories, setShowCategories] = useState(false);
  const [serverStatus, setServerStatus] = useState("Checking...");
  const [user, setUser] = useState(null); 
  const [mainCategories, setMainCategories] = useState([]);

  // Server connection check
  const checkServerConnection = async () => {
    try {
      const res = await api.get("/health");
      setServerStatus("Connected");
      
    } catch (error) {
      setServerStatus("Server not connected");
      // Silently handle the error without console logs
    }
  };

  useEffect(() => {
    checkServerConnection();
    const interval = setInterval(checkServerConnection, 30000);
    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        const mapped = res.data.data.map((cat) => ({
          name: cat.category_name,
          icon: categoryMeta[cat.slug]?.icon || "❓",
          subcats: categoryMeta[cat.slug]?.subcats || [],
          image:
            categoryMeta[cat.slug]?.image || "https://via.placeholder.com/300",
        }));
        // console.log(mapped.name, map.icon, map.subcats, map.image);
        setMainCategories(mapped);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };

    fetchCategories();
  }, []);

  

  const quickLinks = [
    { name: "Daily Deals", href: "#" },
    { name: "New Arrivals", href: "#" },
    { name: "Best Sellers", href: "#" },
   { name: "Nayagara Water", href: "/nayagara_water" },
  ];

  // Responsive Layout Component
  const ResponsiveLayout = ({ children }) => {
    const location = useLocation();
    const isAuthPage =
      location.pathname.includes("/login") ||
      location.pathname.includes("/register");

    // For auth pages, don't use any layout wrapper
    if (isAuthPage) {
      return children;
    }

    return (
      <>
        {/* Desktop Layout */}
        <div className="hidden md:block">{children}</div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <MobileLayout user={user}>{children}</MobileLayout>
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
