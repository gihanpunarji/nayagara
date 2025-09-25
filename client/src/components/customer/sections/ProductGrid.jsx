import React from 'react';
import { Star, Heart, ShoppingCart, MapPin, Truck, Grid, List, Filter } from 'lucide-react';

const ProductGrid = () => {
  const featuredProducts = [
    { 
      id: 1, 
      name: 'iPhone 15 Pro Max 256GB', 
      price: 'Rs. 385,000', 
      originalPrice: 'Rs. 420,000', 
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 
      rating: 4.9, 
      reviews: 2847, 
      discount: '8%', 
      badge: 'Best Seller', 
      shipping: 'Free Shipping', 
      location: 'Colombo 07' 
    },
    { 
      id: 2, 
      name: 'Toyota Prius 2022 Hybrid', 
      price: 'Rs. 4,850,000', 
      originalPrice: null, 
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 
      rating: 4.7, 
      reviews: 156, 
      badge: 'Verified', 
      shipping: 'Inspection Available', 
      location: 'Gampaha' 
    },
    { 
      id: 3, 
      name: '3BR Luxury Apartment', 
      price: 'Rs. 28,500,000', 
      originalPrice: null, 
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 
      rating: 4.8, 
      reviews: 89, 
      badge: 'Featured', 
      shipping: 'Virtual Tour', 
      location: 'Colombo 03' 
    },
    { 
      id: 4, 
      name: 'Premium Basmati Rice 25kg', 
      price: 'Rs. 4,750', 
      originalPrice: 'Rs. 5,200', 
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 
      rating: 4.6, 
      reviews: 1234, 
      discount: '9%', 
      shipping: 'Same Day Delivery', 
      location: 'Kelaniya' 
    },
    { 
      id: 5, 
      name: 'Gaming Laptop RTX 4070', 
      price: 'Rs. 425,000', 
      originalPrice: 'Rs. 485,000', 
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 
      rating: 4.8, 
      reviews: 567, 
      discount: '12%', 
      badge: 'Gaming', 
      shipping: 'Free Shipping', 
      location: 'Nugegoda' 
    },
    { 
      id: 6, 
      name: 'Bridal Saree Collection', 
      price: 'Rs. 18,500', 
      originalPrice: 'Rs. 22,000', 
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 
      rating: 4.9, 
      reviews: 345, 
      discount: '16%', 
      badge: 'Trending', 
      shipping: 'Express Delivery', 
      location: 'Kandy' 
    }
  ];

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Best Seller': return 'bg-accent-orange';
      case 'Verified': return 'bg-success';
      case 'Featured': return 'bg-accent-purple';
      case 'Gaming': return 'bg-accent-blue';
      case 'Trending': return 'bg-accent-yellow text-gray-800';
      default: return 'bg-primary-500';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-green">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-heading font-bold text-gray-800">Just For You</h2>
        <div className="flex items-center space-x-2">
          <button className="p-2 border border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <Grid className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 border border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <List className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 border border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProducts.map((product) => (
          <div
            key={product.id}
            className="group border border-gray-200 rounded-xl overflow-hidden hover:border-primary-300 hover:shadow-green-lg transition-all duration-300 cursor-pointer bg-white animate-slide-up"
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
                  <span className={`text-xs px-2 py-1 rounded-full font-bold text-white ${getBadgeColor(product.badge)}`}>
                    {product.badge}
                  </span>
                )}
                {product.discount && (
                  <span className="bg-error text-white text-xs px-2 py-1 rounded-full font-bold">
                    -{product.discount}
                  </span>
                )}
              </div>

              {/* Heart Icon */}
              <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
                <Heart className="w-4 h-4 text-gray-600 hover:text-error" />
              </button>

              {/* Quick View */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="w-full bg-white text-gray-800 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors">
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
                  <span className="text-primary-600 font-medium">{product.shipping}</span>
                </div>
              </div>

              {/* Product Name */}
              <h3 className="font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-4 h-4 ${star <= Math.floor(product.rating) ? 'text-accent-yellow fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.reviews})</span>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-primary-600">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                  )}
                </div>
                <button className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 hover:shadow-green transition-all">
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Horizontal Scroll */}
      <div className="md:hidden">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group border border-gray-200 rounded-xl overflow-hidden hover:border-primary-300 hover:shadow-green-lg transition-all duration-300 cursor-pointer bg-white animate-slide-up flex-shrink-0 w-64"
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
                    <span className={`text-xs px-2 py-1 rounded-full font-bold text-white ${getBadgeColor(product.badge)}`}>
                      {product.badge}
                    </span>
                  )}
                  {product.discount && (
                    <span className="bg-error text-white text-xs px-2 py-1 rounded-full font-bold">
                      -{product.discount}
                    </span>
                  )}
                </div>

                {/* Heart Icon */}
                <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
                  <Heart className="w-4 h-4 text-gray-600 hover:text-error" />
                </button>

                {/* Quick View */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-full bg-white text-gray-800 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors">
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
                    <span className="text-primary-600 font-medium">{product.shipping}</span>
                  </div>
                </div>

                {/* Product Name */}
                <h3 className="font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-4 h-4 ${star <= Math.floor(product.rating) ? 'text-accent-yellow fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-primary-600">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                    )}
                  </div>
                  <button className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 hover:shadow-green transition-all">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Load More */}
      <div className="text-center mt-8">
        <button className="px-8 py-3 border-2 border-primary-500 text-primary-600 rounded-xl hover:bg-primary-500 hover:text-white transition-all duration-300 font-bold shadow-green">
          Load More Products
        </button>
      </div>
    </div>
  );
};

export default ProductGrid;