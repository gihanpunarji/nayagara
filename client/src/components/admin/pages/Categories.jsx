import React, { useState, useEffect } from 'react';
import {
  Folder,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronRight,
  Grid,
  RefreshCw,
  Download,
  MoreVertical,
  Package,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon
} from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Mock category data
  const mockCategories = [
    {
      id: 1,
      name: 'Electronics',
      description: 'Electronic devices, gadgets, and accessories',
      parentCategory: null,
      subCategories: ['Mobile Phones', 'Laptops', 'Cameras', 'Audio'],
      totalProducts: 12500,
      activeProducts: 11200,
      totalSales: 4200000,
      icon: '📱',
      status: 'active',
      featured: true,
      createdDate: '2023-01-15',
      lastUpdated: '2024-01-10'
    },
    {
      id: 2,
      name: 'Fashion',
      description: 'Clothing, accessories, and footwear',
      parentCategory: null,
      subCategories: ['Men\'s Wear', 'Women\'s Wear', 'Kids', 'Accessories'],
      totalProducts: 8900,
      activeProducts: 8100,
      totalSales: 2800000,
      icon: '👗',
      status: 'active',
      featured: true,
      createdDate: '2023-01-15',
      lastUpdated: '2024-01-12'
    },
    {
      id: 3,
      name: 'Home & Garden',
      description: 'Home decor, furniture, and garden supplies',
      parentCategory: null,
      subCategories: ['Furniture', 'Decor', 'Kitchen', 'Garden'],
      totalProducts: 6700,
      activeProducts: 6200,
      totalSales: 1900000,
      icon: '🏡',
      status: 'active',
      featured: false,
      createdDate: '2023-02-20',
      lastUpdated: '2024-01-08'
    },
    {
      id: 4,
      name: 'Automotive',
      description: 'Car parts, accessories, and maintenance',
      parentCategory: null,
      subCategories: ['Parts', 'Accessories', 'Tools', 'Oils'],
      totalProducts: 5400,
      activeProducts: 5100,
      totalSales: 1500000,
      icon: '🚗',
      status: 'active',
      featured: false,
      createdDate: '2023-03-10',
      lastUpdated: '2024-01-11'
    },
    {
      id: 5,
      name: 'Books',
      description: 'Books, magazines, and educational materials',
      parentCategory: null,
      subCategories: ['Fiction', 'Non-fiction', 'Academic', 'Children'],
      totalProducts: 3200,
      activeProducts: 3000,
      totalSales: 1000000,
      icon: '📚',
      status: 'active',
      featured: false,
      createdDate: '2023-04-05',
      lastUpdated: '2024-01-09'
    },
    {
      id: 6,
      name: 'Health & Beauty',
      description: 'Healthcare, beauty, and personal care products',
      parentCategory: null,
      subCategories: ['Skincare', 'Makeup', 'Healthcare', 'Fragrance'],
      totalProducts: 4500,
      activeProducts: 4200,
      totalSales: 1200000,
      icon: '💄',
      status: 'active',
      featured: false,
      createdDate: '2023-05-15',
      lastUpdated: '2024-01-13'
    },
    {
      id: 7,
      name: 'Sports & Outdoors',
      description: 'Sports equipment and outdoor gear',
      parentCategory: null,
      subCategories: ['Fitness', 'Outdoor', 'Team Sports', 'Cycling'],
      totalProducts: 2800,
      activeProducts: 2500,
      totalSales: 850000,
      icon: '⚽',
      status: 'inactive',
      featured: false,
      createdDate: '2023-06-20',
      lastUpdated: '2023-12-15'
    },
    {
      id: 8,
      name: 'Mobile Phones',
      description: 'Smartphones and mobile accessories',
      parentCategory: 'Electronics',
      subCategories: [],
      totalProducts: 3500,
      activeProducts: 3200,
      totalSales: 1800000,
      icon: '📱',
      status: 'active',
      featured: false,
      createdDate: '2023-01-15',
      lastUpdated: '2024-01-10'
    }
  ];

  const filterOptions = [
    { key: 'all', label: 'All Categories', count: 0, color: 'gray' },
    { key: 'active', label: 'Active', count: 0, color: 'green' },
    { key: 'inactive', label: 'Inactive', count: 0, color: 'red' },
    { key: 'parent', label: 'Parent Categories', count: 0, color: 'blue' },
    { key: 'subcategory', label: 'Subcategories', count: 0, color: 'purple' },
    { key: 'featured', label: 'Featured', count: 0, color: 'orange' }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setCategories(mockCategories);

      // Update filter counts
      filterOptions.forEach(filter => {
        if (filter.key === 'all') {
          filter.count = mockCategories.length;
        } else if (filter.key === 'parent') {
          filter.count = mockCategories.filter(cat => cat.parentCategory === null).length;
        } else if (filter.key === 'subcategory') {
          filter.count = mockCategories.filter(cat => cat.parentCategory !== null).length;
        } else if (filter.key === 'featured') {
          filter.count = mockCategories.filter(cat => cat.featured).length;
        } else {
          filter.count = mockCategories.filter(cat => cat.status === filter.key).length;
        }
      });

      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...categories];

    // Apply status filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'parent') {
        filtered = filtered.filter(cat => cat.parentCategory === null);
      } else if (selectedFilter === 'subcategory') {
        filtered = filtered.filter(cat => cat.parentCategory !== null);
      } else if (selectedFilter === 'featured') {
        filtered = filtered.filter(cat => cat.featured);
      } else {
        filtered = filtered.filter(cat => cat.status === selectedFilter);
      }
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.parentCategory?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by total products (highest first)
    filtered.sort((a, b) => b.totalProducts - a.totalProducts);

    setFilteredCategories(filtered);
  }, [categories, selectedFilter, searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive': return 'bg-red-100 text-red-700 border-red-200';
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

  const handleCategoryAction = (action, categoryId) => {
    console.log(`${action} category:`, categoryId);
    // Handle category actions here
  };

  const handleBulkAction = (action) => {
    console.log(`${action} categories:`, selectedCategories);
    // Handle bulk actions here
  };

  const CategoryRow = ({ category }) => (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={selectedCategories.includes(category.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedCategories([...selectedCategories, category.id]);
            } else {
              setSelectedCategories(selectedCategories.filter(id => id !== category.id));
            }
          }}
          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
        />
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center text-2xl">
            {category.icon}
          </div>
          <div>
            <div className="font-medium text-gray-900 flex items-center space-x-2">
              <span>{category.name}</span>
              {category.featured && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                  Featured
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">{category.description}</div>
            {category.parentCategory && (
              <div className="flex items-center space-x-1 text-xs text-gray-400 mt-1">
                <span>Parent:</span>
                <span className="font-medium">{category.parentCategory}</span>
              </div>
            )}
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-sm">
        <div className="space-y-1">
          <div className="font-medium text-gray-900">
            {category.subCategories.length} subcategories
          </div>
          {category.subCategories.length > 0 && (
            <div className="text-gray-500 text-xs">
              {category.subCategories.slice(0, 2).join(', ')}
              {category.subCategories.length > 2 && ` +${category.subCategories.length - 2} more`}
            </div>
          )}
        </div>
      </td>

      <td className="px-6 py-4 text-sm">
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{category.totalProducts.toLocaleString()} total</div>
          <div className="text-green-600 text-xs">{category.activeProducts.toLocaleString()} active</div>
          <div className="text-gray-500 text-xs">
            {((category.activeProducts / category.totalProducts) * 100).toFixed(1)}% active rate
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-sm">
        <div className="space-y-1">
          <div className="font-semibold text-gray-900">{formatPrice(category.totalSales)}</div>
          <div className="text-xs text-gray-500">Total Sales</div>
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-gray-500">
        <div className="space-y-1">
          <div>Created: {formatDate(category.createdDate)}</div>
          <div className="text-xs">Updated: {formatDate(category.lastUpdated)}</div>
        </div>
      </td>

      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(category.status)}`}>
          {category.status.toUpperCase()}
        </span>
      </td>

      <td className="px-6 py-4 text-right">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleCategoryAction('view', category.id)}
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
                  onClick={() => handleCategoryAction('edit', category.id)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Category</span>
                </button>

                <button
                  onClick={() => handleCategoryAction('add_subcategory', category.id)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Subcategory</span>
                </button>

                {category.status === 'active' ? (
                  <button
                    onClick={() => handleCategoryAction('deactivate', category.id)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>Deactivate</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleCategoryAction('activate', category.id)}
                    className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Activate</span>
                  </button>
                )}

                <button
                  onClick={() => handleCategoryAction(category.featured ? 'unfeature' : 'feature', category.id)}
                  className="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 flex items-center space-x-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>{category.featured ? 'Remove from Featured' : 'Add to Featured'}</span>
                </button>

                <button
                  onClick={() => handleCategoryAction('delete', category.id)}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Category</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );

  const stats = {
    totalCategories: categories.length,
    activeCategories: categories.filter(c => c.status === 'active').length,
    parentCategories: categories.filter(c => c.parentCategory === null).length,
    subCategories: categories.filter(c => c.parentCategory !== null).length,
    featuredCategories: categories.filter(c => c.featured).length,
    totalProducts: categories.reduce((sum, c) => sum + c.totalProducts, 0),
    totalSales: categories.reduce((sum, c) => sum + c.totalSales, 0)
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
            <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
            <p className="text-gray-600 mt-1">
              Organize and manage product categories and subcategories
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button
              onClick={() => handleCategoryAction('add', null)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>

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
              <p className="text-xl font-bold text-gray-900">{stats.totalCategories}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-xl font-bold text-green-600">{stats.activeCategories}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Parent</p>
              <p className="text-xl font-bold text-blue-600">{stats.parentCategories}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Subcategories</p>
              <p className="text-xl font-bold text-purple-600">{stats.subCategories}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Featured</p>
              <p className="text-xl font-bold text-orange-600">{stats.featuredCategories}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Products</p>
              <p className="text-lg font-bold text-gray-900">{stats.totalProducts.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-lg font-bold text-green-600">{formatPrice(stats.totalSales)}</p>
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

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search categories by name, description, or parent category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Bulk Actions */}
          {selectedCategories.length > 0 && (
            <div className="mt-4 flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <span className="text-sm text-red-700">
                {selectedCategories.length} categor{selectedCategories.length > 1 ? 'ies' : 'y'} selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Bulk Activate
                </button>
                <button
                  onClick={() => handleBulkAction('feature')}
                  className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition-colors"
                >
                  Add to Featured
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredCategories.length === 0 ? (
            <div className="p-12 text-center">
              <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No categories found
              </h3>
              <p className="text-gray-600">
                {categories.length === 0
                  ? "No categories have been created yet."
                  : "No categories match your current filters."}
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
                          checked={selectedCategories.length === filteredCategories.length && filteredCategories.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategories(filteredCategories.map(c => c.id));
                            } else {
                              setSelectedCategories([]);
                            }
                          }}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subcategories
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Products
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sales
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
                    {filteredCategories.map(category => (
                      <CategoryRow key={category.id} category={category} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Showing {filteredCategories.length} of {categories.length} categories
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

export default Categories;
