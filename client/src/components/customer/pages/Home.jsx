import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Import layout components
import Header from "../layout/Header";
import MobileHeader from "../layout/MobileHeader";
import Sidebar from "../layout/Sidebar";
import Footer from "../layout/Footer";
import MobileLayout from "../layout/MobileLayout";
import MobileBottomNav from "../layout/MobileBottomNav";
import MobileMenu from "../layout/MobileMenu";

// Import page components
import HeroSection from "../sections/HeroSection";
import NewArrivals from "../sections/NewArrivals";
import ProductGrid from "../sections/ProductGrid";
import ServicesSection from "../sections/ServicesSection";
import Newsletter from "../sections/Newsletter";
import MobileHome from "./MobileHome";


import { publicApi } from "../../../api/axios";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";

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
  user
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount: cartCount } = useCart();
  const { user: contextUser } = useAuth();
  const currentUser = user || contextUser;

  return (
    <div className="min-h-screen bg-primary-50 pb-16 xl:pb-0">
      {/* Desktop Header - Visible on XL screens and up */}
      <div className="hidden xl:block">
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
      </div>

      {/* Mobile/Tablet Header - Visible on screens smaller than XL */}
      <div className="xl:hidden">
        <MobileHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          user={currentUser}
          wishlistCount={0}
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
      </div>

      {/* Mobile Menu for Medium/Large Screens */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={currentUser}
        mainCategories={mainCategories}
      />


      {/* Main Container */}
      <div className="max-w-[95%] md:max-w-[90%] xl:max-w-[85%] mx-auto px-3 md:px-4 xl:px-8 py-4 md:py-5 xl:py-6">
        <div className="flex flex-col xl:flex-row gap-4 md:gap-5 xl:gap-6">
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

      {/* Mobile Bottom Navigation - Show on medium screens */}
      <MobileBottomNav
        cartCount={cartCount}
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
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


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await publicApi.get("/categories-with-subcategories");
        const mapped = res.data.data.map((cat) => {
          const slug = cat.category_slug || cat.category_name.toLowerCase().replace(/\s+/g, '');
          const iconValue = cat.icon || "📁";
          
          return {
            id: cat.category_id,
            name: cat.category_name,
            slug: slug,
            icon: iconValue,
            subcategories: cat.subcategories || [],
            image: cat.image,
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

    { name: "New Arrivals", href: "#" },

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
          user={user}
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
