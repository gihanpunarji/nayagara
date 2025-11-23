import React, { useState, useEffect } from 'react';
import { getAdminProducts } from '../../../api/admin';
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
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';
import Pagination from '../../ui/Pagination';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [categories, setCategories] = useState(['all']);
  
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filterOptions = [
    { key: 'all', label: 'All Products' },
    { key: 'active', label: 'Active' },
    { key: 'pending_approval', label: 'Pending' },
    { key: 'suspended', label: 'Suspended' },
    { key: 'out_of_stock', label: 'Out of Stock' },
    { key: 'featured', label: 'Featured' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getAdminProducts({ page: currentPage, limit: 25 });
        if (response.data && Array.isArray(response.data)) {
          setProducts(response.data);
          setPagination(response.pagination);

          if (currentPage === 1) {
            const productCategories = [...new Set(response.data.map(p => p.category_name).filter(Boolean))];
            setCategories(['all', ...productCategories]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage]);

  useEffect(() => {
    let filtered = [...products];
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'featured') {
        filtered = filtered.filter(p => p.is_featured);
      } else if (selectedFilter === 'out_of_stock') {
        filtered = filtered.filter(p => p.stock_quantity === 0);
      } else {
        filtered = filtered.filter(p => p.product_status === selectedFilter);
      }
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category_name === selectedCategory);
    }
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        (p.product_title && p.product_title.toLowerCase().includes(lowercasedQuery)) ||
        (p.product_description && p.product_description.toLowerCase().includes(lowercasedQuery)) ||
        (p.seller_name && p.seller_name.toLowerCase().includes(lowercasedQuery))
      );
    }
    setFilteredProducts(filtered);
  }, [products, selectedFilter, selectedCategory, searchQuery]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
        <input type="checkbox" className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            {product.images && product.images.length > 0 ? (
              <img src={product.images[0].image_url} alt={product.product_title} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Package className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900 flex items-center space-x-2">
              <span className="truncate max-w-xs">{product.product_title}</span>
              {product.is_featured && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
            </div>
            <div className="text-sm text-gray-500 truncate max-w-xs">{product.product_description}</div>
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
          <div>Created: {formatDate(product.created_at)}</div>
          <div className="text-xs">Updated: {formatDate(product.updated_at)}</div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="space-y-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(product.product_status)}`}>
            {product.product_status?.replace('_', ' ').toUpperCase() || 'N/A'}
          </span>
          <div className="flex items-center space-x-1">
            {product.is_featured && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">Featured</span>}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center space-x-2">
          <button title="View Details" className="text-gray-600 hover:text-red-600"><Eye className="w-4 h-4" /></button>
          <div className="relative group">
            <button className="text-gray-600 hover:text-red-600"><MoreVertical className="w-4 h-4" /></button>
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 invisible group-hover:visible z-10 py-1">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"><Edit className="w-4 h-4" /><span>Edit Product</span></button>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );

  const stats = {
    total: pagination ? pagination.total : 0,
    active: products.filter(p => p.product_status === 'active').length,
    pending: products.filter(p => p.product_status === 'pending_approval').length,
    suspended: products.filter(p => p.product_status === 'suspended').length,
    featured: products.filter(p => p.is_featured).length,
    out_of_stock: products.filter(p => p.stock_quantity === 0).length,
  };

  if (loading && currentPage === 1) {
    return <AdminLayout><div className="flex items-center justify-center h-64"><RefreshCw className="w-8 h-8 animate-spin text-red-600" /></div></AdminLayout>;
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
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"><Download className="w-4 h-4" /><span>Export</span></button>
            <button onClick={() => setCurrentPage(1)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"><RefreshCw className="w-4 h-4" /><span>Refresh</span></button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center"><p className="text-sm text-gray-600">Total</p><p className="text-xl font-bold text-gray-900">{stats.total}</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center"><p className="text-sm text-gray-600">Active</p><p className="text-xl font-bold text-green-600">{stats.active}</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center"><p className="text-sm text-gray-600">Pending</p><p className="text-xl font-bold text-yellow-600">{stats.pending}</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center"><p className="text-sm text-gray-600">Suspended</p><p className="text-xl font-bold text-red-600">{stats.suspended}</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center"><p className="text-sm text-gray-600">Featured</p><p className="text-xl font-bold text-purple-600">{stats.featured}</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center"><p className="text-sm text-gray-600">Out of Stock</p><p className="text-xl font-bold text-orange-600">{stats.out_of_stock}</p></div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-wrap gap-2 mb-4">
            {filterOptions.map((filter) => (
              <button key={filter.key} onClick={() => setSelectedFilter(filter.key)} className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedFilter === filter.key ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                <span>{filter.label}</span><span className={`text-xs px-2 py-0.5 rounded-full ${selectedFilter === filter.key ? 'bg-white bg-opacity-20 text-white' : 'bg-gray-200 text-gray-600'}`}>{stats[filter.key] || 0}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
              {categories.map(category => <option key={category} value={category}>{category === 'all' ? 'All Categories' : category}</option>)}
            </select>
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Search products by name, description, seller..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">{products.length === 0 ? "No products have been listed yet." : "No products match your current filters."}</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left"><input type="checkbox" className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" /></th>
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
                    {filteredProducts.map(product => <ProductRow key={product.product_id} product={product} />)}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-gray-200">
                <Pagination pagination={pagination} onPageChange={handlePageChange} />
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Products;