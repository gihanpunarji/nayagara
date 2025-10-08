import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  MoreVertical,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  Grid,
  List as ListIcon,
  SortAsc,
  SortDesc
} from 'lucide-react';
import api from '../../../api/axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  // Load products from API with search and filters
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Build query parameters
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (selectedFilter !== 'all') params.append('status', selectedFilter);
      if (selectedCategory) params.append('category', selectedCategory);
      if (sortBy !== 'newest') params.append('sort', sortBy);
      
      const queryString = params.toString();
      const url = `/products/seller${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      
      if (response.data.success) {
        const productsData = response.data.data.map(product => ({
          id: product.product_id,
          title: product.product_title,
          description: product.product_description,
          price: product.price,
          category: product.category_name || 'Uncategorized',
          subcategory: product.sub_category_name || 'General',
          stock: product.stock_quantity,
          status: product.product_status,
          images: product.images?.map(img => `http://localhost:5001${img.image_url}`) || ['/placeholder-image.jpg'],
          createdAt: product.created_at,
          views: product.view_count || 0,
          orders: product.inquiry_count || 0,
          attributes: product.product_attributes
        }));
        
        setProducts(productsData);
      } else {
        setError(response.data.message || 'Failed to load products');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setError(error.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Load categories from API
  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Calculate status filters based on actual data
  const getStatusFilters = () => [
    { key: 'all', label: 'All Products', count: products.length },
    { key: 'approved', label: 'Approved', count: products.filter(p => p.status === 'approved').length },
    { key: 'pending', label: 'Pending Approval', count: products.filter(p => p.status === 'pending').length },
    { key: 'out_of_stock', label: 'Out of Stock', count: products.filter(p => p.stock === 0).length }
  ];

  const statusFilters = getStatusFilters();

  const sortOptions = [
    { key: 'newest', label: 'Newest First' },
    { key: 'oldest', label: 'Oldest First' },
    { key: 'price_high', label: 'Price High to Low' },
    { key: 'price_low', label: 'Price Low to High' },
    { key: 'most_viewed', label: 'Most Viewed' },
    { key: 'best_selling', label: 'Best Selling' }
  ];

  // Initialize data
  useEffect(() => {
    loadCategories();
  }, []);

  // Reload products when filters change
  useEffect(() => {
    loadProducts();
  }, [searchQuery, selectedFilter, selectedCategory, sortBy]);

  const getStatusColor = (status, stock) => {
    if (stock === 0) return 'text-red-600 bg-red-100';
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status, stock) => {
    if (stock === 0) return <XCircle className="w-4 h-4" />;
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatPrice = (price) => {
    return `Rs. ${price.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100">
        <img
          src={product.images && product.images.length > 0 ? product.images[0] : '/api/placeholder/400/400'}
          alt={product.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/api/placeholder/400/400';
          }}
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status, product.stock)}`}>
            {getStatusIcon(product.status, product.stock)}
            <span>
              {product.stock === 0 ? 'Out of Stock' :
               product.status === 'approved' ? 'Approved' :
               product.status === 'pending' ? 'Pending' : product.status}
            </span>
          </span>
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3 flex space-x-1">
          <Link
            to={`/seller/products/edit/${product.id}`}
            className="p-2 bg-white bg-opacity-90 text-gray-600 rounded-lg hover:bg-opacity-100 hover:text-primary-600 transition-all"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button className="p-2 bg-white bg-opacity-90 text-gray-600 rounded-lg hover:bg-opacity-100 hover:text-primary-600 transition-all">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
            {product.title}
          </h3>
          <p className="text-xs text-gray-500">{product.category} • {product.subcategory}</p>
        </div>

        <div className="mb-3">
          <span className="text-lg font-bold text-primary-600">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="flex items-center space-x-1">
            <Package className="w-3 h-3" />
            <span>Stock: {product.stock}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>{product.views} views</span>
          </span>
        </div>

        <div className="text-xs text-gray-500">
          Added {formatDate(product.createdAt)}
        </div>
      </div>
    </div>
  );

  const ProductListItem = ({ product }) => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all">
      <div className="flex items-center space-x-4">
        {/* Image */}
        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={product.images && product.images.length > 0 ? product.images[0] : '/api/placeholder/400/400'}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/api/placeholder/400/400';
            }}
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1 mr-4">
              <h3 className="font-semibold text-gray-900 truncate mb-1">
                {product.title}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                {product.category} • {product.subcategory}
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="font-semibold text-primary-600">
                  {formatPrice(product.price)}
                </span>
                <span className="text-gray-500">
                  Stock: {product.stock}
                </span>
                <span className="text-gray-500">
                  {product.views} views
                </span>
              </div>
            </div>

            {/* Status and Actions */}
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status, product.stock)}`}>
                {getStatusIcon(product.status, product.stock)}
                <span>
                  {product.stock === 0 ? 'Out of Stock' :
                   product.status === 'approved' ? 'Approved' :
                   product.status === 'pending' ? 'Pending' : product.status}
                </span>
              </span>

              <div className="flex space-x-1">
                <Link
                  to={`/seller/products/edit/${product.id}`}
                  className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-all">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">
            Manage your product listings and track their performance
          </p>
        </div>

        <Link
          to="/seller/products/add"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        {/* Status Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {statusFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key)}
              className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedFilter === filter.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{filter.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                selectedFilter === filter.key
                  ? 'bg-white bg-opacity-20 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.category_id} value={category.category_name}>
                  {category.category_name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {sortOptions.map(option => (
                <option key={option.key} value={option.key}>{option.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* View Toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${
                viewMode === 'grid'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              } transition-colors`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              } transition-colors`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Products */}
      <div>
        {loading ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Products</h3>
            <p className="text-gray-600">Please wait while we fetch your products...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Products</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadProducts}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <span>Try Again</span>
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedFilter !== 'all' || selectedCategory
                ? "No products match your current search or filters. Try adjusting your criteria."
                : "You haven't added any products yet. Get started by adding your first product."
              }
            </p>
            <Link
              to="/seller/products/add"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Product</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Showing {products.length} products
                {(searchQuery || selectedFilter !== 'all' || selectedCategory) && (
                  <span className="text-primary-600 font-medium">
                    {' '}• {searchQuery && `"${searchQuery}"`} 
                    {selectedFilter !== 'all' && ` • ${selectedFilter}`} 
                    {selectedCategory && ` • ${selectedCategory}`}
                  </span>
                )}
              </p>
            </div>

            {/* Products Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map(product => (
                  <ProductListItem key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductList;