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

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Mock data - in real app, this would come from API
  const mockProducts = [
    {
      id: 1,
      title: 'iPhone 14 Pro Max 256GB Space Black',
      description: 'Brand new iPhone 14 Pro Max with original warranty',
      price: 450000,
      category: 'Electronics',
      subcategory: 'Mobile Phones',
      stock: 5,
      status: 'approved',
      images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'],
      createdAt: '2024-01-15T10:30:00Z',
      views: 234,
      orders: 12
    },
    {
      id: 2,
      title: 'Toyota Prius 2020 Hybrid',
      description: 'Low mileage, excellent condition, full service history',
      price: 8500000,
      category: 'Vehicles',
      subcategory: 'Cars',
      stock: 1,
      status: 'pending',
      images: ['https://images.unsplash.com/photo-1549399163-1ba32edc4c84?w=400'],
      createdAt: '2024-01-14T15:20:00Z',
      views: 89,
      orders: 0
    },
    {
      id: 3,
      title: 'Nike Air Max 270 Black White',
      description: 'Comfortable running shoes in excellent condition',
      price: 15000,
      category: 'Fashion',
      subcategory: 'Shoes',
      stock: 0,
      status: 'approved',
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
      createdAt: '2024-01-13T09:15:00Z',
      views: 156,
      orders: 8
    },
    {
      id: 4,
      title: 'MacBook Pro 16" M2 512GB',
      description: 'Professional laptop for creative work',
      price: 650000,
      category: 'Electronics',
      subcategory: 'Laptops',
      stock: 3,
      status: 'approved',
      images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400'],
      createdAt: '2024-01-12T14:45:00Z',
      views: 312,
      orders: 5
    },
    {
      id: 5,
      title: 'Samsung 65" 4K Smart TV',
      description: 'Crystal clear display with smart features',
      price: 185000,
      category: 'Electronics',
      subcategory: 'TVs',
      stock: 2,
      status: 'pending',
      images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400'],
      createdAt: '2024-01-10T16:30:00Z',
      views: 78,
      orders: 0
    }
  ];

  const statusFilters = [
    { key: 'all', label: 'All Products', count: mockProducts.length },
    { key: 'approved', label: 'Approved', count: mockProducts.filter(p => p.status === 'approved').length },
    { key: 'pending', label: 'Pending Approval', count: mockProducts.filter(p => p.status === 'pending').length },
    { key: 'out_of_stock', label: 'Out of Stock', count: mockProducts.filter(p => p.stock === 0).length }
  ];

  const categories = [
    'Electronics',
    'Vehicles',
    'Fashion',
    'Home & Living',
    'Beauty & Health',
    'Sports',
    'Books & Media',
    'Services'
  ];

  const sortOptions = [
    { key: 'newest', label: 'Newest First' },
    { key: 'oldest', label: 'Oldest First' },
    { key: 'price_high', label: 'Price High to Low' },
    { key: 'price_low', label: 'Price Low to High' },
    { key: 'most_viewed', label: 'Most Viewed' },
    { key: 'best_selling', label: 'Best Selling' }
  ];

  // Initialize products
  useEffect(() => {
    setProducts(mockProducts);
  }, []);

  // Filter and search products
  useEffect(() => {
    let filtered = [...products];

    // Apply status filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'out_of_stock') {
        filtered = filtered.filter(product => product.stock === 0);
      } else {
        filtered = filtered.filter(product => product.status === selectedFilter);
      }
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price_high':
          return b.price - a.price;
        case 'price_low':
          return a.price - b.price;
        case 'most_viewed':
          return b.views - a.views;
        case 'best_selling':
          return b.orders - a.orders;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedFilter, selectedCategory, searchQuery, sortBy]);

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

  const toggleProductStatus = (productId) => {
    setProducts(prev => prev.map(product =>
      product.id === productId
        ? { ...product, status: product.status === 'active' ? 'inactive' : 'active' }
        : product
    ));
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
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover"
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
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover"
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
                <option key={category} value={category}>{category}</option>
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
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6">
              {products.length === 0
                ? "You haven't added any products yet. Get started by adding your first product."
                : "No products match your current filters. Try adjusting your search or filters."
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
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            {/* Products Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map(product => (
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