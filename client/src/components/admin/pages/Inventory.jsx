import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Filter,
  MoreVertical,
  AlertTriangle,
  History,
  Archive,
  Download,
  Plus,
  RefreshCw,
  Box,
  Truck,
  DollarSign
} from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';
import api from '../../../api/axios';
const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  const filterOptions = [
    { key: 'all', label: 'All Items' },
    { key: 'active', label: 'In Stock' }, // mapped to product_status sometimes or logic
    { key: 'out_of_stock', label: 'Out of Stock' },
    // { key: 'low_stock', label: 'Low Stock' } // Backend doesn't have low_stock filter explicitly yet
  ];

  /* 
   * Note: The backend uses 'product_status' which can be 'active', 'pending', etc.
   * 'out_of_stock' is a special case in getAdminProducts controller where it checks stock_quantity = 0.
   */

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery,
        status: selectedFilter, // 'active', 'out_of_stock' etc.
        category: selectedCategory
      };

      const response = await api.get('/admin/products', { params });
      
      if (response.data.success) {
        setInventory(response.data.products); // Controller returns { products: [], ... } or data: []? Let me check controller.
        // Checking getAdminProducts in productController.js... 
        // It returns data: productsWithImages. 
        // Oh wait, let me double check the response structure in productController.js
        /*
          res.json({
            success: true,
            data: productsWithImages,
             pagination: { ... }
          })
        */
        const products = response.data.data;
        const formattedInventory = products.map(p => ({
            id: p.product_id,
            productName: p.product_title,
            sku: p.product_slug, // Using slug as SKU for now
            category: p.category_name,
            seller: p.seller_first_name ? `${p.seller_first_name} ${p.seller_last_name}` : 'Unknown',
            currentStock: p.stock_quantity,
            reorderLevel: 10, // Mock for now, not in DB
            maxStock: 50, // Mock for now
            unitPrice: parseFloat(p.price),
            totalValue: parseFloat(p.price) * p.stock_quantity,
            lastRestocked: p.updated_at,
            lastSold: null, // Not easily available
            status: p.stock_quantity === 0 ? 'out_of_stock' : (p.product_status || 'active'),
            movement: 'medium', // Mock
            warehouseLocation: p.location_city_name || 'Main Warehouse',
            image: p.images && p.images.length > 0 ? p.images[0].image_url : null
        }));

        setInventory(formattedInventory);
        setPagination(prev => ({
            ...prev,
            total: response.data.pagination.total
        }));
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [pagination.page, searchQuery, selectedFilter, selectedCategory]);

  const handleStockAction = (action, itemId) => {
    console.log(`${action} stock for item:`, itemId);
    // Would implement stock adjustments API here
    alert("Stock adjustment not yet implemented in backend.");
  };

  const getStatusColor = (status, stock) => {
    if (stock === 0) return 'bg-red-100 text-red-700 border-red-200';
    if (stock < 10) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600 mt-1">
              Track stock levels, manage warehouses, and monitor product movement
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
             <button
              onClick={fetchInventory}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Stock</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Box className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            {/* <div className="mt-2 text-sm text-green-600 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+12 this week</span>
            </div> */}
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
             <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                    {/* Calculate total value of displayed items as approximation or need separate API for stats */}
                    LKR {(inventory.reduce((acc, item) => acc + item.totalValue, 0)).toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-gray-900">
                    {inventory.filter(i => i.currentStock < 10 && i.currentStock > 0).length}
                </p>
              </div>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                     {inventory.filter(i => i.currentStock === 0).length}
                </p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <Archive className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search */}
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by product name, SKU, or seller..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Status Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {filterOptions.map(option => (
                  <option key={option.key} value={option.key}>{option.label}</option>
                ))}
              </select>
            </div>

             {/* Category Filter - Mock options for now unless we fetch categories */}
            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home & Garden">Home & Garden</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
             <div className="p-12 text-center">
                 <RefreshCw className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
                 <p className="text-gray-600">Loading inventory...</p>
             </div>
          ) : inventory.length === 0 ? (
             <div className="p-12 text-center">
              <Box className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No inventory items found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filters
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
                          checked={selectedItems.length === inventory.length && inventory.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems(inventory.map(i => i.id));
                            } else {
                              setSelectedItems([]);
                            }
                          }}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Seller
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pricing
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
                    {inventory.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems([...selectedItems, item.id]);
                              } else {
                                setSelectedItems(selectedItems.filter(id => id !== item.id));
                              }
                            }}
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          />
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                              {item.image ? (
                                <img src={item.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                              ) : (
                                <Box className="w-5 h-5 text-gray-500" />
                                )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{item.productName}</div>
                              <div className="text-xs text-gray-500">{item.sku}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{item.category}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-500">
                          {item.seller}
                          <div className="text-xs text-gray-400">{item.warehouseLocation}</div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-gray-900">
                              {item.currentStock} units
                            </div>
                            {/* <div className="text-xs text-gray-500">
                              Reorder at: {item.reorderLevel}
                            </div> */}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-gray-900">
                              LKR {item.unitPrice.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              Total: LKR {item.totalValue.toLocaleString()}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status, item.currentStock)}`}>
                            {item.status === 'out_of_stock' || item.currentStock === 0 ? 'OUT OF STOCK' : 'IN STOCK'}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center space-x-2 justify-end">
                            <button
                              onClick={() => handleStockAction('edit', item.id)}
                              className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                              title="Edit"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

               {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Showing {inventory.length} of {pagination.total} items
                  </p>
                  <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => setPagination(p => ({...p, page: Math.max(1, p.page - 1)}))}
                        disabled={pagination.page <= 1}
                        className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm disabled:opacity-50">
                      Previous
                    </button>
                    <button 
                        onClick={() => setPagination(p => ({...p, page: p.page + 1}))}
                        disabled={inventory.length < pagination.limit} // Approximation since API might not return totalPages for admin
                        className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm disabled:opacity-50">
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

export default Inventory;
