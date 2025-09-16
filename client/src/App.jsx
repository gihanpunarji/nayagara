import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Star, Heart, MapPin, Truck, Shield, Clock, Bell, Globe, Phone, Gift, Zap, TrendingUp, ChevronRight, ChevronLeft, Filter, Grid, List } from 'lucide-react';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentDeal, setCurrentDeal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showCategories, setShowCategories] = useState(false);

  // Hero Banners (like Daraz/AliExpress main banners)
  const heroBanners = [
    {
      title: "MEGA SALE",
      subtitle: "Up to 80% OFF",
      description: "Electronics, Fashion & More",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      cta: "Shop Now",
      badge: "Limited Time",
      color: "from-red-500 to-pink-600"
    },
    {
      title: "NEW ARRIVALS",
      subtitle: "Latest Fashion Trends",
      description: "Discover Premium Collections",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      cta: "Explore",
      badge: "Trending",
      color: "from-purple-500 to-indigo-600"
    },
    {
      title: "VEHICLE BAZAAR",
      subtitle: "Best Car Deals",
      description: "Verified Sellers, Best Prices",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      cta: "Browse Cars",
      badge: "Verified",
      color: "from-blue-500 to-cyan-600"
    }
  ];

  // Flash Deals (like AliExpress flash deals)
  const flashDeals = [
    { id: 1, name: 'Samsung Galaxy S24', originalPrice: 'Rs. 185,000', salePrice: 'Rs. 149,000', discount: '19%', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', timeLeft: '02:34:56', sold: 87, stock: 150 },
    { id: 2, name: 'MacBook Pro M3', originalPrice: 'Rs. 485,000', salePrice: 'Rs. 399,000', discount: '18%', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', timeLeft: '01:22:18', sold: 23, stock: 50 },
    { id: 3, name: 'Nike Air Max 270', originalPrice: 'Rs. 28,500', salePrice: 'Rs. 19,999', discount: '30%', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', timeLeft: '03:45:12', sold: 156, stock: 200 },
    { id: 4, name: 'Sony WH-1000XM5', originalPrice: 'Rs. 85,000', salePrice: 'Rs. 67,900', discount: '20%', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', timeLeft: '00:45:33', sold: 234, stock: 300 }
  ];

  // Categories (like eBay categories)
  const mainCategories = [
    { name: 'Electronics', icon: '📱', subcats: ['Mobile Phones', 'Laptops', 'TVs', 'Cameras'], image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { name: 'Vehicles', icon: '🚗', subcats: ['Cars', 'Motorcycles', 'Parts', 'Accessories'], image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { name: 'Fashion', icon: '👔', subcats: ['Men\'s Wear', 'Women\'s Wear', 'Shoes', 'Accessories'], image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { name: 'Home & Living', icon: '🏠', subcats: ['Furniture', 'Appliances', 'Decor', 'Kitchen'], image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { name: 'Beauty & Health', icon: '💄', subcats: ['Skincare', 'Makeup', 'Supplements', 'Fitness'], image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { name: 'Sports', icon: '⚽', subcats: ['Cricket', 'Football', 'Fitness', 'Outdoor'], image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { name: 'Books & Media', icon: '📚', subcats: ['Educational', 'Fiction', 'Children', 'Software'], image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { name: 'Services', icon: '🔧', subcats: ['Home Services', 'Professional', 'Events', 'Education'], image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' }
  ];

  // Featured Products Grid
  const featuredProducts = [
    { id: 1, name: 'iPhone 15 Pro Max 256GB', price: 'Rs. 385,000', originalPrice: 'Rs. 420,000', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', rating: 4.9, reviews: 2847, discount: '8%', badge: 'Best Seller', shipping: 'Free Shipping', location: 'Colombo 07' },
    { id: 2, name: 'Toyota Prius 2022 Hybrid', price: 'Rs. 4,850,000', originalPrice: null, image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', rating: 4.7, reviews: 156, badge: 'Verified', shipping: 'Inspection Available', location: 'Gampaha' },
    { id: 3, name: '3BR Luxury Apartment', price: 'Rs. 28,500,000', originalPrice: null, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', rating: 4.8, reviews: 89, badge: 'Featured', shipping: 'Virtual Tour', location: 'Colombo 03' },
    { id: 4, name: 'Premium Basmati Rice 25kg', price: 'Rs. 4,750', originalPrice: 'Rs. 5,200', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', rating: 4.6, reviews: 1234, discount: '9%', shipping: 'Same Day Delivery', location: 'Kelaniya' },
    { id: 5, name: 'Gaming Laptop RTX 4070', price: 'Rs. 425,000', originalPrice: 'Rs. 485,000', image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', rating: 4.8, reviews: 567, discount: '12%', badge: 'Gaming', shipping: 'Free Shipping', location: 'Nugegoda' },
    { id: 6, name: 'Bridal Saree Collection', price: 'Rs. 18,500', originalPrice: 'Rs. 22,000', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', rating: 4.9, reviews: 345, discount: '16%', badge: 'Trending', shipping: 'Express Delivery', location: 'Kandy' }
  ];

  const quickLinks = ['Daraz Mall', 'Flash Sale', 'Vouchers', 'Top Up', 'Help & Support'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDeal((prev) => (prev + 1) % flashDeals.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar (like Daraz top bar) */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>+94 11 234 5678</span>
            </span>
            <span>Get 50% OFF your first order!</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-orange-200">Sell on MarketPlace</a>
            <a href="#" className="hover:text-orange-200">Help & Support</a>
            <div className="flex items-center space-x-1">
              <Globe className="w-4 h-4" />
              <span>English</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Top Header */}
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">N</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Nayagara Lk
                </h1>
                <p className="text-xs text-gray-500">Sri Lanka's #1 Online Shopping</p>
              </div>
            </div>

            {/* Search Bar (enhanced like Amazon/eBay) */}
            <div className="flex-1 max-w-3xl mx-8">
              <div className="relative flex">
                <div className="relative">
                  <button 
                    onClick={() => setShowCategories(!showCategories)}
                    className="h-12 px-4 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg flex items-center space-x-2 hover:bg-gray-200 transition-colors min-w-[140px]"
                  >
                    <span className="text-sm text-gray-700 truncate">{selectedCategory}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  
                  {showCategories && (
                    <div className="absolute top-full left-0 w-64 bg-white border border-gray-300 rounded-lg shadow-xl z-50 mt-1">
                      <div className="py-2">
                        <button 
                          onClick={() => {setSelectedCategory('All Categories'); setShowCategories(false);}}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                        >
                          All Categories
                        </button>
                        {mainCategories.map((cat, idx) => (
                          <button 
                            key={idx}
                            onClick={() => {setSelectedCategory(cat.name); setShowCategories(false);}}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center space-x-2"
                          >
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <input
                  type="text"
                  placeholder="Search for products, brands, categories..."
                  className="flex-1 h-12 px-4 border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="h-12 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-r-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span className="hidden sm:block font-medium">SEARCH</span>
                </button>
              </div>
              
              {/* Quick Search Tags */}
              <div className="flex space-x-2 mt-2">
                {['iPhone 15', 'Toyota Prius', 'Gaming Laptop', 'Apartments Colombo'].map((tag, idx) => (
                  <button key={idx} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-600 transition-colors">
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors">
                <Heart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">5</span>
              </button>
              
              <button className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </button>
              
              <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-orange-500 transition-colors cursor-pointer">
                <User className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <p className="text-xs text-gray-500">Hello</p>
                  <p className="text-sm font-medium text-gray-800">Sign In</p>
                </div>
              </div>
              
              <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-bold shadow-lg">
                SELL NOW
              </button>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="border-t border-gray-200 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {quickLinks.map((link, idx) => (
                  <a key={idx} href="#" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
                    {link}
                  </a>
                ))}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Deliver to</span>
                <span className="font-medium text-orange-500">Colombo 07</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar - Categories (like eBay/Amazon sidebar) */}
          <div className="hidden lg:block w-64">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              <h3 className="font-bold text-lg mb-4 text-gray-800">Shop by Category</h3>
              <div className="space-y-2">
                {mainCategories.map((category, idx) => (
                  <div key={idx} className="group">
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{category.icon}</span>
                        <span className="font-medium text-gray-700 group-hover:text-orange-500">{category.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500" />
                    </div>
                    
                    {/* Submenu */}
                    <div className="hidden group-hover:block absolute left-full top-0 w-64 bg-white border border-gray-200 rounded-lg shadow-xl ml-2 p-4 z-50">
                      <h4 className="font-bold text-gray-800 mb-3">{category.name}</h4>
                      <div className="grid gap-1">
                        {category.subcats.map((subcat, sidx) => (
                          <a key={sidx} href="#" className="text-sm text-gray-600 hover:text-orange-500 py-1">
                            {subcat}
                          </a>
                        ))}
                      </div>
                      <img src={category.image} alt={category.name} className="w-full h-32 object-cover rounded-lg mt-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Hero Section with Side Banners */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              {/* Main Banner */}
              <div className="lg:col-span-3">
                <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10"></div>
                  <img 
                    src={heroBanners[currentSlide].image} 
                    alt={heroBanners[currentSlide].title}
                    className="w-full h-full object-cover transition-all duration-1000"
                  />
                  
                  <div className="absolute inset-0 z-20 flex items-center p-8">
                    <div className="text-white max-w-lg">
                      <div className={`inline-block px-3 py-1 bg-gradient-to-r ${heroBanners[currentSlide].color} rounded-full text-sm font-bold mb-4`}>
                        {heroBanners[currentSlide].badge}
                      </div>
                      <h2 className="text-5xl font-bold mb-4 leading-tight">
                        {heroBanners[currentSlide].title}
                      </h2>
                      <p className="text-2xl mb-2 text-yellow-300 font-bold">
                        {heroBanners[currentSlide].subtitle}
                      </p>
                      <p className="text-lg mb-6 text-gray-200">
                        {heroBanners[currentSlide].description}
                      </p>
                      <button className="px-8 py-4 bg-white text-gray-800 rounded-xl hover:bg-gray-100 transition-all duration-300 font-bold text-lg shadow-lg">
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
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Gift className="w-6 h-6" />
                    <span className="font-bold">Daily Deals</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Up to 60% OFF</h3>
                  <p className="text-sm text-purple-100 mb-4">Limited time offers on top brands</p>
                  <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    Shop Now
                  </button>
                </div>
                
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Truck className="w-6 h-6" />
                    <span className="font-bold">Free Delivery</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Island Wide</h3>
                  <p className="text-sm text-green-100 mb-4">On orders over Rs. 2,500</p>
                  <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            {/* Flash Deals Section (like AliExpress) */}
            <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-6 mb-8 text-white shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-8 h-8 text-yellow-300" />
                    <h2 className="text-3xl font-bold">Flash Sale</h2>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span className="font-mono text-lg font-bold">02:34:56</span>
                    </div>
                  </div>
                </div>
                <button className="bg-white text-red-500 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                  View All Deals
                </button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {flashDeals.map((deal, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 text-gray-800 hover:shadow-2xl transition-all duration-300 cursor-pointer">
                    <div className="relative mb-3">
                      <img src={deal.image} alt={deal.name} className="w-full h-32 object-cover rounded-lg" />
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        -{deal.discount}
                      </div>
                    </div>
                    <h3 className="font-bold text-sm mb-2 truncate">{deal.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg font-bold text-red-500">{deal.salePrice}</span>
                      <span className="text-sm text-gray-500 line-through">{deal.originalPrice}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full" 
                        style={{width: `${(deal.sold / deal.stock) * 100}%`}}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600">{deal.sold} sold</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Products Grid */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Just For You</h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 border border-gray-300 rounded-lg hover:border-orange-500 transition-colors">
                    <Grid className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:border-orange-500 transition-colors">
                    <List className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:border-orange-500 transition-colors">
                    <Filter className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group border border-gray-200 rounded-xl overflow-hidden hover:border-orange-300 hover:shadow-xl transition-all duration-300 cursor-pointer bg-white"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col space-y-1">
                        {product.badge && (
                          <span className={`text-xs px-2 py-1 rounded-full font-bold text-white ${
                            product.badge === 'Best Seller' ? 'bg-orange-500' :
                            product.badge === 'Verified' ? 'bg-green-500' :
                            product.badge === 'Featured' ? 'bg-purple-500' :
                            product.badge === 'Gaming' ? 'bg-blue-500' :
                            'bg-pink-500'
                          }`}>
                            {product.badge}
                          </span>
                        )}
                        {product.discount && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            -{product.discount}
                          </span>
                        )}
                      </div>

                      {/* Heart Icon */}
                      <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
                        <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                      </button>

                      {/* Quick View */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="w-full bg-white text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                          Quick View
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      {/* Location & Shipping */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{product.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Truck className="w-3 h-3" />
                          <span className="text-green-600 font-medium">{product.shipping}</span>
                        </div>
                      </div>

                      {/* Product Name */}
                      <h3 className="font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-4 h-4 ${star <= Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({product.reviews})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-orange-600">{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                          )}
                        </div>
                        <button className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors">
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-8">
                <button className="px-8 py-3 border-2 border-orange-500 text-orange-500 rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-300 font-bold">
                  Load More Products
                </button>
              </div>
            </div>

            {/* Services Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="w-8 h-8" />
                  <h3 className="text-xl font-bold">Buyer Protection</h3>
                </div>
                <p className="text-blue-100 mb-4">Shop with confidence. Full refund if item not as described.</p>
                <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  Learn More
                </button>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <Truck className="w-8 h-8" />
                  <h3 className="text-xl font-bold">Fast Delivery</h3>
                </div>
                <p className="text-green-100 mb-4">Island-wide delivery within 24-48 hours for most items.</p>
                <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors">
                  Track Order
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <Star className="w-8 h-8" />
                  <h3 className="text-xl font-bold">Quality Assured</h3>
                </div>
                <p className="text-purple-100 mb-4">Every seller is verified and products are quality checked.</p>
                <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                  Verify Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Bell className="w-8 h-8 text-orange-400" />
            <h2 className="text-4xl font-bold">Stay Updated</h2>
          </div>
          <p className="text-xl text-gray-300 mb-8">Get the latest deals, new arrivals, and exclusive offers delivered to your inbox</p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-bold">
              Subscribe
            </button>
          </div>
          
          <div className="flex items-center justify-center space-x-6 mt-8 text-gray-400">
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

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">M</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    MarketPlace
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
              <h4 className="font-bold text-lg mb-4 text-gray-800">Customer Service</h4>
              <div className="space-y-3">
                <a href="#" className="block text-gray-600 hover:text-orange-500 transition-colors">Help Center</a>
                <a href="#" className="block text-gray-600 hover:text-orange-500 transition-colors">How to Buy</a>
                <a href="#" className="block text-gray-600 hover:text-orange-500 transition-colors">How to Sell</a>
                <a href="#" className="block text-gray-600 hover:text-orange-500 transition-colors">Payment Methods</a>
                <a href="#" className="block text-gray-600 hover:text-orange-500 transition-colors">Shipping Info</a>
                <a href="#" className="block text-gray-600 hover:text-orange-500 transition-colors">Return Policy</a>
              </div>
            </div>
            
            {/* About */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-gray-800">About MarketPlace</h4>
              <div className="space-y-3">
                <a href="#" className="block text-gray-600 hover:text-orange-500 transition-colors">About Us</a>
                <a href="#" className="block text-gray-600 hover:text-orange-500 transition-colors">Careers</a>
                <a href="#" className="block text-gray-600 hover:text-orange-500 transition-colors">Press & Media</a>
                <a href="#" className="block text-gray-600 hover:text-orange-500 transition-colors">Success Stories</a>
                <a href="#" className="block text-gray-600 hover:text-orange-500 transition-colors">Seller Center</a>
                <a href="#" className="block text-gray-600 hover:text-orange-500 transition-colors">Affiliate Program</a>
              </div>
            </div>
            
            {/* Contact & Apps */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-gray-800">Stay Connected</h4>
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-600">+94 11 234 5678</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-orange-500" />
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
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors">
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
            <h4 className="font-bold text-lg mb-4 text-gray-800">Payment Methods</h4>
            <div className="flex flex-wrap items-center gap-4">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">VISA</div>
              <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">MC</div>
              <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold">PayPal</div>
              <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold">HNB</div>
              <div className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold">BOC</div>
              <div className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold">Sampath</div>
              <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold">Commercial</div>
            </div>
          </div>
          
          {/* Bottom Footer */}
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 MarketPlace LK. All rights reserved. 
            </p>
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-orange-500 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-orange-500 transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-orange-500 transition-colors">Cookie Policy</a>
              <a href="#" className="text-gray-500 hover:text-orange-500 transition-colors">Sitemap</a>
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
    </div>
  );
};

export default HomePage;