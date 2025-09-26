import React, { useState } from 'react';
import SellerHeader from './SellerHeader';
import SellerSidebar from './SellerSidebar';

const SellerLayout = ({ children, sellerName = "Supun" }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleMenuToggle = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SellerHeader
        onMenuToggle={handleMenuToggle}
        showMobileMenu={showMobileMenu}
        sellerName={sellerName}
      />

      <div className="flex h-[calc(100vh-4rem)]">
        <SellerSidebar
          showMobileMenu={showMobileMenu}
          onMenuToggle={handleMenuToggle}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;