import React, { useState } from 'react';
import { Bell, Shield, Gift } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <section className="bg-gradient-hero text-white py-16 mt-12">
      <div className="mx-auto px-16 text-center">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Bell className="w-8 h-8 text-accent-yellow animate-bounce-gentle" />
          <h2 className="text-4xl font-heading font-bold">Stay Updated</h2>
        </div>
        <p className="text-xl text-primary-100 mb-8">Get the latest deals, new arrivals, and exclusive offers delivered to your inbox</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-6 py-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400"
            required
          />
          <button 
            type="submit"
            className="px-8 py-4 bg-gradient-primary text-white rounded-xl hover:shadow-green transition-all duration-300 font-bold"
          >
            Subscribe
          </button>
        </form>
        
        <div className="flex items-center justify-center space-x-6 text-primary-200">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>100% Secure</span>
          </div>
          <div className="flex items-center space-x-2">
            <Gift className="w-5 h-5" />
            <span>Exclusive Deals</span>
          </div>
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Instant Notifications</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;