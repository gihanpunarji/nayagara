import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Filter, Search, MapPin, Eye, Calendar, Car, Home,
  ChevronDown, Grid, List, SlidersHorizontal
} from 'lucide-react';

const AdListings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    city: searchParams.get('city') || '',
    district: searchParams.get('district') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    search: searchParams.get('search') || ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);

  const categories = {
    'Vehicles': ['Cars', 'Motorcycles', 'Three Wheelers', 'Commercial Vehicles', 'Boats'],
    'Property': ['Houses', 'Land', 'Apartments', 'Commercial Property', 'Rooms']
  };

  useEffect(() => {
    fetchDistricts();
    fetchAds();
  }, []);

  useEffect(() => {
    if (filters.district) {
      fetchCities(filters.district);
    } else {
      setCities([]);
    }
  }, [filters.district]);

  const fetchDistricts = async () => {
    try {
      const response = await fetch('/api/address/districts');
      const data = await response.json();
      if (data.success) {
        setDistricts(data.data);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const fetchCities = async (districtId) => {
    try {
      const response = await fetch(`/api/address/cities/${districtId}`);
      const data = await response.json();
      if (data.success) {
        setCities(data.data);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchAds = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(`/api/advertisements?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setAds(data.data);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Update URL params
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set(key, value);
    } else {
      newSearchParams.delete(key);
    }
    setSearchParams(newSearchParams);
  };

  const handleApplyFilters = () => {
    fetchAds();
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      category: '',
      subcategory: '',
      city: '',
      district: '',
      minPrice: '',
      maxPrice: '',
      search: ''
    };
    setFilters(clearedFilters);
    setSearchParams(new URLSearchParams());
    setAds([]);
    fetchAds();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const AdCard = ({ ad }) => (
    <Link to={`/ad/${ad.ad_id}`} className="block">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image */}
        <div className="aspect-video bg-gray-200 relative">
          {ad.images && ad.images.length > 0 ? (
            <img
              src={ad.images[0]}
              alt={ad.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {ad.ad_type === 'vehicle' ? (
                <Car className="w-12 h-12 text-gray-400" />
              ) : (
                <Home className="w-12 h-12 text-gray-400" />
              )}
            </div>
          )}

          {/* Package Badge */}
          {ad.package_type !== 'standard' && (
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-1 text-xs font-bold text-white rounded-full ${
                ad.package_type === 'urgent' ? 'bg-orange-500' : 'bg-purple-500'
              }`}>
                {ad.package_type === 'urgent' ? 'URGENT' : 'FEATURED'}
              </span>
            </div>
          )}

          {/* Views */}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>{ad.views}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{ad.title}</h3>

          <div className="text-xl font-bold text-green-600 mb-2">
            {formatPrice(ad.price)}
            {ad.is_negotiable && <span className="text-sm text-gray-500 font-normal ml-1">(Negotiable)</span>}
          </div>

          <div className="flex items-center text-sm text-gray-500 space-x-3">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{ad.location_city}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(ad.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Category Badge */}
          <div className="mt-3">
            <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {ad.subcategory || ad.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );

  const AdListItem = ({ ad }) => (
    <Link to={`/ad/${ad.ad_id}`} className="block">
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow">
        <div className="flex space-x-4">
          {/* Image */}
          <div className="w-32 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
            {ad.images && ad.images.length > 0 ? (
              <img
                src={ad.images[0]}
                alt={ad.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {ad.ad_type === 'vehicle' ? (
                  <Car className="w-6 h-6 text-gray-400" />
                ) : (
                  <Home className="w-6 h-6 text-gray-400" />
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{ad.title}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{ad.description}</p>

                <div className="flex items-center text-sm text-gray-500 space-x-4 mb-2">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{ad.location_city}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{ad.views} views</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(ad.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {ad.subcategory || ad.category}
                </span>
              </div>

              <div className="text-right">
                <div className="text-xl font-bold text-green-600 mb-2">
                  {formatPrice(ad.price)}
                  {ad.is_negotiable && <div className="text-sm text-gray-500 font-normal">(Negotiable)</div>}
                </div>

                {/* Package Badge */}
                {ad.package_type !== 'standard' && (
                  <span className={`px-2 py-1 text-xs font-bold text-white rounded-full ${
                    ad.package_type === 'urgent' ? 'bg-orange-500' : 'bg-purple-500'
                  }`}>
                    {ad.package_type === 'urgent' ? 'URGENT' : 'FEATURED'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {filters.category ? `${filters.category} Ads` : 'All Advertisements'}
            </h1>
            <p className="text-gray-600">
              {ads.length} {ads.length === 1 ? 'advertisement' : 'advertisements'} found
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search ads..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => {
                    handleFilterChange('category', e.target.value);
                    handleFilterChange('subcategory', ''); // Reset subcategory
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  {Object.keys(categories).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                <select
                  value={filters.subcategory}
                  onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                  disabled={!filters.category}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="">All Subcategories</option>
                  {filters.category && categories[filters.category]?.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                <select
                  value={filters.district}
                  onChange={(e) => {
                    handleFilterChange('district', e.target.value);
                    handleFilterChange('city', ''); // Reset city
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Districts</option>
                  {districts.map(district => (
                    <option key={district.district_id} value={district.district_id}>
                      {district.district_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  disabled={!filters.district}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="">All Cities</option>
                  {cities.map(city => (
                    <option key={city.city_id} value={city.city_name}>
                      {city.city_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Price (Rs.)</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Price (Rs.)</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="No limit"
                  min="0"
                />
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Ads Grid/List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading advertisements...</p>
          </div>
        ) : ads.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No advertisements found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ads.map(ad => (
              <AdCard key={ad.ad_id} ad={ad} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {ads.map(ad => (
              <AdListItem key={ad.ad_id} ad={ad} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdListings;