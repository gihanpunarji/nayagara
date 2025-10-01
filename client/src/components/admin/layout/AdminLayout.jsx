import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // useEffect(() => {
  //   // Check admin authentication
  //   const adminSession = localStorage.getItem('adminSession');
  //   if (!adminSession) {
  //     navigate('/admin/login');
  //     return;
  //   }

  //   try {
  //     const session = JSON.parse(adminSession);
  //     const currentTime = Date.now();
  //     const sessionDuration = 2 * 60 * 60 * 1000; // 2 hours

  //     if (!session.authenticated || (currentTime - session.timestamp) > sessionDuration) {
  //       localStorage.removeItem('adminSession');
  //       navigate('/admin/login');
  //       return;
  //     }

  //     // Update session timestamp for activity tracking
  //     const updatedSession = {
  //       ...session,
  //       lastActivity: currentTime
  //     };
  //     localStorage.setItem('adminSession', JSON.stringify(updatedSession));

  //   } catch (error) {
  //     localStorage.removeItem('adminSession');
  //     navigate('/admin/login');
  //   }
  // }, [navigate]);

  const handleMenuToggle = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showMobileMenu) {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showMobileMenu]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader
        onMenuToggle={handleMenuToggle}
        showMobileMenu={showMobileMenu}
      />
      <AdminSidebar
        showMobileMenu={showMobileMenu}
        onMenuToggle={handleMenuToggle}
      />

      <div className="md:ml-64 pt-16">
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;