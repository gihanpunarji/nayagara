import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Filter,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  RefreshCw,
  MoreVertical,
  Star,
  TrendingUp,
  Flag,
  Store,
  DollarSign,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Mock product data
  const mockProducts = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max 256GB',
      description: 'Latest Apple iPhone with advanced features',
      seller: 'TechZone Electronics',
      sellerId: 1,
      category: 'Electronics',
      subCategory: 'Mobile Phones',
      price: 325000,
      originalPrice: 350000,
      stock: 15,
      sku: 'TZ-IP15PM-256',
      images: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
      rating: 4.8,
      totalReviews: 24,
      totalSales: 45,
      status: 'active',
      featured: true,
      flagged: false,
      createdDate: '2024-01-10',
      lastUpdated: '2024-01-15',
      tags: ['smartphone', 'apple', 'latest', 'premium']
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Premium Android flagship with S Pen',
      seller: 'TechZone Electronics',
      sellerId: 1,
      category: 'Electronics',
      subCategory: 'Mobile Phones',
      price: 285000,
      originalPrice: 285000,
      stock: 8,
      sku: 'TZ-SGS24U-512',
      images: ['image1.jpg', 'image2.jpg'],
      rating: 4.7,
      totalReviews: 18,
      totalSales: 23,
      status: 'active',
      featured: false,
      flagged: false,
      createdDate: '2024-01-08',
      lastUpdated: '2024-01-12',
      tags: ['smartphone', 'samsung', 'android', 's-pen']
    },
    {
      id: 3,
      name: 'Designer Silk Saree Collection',
      description: 'Handwoven silk sarees with traditional patterns',
      seller: 'Fashion Hub',
      sellerId: 2,
      category: 'Fashion',
      subCategory: 'Traditional Wear',
      price: 15000,
      originalPrice: 18000,
      stock: 25,
      sku: 'FH-SILK-001',
      images: ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg'],
      rating: 4.9,
      totalReviews: 156,
      totalSales: 234,
      status: 'active',
      featured: true,
      flagged: false,
      createdDate: '2023-12-15',
      lastUpdated: '2024-01-10',
      tags: ['saree', 'silk', 'traditional', 'handwoven']
    },
    {
      id: 4,
      name: 'Organic Rose Plants Set',
      description: 'Premium organic rose plants for home gardens',
      seller: 'Green Gardens',
      sellerId: 3,
      category: 'Home & Garden',
      subCategory: 'Plants',
      price: 2500,
      originalPrice: 2500,
      stock: 0,
      sku: 'GG-ROSE-SET',
      images: ['image1.jpg'],
      rating: 5.0,
      totalReviews: 12,
      totalSales: 89,
      status: 'out_of_stock',
      featured: false,
      flagged: false,
      createdDate: '2024-01-05',
      lastUpdated: '2024-01-14',
      tags: ['plants', 'organic', 'roses', 'garden']
    },
    {
      id: 5,
      name: 'Car Engine Oil 5W-30',
      description: 'High-quality synthetic engine oil',
      seller: 'AutoParts Pro',
      sellerId: 4,
      category: 'Automotive',
      subCategory: 'Engine Oil',
      price: 3500,
      originalPrice: 3500,
      stock: 150,
      sku: 'APP-EO-5W30',
      images: ['image1.jpg', 'image2.jpg'],
      rating: 4.6,
      totalReviews: 67,
      totalSales: 445,
      status: 'active',
      featured: false,
      flagged: false,
      createdDate: '2023-11-20',
      lastUpdated: '2024-01-13',
      tags: ['engine-oil', 'synthetic', 'automotive', '5w-30']
    },
    {
      id: 6,
      name: 'Fake Branded Watch',
      description: 'Counterfeit luxury watch replica',
      seller: 'Suspicious Store',
      sellerId: 7,
      category: 'Fashion',
      subCategory: 'Watches',
      price: 5000,
      originalPrice: 5000,
      stock: 20,
      sku: 'SS-FAKE-001',
      images: ['image1.jpg'],
      rating: 2.1,
      totalReviews: 3,
      totalSales: 1,
      status: 'suspended',
      featured: false,
      flagged: true,
      createdDate: '2024-01-12',
      lastUpdated: '2024-01-12',
      tags: ['watch', 'replica', 'luxury']
    }
  ];

  const categories = [
    'all', 'Electronics', 'Fashion', 'Home & Garden', 'Automotive',
    'Books', 'Health & Beauty', 'Sports', 'Toys', 'Food & Beverages'
  ];

  const filterOptions = [
    { key: 'all', label: 'All Products', count: 0, color: 'gray' },
    { key: 'active', label: 'Active', count: 0, color: 'green' },
    { key: 'pending', label: 'Pending Review', count: 0, color: 'yellow' },
    { key: 'suspended', label: 'Suspended', count: 0, color: 'red' },
    { key: 'out_of_stock', label: 'Out of Stock', count: 0, color: 'orange' },
    { key: 'flagged', label: 'Flagged', count: 0, color: 'red' },
    { key: 'featured', label: 'Featured', count: 0, color: 'purple' }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProducts(mockProducts);

      // Update filter counts
      filterOptions.forEach(filter => {
        if (filter.key === 'all') {
          filter.count = mockProducts.length;
        } else if (filter.key === 'flagged') {
          filter.count = mockProducts.filter(product => product.flagged).length;
        } else if (filter.key === 'featured') {
          filter.count = mockProducts.filter(product => product.featured).length;
        } else {
          filter.count = mockProducts.filter(product => product.status === filter.key).length;
        }
      });

      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Apply status filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'flagged') {
        filtered = filtered.filter(product => product.flagged);
      } else if (selectedFilter === 'featured') {
        filtered = filtered.filter(product => product.featured);
      } else {
        filtered = filtered.filter(product => product.status === selectedFilter);
      }
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

    setFilteredProducts(filtered);
  }, [products, selectedFilter, selectedCategory, searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'suspended': return 'bg-red-100 text-red-700 border-red-200';
      case 'out_of_stock': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatPrice = (amount) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleProductAction = (action, productId) => {
    console.log(`${action} product:`, productId);
    // Handle product actions here
  };

  const handleBulkAction = (action) => {
    console.log(`${action} products:`, selectedProducts);
    // Handle bulk actions here
  };

  const ProductRow = ({ product }) => (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={selectedProducts.includes(product.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedProducts([...selectedProducts, product.id]);
            } else {
              setSelectedProducts(selectedProducts.filter(id => id !== product.id));
            }
          }}
          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
        />
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            {product.images.length > 0 ? (
              <ImageIcon className="w-6 h-6 text-gray-400" />
            ) : (
              <Package className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900 flex items-center space-x-2">
              <span className="truncate max-w-xs">{product.name}</span>
              {product.featured && (
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              )}
              {product.flagged && (
                <Flag className="w-4 h-4 text-red-500 fill-current" />
              )}
            </div>
            <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
            <div className="text-xs text-gray-400">SKU: {product.sku}</div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Store className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-900">{product.seller}</span>
          </div>
          <div className="text-gray-500">{product.category}</div>
          <div className="text-gray-400 text-xs">{product.subCategory}</div>
        </div>
      </td>

      <td className="px-6 py-4 text-sm">
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{formatPrice(product.price)}</div>
          {product.originalPrice !== product.price && (
            <div className="text-gray-500 line-through text-xs">{formatPrice(product.originalPrice)}</div>
          )}
          <div className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            Stock: {product.stock}
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="font-medium">{product.rating}</span>
            <span className="text-gray-500">({product.totalReviews})</span>
          </div>
          <div className="text-gray-600">{product.totalSales} sold</div>
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-gray-500">
        <div className="space-y-1">
          <div>Created: {formatDate(product.createdDate)}</div>
          <div className="text-xs">Updated: {formatDate(product.lastUpdated)}</div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="space-y-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
            {product.status.replace('_', ' ').toUpperCase()}
          </span>

          <div className="flex items-center space-x-1">
            {product.featured && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                Featured
              </span>
            )}
            {product.flagged && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                Flagged
              </span>
            )}
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-right">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleProductAction('view', product.id)}
            className="text-gray-600 hover:text-red-600 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          <div className="relative group">
            <button className="text-gray-600 hover:text-red-600 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>

            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 invisible group-hover:visible z-10">
              <div className="py-1">
                <button
                  onClick={() => handleProductAction('edit', product.id)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Product</span>
                </button>

                {product.status === 'active' ? (
                  <button
                    onClick={() => handleProductAction('suspend', product.id)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Ban className="w-4 h-4" />
                    <span>Suspend Product</span>
                  </button>
                ) : product.status === 'suspended' ? (
                  <button
                    onClick={() => handleProductAction('activate', product.id)}
                    className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Activate Product</span>
                  </button>
                ) : null}

                {product.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleProductAction('approve', product.id)}
                      className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve Product</span>
                    </button>
                    <button
                      onClick={() => handleProductAction('reject', product.id)}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Product</span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => handleProductAction(product.featured ? 'unfeature' : 'feature', product.id)}
                  className="w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 flex items-center space-x-2"
                >
                  <Star className="w-4 h-4" />
                  <span>{product.featured ? 'Remove from Featured' : 'Add to Featured'}</span>
                </button>

                <button
                  onClick={() => handleProductAction(product.flagged ? 'unflag' : 'flag', product.id)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-red-50 flex items-center space-x-2 ${
                    product.flagged ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  <Flag className="w-4 h-4" />
                  <span>{product.flagged ? 'Remove Flag' : 'Flag Product'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );

  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.status === 'active').length,
    pendingProducts: products.filter(p => p.status === 'pending').length,
    suspendedProducts: products.filter(p => p.status === 'suspended').length,
    flaggedProducts: products.filter(p => p.flagged).length,
    featuredProducts: products.filter(p => p.featured).length,
    outOfStockProducts: products.filter(p => p.stock === 0).length
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-red-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600 mt-1">
              Manage all products, approvals, and inventory across the platform
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button
              onClick={() => handleBulkAction('export')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-xl font-bold text-green-600">{stats.activeProducts}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-bold text-yellow-600">{stats.pendingProducts}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Suspended</p>
              <p className="text-xl font-bold text-red-600">{stats.suspendedProducts}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Flagged</p>
              <p className="text-xl font-bold text-red-600">{stats.flaggedProducts}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Featured</p>
              <p className="text-xl font-bold text-purple-600">{stats.featuredProducts}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-xl font-bold text-orange-600">{stats.outOfStockProducts}</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {filterOptions.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedFilter === filter.key
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{filter.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedFilter === filter.key
                    ? 'bg-white bg-opacity-20 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="mb-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products by name, description, seller, SKU, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <div className="mt-4 flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <span className="text-sm text-red-700">
                {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('approve')}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Bulk Approve
                </button>
                <button
                  onClick={() => handleBulkAction('feature')}
                  className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                >
                  Add to Featured
                </button>
                <button
                  onClick={() => handleBulkAction('suspend')}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Bulk Suspend
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600">
                {products.length === 0
                  ? "No products have been listed yet."
                  : "No products match your current filters."}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts(filteredProducts.map(p => p.id));
                            } else {
                              setSelectedProducts([]);
                            }
                          }}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Seller & Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price & Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map(product => (
                      <ProductRow key={product.id} product={product} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Showing {filteredProducts.length} of {products.length} products
                  </p>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm">
                      Previous
                    </button>
                    <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Products;