import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAdminProducts, updateProductStatus, deleteProduct } from '../../../api/admin';
import {
  Package,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Ban,
  Download,
  RefreshCw,
  MoreVertical,
  Star,
  Store,
  Calendar,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Trash2
} from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';
import ProductDetailView from './ProductDetailView';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sellerId = searchParams.get('sellerId');
  const sellerName = searchParams.get('sellerName');

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [viewingProduct, setViewingProduct] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // Stats derived from local data to match client-side logic
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0, // Maps to 'pending_approval'
    suspended: 0,
    featured: 0,
    out_of_stock: 0
  });

  const filterOptions = [
    { key: 'all', label: 'All Products' },
    { key: 'active', label: 'Active' },
    { key: 'pending_approval', label: 'Pending' },
    { key: 'suspended', label: 'Suspended' }
  ];

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // FETCH ALL PRODUCTS ONCE
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getAdminProducts({ 
        page: 1, 
        limit: 2000, // Fetch large batch to simulate "all" for client-side search
        search: '',
        status: 'all',
        category: 'all',
        sellerId: sellerId
      });
      
      if (response.data && Array.isArray(response.data)) {
        setProducts(response.data);
        setFilteredProducts(response.data);
        
        // Extract unique categories from fetched products
        const uniqueCats = ['all', ...new Set(response.data.map(p => p.category_name).filter(Boolean))];
        setCategories(uniqueCats);
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger, sellerId]); // Only refetch if refresh triggered or sellerId changes URL

  // CLIENT-SIDE FILTERING & STATS CALCULATION
  useEffect(() => {
    let result = [...products];

    // Filter by Status
    if (selectedFilter !== 'all') {
      result = result.filter(p => p.product_status === selectedFilter);
    }

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category_name === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        (p.product_title && p.product_title.toLowerCase().includes(query)) ||
        (p.product_description && p.product_description.toLowerCase().includes(query)) ||
        (p.seller_name && p.seller_name.toLowerCase().includes(query)) ||
        (p.sku && p.sku.toLowerCase().includes(query))
      );
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page on filter change

    // Update Stats based on CURRENT FULL LIST (products, not filteredProducts, usually global stats are preferred?)
    // Actually, dashboard stats should reflect the TOTAL state, not filtered state in search.
    // So we use 'products' to calculate stats.
    setStats({
      total: products.length,
      active: products.filter(p => p.product_status === 'active').length,
      pending: products.filter(p => p.product_status === 'pending_approval').length,
      suspended: products.filter(p => p.product_status === 'suspended').length,
      featured: products.filter(p => p.is_featured).length,
      out_of_stock: products.filter(p => p.stock_quantity === 0).length
    });

  }, [products, searchQuery, selectedFilter, selectedCategory]);


  const handleStatusUpdate = async (productId, newStatus) => {
    try {
      await updateProductStatus(productId, newStatus);
      // Optimistic update locally or refetch
      // Optimistic:
      setProducts(prev => prev.map(p => p.product_id === productId ? { ...p, product_status: newStatus } : p));

      // Also refetch to be safe/sync
      // setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Failed to update product status', error);
      alert('Failed to update status');
    }
  };

  const handleDeleteProduct = async (productId, productTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${productTitle}"?\n\nThis action cannot be undone. The product will only be deleted if it has no orders.`)) {
      return;
    }

    try {
      const response = await deleteProduct(productId);

      if (response.success) {
        // Remove from local state
        setProducts(prev => prev.filter(p => p.product_id !== productId));
        alert('Product deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete product', error);
      const errorMessage = error.message || 'Failed to delete product';
      alert(errorMessage);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'suspended': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatPrice = (amount) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return 'N/A';
    return `Rs. ${num.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const ProductRow = ({ product }) => (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <input 
            type="checkbox" 
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            checked={selectedProducts.includes(product.product_id)}
            onChange={(e) => {
                if (e.target.checked) setSelectedProducts([...selectedProducts, product.product_id]);
                else setSelectedProducts(selectedProducts.filter(id => id !== product.product_id));
            }}
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img src={product.images[0].image_url} alt={product.product_title} className="w-full h-full object-cover" />
            ) : (
              <Package className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900 flex items-center space-x-2">
              <span className="truncate max-w-xs">{product.product_title}</span>
              {product.is_featured && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
            </div>
            {/* <div className="text-sm text-gray-500 truncate max-w-xs">{product.product_description}</div> */}
            <div className="text-xs text-gray-400">SKU: {product.sku || 'N/A'}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Store className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-900">{product.seller_name || 'N/A'}</span>
          </div>
          <div className="text-gray-500">{product.category_name}</div>
          <div className="text-gray-400 text-xs">{product.sub_category_name}</div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm">
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{formatPrice(product.price)}</div>
          {product.market_price && product.market_price !== product.price && (
            <div className="text-gray-500 line-through text-xs">{formatPrice(product.market_price)}</div>
          )}
          <div className={`text-xs ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
            Stock: {product.stock_quantity}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="font-medium">{product.rating || 0}</span>
            <span className="text-gray-500">({product.review_count || 0})</span>
          </div>
          <div className="text-gray-600">{product.inquiry_count || 0} sold</div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        <div className="space-y-1">
          <div>Cr: {formatDate(product.created_at)}</div>
          <div className="text-xs">Up: {formatDate(product.updated_at)}</div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="space-y-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(product.product_status)}`}>
            {product.product_status?.replace('_', ' ').toUpperCase() || 'N/A'}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center space-x-2">
          <button title="View Details" onClick={() => setViewingProduct(product)} className="text-gray-600 hover:text-green-600"><Eye className="w-4 h-4" /></button>
          <div className="relative group">
            <button className="text-gray-600 hover:text-green-600"><MoreVertical className="w-4 h-4" /></button>
            <div className="absolute right-0 w-56 bg-white rounded-md shadow-lg border border-gray-200 invisible group-hover:visible z-10 py-1 text-left">
              {product.product_status === 'pending_approval' && (
                <button 
                  onClick={() => handleStatusUpdate(product.product_id, 'active')}
                  className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" /><span>Approve</span>
                </button>
              )}
              {product.product_status === 'active' && (
                <button
                  onClick={() => handleStatusUpdate(product.product_id, 'inactive')}
                  className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Ban className="w-4 h-4" /><span>Deactivate</span>
                </button>
              )}
               {(product.product_status === 'inactive' || product.product_status === 'suspended') && (
                <button
                  onClick={() => handleStatusUpdate(product.product_id, 'active')}
                  className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" /><span>Re-activate</span>
                </button>
              )}
              <button
                onClick={() => handleDeleteProduct(product.product_id, product.product_title)}
                className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center space-x-2 border-t border-gray-100"
              >
                <Trash2 className="w-4 h-4" /><span>Delete Product</span>
              </button>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );

  if (loading && products.length === 0) {
    return <AdminLayout><div className="flex items-center justify-center h-64"><RefreshCw className="w-8 h-8 animate-spin text-green-600" /></div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600 mt-1">Manage all products, approvals, and inventory across the platform</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
             <button onClick={() => setRefreshTrigger(prev => prev + 1)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"><RefreshCw className="w-4 h-4" /><span>Refresh</span></button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center"><p className="text-sm text-gray-600">Total</p><p className="text-xl font-bold text-gray-900">{stats.total}</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center"><p className="text-sm text-gray-600">Active</p><p className="text-xl font-bold text-green-600">{stats.active}</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center"><p className="text-sm text-gray-600">Pending</p><p className="text-xl font-bold text-yellow-600">{stats.pending}</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center"><p className="text-sm text-gray-600">Suspended</p><p className="text-xl font-bold text-red-600">{stats.suspended}</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center"><p className="text-sm text-gray-600">Featured</p><p className="text-xl font-bold text-purple-600">{stats.featured}</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center"><p className="text-sm text-gray-600">Out of Stock</p><p className="text-xl font-bold text-red-500">{stats.out_of_stock}</p></div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-wrap gap-2 mb-4">
            {filterOptions.map((filter) => {
                 let count = 0;
                 if (filter.key === 'all') count = stats.total;
                 else if (filter.key === 'pending_approval') count = stats.pending;
                 else count = stats[filter.key] || 0;
                 
                 return (
                  <button key={filter.key} onClick={() => setSelectedFilter(filter.key)} className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedFilter === filter.key ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    <span>{filter.label}</span><span className={`text-xs px-2 py-0.5 rounded-full ${selectedFilter === filter.key ? 'bg-white bg-opacity-20 text-white' : 'bg-gray-200 text-gray-600'}`}>{count}</span>
                  </button>
                 );
            })}
          </div>
          
          {sellerId && (
            <div className="mb-4">
              <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm border border-green-200">
                <span className="font-medium">Seller: {sellerName || 'ID: ' + sellerId}</span>
                <button 
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('sellerId');
                    newParams.delete('sellerName');
                    setSearchParams(newParams);
                  }}
                  className="hover:text-green-900 focus:outline-none"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <div className="relative">
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="appearance-none px-4 py-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white">
                {categories.map(category => <option key={category} value={category}>{category === 'all' ? 'All Categories' : category}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
            
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Search products by title, SKU, seller..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">No products match your current filters.</p>
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
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                            onChange={(e) => {
                                if (e.target.checked) setSelectedProducts(filteredProducts.map(p => p.product_id));
                                else setSelectedProducts([]);
                            }}
                         />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller & Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price & Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(product => <ProductRow key={product.product_id} product={product} />)}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredProducts.length)}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> of <span className="font-medium">{filteredProducts.length}</span> results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(5, Math.ceil(filteredProducts.length / itemsPerPage)) }, (_, i) => {
                    // Logic to show a sliding window of page numbers or just first 5 for simplicity?
                    // Let's implement a simple sliding window or just simple pagination
                    // For better UX, let's just show current page and total pages if plain, or use a simpler prev/next with numbers logic.
                    // Let's do a simple one: Prev [Current] Next. 
                    // Or if we want numbers:
                    let startPage = Math.max(1, currentPage - 2);
                    let endPage = Math.min(Math.ceil(filteredProducts.length / itemsPerPage), startPage + 4);
                    if (endPage - startPage < 4) {
                      startPage = Math.max(1, endPage - 4);
                    }
                    
                    const pageNum = startPage + i;
                    if (pageNum > Math.ceil(filteredProducts.length / itemsPerPage)) return null;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 border rounded-md text-sm font-medium ${
                          currentPage === pageNum
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredProducts.length / itemsPerPage)))}
                    disabled={currentPage >= Math.ceil(filteredProducts.length / itemsPerPage)}
                    className="p-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {viewingProduct && (
        <ProductDetailView 
          productId={viewingProduct.product_id} 
          initialData={viewingProduct} 
          onClose={() => setViewingProduct(null)} 
        />
      )}
    </AdminLayout>
  );
};

export default Products;