import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import MobileLayout from './MobileLayout';
import Header from './Header';
import Footer from './Footer';

const PageWrapper = ({ children }) => {
  const location = useLocation();
  const [user] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showCategories, setShowCategories] = useState(false);
  const [serverStatus] = useState("Connected");

  const mainCategories = [
    
  ];

  const quickLinks = [
    { name: "Daily Deals", href: "#" },
    { name: "New Arrivals", href: "#" },
    { name: "Best Sellers", href: "#" },
  ];


  const isAuthPage = location.pathname.includes('/login') ||
                    location.pathname.includes('/register') ||
                    location.pathname.includes('/forgot-password') ||
                    location.pathname.includes('/reset-password');

  if (isAuthPage) {
    return children;
  }

  return (
    <>
      <div className="hidden md:block">
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
        {children}
        <Footer />
      </div>

      <div className="md:hidden">
        <MobileLayout user={user}>
          {children}
        </MobileLayout>
      </div>
    </>
  );
};

export default PageWrapper;