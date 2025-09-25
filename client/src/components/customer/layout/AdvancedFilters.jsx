import React, { useState, useEffect, useRef } from 'react';
import { Filter, X, ChevronDown, MapPin, DollarSign, Calendar, Cpu, Car, Home, Shirt, Heart, Book, Wrench } from 'lucide-react';

const AdvancedFilters = ({ isOpen, onClose, onFiltersApply, selectedCategory, mainCategories }) => {
  const modalRef = useRef(null);
  const [filters, setFilters] = useState({
    category: 'All Categories',
    district: '',
    priceMin: '',
    priceMax: '',
    // Dynamic filters will be added based on category
  });

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Sri Lankan districts
  const districts = [
    'All Districts', 'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya',
    'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee', 'Kurunegala', 'Puttalam',
    'Anuradhapura', 'Polonnaruwa', 'Badulla', 'Moneragala', 'Ratnapura', 'Kegalle'
  ];

  // Simplified dynamic filter configurations for each category
  const categoryFilters = {
    'Electronics': {
      icon: <Cpu className="w-4 h-4" />,
      filters: [
        { type: 'select', key: 'brand', label: 'Brand', options: ['All', 'Apple', 'Samsung', 'Sony', 'Dell', 'HP'] },
        { type: 'select', key: 'condition', label: 'Condition', options: ['Any', 'New', 'Used'] }
      ]
    },
    'Vehicles': {
      icon: <Car className="w-4 h-4" />,
      filters: [
        { type: 'select', key: 'make', label: 'Make', options: ['All', 'Toyota', 'Honda', 'Nissan', 'Suzuki'] },
        { type: 'select', key: 'fuel', label: 'Fuel', options: ['Any', 'Petrol', 'Diesel', 'Hybrid'] },
        { type: 'input', key: 'yearMin', label: 'Min Year', placeholder: '2010' },
        { type: 'input', key: 'yearMax', label: 'Max Year', placeholder: '2024' }
      ]
    },
    'Fashion': {
      icon: <Shirt className="w-4 h-4" />,
      filters: [
        { type: 'select', key: 'gender', label: 'Gender', options: ['All', 'Men', 'Women', 'Kids'] },
        { type: 'select', key: 'size', label: 'Size', options: ['All', 'XS', 'S', 'M', 'L', 'XL'] },
        { type: 'select', key: 'condition', label: 'Condition', options: ['Any', 'New', 'Like New', 'Used'] }
      ]
    },
    'Home & Living': {
      icon: <Home className="w-4 h-4" />,
      filters: [
        { type: 'select', key: 'type', label: 'Type', options: ['All', 'Furniture', 'Appliances', 'Decor'] },
        { type: 'select', key: 'condition', label: 'Condition', options: ['Any', 'New', 'Used'] }
      ]
    },
    'Beauty & Health': {
      icon: <Heart className="w-4 h-4" />,
      filters: [
        { type: 'select', key: 'type', label: 'Type', options: ['All', 'Skincare', 'Makeup', 'Hair Care'] },
        { type: 'select', key: 'condition', label: 'Condition', options: ['Any', 'New', 'Unopened'] }
      ]
    },
    'Sports': {
      icon: <Car className="w-4 h-4" />,
      filters: [
        { type: 'select', key: 'sport', label: 'Sport', options: ['All', 'Cricket', 'Football', 'Tennis'] },
        { type: 'select', key: 'condition', label: 'Condition', options: ['Any', 'New', 'Used'] }
      ]
    },
    'Books & Media': {
      icon: <Book className="w-4 h-4" />,
      filters: [
        { type: 'select', key: 'type', label: 'Type', options: ['All', 'Books', 'DVDs', 'Games'] },
        { type: 'select', key: 'condition', label: 'Condition', options: ['Any', 'New', 'Used'] }
      ]
    },
    'Services': {
      icon: <Wrench className="w-4 h-4" />,
      filters: [
        { type: 'select', key: 'type', label: 'Type', options: ['All', 'Home', 'Professional', 'Education'] },
        { type: 'select', key: 'availability', label: 'Availability', options: ['Any', 'Weekdays', 'Weekends', '24/7'] }
      ]
    }
  };

  // Get current category filters
  const getCurrentCategoryFilters = () => {
    const categoryName = filters.category === 'All Categories' ? 'Electronics' : filters.category;
    return categoryFilters[categoryName] || categoryFilters['Electronics'];
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (key, option, checked) => {
    setFilters(prev => {
      const currentValues = prev[key] || [];
      if (checked) {
        return { ...prev, [key]: [...currentValues, option] };
      } else {
        return { ...prev, [key]: currentValues.filter(item => item !== option) };
      }
    });
  };

  // Apply filters
  const handleApplyFilters = () => {
    onFiltersApply(filters);
    onClose();
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilters({
      category: 'All Categories',
      district: '',
      priceMin: '',
      priceMax: ''
    });
  };

  // Update category when selectedCategory prop changes
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'All Categories') {
      setFilters(prev => ({ ...prev, category: selectedCategory }));
    }
  }, [selectedCategory]);

  if (!isOpen) return null;

  const currentFilters = getCurrentCategoryFilters();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-[200] flex justify-center items-start pt-16">
      <div ref={modalRef} className="bg-white w-full max-w-5xl mx-4 rounded-lg shadow-xl">
        {/* Compact Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Compact Filters Content */}
        <div className="p-6">
          {/* Row 1: Common Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Category</label>
              <select
                className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option>All Categories</option>
                {mainCategories.map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">District</label>
              <select
                className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={filters.district}
                onChange={(e) => handleFilterChange('district', e.target.value)}
              >
                {districts.slice(0, 10).map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Min Price</label>
              <input
                type="number"
                placeholder="Min"
                className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={filters.priceMin}
                onChange={(e) => handleFilterChange('priceMin', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Max Price</label>
              <input
                type="number"
                placeholder="Max"
                className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={filters.priceMax}
                onChange={(e) => handleFilterChange('priceMax', e.target.value)}
              />
            </div>
          </div>

          {/* Row 2: Category Specific Filters */}
          {currentFilters.filters.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-2 mb-4">
                {currentFilters.icon}
                <h4 className="text-sm font-medium text-gray-700">{filters.category} Filters</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {currentFilters.filters.map(filter => (
                  <div key={filter.key}>
                    <label className="block text-sm text-gray-600 mb-1">{filter.label}</label>

                    {filter.type === 'select' && (
                      <select
                        className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        value={filters[filter.key] || ''}
                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      >
                        {filter.options.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}

                    {filter.type === 'input' && (
                      <input
                        type="number"
                        placeholder={filter.placeholder}
                        className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        value={filters[filter.key] || ''}
                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Compact Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            Clear All
          </button>
          <div className="space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm font-medium"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;