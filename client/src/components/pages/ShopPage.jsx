import React, { useState } from 'react';
import {
  Grid, List, Filter, ArrowUpDown, ChevronDown, Star, Heart,
  ShoppingCart, MapPin, Truck, Eye, TrendingUp, Zap, Gift
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ShopPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock products data
  const products = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max 256GB',
      price: 385000,
      originalPrice: 420000,
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviews: 2847,
      discount: 8,
      badge: 'Best Seller',
      location: 'Colombo 07',
      seller: 'TechZone Lanka',
      category: 'Electronics',
      isFeatured: true,
      views: 12450
    },
    {
      id: 2,
      name: 'Toyota Prius 2020 Hybrid',
      price: 4850000,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.7,
      reviews: 156,
      badge: 'Verified',
      location: 'Gampaha',
      seller: 'AutoHub Lanka',
      category: 'Vehicles',
      isFeatured: false,
      views: 8920
    },
    {
      id: 3,
      name: 'Gaming Laptop RTX 4070',
      price: 425000,
      originalPrice: 485000,
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviews: 567,
      discount: 12,
      badge: 'Gaming',
      location: 'Nugegoda',
      seller: 'Gamer Hub',
      category: 'Electronics',
      isFeatured: true,
      views: 15680
    },
    {
      id: 4,
      name: 'Bridal Saree Collection',
      price: 18500,
      originalPrice: 22000,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviews: 345,
      discount: 16,
      badge: 'Trending',
      location: 'Kandy',
      seller: 'Fashion House',
      category: 'Fashion',
      isFeatured: false,
      views: 7230
    },
    {
      id: 5,
      name: 'Premium Basmati Rice 25kg',
      price: 4750,
      originalPrice: 5200,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.6,
      reviews: 1234,
      discount: 9,
      badge: 'Fresh',
      location: 'Kelaniya',
      seller: 'Fresh Mart',
      category: 'Grocery',
      isFeatured: false,
      views: 5420
    },
    {
      id: 6,
      name: 'Sony WH-1000XM4 Headphones',
      price: 65000,
      originalPrice: 75000,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviews: 892,
      discount: 13,
      badge: 'Audio',
      location: 'Colombo 05',
      seller: 'Audio Pro',
      category: 'Electronics',
      isFeatured: true,
      views: 9870
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', count: products.length },
    { id: 'electronics', name: 'Electronics', count: products.filter(p => p.category === 'Electronics').length },
    { id: 'vehicles', name: 'Vehicles', count: products.filter(p => p.category === 'Vehicles').length },
    { id: 'fashion', name: 'Fashion', count: products.filter(p => p.category === 'Fashion').length },
    { id: 'grocery', name: 'Grocery', count: products.filter(p => p.category === 'Grocery').length }
  ];

  const quickFilters = [
    { id: 'featured', label: 'Featured', icon: Star },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'flash_sale', label: 'Flash Sale', icon: Zap },
    { id: 'free_shipping', label: 'Free Shipping', icon: Truck }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' }
  ];

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Best Seller': return 'bg-orange-500';
      case 'Verified': return 'bg-green-500';
      case 'Gaming': return 'bg-blue-500';
      case 'Trending': return 'bg-purple-500';
      case 'Fresh': return 'bg-emerald-500';
      case 'Audio': return 'bg-indigo-500';
      default: return 'bg-primary-500';
    }
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category.toLowerCase() === selectedCategory);

  const ProductCard = ({ product, viewMode }) => {
    if (viewMode === 'list') {
      return (
        <Link
          to={`/product/${product.id}`}
          className="bg-white rounded-xl border border-gray-200 p-4 hover:border-primary-300 hover:shadow-green transition-all group"
        >
          <div className="flex space-x-4">
            <div className="relative flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-lg group-hover:scale-105 transition-transform"
              />
              {product.badge && (
                <span className={`absolute -top-1 -left-1 text-white text-xs px-2 py-1 rounded-full font-bold ${getBadgeColor(product.badge)}`}>
                  {product.badge}
                </span>
              )}
              {product.discount && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                  -{product.discount}%
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-2">
                {product.name}
              </h3>

              <div className="flex items-center space-x-1 mb-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">{product.rating}</span>
                <span className="text-sm text-gray-500">({product.reviews})</span>
                <span className="text-sm text-gray-400">•</span>
                <Eye className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">{product.views}</span>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{product.location}</span>
                </div>
                <span>by {product.seller}</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-primary-600">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      Rs. {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Link>
      );
    }

    return (
      <Link
        to={`/product/${product.id}`}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-primary-300 hover:shadow-green transition-all group"
      >
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {product.badge && (
              <span className={`text-white text-xs px-2 py-1 rounded-full font-bold ${getBadgeColor(product.badge)}`}>
                {product.badge}
              </span>
            )}
            {product.discount && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                -{product.discount}%
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 bg-white bg-opacity-90 rounded-full text-gray-600 hover:text-red-500 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
            <button className="p-2 bg-white bg-opacity-90 rounded-full text-gray-600 hover:text-primary-600 transition-colors">
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Views indicator */}
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
            {product.views} views
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
              <span className="text-primary-600 font-medium">Free Shipping</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* Seller */}
          <p className="text-xs text-gray-500 mb-2">by {product.seller}</p>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-3">
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
              {product.originalPrice && (
                <div className="text-xs text-gray-500 line-through">
                  Rs. {product.originalPrice.toLocaleString()}
                </div>
              )}
            </div>
            <button className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-primary text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Shop Everything</h1>
          <p className="text-primary-100">Discover amazing products from trusted sellers across Sri Lanka</p>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {quickFilters.map((filter) => {
              const IconComponent = filter.icon;
              return (
                <button
                  key={filter.id}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors whitespace-nowrap"
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.name}</span>
                      <span className="text-sm text-gray-500">({category.count})</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Price Range Filter */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <button className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="text-sm text-gray-600">& up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <p className="text-gray-600">
                    Showing <span className="font-medium">{filteredProducts.length}</span> products
                  </p>

                  <div className="relative">
                    <button
                      onClick={() => setShowSortMenu(!showSortMenu)}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-primary-500 transition-colors"
                    >
                      <ArrowUpDown className="w-4 h-4" />
                      <span className="text-sm font-medium">Sort</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {showSortMenu && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value);
                              setShowSortMenu(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-primary-50 transition-colors ${
                              sortBy === option.value ? 'bg-primary-50 text-primary-600 font-medium' : ''
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:text-primary-600'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:text-primary-600'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="px-8 py-3 border-2 border-primary-500 text-primary-600 rounded-xl hover:bg-primary-500 hover:text-white transition-all font-bold">
                Load More Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;