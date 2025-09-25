import React from 'react';
import { Shield, Truck, Star } from 'lucide-react';

const ServicesSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <div className="bg-gradient-to-br from-accent-blue to-blue-600 text-white p-6 rounded-xl shadow-green">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-8 h-8" />
          <h3 className="text-xl font-heading font-bold">Buyer Protection</h3>
        </div>
        <p className="text-blue-100 mb-4">Shop with confidence. Full refund if item not as described.</p>
        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
          Learn More
        </button>
      </div>

      <div className="bg-gradient-primary text-white p-6 rounded-xl shadow-green">
        <div className="flex items-center space-x-3 mb-4">
          <Truck className="w-8 h-8" />
          <h3 className="text-xl font-heading font-bold">Fast Delivery</h3>
        </div>
        <p className="text-primary-100 mb-4">Island-wide delivery within 24-48 hours for most items.</p>
        <button className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors">
          Track Order
        </button>
      </div>

      <div className="bg-gradient-to-br from-accent-purple to-purple-600 text-white p-6 rounded-xl shadow-green">
        <div className="flex items-center space-x-3 mb-4">
          <Star className="w-8 h-8" />
          <h3 className="text-xl font-heading font-bold">Quality Assured</h3>
        </div>
        <p className="text-purple-100 mb-4">Every seller is verified and products are quality checked.</p>
        <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors">
          Verify Seller
        </button>
      </div>
    </div>
  );
};

export default ServicesSection;