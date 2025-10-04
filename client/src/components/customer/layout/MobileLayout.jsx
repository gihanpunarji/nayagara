import React, { useState } from 'react';
import MobileHeader from './MobileHeader';
import MobileBottomNav from './MobileBottomNav';
import MobileMenu from './MobileMenu';

const MobileLayout = ({ children, user = null }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [cartCount] = useState(3); // This would come from cart context/state
  const [wishlistCount] = useState(5); // This would come from wishlist context/state

  const handleMenuToggle = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Mobile Header */}
      <MobileHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onMenuToggle={handleMenuToggle}
        user={user}
      />

      {/* Main Content */}
      <main className="pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav cartCount={cartCount} onMenuToggle={handleMenuToggle} />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        user={user}
      />
    </div>
  );
};

export default MobileLayout;