import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Gift, Truck } from 'lucide-react';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroBanners = [
    {
      title: "MEGA SALE",
      subtitle: "Up to 80% OFF",
      description: "Electronics, Fashion & More",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      cta: "Shop Now",
      badge: "Limited Time",
      color: "from-primary-600 to-primary-800"
    },
    {
      title: "NEW ARRIVALS",
      subtitle: "Latest Fashion Trends",
      description: "Discover Premium Collections",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      cta: "Explore",
      badge: "Trending",
      color: "from-secondary-600 to-secondary-800"
    },
    {
      title: "VEHICLE BAZAAR",
      subtitle: "Best Car Deals",
      description: "Verified Sellers, Best Prices",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      cta: "Browse Cars",
      badge: "Verified",
      color: "from-primary-500 to-secondary-600"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {/* Main Banner */}
      <div className="lg:col-span-3">
        <div className="relative h-64 sm:h-80 lg:h-96 rounded-xl sm:rounded-2xl overflow-hidden shadow-green-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10"></div>
          <img 
            src={heroBanners[currentSlide].image} 
            alt={heroBanners[currentSlide].title}
            className="w-full h-full object-cover transition-all duration-1000"
          />
          
          <div className="absolute inset-0 z-20 flex items-center p-4 sm:p-6 lg:p-8">
            <div className="text-white max-w-lg">
              <div className={`inline-block px-2 py-1 sm:px-3 sm:py-1 bg-gradient-to-r ${heroBanners[currentSlide].color} rounded-full text-xs sm:text-sm font-bold mb-2 sm:mb-4`}>
                {heroBanners[currentSlide].badge}
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-heading font-bold mb-2 sm:mb-4 leading-tight">
                {heroBanners[currentSlide].title}
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl mb-1 sm:mb-2 text-accent-yellow font-bold">
                {heroBanners[currentSlide].subtitle}
              </p>
              <p className="text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 text-gray-200">
                {heroBanners[currentSlide].description}
              </p>
              <button className="px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 bg-white text-primary-800 rounded-lg sm:rounded-xl hover:bg-primary-50 transition-all duration-300 font-bold text-sm sm:text-base lg:text-lg shadow-green">
                {heroBanners[currentSlide].cta} →
              </button>
            </div>
          </div>

          {/* Navigation */}
          <button 
            onClick={() => setCurrentSlide((prev) => prev === 0 ? heroBanners.length - 1 : prev - 1)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroBanners.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
            {heroBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-white scale-125' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Side Banners */}
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:space-y-0">
        <div className="bg-gradient-to-br from-secondary-500 to-secondary-700 text-white p-4 sm:p-6 rounded-xl shadow-green">
          <div className="flex items-center space-x-2 mb-3">
            <Gift className="w-6 h-6" />
            <span className="font-bold">Daily Deals</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Up to 60% OFF</h3>
          <p className="text-sm text-secondary-100 mb-4">Limited time offers on top brands</p>
          <button className="bg-white text-secondary-600 px-4 py-2 rounded-lg font-medium hover:bg-secondary-50 transition-colors">
            Shop Now
          </button>
        </div>
        
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white p-4 sm:p-6 rounded-xl shadow-green">
          <div className="flex items-center space-x-2 mb-3">
            <Truck className="w-6 h-6" />
            <span className="font-bold">Free Delivery</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Island Wide</h3>
          <p className="text-sm text-primary-100 mb-4">On orders over Rs. 2,500</p>
          <button className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;