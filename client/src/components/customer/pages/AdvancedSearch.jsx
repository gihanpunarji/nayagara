import React, { useState, useEffect } from 'react';
import {
  Search, Filter, MapPin, DollarSign, Calendar, Gauge,
  Car, Home, Smartphone, Package, X, ChevronDown, ChevronUp,
  Sliders, Grid, List, SlidersHorizontal
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdvancedSearch = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(true);
  const [dynamicFilters, setDynamicFilters] = useState({});
  const [viewMode, setViewMode] = useState('grid');

  // Category-specific filter configurations
  const categoryFilters = {
    vehicles: {
      name: 'Vehicles',
      icon: <Car className="w-5 h-5" />,
      filters: {
        brand: {
          type: 'select',
          label: 'Brand',
          options: ['Toyota', 'Honda', 'Nissan', 'Suzuki', 'BMW', 'Mercedes', 'Audi', 'Hyundai', 'KIA']
        },
        model: {
          type: 'select',
          label: 'Model',
          options: ['Prius', 'Civic', 'Corolla', 'Aqua', 'Vezel', 'CRV', 'Benz C180', 'BMW 318i']
        },
        year: {
          type: 'range',
          label: 'Year',
          min: 1990,
          max: 2024
        },
        mileage: {
          type: 'range',
          label: 'Mileage (km)',
          min: 0,
          max: 300000
        },
        fuelType: {
          type: 'checkbox',
          label: 'Fuel Type',
          options: ['Petrol', 'Diesel', 'Hybrid', 'Electric']
        },
        transmission: {
          type: 'radio',
          label: 'Transmission',
          options: ['Manual', 'Automatic', 'CVT']
        },
        condition: {
          type: 'radio',
          label: 'Condition',
          options: ['New', 'Used', 'Reconditioned']
        }
      }
    },
    electronics: {
      name: 'Electronics',
      icon: <Smartphone className="w-5 h-5" />,
      filters: {
        brand: {
          type: 'select',
          label: 'Brand',
          options: ['Apple', 'Samsung', 'Sony', 'LG', 'Xiaomi', 'Huawei', 'OnePlus', 'Google']
        },
        condition: {
          type: 'radio',
          label: 'Condition',
          options: ['New', 'Like New', 'Used', 'Refurbished']
        },
        warranty: {
          type: 'checkbox',
          label: 'Warranty',
          options: ['Local Warranty', 'International Warranty', 'No Warranty']
        },
        storage: {
          type: 'checkbox',
          label: 'Storage',
          options: ['64GB', '128GB', '256GB', '512GB', '1TB']
        }
      }
    },
    property: {
      name: 'Property',
      icon: <Home className="w-5 h-5" />,
      filters: {
        propertyType: {
          type: 'radio',
          label: 'Property Type',
          options: ['House', 'Apartment', 'Land', 'Commercial', 'Warehouse']
        },
        bedrooms: {
          type: 'select',
          label: 'Bedrooms',
          options: ['1', '2', '3', '4', '5+']
        },
        bathrooms: {
          type: 'select',
          label: 'Bathrooms',
          options: ['1', '2', '3', '4+']
        },
        area: {
          type: 'range',
          label: 'Area (sq ft)',
          min: 500,
          max: 10000
        },
        furnished: {
          type: 'radio',
          label: 'Furnished',
          options: ['Furnished', 'Semi-Furnished', 'Unfurnished']
        },
        parking: {
          type: 'checkbox',
          label: 'Parking',
          options: ['Covered Parking', 'Open Parking', 'No Parking']
        }
      }
    },
    jobs: {
      name: 'Jobs',
      icon: <Package className="w-5 h-5" />,
      filters: {
        jobType: {
          type: 'radio',
          label: 'Job Type',
          options: ['Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance']
        },
        experience: {
          type: 'select',
          label: 'Experience',
          options: ['0-1 years', '1-3 years', '3-5 years', '5+ years']
        },
        industry: {
          type: 'select',
          label: 'Industry',
          options: ['IT/Software', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Sales']
        },
        workLocation: {
          type: 'radio',
          label: 'Work Location',
          options: ['On-site', 'Remote', 'Hybrid']
        }
      }
    }
  };

  // Sri Lankan districts
  const districts = [
    'All Districts', 'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Vavuniya', 'Mullaitivu', 'Batticaloa',
    'Ampara', 'Trincomalee', 'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa',
    'Badulla', 'Moneragala', 'Ratnapura', 'Kegalle'
  ];

  const FilterComponent = ({ filterId, filterConfig, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    switch (filterConfig.type) {
      case 'select':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {filterConfig.label}
            </label>
            <select
              value={value || ''}
              onChange={(e) => onChange(filterId, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All {filterConfig.label}</option>
              {filterConfig.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {filterConfig.label}
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name={filterId}
                  value=""
                  checked={!value}
                  onChange={() => onChange(filterId, '')}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm">Any</span>
              </label>
              {filterConfig.options.map(option => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name={filterId}
                    value={option}
                    checked={value === option}
                    onChange={(e) => onChange(filterId, e.target.value)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'checkbox':
        const selectedValues = value || [];
        return (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {filterConfig.label}
            </label>
            <div className="space-y-2">
              {filterConfig.options.map(option => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onChange(filterId, [...selectedValues, option]);
                      } else {
                        onChange(filterId, selectedValues.filter(v => v !== option));
                      }
                    }}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'range':
        const rangeValue = value || { min: filterConfig.min, max: filterConfig.max };
        return (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {filterConfig.label}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={rangeValue.min || ''}
                onChange={(e) => onChange(filterId, { ...rangeValue, min: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={rangeValue.max || ''}
                onChange={(e) => onChange(filterId, { ...rangeValue, max: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleDynamicFilterChange = (filterId, value) => {
    setDynamicFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  const clearFilters = () => {
    setDynamicFilters({});
    setPriceRange({ min: '', max: '' });
    setLocation('all');
    setSearchQuery('');
  };

  const getCurrentCategoryFilters = () => {
    return categoryFilters[selectedCategory] || null;
  };

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Advanced Search</h1>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products, services, jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base sm:text-lg"
              />
            </div>
            <Link
              to={`/shop?q=${encodeURIComponent(searchQuery)}&category=${selectedCategory}&location=${location}&filters=${encodeURIComponent(JSON.stringify(dynamicFilters))}`}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-primary text-white rounded-lg sm:rounded-xl hover:shadow-green transition-all duration-300 flex items-center justify-center space-x-2 font-bold text-sm sm:text-base"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Search</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">

          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 sticky top-4">

              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full flex items-center justify-between p-3 bg-primary-50 rounded-lg"
                >
                  <span className="font-medium text-primary-700">Filters</span>
                  {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              <div className={`${showFilters ? 'block' : 'hidden lg:block'} space-y-6`}>

              {/* Filter Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                  <span>Filters</span>
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Category Selection */}
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900">Category</h3>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'all', name: 'All Categories', icon: <Package className="w-4 h-4" /> },
                    { id: 'vehicles', name: 'Vehicles', icon: <Car className="w-4 h-4" /> },
                    { id: 'electronics', name: 'Electronics', icon: <Smartphone className="w-4 h-4" /> },
                    { id: 'property', name: 'Property', icon: <Home className="w-4 h-4" /> },
                    { id: 'jobs', name: 'Jobs', icon: <Package className="w-4 h-4" /> }
                  ].map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary-50 text-primary-700 border-2 border-primary-200'
                          : 'hover:bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      {category.icon}
                      <span className="text-sm sm:text-base font-medium">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-primary-600" />
                  <span>Location</span>
                </h3>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                >
                  {districts.map(district => (
                    <option key={district} value={district.toLowerCase()}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-primary-600" />
                  <span>Price Range (Rs.)</span>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Dynamic Category-Specific Filters */}
              {getCurrentCategoryFilters() && (
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 flex items-center space-x-2">
                    <SlidersHorizontal className="w-4 h-4 text-primary-600" />
                    <span>{getCurrentCategoryFilters().name} Filters</span>
                  </h3>

                  {Object.entries(getCurrentCategoryFilters().filters).map(([filterId, filterConfig]) => (
                    <FilterComponent
                      key={filterId}
                      filterId={filterId}
                      filterConfig={filterConfig}
                      value={dynamicFilters[filterId]}
                      onChange={handleDynamicFilterChange}
                    />
                  ))}
                </div>
              )}
              </div>
            </div>
          </div>

          {/* Search Results Preview */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
              <div className="text-center py-8 sm:py-12">
                <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Ready to Search!</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">
                  Configure your filters and click the search button to find exactly what you're looking for.
                </p>

                {/* Search Summary */}
                <div className="bg-primary-50 rounded-lg p-3 sm:p-4 text-left max-w-md mx-auto">
                  <h4 className="text-sm sm:text-base font-semibold text-primary-900 mb-2 sm:mb-3">Current Search:</h4>
                  <ul className="space-y-1 text-xs sm:text-sm text-primary-800">
                    <li><strong>Category:</strong> {selectedCategory === 'all' ? 'All Categories' : selectedCategory}</li>
                    <li><strong>Location:</strong> {location === 'all' ? 'All Locations' : location}</li>
                    {priceRange.min && <li><strong>Min Price:</strong> Rs. {priceRange.min}</li>}
                    {priceRange.max && <li><strong>Max Price:</strong> Rs. {priceRange.max}</li>}
                    {Object.entries(dynamicFilters).length > 0 && (
                      <li><strong>Filters:</strong> {Object.entries(dynamicFilters).length} applied</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;