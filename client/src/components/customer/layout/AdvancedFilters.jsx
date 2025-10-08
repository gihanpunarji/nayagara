import React, { useState, useEffect, useRef } from 'react';
import { Filter, X, ChevronDown, MapPin, DollarSign, Calendar, Cpu, Car, Home, Shirt, Heart, Book, Wrench } from 'lucide-react';
import api from '../../../api/axios';

const AdvancedFilters = ({ isOpen, onClose, onFiltersApply, selectedCategory, mainCategories }) => {
  const modalRef = useRef(null);
  
  const [filters, setFilters] = useState({
    category: 'All Categories',
    district: '',
    priceMin: '',
    priceMax: '',
    // Dynamic filters will be added based on category
  });

  const [districts, setDistricts] = useState([]);

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

  useEffect(() => {
    async function fetchDistricts() {
      const res = await api.get('/address/fetchData');
        const districts = res.data.data.map(district => district.district_name);
        setDistricts(districts);
      }
    fetchDistricts();
  }, [])


  // Dynamic filter configurations for categories
  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('electronics')) return <Cpu className="w-4 h-4" />;
    if (name.includes('vehicles') || name.includes('automotive')) return <Car className="w-4 h-4" />;
    if (name.includes('fashion') || name.includes('clothing')) return <Shirt className="w-4 h-4" />;
    if (name.includes('home') || name.includes('furniture')) return <Home className="w-4 h-4" />;
    if (name.includes('beauty') || name.includes('health')) return <Heart className="w-4 h-4" />;
    if (name.includes('sports')) return <Car className="w-4 h-4" />;
    if (name.includes('books') || name.includes('media')) return <Book className="w-4 h-4" />;
    if (name.includes('services')) return <Wrench className="w-4 h-4" />;
    return <Cpu className="w-4 h-4" />;
  };

  const categoryFilters = {
    'Electronics': {
      icon: <Cpu className="w-4 h-4" />,
      filters: [
        { type: 'select', key: 'brand', label: 'Brand', options: ['All', 'Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'LG', 'Xiaomi'] },
        { type: 'select', key: 'condition', label: 'Condition', options: ['Any', 'New', 'Used', 'Refurbished'] }
      ]
    },
    'Automotive': {
      icon: <Car className="w-4 h-4" />,
      filters: [
        { type: 'select', key: 'make', label: 'Make', options: ['All', 'Toyota', 'Honda', 'Nissan', 'Suzuki', 'BMW', 'Mercedes', 'Audi'] },
        { type: 'select', key: 'fuel', label: 'Fuel Type', options: ['Any', 'Petrol', 'Diesel', 'Hybrid', 'Electric'] },
        { type: 'input', key: 'yearMin', label: 'Min Year', placeholder: '2010' },
        { type: 'input', key: 'yearMax', label: 'Max Year', placeholder: '2024' }
      ]
    },
    'Fashion': {
      icon: <Shirt className="w-4 h-4" />,
      filters: [
        { type: 'select', key: 'gender', label: 'Gender', options: ['All', 'Men', 'Women', 'Kids', 'Unisex'] },
        { type: 'select', key: 'size', label: 'Size', options: ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL'] },
        { type: 'select', key: 'condition', label: 'Condition', options: ['Any', 'New', 'Like New', 'Used'] }
      ]
    },
    'Furniture': {
      icon: <Home className="w-4 h-4" />,
      filters: [
        { type: 'select', key: 'type', label: 'Type', options: ['All', 'Living Room', 'Bedroom', 'Kitchen', 'Office', 'Outdoor'] },
        { type: 'select', key: 'material', label: 'Material', options: ['Any', 'Wood', 'Metal', 'Plastic', 'Glass'] },
        { type: 'select', key: 'condition', label: 'Condition', options: ['Any', 'New', 'Used', 'Refurbished'] }
      ]
    },
    'Beauty': {
      icon: <Heart className="w-4 h-4" />,
      filters: [
        { type: 'select', key: 'type', label: 'Type', options: ['All', 'Skincare', 'Makeup', 'Hair Care', 'Fragrance'] },
        { type: 'select', key: 'condition', label: 'Condition', options: ['Any', 'New', 'Unopened', 'Lightly Used'] }
      ]
    },
    'Sports': {
      icon: <Car className="w-4 h-4" />,
      filters: [
        { type: 'select', key: 'sport', label: 'Sport', options: ['All', 'Cricket', 'Football', 'Tennis', 'Swimming', 'Gym'] },
        { type: 'select', key: 'condition', label: 'Condition', options: ['Any', 'New', 'Used', 'Like New'] }
      ]
    },
    'Books': {
      icon: <Book className="w-4 h-4" />,
      filters: [
        { type: 'select', key: 'type', label: 'Type', options: ['All', 'Fiction', 'Non-Fiction', 'Educational', 'Children'] },
        { type: 'select', key: 'condition', label: 'Condition', options: ['Any', 'New', 'Used', 'Like New'] }
      ]
    }
  };

  // Get current category filters
  const getCurrentCategoryFilters = () => {
    const categoryName = filters.category === 'All Categories' ? 'Electronics' : filters.category;
    
    // Try exact match first
    if (categoryFilters[categoryName]) {
      return categoryFilters[categoryName];
    }
    
    // Try partial matches
    for (const [key, config] of Object.entries(categoryFilters)) {
      if (categoryName.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(categoryName.toLowerCase())) {
        return config;
      }
    }
    
    // Default fallback
    return {
      icon: getCategoryIcon(categoryName),
      filters: [
        { type: 'select', key: 'condition', label: 'Condition', options: ['Any', 'New', 'Used', 'Like New'] }
      ]
    };
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
                <option value="">All Districts</option>
                {districts.map(district => (
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