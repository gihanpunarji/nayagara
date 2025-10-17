import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Import layout components
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";
import Footer from "../layout/Footer";
import MobileLayout from "../layout/MobileLayout";

// Import page components
import HeroSection from "../sections/HeroSection";
import FlashSale from "../sections/FlashSale";
import ProductGrid from "../sections/ProductGrid";
import ServicesSection from "../sections/ServicesSection";
import Newsletter from "../sections/Newsletter";
import MobileHome from "./MobileHome";


import { publicApi } from "../../../api/axios";

// Responsive Layout Component (moved outside to prevent re-creation)
const ResponsiveLayout = ({ children, user }) => {
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
      const res = await publicApi.get("/health");
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

  const defaultCategoryMeta = {
    electronics: {
      icon: "📱",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    fashion: {
      icon: "👔",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    groceries: {
      icon: "🛒",
      image:
        "https://images.unsplash.com/photo-1586201375761-83865001e17d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    furniture: {
      icon: "🏠",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    sports: {
      icon: "⚽",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    automotive: {
      icon: "🚗",
      image:
        "https://images.unsplash.com/photo-1493238792000-8113da705763?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    "books-media": {
      icon: "📚",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    
    toys: {
      icon: "🧸",
      image:
        "https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    "beauty-health": {
      icon: "💄",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    jewelry: {
      icon: "💎",
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    "home-living": {
      icon: "🏡",
      image:
        "https://images.unsplash.com/photo-1484101403633-562f891dc89a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    appliances: {
      icon: "🔌",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    music: {
      icon: "🎵",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    "toys-games": {
      icon: "🎮",
      image:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    pets: {
      icon: "🐕",
      image:
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    garden: {
      icon: "🌱",
      image:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    tools: {
      icon: "🔧",
      image:
        "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    bags: {
      icon: "👜",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    shoes: {
      icon: "👟",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    watches: {
      icon: "⌚",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
   services: {
      icon: "🖥️",
      image:
        "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    baby: {
      icon: "👶",
      image:
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    food: {
      icon: "🍕",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    travel: {
      icon: "✈️",
      image:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    art: {
      icon: "🎨",
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    craft: {
      icon: "✂️",
      image:
        "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    outdoors: {
      icon: "🏕️",
      image:
        "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    vintage: {
      icon: "🕰️",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await publicApi.get("/categories-with-subcategories");
        const mapped = res.data.data.map((cat) => {
          const slug = cat.category_slug || cat.category_name.toLowerCase().replace(/\s+/g, '');
          return {
            id: cat.category_id,
            name: cat.category_name,
            slug: slug,
            icon: defaultCategoryMeta[slug]?.icon || "❓",
            subcategories: cat.subcategories || [],
            image: defaultCategoryMeta[slug]?.image || "https://via.placeholder.com/300",
          };
        });
        setMainCategories(mapped);
      } catch (err) {
        console.error("Error fetching categories", err);
        // Fallback to empty array if API fails
        setMainCategories([]);
      }
    };

    fetchCategories();
  }, []);

  

  const quickLinks = [
    { name: "Daily Deals", href: "#" },
    { name: "New Arrivals", href: "#" },
    { name: "Best Sellers", href: "#" },
   { name: "Nayagara Water", href: "/nayagara-water" },
  ];


  

  return (
    <ResponsiveLayout user={user}>
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
