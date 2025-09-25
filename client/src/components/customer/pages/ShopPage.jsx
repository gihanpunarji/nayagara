import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid, List, Filter, ArrowUpDown, ChevronDown, Star, Heart,
  ShoppingCart, MapPin, Truck, Eye, TrendingUp, Zap, Gift, Loader2
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');

  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || 'all');

  // Infinite scroll state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Mock product data generator
  const generateMockProducts = (pageNum, category) => {
    const baseProducts = [
      {
        name: 'iPhone 15 Pro Max 256GB',
        price: 385000,
        originalPrice: 420000,
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        reviews: 2847,
        category: 'Electronics',
        location: 'Colombo 07',
        seller: 'TechZone Lanka'
      },
      {
        name: 'Toyota Prius Hybrid 2020',
        price: 8500000,
        originalPrice: 9200000,
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        rating: 4.7,
        reviews: 1234,
        category: 'Vehicles',
        location: 'Kandy',
        seller: 'Premium Cars'
      },
      {
        name: 'Gaming Laptop RTX 4070',
        price: 425000,
        originalPrice: 485000,
        image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        rating: 4.6,
        reviews: 892,
        category: 'Electronics',
        location: 'Nugegoda',
        seller: 'Gamer Hub'
      },
      {
        name: '3BHK Apartment Colombo',
        price: 25000000,
        originalPrice: 28000000,
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        reviews: 456,
        category: 'Property',
        location: 'Colombo 03',
        seller: 'Dream Homes'
      },
      {
        name: 'Premium Basmati Rice 25kg',
        price: 4750,
        originalPrice: 5200,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        rating: 4.4,
        reviews: 667,
        category: 'Grocery',
        location: 'Kelaniya',
        seller: 'Fresh Mart'
      }
    ];

    return baseProducts
      .filter(product => category === 'all' || product.category.toLowerCase() === category.toLowerCase())
      .map((product, index) => ({
        ...product,
        id: (pageNum - 1) * 12 + index + 1,
        name: `${product.name} - Batch ${pageNum}`,
        discount: Math.floor(((product.originalPrice - product.price) / product.originalPrice) * 100)
      }))
      .slice(0, 12); // 12 products per page
  };

  // Load more products
  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newProducts = generateMockProducts(page, selectedCategory);

    if (newProducts.length === 0 || page > 10) { // Limit to 10 pages for demo
      setHasMore(false);
    } else {
      setProducts(prev => [...prev, ...newProducts]);
      setPage(prev => prev + 1);
    }

    setLoading(false);
  }, [page, selectedCategory, loading, hasMore]);

  // Load initial products
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);

    const initialProducts = generateMockProducts(1, selectedCategory);
    setProducts(initialProducts);
    setPage(2);
  }, [selectedCategory]);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop
          >= document.documentElement.offsetHeight - 1000) {
        loadMoreProducts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreProducts]);

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group overflow-hidden">
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-error text-white px-2 py-1 rounded text-xs font-bold">
            -{product.discount}%
          </span>
        )}

        <button className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
        </button>
      </div>

      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
          ))}
          <span className="text-sm text-gray-500">({product.reviews})</span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
          <MapPin className="w-4 h-4" />
          <span>{product.location}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg font-bold text-primary-600">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through ml-2">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <button className="w-full bg-gradient-primary text-white py-2 rounded-lg hover:shadow-green transition-all duration-300 flex items-center justify-center space-x-2">
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === 'all' ? 'All Products' : selectedCategory}
                </h1>
                <p className="text-gray-600">Found {products.length}+ products</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button
                    onClick={() => setShowSortMenu(!showSortMenu)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-primary-500 transition-colors"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    <span>Sort by {sortBy}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showSortMenu && (
                    <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                      {['relevance', 'price-low', 'price-high', 'rating', 'newest'].map(option => (
                        <button
                          key={option}
                          onClick={() => {setSortBy(option); setShowSortMenu(false);}}
                          className="w-full text-left px-4 py-2 hover:bg-primary-50 transition-colors capitalize"
                        >
                          {option.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {['all', 'Electronics', 'Vehicles', 'Property', 'Grocery', 'Fashion', 'Jobs'].map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-600 border border-gray-300'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            : 'grid-cols-1'
        }`}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600">Loading more products...</span>
          </div>
        )}

        {/* End Message */}
        {!hasMore && products.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">You've reached the end! No more products to show.</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Filter className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;