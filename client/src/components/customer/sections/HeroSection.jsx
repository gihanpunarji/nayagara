import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Gift, Truck } from 'lucide-react';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroBanners = [
    {
      title: "SRI LANKA'S #1",
      subtitle: "Shopping Platform",
      description: "The most trusted online marketplace in the island",
      image: "banner.avif",
      cta: "Start Shopping",
      badge: "Top Rated",
      color: "from-primary-600 to-primary-800"
    },
    {
      title: "MULTI-SELLER STORE",
      subtitle: "Thousands of Sellers",
      description: "Connect with verified sellers across the nation",
      image: "/multiseller.png",
      cta: "Explore Stores",
      badge: "Variety",
      color: "from-secondary-600 to-secondary-800"
    },
    {
      title: "HUGE DISCOUNTS",
      subtitle: "Unbeatable Prices",
      description: "Get the best value for your money every day",
      image: "/delivery.png",
      cta: "View Offers",
      badge: "Best Deals",
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
    <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-4 gap-3 md:gap-4 xl:gap-6 mb-6 md:mb-8">
      {/* Main Banner */}
      <div className="xl:col-span-3">
        <div className="relative h-44 md:h-64 xl:h-96 rounded-lg md:rounded-xl xl:rounded-2xl overflow-hidden shadow-green-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-1"></div>
          <img
            src={heroBanners[currentSlide].image}
            alt={heroBanners[currentSlide].title}
            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000"
          />
          
          <div className="absolute inset-0 z-2 flex items-center p-3 md:p-5 xl:p-8">
            <div className="text-white max-w-lg">
              <div className={`inline-block px-2 py-0.5 md:px-3 md:py-1 bg-gradient-to-r ${heroBanners[currentSlide].color} rounded-full text-xs md:text-sm font-bold mb-2 md:mb-3 xl:mb-4`}>
                {heroBanners[currentSlide].badge}
              </div>
              <h2 className="text-xl md:text-3xl xl:text-5xl font-heading font-bold mb-2 md:mb-3 xl:mb-4 leading-tight">
                {heroBanners[currentSlide].title}
              </h2>
              <p className="text-base md:text-xl xl:text-2xl mb-1 md:mb-2 text-accent-yellow font-bold">
                {heroBanners[currentSlide].subtitle}
              </p>
              <p className="text-xs md:text-base xl:text-lg mb-3 md:mb-4 xl:mb-6 text-gray-200">
                {heroBanners[currentSlide].description}
              </p>
              <button className="px-3 py-1.5 md:px-6 md:py-3 xl:px-8 xl:py-4 bg-white text-primary-800 rounded-md md:rounded-lg xl:rounded-xl hover:bg-primary-50 transition-all duration-300 font-bold text-xs md:text-base xl:text-lg shadow-green">
                {heroBanners[currentSlide].cta} →
              </button>
            </div>
          </div>

          {/* Navigation */}
          <button 
            onClick={() => setCurrentSlide((prev) => prev === 0 ? heroBanners.length - 1 : prev - 1)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-3 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroBanners.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-3 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-3 flex space-x-2">
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
      <div className="grid grid-cols-2 xl:grid-cols-1 gap-3 md:gap-4">
        <div className="bg-gradient-to-br from-secondary-500 to-secondary-700 text-white p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl shadow-green">
          <div className="flex items-center space-x-1.5 md:space-x-2 mb-2 md:mb-3">
            <Gift className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
            <span className="font-bold text-xs md:text-sm lg:text-base">Daily Deals</span>
          </div>
          <h3 className="text-sm md:text-base lg:text-xl font-bold mb-1.5 md:mb-2 leading-tight">Huge discounts on products</h3>
          <p className="text-xs md:text-sm text-secondary-100 mb-2 md:mb-3 lg:mb-4">Limited time offers on top brands</p>
          <button className="bg-white text-secondary-600 px-2.5 py-1.5 md:px-3 md:py-1.5 lg:px-4 lg:py-2 rounded-md md:rounded-lg text-xs md:text-sm font-medium hover:bg-secondary-50 transition-colors">
            Shop Now
          </button>
        </div>

        <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl shadow-green">
          <div className="flex items-center space-x-1.5 md:space-x-2 mb-2 md:mb-3">
            <Truck className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
            <span className="font-bold text-xs md:text-sm lg:text-base">Delivery</span>
          </div>
          <h3 className="text-sm md:text-base lg:text-xl font-bold mb-1.5 md:mb-2 leading-tight">Island Wide</h3>
          <p className="text-xs md:text-sm text-primary-100 mb-2 md:mb-3 lg:mb-4">For every order</p>
          <button className="bg-white text-primary-600 px-2.5 py-1.5 md:px-3 md:py-1.5 lg:px-4 lg:py-2 rounded-md md:rounded-lg text-xs md:text-sm font-medium hover:bg-primary-50 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;