import React, { useState, useEffect } from 'react';
import {
  Search, Filter, Grid, List, MapPin, Star, Heart, ShoppingCart,
  SlidersHorizontal, ChevronDown, X, ArrowUpDown, Truck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: { min: '', max: '' },
    location: 'all',
    condition: 'all',
    rating: 0
  });

  // Mock search results
  const [searchResults] = useState([
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
      condition: 'New'
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
      condition: 'Used'
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
      condition: 'New'
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
      condition: 'New'
    }
  ]);

  const categories = ['All Categories', 'Electronics', 'Vehicles', 'Fashion', 'Home & Living', 'Beauty & Health', 'Sports', 'Books & Media'];
  const locations = ['All Locations', 'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matara', 'Galle'];
  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Best Seller': return 'bg-orange-500';
      case 'Verified': return 'bg-green-500';
      case 'Gaming': return 'bg-blue-500';
      case 'Trending': return 'bg-purple-500';
      default: return 'bg-primary-500';
    }
  };

  const ProductCard = ({ product, viewMode }) => {
    if (viewMode === 'list') {
      return (
        <Link
          to={`/product/${product.id}`}
          className="bg-white rounded-xl border border-gray-200 p-4 hover:border-primary-300 hover:shadow-green transition-all"
        >
          <div className="flex space-x-4">
            <div className="relative flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
              />
              {product.badge && (
                <span className={`absolute -top-1 -left-1 text-white text-xs px-2 py-1 rounded-full font-bold ${getBadgeColor(product.badge)}`}>
                  {product.badge}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>

              <div className="flex items-center space-x-1 mb-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">{product.rating}</span>
                <span className="text-sm text-gray-500">({product.reviews})</span>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{product.location}</span>
                </div>
                <span>by {product.seller}</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-primary-600">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      Rs. {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
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
        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-primary-300 hover:shadow-green transition-all"
      >
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-40 object-cover"
          />
          {product.badge && (
            <span className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded-full font-bold ${getBadgeColor(product.badge)}`}>
              {product.badge}
            </span>
          )}
          {product.discount && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              -{product.discount}%
            </span>
          )}
          <button className="absolute bottom-2 right-2 p-2 bg-white bg-opacity-90 rounded-full text-gray-600 hover:text-primary-600 transition-colors">
            <Heart className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3">
          <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
            <MapPin className="w-3 h-3" />
            <span>{product.location}</span>
            <span className="mx-1">•</span>
            <Truck className="w-3 h-3" />
            <span>Free Shipping</span>
          </div>

          <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">{product.name}</h3>

          <div className="flex items-center space-x-1 mb-2">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs text-gray-600">{product.rating}</span>
            <span className="text-xs text-gray-500">({product.reviews})</span>
          </div>

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
            <button className="w-7 h-7 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands, categories..."
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Search className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Filters & Sort Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-primary-500 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-sm font-medium">Filters</span>
              </button>

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

        {/* Expandable Filters */}
        {showFilters && (
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat.toLowerCase().replace(' ', '_')}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange.min}
                      onChange={(e) => setFilters({...filters, priceRange: {...filters.priceRange, min: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange.max}
                      onChange={(e) => setFilters({...filters, priceRange: {...filters.priceRange, max: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc.toLowerCase().replace(' ', '_')}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Condition Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                  <select
                    value={filters.condition}
                    onChange={(e) => setFilters({...filters, condition: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Conditions</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="refurbished">Refurbished</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing <span className="font-medium">{searchResults.length}</span> results
            {searchQuery && (
              <span> for "<span className="font-medium">{searchQuery}</span>"</span>
            )}
          </p>
        </div>

        {/* Products Grid/List */}
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
            : 'space-y-4'
        }>
          {searchResults.map((product) => (
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
  );
};

export default SearchPage;