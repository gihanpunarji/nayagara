import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Grid, List, Filter, ArrowUpDown, ChevronDown, Star, Heart,
  ShoppingCart, MapPin, Truck, Eye, TrendingUp, Zap, Gift, Loader2
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { publicApi } from '../../../api/axios';
import { useCart } from '../../../context/CartContext';

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  
  // Get search parameters
  const searchQuery = searchParams.get('search') || '';
  const categoryFromUrl = searchParams.get('category') || 'all';
  const subcategoryFromUrl = searchParams.get('subcategory') || '';
  const districtFromUrl = searchParams.get('district') || '';
  const priceMinFromUrl = searchParams.get('priceMin') || '';
  const priceMaxFromUrl = searchParams.get('priceMax') || '';

  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategoryFromUrl);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  // Products state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Set view mode based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('list');
      } else {
        setViewMode('grid');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await publicApi.get('/categories-with-subcategories');
        const categoriesData = res.data.data || [];
        setCategories(categoriesData);
        
        // Set subcategories based on selected category
        if (selectedCategory && selectedCategory !== 'all') {
          const selectedCat = categoriesData.find(cat => 
            cat.category_slug === selectedCategory || 
            cat.category_name.toLowerCase() === selectedCategory.toLowerCase()
          );
          if (selectedCat && selectedCat.subcategories) {
            setSubcategories(selectedCat.subcategories);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [selectedCategory]);

  // Fetch products from backend
  const fetchProducts = useCallback(async (pageNum = 1, append = false) => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.append('page', pageNum.toString());
      params.append('limit', '12');
      
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedSubcategory) params.append('subcategory', selectedSubcategory);
      if (districtFromUrl) params.append('district', districtFromUrl);
      if (priceMinFromUrl) params.append('priceMin', priceMinFromUrl);
      if (priceMaxFromUrl) params.append('priceMax', priceMaxFromUrl);
      
      // Add sort parameter
      switch (sortBy) {
        case 'price-low':
          params.append('sort', 'price_low');
          break;
        case 'price-high':
          params.append('sort', 'price_high');
          break;
        case 'rating':
          params.append('sort', 'most_viewed');
          break;
        case 'newest':
        default:
          params.append('sort', 'newest');
          break;
      }

      const res = await publicApi.get(`/products/public?${params.toString()}`);
      const fetchedProducts = res.data.data || [];
      
      if (append) {
        setProducts(prev => [...prev, ...fetchedProducts]);
      } else {
        setProducts(fetchedProducts);
      }
      
      setTotalProducts(fetchedProducts.length);
      setHasMore(fetchedProducts.length === 12); // If we get less than 12, no more products
      
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setHasMore(false);
    }

    setLoading(false);
  }, [searchQuery, selectedCategory, selectedSubcategory, districtFromUrl, priceMinFromUrl, priceMaxFromUrl, sortBy]);

  // Load more products for infinite scroll
  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;
    await fetchProducts(page + 1, true);
    setPage(prev => prev + 1);
  }, [fetchProducts, page, loading, hasMore]);

  // Load initial products when search params change
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts(1, false);
  }, [fetchProducts]);

  // Update selected category when URL changes
  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
    setSelectedSubcategory(subcategoryFromUrl);
  }, [categoryFromUrl, subcategoryFromUrl]);

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

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const ProductCard = ({ product, viewMode }) => {
    const { addToCart, isInCart, getItemQuantity, loading: cartLoading } = useCart();
    
    const handleAddToCart = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      try {
        await addToCart(product, 1);
        // You could add a toast notification here
      } catch (error) {
        console.error('Error adding to cart:', error);
        // You could add an error toast here
      }
    };

    const productId = product.product_id || product.id;
    const inCart = isInCart(productId);
    const cartQuantity = getItemQuantity(productId);
    
    // Handle images properly
    let displayImage = 'https://via.placeholder.com/400x300?text=No+Image';
    if (product.images) {
      if (typeof product.images === 'string' && product.images.trim()) {
        // If images is a comma-separated string
        displayImage = product.images.split(',')[0].trim();
      } else if (Array.isArray(product.images) && product.images.length > 0) {
        // If images is an array
        displayImage = product.images[0].image_url || product.images[0];
      }
      

    }

    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group overflow-hidden ${
        viewMode === 'list' ? 'flex' : ''
      }`}>
        <div className={`relative ${
          viewMode === 'list' ? 'w-32 flex-shrink-0' : 'w-full'
        }`}>
          <Link to={`/product/${product.product_id}`}>
            <img
              src={displayImage}
              alt={product.product_title || 'Product'}
              className={`object-contain group-hover:scale-105 transition-transform duration-300 ${
                viewMode === 'list' ? 'w-full h-32' : 'w-full h-48 sm:h-56'
              }`}
            />
          </Link>

          <div className="absolute top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Link to={`/product/${product.product_id}`} className="bg-white text-gray-800 py-2 px-4 rounded-lg text-sm font-semibold">Quick View</Link>
          </div>

          <button className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </button>
        </div>

        <div className={`p-2 sm:p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
          <Link to={`/product/${product.product_id}`}>
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
              {product.product_title || 'Untitled Product'}
            </h3>
          </Link>

          <div className="flex items-center space-x-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(4.5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
            <span className="text-sm text-gray-500">({product.inquiry_count || 0})</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
            <MapPin className="w-4 h-4" />
            <span>{product.location_city_name || 'Location not specified'}</span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-lg font-bold text-primary-600">
                Rs. {parseFloat(product.price || 0).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="text-xs text-gray-500 mb-2">
            By: {`${product.seller_first_name || ''} ${product.seller_last_name || ''}`.trim() || 'Unknown Seller'}
          </div>

          <div className="flex space-x-2">
            <Link 
              to={`/product/${productId}`}
              className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>View</span>
            </Link>
            
            <button 
              onClick={handleAddToCart}
              disabled={cartLoading || (product.stock_quantity !== undefined && product.stock_quantity <= 0)}
              className={`flex-1 py-2 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                inCart 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gradient-primary text-white hover:shadow-green'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>
                {cartLoading ? '...' : inCart ? `In Cart (${cartQuantity})` : 'Add to Cart'}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-[85%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {searchQuery ? `Search results for "${searchQuery}"` : 
                   selectedCategory === 'all' ? 'All Products' : capitalizeFirstLetter(selectedCategory)}
                </h1>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="relative">
                  <button
                    onClick={() => setShowSortMenu(!showSortMenu)}
                    className="flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg hover:border-primary-500 transition-colors"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    <span className="hidden sm:inline">Sort by {sortBy}</span>
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
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <button
                  key="all"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedSubcategory('');
                    setSubcategories([]);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-600 border border-gray-300'
                  }`}
                >
                  All Categories
                </button>
                {categories.map(category => (
                  <button
                    key={category.category_id}
                    onClick={() => {
                      const categorySlug = category.category_slug || category.category_name.toLowerCase().replace(/\s+/g, '-');
                      setSelectedCategory(categorySlug);
                      setSelectedSubcategory('');
                      setSubcategories(category.subcategories || []);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === (category.category_slug || category.category_name.toLowerCase().replace(/\s+/g, '-'))
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-600 border border-gray-300'
                    }`}
                  >
                    {category.category_name}
                  </button>
                ))}
              </div>

              {/* Subcategory Filter */}
              {subcategories.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-500 py-2">Subcategories:</span>
                  <button
                    onClick={() => setSelectedSubcategory('')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      !selectedSubcategory
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    All
                  </button>
                  {subcategories.map(subcat => (
                    <button
                      key={subcat.sub_category_id}
                      onClick={() => setSelectedSubcategory(subcat.sub_category_id.toString())}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        selectedSubcategory === subcat.sub_category_id.toString()
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      {subcat.sub_category_name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-[85%] mx-auto px-0 sm:px-6 lg:px-8 py-8">
        <div className="text-gray-600 mb-4">
          <p>Found {totalProducts} product{totalProducts !== 1 ? 's' : ''}</p>
          {searchQuery && <p> for "{searchQuery}"</p>}
          {selectedCategory !== 'all' && <p> in {capitalizeFirstLetter(selectedCategory)}</p>}
        </div>
        <div className={`grid gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            : 'grid-cols-1'
        }`}>
          {products.map(product => (
            <ProductCard key={product.product_id} product={product} viewMode={viewMode} />
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