import React, { useState } from 'react';
import {
  Zap, TrendingUp, Gift, Star, MapPin, Truck,
  ChevronRight, Heart, ShoppingCart, Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MobileHome = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  // Hero banners for mobile
  const heroBanners = [
    {
      id: 1,
      title: 'Super Sale',
      subtitle: 'Up to 70% OFF',
      description: 'Electronics & Fashion',
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      color: 'from-red-500 to-pink-600',
      cta: 'Shop Now'
    },
    {
      id: 2,
      title: 'New Arrivals',
      subtitle: 'Fresh Collection',
      description: 'Trending products just in',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      color: 'from-primary-500 to-secondary-600',
      cta: 'Explore'
    },
    {
      id: 3,
      title: 'Free Delivery',
      subtitle: 'Island Wide',
      description: 'On orders above Rs. 5,000',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      color: 'from-blue-500 to-cyan-600',
      cta: 'Learn More'
    }
  ];

  // Quick action categories
  const quickActions = [
    { name: 'Flash Sale', icon: Zap, color: 'bg-red-500', textColor: 'text-red-600', path: '/flash-sale' },
    { name: 'New Arrivals', icon: TrendingUp, color: 'bg-blue-500', textColor: 'text-blue-600', path: '/new-arrivals' },
    { name: 'Daily Deals', icon: Gift, color: 'bg-green-500', textColor: 'text-green-600', path: '/deals' },
    { name: 'Top Rated', icon: Star, color: 'bg-yellow-500', textColor: 'text-yellow-600', path: '/top-rated' }
  ];

  // Featured products
  const featuredProducts = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      price: 385000,
      originalPrice: 420000,
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviews: 2847,
      discount: 8,
      badge: 'Best Seller',
      location: 'Colombo 07'
    },
    {
      id: 2,
      name: 'Gaming Laptop RTX 4070',
      price: 425000,
      originalPrice: 485000,
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviews: 567,
      discount: 12,
      badge: 'Gaming',
      location: 'Nugegoda'
    },
    {
      id: 3,
      name: 'Bridal Saree Collection',
      price: 18500,
      originalPrice: 22000,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviews: 345,
      discount: 16,
      badge: 'Trending',
      location: 'Kandy'
    }
  ];

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Best Seller': return 'bg-orange-500';
      case 'Gaming': return 'bg-blue-500';
      case 'Trending': return 'bg-purple-500';
      default: return 'bg-primary-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner Slider */}
      <div className="relative bg-white">
        <div className="overflow-hidden">
          <div className="flex transition-transform duration-500 ease-in-out"
               style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
            {heroBanners.map((banner) => (
              <div key={banner.id} className="w-full flex-shrink-0 relative h-48">
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.color} opacity-90`}></div>
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center">
                  <div className="px-6 text-white">
                    <h2 className="text-2xl font-bold mb-1">{banner.title}</h2>
                    <p className="text-lg mb-1">{banner.subtitle}</p>
                    <p className="text-sm mb-4 opacity-90">{banner.description}</p>
                    <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium">
                      {banner.cta}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                activeSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="bg-white px-4 py-6">
        <div className="grid grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Link
                key={index}
                to={action.path}
                className="flex flex-col items-center space-y-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center">{action.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Flash Sale Section */}
      <div className="bg-gradient-to-r from-red-500 to-pink-600 mx-4 rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between text-white mb-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <h3 className="font-bold">Flash Sale</h3>
          </div>
          <span className="text-sm">Ends in 12:34:56</span>
        </div>
        <div className="flex space-x-3 overflow-x-auto">
          {featuredProducts.slice(0, 2).map((product) => (
            <div key={product.id} className="bg-white rounded-lg p-3 min-w-[140px] flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-20 object-cover rounded-lg mb-2"
              />
              <p className="text-xs font-medium text-gray-900 truncate">{product.name}</p>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-bold text-red-600">Rs. {product.price.toLocaleString()}</span>
                <span className="text-xs text-gray-500 line-through">Rs. {product.originalPrice.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Just For You</h3>
          <Link to="/shop" className="flex items-center space-x-1 text-primary-600 text-sm font-medium">
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover"
                />
                {/* Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`text-white text-xs px-2 py-1 rounded-full font-bold ${getBadgeColor(product.badge)}`}>
                    {product.badge}
                  </span>
                </div>
                {/* Discount */}
                <div className="absolute top-2 right-2">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    -{product.discount}%
                  </span>
                </div>
                {/* Quick Actions */}
                <div className="absolute bottom-2 right-2 flex space-x-1">
                  <button className="w-7 h-7 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-3">
                {/* Location */}
                <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                  <MapPin className="w-3 h-3" />
                  <span>{product.location}</span>
                </div>

                {/* Product Name */}
                <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                  {product.name}
                </h4>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-2">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600">{product.rating}</span>
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-primary-600">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    <div className="text-xs text-gray-500 line-through">
                      Rs. {product.originalPrice.toLocaleString()}
                    </div>
                  </div>
                  <button className="w-7 h-7 bg-primary-500 text-white rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Services Banner */}
      <div className="px-4 mb-6">
        <div className="bg-primary-50 rounded-2xl p-4">
          <h3 className="font-bold text-gray-900 mb-3">Why Choose Nayagara?</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Fast Delivery</p>
                <p className="text-sm text-gray-600">Island-wide delivery within 24-48 hours</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Buyer Protection</p>
                <p className="text-sm text-gray-600">Shop with confidence, full refund guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileHome;