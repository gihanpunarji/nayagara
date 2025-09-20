import React from 'react';
import { Phone, MapPin, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="mx-auto px-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-green">
                <img 
                  src="/logo.png" 
                  alt="Nayagara.lk" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-primary-700">
                  Nayagara.lk
                </h1>
                <p className="text-sm text-gray-500">Sri Lanka's #1 Online Shopping</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">
              Sri Lanka's most trusted online marketplace connecting millions of buyers and sellers across the island. 
              From electronics to vehicles, find everything you need at the best prices.
            </p>
            <div className="flex space-x-4">
              <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                f
              </button>
              <button className="w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                t
              </button>
              <button className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors">
                i
              </button>
              <button className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                y
              </button>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4 text-gray-800">Customer Service</h4>
            <div className="space-y-3">
              <a href="#" className="block text-gray-600 hover:text-primary-600 transition-colors">Help Center</a>
              <a href="#" className="block text-gray-600 hover:text-primary-600 transition-colors">How to Buy</a>
              <a href="#" className="block text-gray-600 hover:text-primary-600 transition-colors">How to Sell</a>
              <a href="#" className="block text-gray-600 hover:text-primary-600 transition-colors">Payment Methods</a>
              <a href="#" className="block text-gray-600 hover:text-primary-600 transition-colors">Shipping Info</a>
              <a href="#" className="block text-gray-600 hover:text-primary-600 transition-colors">Return Policy</a>
            </div>
          </div>
          
          {/* About */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4 text-gray-800">About Nayagara</h4>
            <div className="space-y-3">
              <a href="#" className="block text-gray-600 hover:text-primary-600 transition-colors">About Us</a>
              <a href="#" className="block text-gray-600 hover:text-primary-600 transition-colors">Careers</a>
              <a href="#" className="block text-gray-600 hover:text-primary-600 transition-colors">Press & Media</a>
              <a href="#" className="block text-gray-600 hover:text-primary-600 transition-colors">Success Stories</a>
              <a href="#" className="block text-gray-600 hover:text-primary-600 transition-colors">Seller Center</a>
              <a href="#" className="block text-gray-600 hover:text-primary-600 transition-colors">Affiliate Program</a>
            </div>
          </div>
          
          {/* Contact & Apps */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4 text-gray-800">Stay Connected</h4>
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-500" />
                <span className="text-gray-600">+94 77 532 2234</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary-500" />
                <span className="text-gray-600">Colombo 07, Sri Lanka</span>
              </div>
            </div>
            
            <h5 className="font-bold mb-3 text-gray-700">Download Our App</h5>
            <div className="space-y-2">
              <button className="w-full bg-black text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors">
                <span className="text-2xl">📱</span>
                <div className="text-left">
                  <p className="text-xs">Download on the</p>
                  <p className="font-bold">App Store</p>
                </div>
              </button>
              <button className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700 transition-colors">
                <span className="text-2xl">🎮</span>
                <div className="text-left">
                  <p className="text-xs">Get it on</p>
                  <p className="font-bold">Google Play</p>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Payment Methods */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <h4 className="font-heading font-bold text-lg mb-4 text-gray-800">Payment Methods</h4>
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">VISA</div>
            <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">MC</div>
            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold">PayPal</div>
            <div className="bg-primary-600 text-white px-4 py-2 rounded-lg font-bold">HNB</div>
            <div className="bg-secondary-600 text-white px-4 py-2 rounded-lg font-bold">BOC</div>
            <div className="bg-accent-orange text-white px-4 py-2 rounded-lg font-bold">Sampath</div>
            <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold">Commercial</div>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2025 Nayagara.lk. All rights reserved. 
          </p>
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-primary-600 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-primary-600 transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-primary-600 transition-colors">Cookie Policy</a>
            <a href="#" className="text-gray-500 hover:text-primary-600 transition-colors">Sitemap</a>
            <div className="flex items-center space-x-2 text-gray-500">
              <Globe className="w-4 h-4" />
              <span>English</span>
              <span>|</span>
              <span>සිංහල</span>
              <span>|</span>
              <span>தமிழ்</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;