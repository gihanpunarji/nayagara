import React, { useState, useEffect, useMemo } from 'react';
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
  const [debouncedSearch, setDebouncedSearch] = useState('');
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

      // Build query parameters (using debounced search)
      const params = new URLSearchParams();
      if (debouncedSearch.trim()) params.append('search', debouncedSearch.trim());
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
          images: product.images?.map(img => img.image_url),
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

  // Handle status toggle
  const handleStatusToggle = async (productId, currentStatus) => {
    // Prevent toggling if pending approval (unless setting to inactive)
    if (currentStatus === 'pending_approval') {
      // Allow disabling, but warn if trying to enable
      // Actually, since it's a toggle, we only need to check if we are trying to ACTIVATE it
      // But the toggle UI will show "off" for pending usually? Or "warning"?
      // Let's assume toggle is ON for active, OFF for inactive/pending.
      // If pending, it's safer to not allow toggle TO active via simple switch.
      // But we can allow setting to inactive.
      
      // For now, let's just call the API. The API has the safety checks.
      // We will handle the optimistic UI carefully.
    }

    // Determine new status
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    // Optimistic Update
    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === productId ? { ...p, status: newStatus } : p
      )
    );

    try {
      const response = await api.patch(`/products/${productId}/status`, {
        status: newStatus
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      
      // Success - no need to do anything as we already updated UI
    } catch (error) {
      console.error('Error updating status:', error);
      // Revert on error
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === productId ? { ...p, status: currentStatus } : p
        )
      );
      // Optional: Show toast or error
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  // OPTIMIZED: Calculate status filters with useMemo - single iteration instead of 6
  const statusFilters = useMemo(() => {
    // Count all statuses in a single iteration
    const counts = products.reduce((acc, product) => {
      acc[product.status] = (acc[product.status] || 0) + 1;
      if (product.stock === 0) {
        acc.out_of_stock = (acc.out_of_stock || 0) + 1;
      }
      return acc;
    }, {});

    return [
      { key: 'all', label: 'All Products', count: products.length },
      { key: 'active', label: 'Active', count: counts.active || 0 },
      { key: 'pending_approval', label: 'Pending Approval', count: counts.pending_approval || 0 },
      { key: 'suspended', label: 'Suspended', count: counts.suspended || 0 },
      { key: 'inactive', label: 'Inactive', count: counts.inactive || 0 },
      { key: 'out_of_stock', label: 'Out of Stock', count: counts.out_of_stock || 0 }
    ];
  }, [products]);

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

  // OPTIMIZED: Debounce search input to prevent API call on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reload products when filters change (using debounced search)
  useEffect(() => {
    loadProducts();
  }, [debouncedSearch, selectedFilter, selectedCategory, sortBy]);



  const getStatusColor = (status, stock) => {
    if (stock === 0) return 'text-red-600 bg-red-100';
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending_approval': return 'text-yellow-600 bg-yellow-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status, stock) => {
    if (stock === 0) return <XCircle className="w-4 h-4" />;
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'pending_approval': return <Clock className="w-4 h-4" />;
      case 'suspended': return <AlertTriangle className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
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
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        <img
          src={product.images && product.images.length > 0 ? product.images[0] : '/api/placeholder/400/400'}
          alt={product.title}
          className="w-full h-full object-contain mix-blend-multiply p-4 transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = '/api/placeholder/400/400';
          }}
        />

        {/* Status Badge Overlay */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md ${
            product.stock === 0 ? 'bg-red-500/90 text-white' :
            product.status === 'active' ? 'bg-green-500/90 text-white' :
            product.status === 'pending_approval' ? 'bg-yellow-500/90 text-white' :
            product.status === 'suspended' ? 'bg-red-500/90 text-white' :
            'bg-gray-500/90 text-white'
          }`}>
            {getStatusIcon(product.status, product.stock)}
            <span>
              {product.stock === 0 ? 'Out of Stock' :
                product.status === 'active' ? 'Active' :
                  product.status === 'pending_approval' ? 'Pending' :
                    product.status === 'suspended' ? 'Suspended' : 'Inactive'}
            </span>
          </span>
        </div>

        {/* Action Buttons Overlay (Visible on Hover in Desktop, Always on Mobile) */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-4 group-hover:translate-x-0">
          <Link
            to={`/seller/products/edit/${product.id}`}
            className="p-2 bg-white text-gray-700 rounded-full shadow-md hover:text-primary-600 hover:bg-gray-50 transition-colors"
            title="Edit Product"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button className="p-2 bg-white text-gray-700 rounded-full shadow-md hover:text-primary-600 hover:bg-gray-50 transition-colors" title="View Details">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-1">
          <p className="text-xs font-medium text-gray-500 mb-1">{product.category} &bull; {product.subcategory}</p>
          <h3 className="font-bold text-gray-900 line-clamp-2 min-h-[2.5rem] leading-tight group-hover:text-primary-700 transition-colors">
            {product.title}
          </h3>
        </div>

        {/* Price and Stock */}
        <div className="mt-4 mb-4 flex items-end justify-between">
          <div>
            <span className="block text-2xl font-bold text-primary-600 leading-none">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-gray-400 mt-1 block">
               Added {formatDate(product.createdAt)}
            </span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-sm text-gray-500">
             <div className="flex items-center space-x-1" title="Stock Quantity">
                <Package className="w-4 h-4" />
                <span className="font-medium">{product.stock}</span>
             </div>
             <div className="flex items-center space-x-1" title="Total Views">
                <Eye className="w-4 h-4" />
                <span className="font-medium">{product.views}</span>
             </div>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center" title={product.status === 'active' ? 'Click to Deactivate' : 'Click to Activate'}>
             {(['active', 'inactive', 'pending_approval'].includes(product.status)) ? (
              <label className="relative inline-flex items-center cursor-pointer group/toggle">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={product.status === 'active'}
                  onChange={() => handleStatusToggle(product.id, product.status)}
                  disabled={product.status === 'pending_approval' || product.status === 'suspended'}
                />
                <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer 
                  transition-colors duration-300
                  ${product.status === 'active' ? 'peer-checked:bg-primary-600' : 'peer-checked:bg-gray-300'}
                  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm
                  ${(product.status === 'pending_approval' || product.status === 'suspended') ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-300'}
                `}></div>
              </label>
             ) : (
               <span className="text-xs font-medium text-gray-400">Locked</span>
             )}
          </div>
        </div>
      </div>
    </div>
  );

  const ProductListItem = ({ product }) => (
    <div className="group bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-6">
        {/* Image */}
        <div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 relative">
          <img
            src={product.images && product.images.length > 0 ? product.images[0] : '/api/placeholder/400/400'}
            alt={product.title}
            className="w-full h-full object-contain p-2 mix-blend-multiply"
            onError={(e) => {
              e.target.src = '/api/placeholder/400/400';
            }}
          />
           {product.stock === 0 && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                 <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">No Stock</span>
              </div>
           )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Title & Category - Col Span 5 */}
          <div className="md:col-span-5 min-w-0">
            <h3 className="font-bold text-gray-900 truncate mb-1 text-lg group-hover:text-primary-700 transition-colors">
              {product.title}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600">{product.category}</span>
              <span className="text-gray-300">•</span>
              <span>{product.subcategory}</span>
            </p>
          </div>

          {/* Stats - Col Span 3 */}
          <div className="md:col-span-3 flex md:flex-col gap-4 md:gap-1 text-sm text-gray-600">
             <div className="flex items-center gap-2" title="Price">
               <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
             </div>
             <div className="flex items-center gap-4 text-xs text-gray-500">
               <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5" /> {product.stock}</span>
               <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {product.views}</span>
             </div>
          </div>

          {/* Status & Actions - Col Span 4 */}
          <div className="md:col-span-4 flex items-center justify-end gap-6">
             {/* Toggle */}
             <div className="flex flex-col items-end gap-1">
                {(['active', 'inactive', 'pending_approval'].includes(product.status)) && (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={product.status === 'active'}
                      onChange={() => handleStatusToggle(product.id, product.status)}
                      disabled={product.status === 'pending_approval' || product.status === 'suspended'}
                    />
                    <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer 
                      ${product.status === 'active' ? 'peer-checked:bg-primary-600' : ''} 
                      peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                      ${(product.status === 'pending_approval' || product.status === 'suspended') ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}
                    `}></div>
                  </label>
                )}
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                   product.status === 'active' ? 'text-green-600' : 
                   product.status === 'pending_approval' ? 'text-yellow-600' : 'text-gray-400'
                }`}>
                   {product.status === 'pending_approval' ? 'Pending' : product.status}
                </span>
             </div>

             {/* Action Buttons */}
             <div className="flex items-center gap-2 border-l pl-4 border-gray-100">
                <Link to={`/seller/products/edit/${product.id}`} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                   <Edit className="w-4 h-4" />
                </Link>
                <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4" />
                </button>
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
              className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedFilter === filter.key
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <span>{filter.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedFilter === filter.key
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
              className={`p-2 ${viewMode === 'grid'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
                } transition-colors`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list'
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