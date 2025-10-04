import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Edit,
  MoreVertical,
  Archive,
  ShoppingCart,
  Store,
  BarChart3,
  CheckCircle,
  XCircle
} from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  // Mock inventory data
  const mockInventory = [
    {
      id: 1,
      productName: 'iPhone 15 Pro Max 256GB',
      sku: 'TZ-IP15PM-256',
      category: 'Electronics',
      seller: 'TechZone Electronics',
      currentStock: 15,
      reorderLevel: 10,
      maxStock: 50,
      unitPrice: 325000,
      totalValue: 4875000,
      lastRestocked: '2024-01-10',
      lastSold: '2024-01-15',
      status: 'in_stock',
      movement: 'fast',
      warehouseLocation: 'A-12-05'
    },
    {
      id: 2,
      productName: 'Samsung Galaxy S24 Ultra',
      sku: 'TZ-SGS24U-512',
      category: 'Electronics',
      seller: 'TechZone Electronics',
      currentStock: 8,
      reorderLevel: 10,
      maxStock: 40,
      unitPrice: 285000,
      totalValue: 2280000,
      lastRestocked: '2024-01-08',
      lastSold: '2024-01-14',
      status: 'low_stock',
      movement: 'fast',
      warehouseLocation: 'A-12-06'
    },
    {
      id: 3,
      productName: 'Designer Silk Saree',
      sku: 'FH-SILK-001',
      category: 'Fashion',
      seller: 'Fashion Hub',
      currentStock: 25,
      reorderLevel: 15,
      maxStock: 100,
      unitPrice: 15000,
      totalValue: 375000,
      lastRestocked: '2024-01-05',
      lastSold: '2024-01-13',
      status: 'in_stock',
      movement: 'medium',
      warehouseLocation: 'B-08-12'
    },
    {
      id: 4,
      productName: 'Organic Rose Plants Set',
      sku: 'GG-ROSE-SET',
      category: 'Home & Garden',
      seller: 'Green Gardens',
      currentStock: 0,
      reorderLevel: 10,
      maxStock: 50,
      unitPrice: 2500,
      totalValue: 0,
      lastRestocked: '2023-12-20',
      lastSold: '2024-01-08',
      status: 'out_of_stock',
      movement: 'slow',
      warehouseLocation: 'C-15-03'
    },
    {
      id: 5,
      productName: 'Car Engine Oil 5W-30',
      sku: 'APP-EO-5W30',
      category: 'Automotive',
      seller: 'AutoParts Pro',
      currentStock: 150,
      reorderLevel: 50,
      maxStock: 200,
      unitPrice: 3500,
      totalValue: 525000,
      lastRestocked: '2024-01-12',
      lastSold: '2024-01-15',
      status: 'overstocked',
      movement: 'fast',
      warehouseLocation: 'D-03-08'
    },
    {
      id: 6,
      productName: 'Premium Yoga Mat',
      sku: 'SP-YOGA-001',
      category: 'Sports',
      seller: 'Sports World',
      currentStock: 45,
      reorderLevel: 20,
      maxStock: 80,
      unitPrice: 4500,
      totalValue: 202500,
      lastRestocked: '2024-01-09',
      lastSold: '2024-01-14',
      status: 'in_stock',
      movement: 'medium',
      warehouseLocation: 'E-06-15'
    },
    {
      id: 7,
      productName: 'LED Smart TV 55 inch',
      sku: 'TZ-TV-55LED',
      category: 'Electronics',
      seller: 'TechZone Electronics',
      currentStock: 3,
      reorderLevel: 5,
      maxStock: 25,
      unitPrice: 185000,
      totalValue: 555000,
      lastRestocked: '2023-12-28',
      lastSold: '2024-01-12',
      status: 'critical',
      movement: 'medium',
      warehouseLocation: 'A-15-02'
    },
    {
      id: 8,
      productName: 'Vintage Book Collection',
      sku: 'BK-VINT-SET',
      category: 'Books',
      seller: 'Book Haven',
      currentStock: 8,
      reorderLevel: 5,
      maxStock: 20,
      unitPrice: 12000,
      totalValue: 96000,
      lastRestocked: '2023-11-15',
      lastSold: '2023-12-10',
      status: 'in_stock',
      movement: 'slow',
      warehouseLocation: 'F-02-20'
    }
  ];

  const categories = [
    'all', 'Electronics', 'Fashion', 'Home & Garden', 'Automotive',
    'Sports', 'Books', 'Health & Beauty'
  ];

  const filterOptions = [
    { key: 'all', label: 'All Items', count: 0, color: 'gray' },
    { key: 'in_stock', label: 'In Stock', count: 0, color: 'green' },
    { key: 'low_stock', label: 'Low Stock', count: 0, color: 'yellow' },
    { key: 'critical', label: 'Critical', count: 0, color: 'orange' },
    { key: 'out_of_stock', label: 'Out of Stock', count: 0, color: 'red' },
    { key: 'overstocked', label: 'Overstocked', count: 0, color: 'purple' }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setInventory(mockInventory);

      // Update filter counts
      filterOptions.forEach(filter => {
        if (filter.key === 'all') {
          filter.count = mockInventory.length;
        } else {
          filter.count = mockInventory.filter(item => item.status === filter.key).length;
        }
      });

      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...inventory];

    // Apply status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(item => item.status === selectedFilter);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.warehouseLocation.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by stock level (critical first)
    filtered.sort((a, b) => {
      const statusPriority = { critical: 1, out_of_stock: 2, low_stock: 3, in_stock: 4, overstocked: 5 };
      return (statusPriority[a.status] || 6) - (statusPriority[b.status] || 6);
    });

    setFilteredInventory(filtered);
  }, [inventory, selectedFilter, selectedCategory, searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-700 border-green-200';
      case 'low_stock': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'critical': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'out_of_stock': return 'bg-red-100 text-red-700 border-red-200';
      case 'overstocked': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getMovementColor = (movement) => {
    switch (movement) {
      case 'fast': return 'text-green-600';
      case 'medium': return 'text-blue-600';
      case 'slow': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getStockPercentage = (current, max) => {
    return (current / max) * 100;
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

  const handleInventoryAction = (action, itemId) => {
    console.log(`${action} item:`, itemId);
    // Handle inventory actions here
  };

  const handleBulkAction = (action) => {
    console.log(`${action} items:`, selectedItems);
    // Handle bulk actions here
  };

  const InventoryRow = ({ item }) => {
    const stockPercentage = getStockPercentage(item.currentStock, item.maxStock);

    return (
      <tr className="hover:bg-gray-50 transition-colors">
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
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
        </td>

        <td className="px-6 py-4">
          <div className="space-y-1">
            <div className="font-medium text-gray-900">{item.productName}</div>
            <div className="text-sm text-gray-500">SKU: {item.sku}</div>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <Store className="w-3 h-3" />
              <span>{item.seller}</span>
            </div>
          </div>
        </td>

        <td className="px-6 py-4 text-sm">
          <div className="space-y-1">
            <div className="font-medium text-gray-900">{item.category}</div>
            <div className="text-gray-500 text-xs">Location: {item.warehouseLocation}</div>
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-lg font-bold ${
                item.currentStock === 0 ? 'text-red-600' :
                item.currentStock <= item.reorderLevel ? 'text-orange-600' :
                'text-gray-900'
              }`}>
                {item.currentStock}
              </span>
              <span className="text-xs text-gray-500">/ {item.maxStock}</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  stockPercentage === 0 ? 'bg-red-500' :
                  stockPercentage <= 30 ? 'bg-orange-500' :
                  stockPercentage >= 90 ? 'bg-purple-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(stockPercentage, 100)}%` }}
              ></div>
            </div>

            <div className="text-xs text-gray-500">
              Reorder at: {item.reorderLevel}
            </div>
          </div>
        </td>

        <td className="px-6 py-4 text-sm">
          <div className={`flex items-center space-x-1 font-medium ${getMovementColor(item.movement)}`}>
            {item.movement === 'fast' && <TrendingUp className="w-4 h-4" />}
            {item.movement === 'medium' && <BarChart3 className="w-4 h-4" />}
            {item.movement === 'slow' && <TrendingDown className="w-4 h-4" />}
            <span className="capitalize">{item.movement}</span>
          </div>
        </td>

        <td className="px-6 py-4 text-sm">
          <div className="space-y-1">
            <div className="font-medium text-gray-900">{formatPrice(item.unitPrice)}</div>
            <div className="text-green-600 font-semibold">{formatPrice(item.totalValue)}</div>
            <div className="text-xs text-gray-500">Total Value</div>
          </div>
        </td>

        <td className="px-6 py-4 text-sm text-gray-500">
          <div className="space-y-1">
            <div>Restocked: {formatDate(item.lastRestocked)}</div>
            <div className="text-xs">Last sold: {formatDate(item.lastSold)}</div>
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="space-y-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
              {item.status.replace('_', ' ').toUpperCase()}
            </span>

            {item.status === 'low_stock' && (
              <div className="flex items-center space-x-1 text-yellow-600 text-xs">
                <AlertTriangle className="w-3 h-3" />
                <span>Needs restock</span>
              </div>
            )}

            {item.status === 'critical' && (
              <div className="flex items-center space-x-1 text-orange-600 text-xs">
                <AlertTriangle className="w-3 h-3" />
                <span>Urgent!</span>
              </div>
            )}
          </div>
        </td>

        <td className="px-6 py-4 text-right">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleInventoryAction('view', item.id)}
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
                    onClick={() => handleInventoryAction('adjust', item.id)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Adjust Stock</span>
                  </button>

                  <button
                    onClick={() => handleInventoryAction('restock', item.id)}
                    className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center space-x-2"
                  >
                    <Package className="w-4 h-4" />
                    <span>Restock Item</span>
                  </button>

                  <button
                    onClick={() => handleInventoryAction('order_history', item.id)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>View Order History</span>
                  </button>

                  <button
                    onClick={() => handleInventoryAction('movement_report', item.id)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Movement Report</span>
                  </button>

                  <button
                    onClick={() => handleInventoryAction('archive', item.id)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Archive className="w-4 h-4" />
                    <span>Archive Item</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    );
  };

  const stats = {
    totalItems: inventory.length,
    inStock: inventory.filter(i => i.status === 'in_stock').length,
    lowStock: inventory.filter(i => i.status === 'low_stock').length,
    critical: inventory.filter(i => i.status === 'critical').length,
    outOfStock: inventory.filter(i => i.status === 'out_of_stock').length,
    overstocked: inventory.filter(i => i.status === 'overstocked').length,
    totalValue: inventory.reduce((sum, i) => sum + i.totalValue, 0)
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
            <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600 mt-1">
              Monitor stock levels, track movements, and manage reorders
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
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalItems}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">In Stock</p>
              <p className="text-xl font-bold text-green-600">{stats.inStock}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-xl font-bold text-yellow-600">{stats.lowStock}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Critical</p>
              <p className="text-xl font-bold text-orange-600">{stats.critical}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-xl font-bold text-red-600">{stats.outOfStock}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Overstocked</p>
              <p className="text-xl font-bold text-purple-600">{stats.overstocked}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-lg font-bold text-green-600">{formatPrice(stats.totalValue)}</p>
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
              placeholder="Search by product name, SKU, seller, or warehouse location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="mt-4 flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <span className="text-sm text-red-700">
                {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('restock')}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Bulk Restock
                </button>
                <button
                  onClick={() => handleBulkAction('adjust')}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Adjust Stock
                </button>
                <button
                  onClick={() => handleBulkAction('export')}
                  className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                >
                  Export Selected
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredInventory.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No inventory items found
              </h3>
              <p className="text-gray-600">
                {inventory.length === 0
                  ? "No inventory items available."
                  : "No items match your current filters."}
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
                          checked={selectedItems.length === filteredInventory.length && filteredInventory.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems(filteredInventory.map(i => i.id));
                            } else {
                              setSelectedItems([]);
                            }
                          }}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category & Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Movement
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
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
                    {filteredInventory.map(item => (
                      <InventoryRow key={item.id} item={item} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Showing {filteredInventory.length} of {inventory.length} items
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

export default Inventory;
