import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import NewArrivals from '../sections/NewArrivals';
import HeroSection from '../sections/HeroSection';
import ServicesSection from '../sections/ServicesSection';
import ProductGrid from '../sections/ProductGrid'; 
import Footer from '../layout/Footer';

const MobileHome = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Search Bar Placeholder if needed, or rely on Header */}
      
      {/* Hero Banner Slider */}
      <div className="px-4 pt-4">
        <HeroSection />
      </div>

      {/* Services Banner */}
      <div className="mt-4">
        <ServicesSection />
      </div>

      {/* New Arrivals Section */}
      <div className="my-6">
        <NewArrivals />
      </div>

      {/* Featured Products */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-4">
        </div>
        
        {/* Using shared ProductGrid which is now responsive */}
        <ProductGrid />
      </div>

      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-4">
        </div>
        
        {/* Using shared ProductGrid which is now responsive */}
        <Footer />  
      </div>
    </div>
  );
};

export default MobileHome;