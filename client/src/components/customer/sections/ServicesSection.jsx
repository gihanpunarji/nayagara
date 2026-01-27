import React from 'react';
import { Shield, Truck, Star } from 'lucide-react';

const ServicesSection = () => {
  return (
    <div className="grid mx-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mt-4">
      <div className="bg-gradient-to-br from-accent-blue to-blue-600 text-white p-4 md:p-5 lg:p-6 rounded-xl shadow-green">
        <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
          <Shield className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
          <h3 className="text-base md:text-lg lg:text-xl font-heading font-bold">Buyer Protection</h3>
        </div>
        <p className="text-blue-100 text-xs md:text-sm lg:text-base mb-3 md:mb-4">Shop with confidence. Full refund if item not as described.</p>
        <button className="bg-white text-blue-600 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-blue-50 transition-colors">
          Learn More
        </button>
      </div>

      <div className="bg-gradient-primary text-white p-4 md:p-5 lg:p-6 rounded-xl shadow-green">
        <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
          <Truck className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
          <h3 className="text-base md:text-lg lg:text-xl font-heading font-bold">Fast Delivery</h3>
        </div>
        <p className="text-primary-100 text-xs md:text-sm lg:text-base mb-3 md:mb-4">Island-wide delivery within 24-48 hours for most items.</p>
        <button className="bg-white text-primary-600 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-primary-50 transition-colors">
          Track Order
        </button>
      </div>

      <div className="bg-gradient-to-br from-accent-purple to-purple-600 text-white p-4 md:p-5 lg:p-6 rounded-xl shadow-green md:col-span-2 xl:col-span-1">
        <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
          <Star className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
          <h3 className="text-base md:text-lg lg:text-xl font-heading font-bold">Quality Assured</h3>
        </div>
        <p className="text-purple-100 text-xs md:text-sm lg:text-base mb-3 md:mb-4">Seller is verified and products are quality checked.</p>
        <button className="bg-white text-purple-600 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-purple-50 transition-colors">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default ServicesSection;