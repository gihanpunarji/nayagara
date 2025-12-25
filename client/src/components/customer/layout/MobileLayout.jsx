import React, { useState } from 'react';
import MobileHeader from './MobileHeader';
import MobileBottomNav from './MobileBottomNav';
import MobileMenu from './MobileMenu';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';

const MobileLayout = ({ children, user = null, mainCategories = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Use real context data
  const { itemCount: cartCount } = useCart();
  const { user: contextUser } = useAuth(); // Fallback to context user if prop is null
  
  // Wishlist count would ideally come from a similar context, keeping 0 for now if no context exists
  const wishlistCount = 0; 

  const currentUser = user || contextUser;

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
        user={currentUser}
      />

      {/* Main Content */}
      <main className="pb-16 xl:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav cartCount={cartCount} onMenuToggle={handleMenuToggle} />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        user={currentUser}
        mainCategories={mainCategories}
      />
    </div>
  );
};

export default MobileLayout;