import React, { useState, useEffect } from 'react';
import {
  Check, X, Eye, Search, Filter, Calendar, MapPin, Car, Home,
  AlertCircle, Clock, User, Phone, Star, ChevronLeft, ChevronRight
} from 'lucide-react';

const AdManagement = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'approve' or 'reject'
  const [adminNotes, setAdminNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending_approval');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchPendingAds();
  }, []);

  const fetchPendingAds = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/advertisements/admin/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setAds(data.data);
      }
    } catch (error) {
      console.error('Error fetching pending ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (ad) => {
    setSelectedAd(ad);
    setActionType('approve');
    setAdminNotes('');
    setShowModal(true);
  };

  const handleReject = (ad) => {
    setSelectedAd(ad);
    setActionType('reject');
    setAdminNotes('');
    setShowModal(true);
  };

  const submitAction = async () => {
    if (actionType === 'reject' && !adminNotes.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const endpoint = actionType === 'approve' ? 'approve' : 'reject';

      const response = await fetch(`/api/advertisements/admin/${selectedAd.ad_id}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          admin_notes: adminNotes
        })
      });

      const data = await response.json();
      if (data.success) {
        // Remove the ad from the list
        setAds(ads.filter(ad => ad.ad_id !== selectedAd.ad_id));
        setShowModal(false);
        setSelectedAd(null);
        setAdminNotes('');
      } else {
        alert('Failed to process the action');
      }
    } catch (error) {
      alert('Error processing the action');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || ad.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const renderVehicleDetails = (data) => {
    if (!data) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        {data.make && <div><span className="font-medium">Make:</span> {data.make}</div>}
        {data.model && <div><span className="font-medium">Model:</span> {data.model}</div>}
        {data.year && <div><span className="font-medium">Year:</span> {data.year}</div>}
        {data.mileage && <div><span className="font-medium">Mileage:</span> {data.mileage} km</div>}
        {data.fuelType && <div><span className="font-medium">Fuel:</span> {data.fuelType}</div>}
        {data.transmission && <div><span className="font-medium">Transmission:</span> {data.transmission}</div>}
        {data.condition && <div><span className="font-medium">Condition:</span> {data.condition}</div>}
      </div>
    );
  };

  const renderPropertyDetails = (data) => {
    if (!data) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        {data.propertyType && <div><span className="font-medium">Type:</span> {data.propertyType}</div>}
        {data.bedrooms && <div><span className="font-medium">Bedrooms:</span> {data.bedrooms}</div>}
        {data.bathrooms && <div><span className="font-medium">Bathrooms:</span> {data.bathrooms}</div>}
        {data.floorArea && <div><span className="font-medium">Floor Area:</span> {data.floorArea} sq ft</div>}
        {data.landSize && <div><span className="font-medium">Land Size:</span> {data.landSize} perches</div>}
        {data.condition && <div><span className="font-medium">Condition:</span> {data.condition}</div>}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advertisement Management</h1>
          <p className="text-gray-600">Review and manage pending advertisements</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{ads.length} pending reviews</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search advertisements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="md:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Property">Property</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ads List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading advertisements...</p>
        </div>
      ) : filteredAds.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pending advertisements</h3>
          <p className="text-gray-600">All advertisements have been reviewed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAds.map(ad => (
            <div key={ad.ad_id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Images */}
                <div className="lg:w-64 flex-shrink-0">
                  {ad.images && ad.images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {ad.images.slice(0, 4).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${ad.title} ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      {ad.ad_type === 'vehicle' ? (
                        <Car className="w-8 h-8 text-gray-400" />
                      ) : (
                        <Home className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                  )}
                </div>

                {/* Ad Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{ad.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(ad.created_at).toLocaleDateString()}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{ad.location_city}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span>{ad.contact_number}</span>
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-green-600 mb-3">
                        {formatPrice(ad.price)}
                        {ad.is_negotiable && <span className="text-sm text-gray-500 font-normal ml-2">(Negotiable)</span>}
                      </div>
                    </div>

                    {/* Package Badge */}
                    {ad.package_type !== 'standard' && (
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        ad.package_type === 'urgent' ? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {ad.package_type.toUpperCase()}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-3">{ad.description}</p>

                  {/* Category Specific Details */}
                  {ad.ad_type === 'vehicle' && ad.vehicle_data && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Car className="w-4 h-4 mr-2" />
                        Vehicle Details
                      </h4>
                      {renderVehicleDetails(ad.vehicle_data)}
                    </div>
                  )}

                  {ad.ad_type === 'property' && ad.property_data && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Home className="w-4 h-4 mr-2" />
                        Property Details
                      </h4>
                      {renderPropertyDetails(ad.property_data)}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleApprove(ad)}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => handleReject(ad)}
                      className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => window.open(`/ad/${ad.ad_id}`, '_blank')}
                      className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Full Ad</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Modal */}
      {showModal && selectedAd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {actionType === 'approve' ? 'Approve Advertisement' : 'Reject Advertisement'}
            </h3>

            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">{selectedAd.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">{selectedAd.description}</p>
            </div>

            {actionType === 'reject' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for rejection <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please provide a clear reason for rejection..."
                />
              </div>
            )}

            {actionType === 'approve' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin notes (optional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any additional notes..."
                />
              </div>
            )}

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitAction}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionType === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdManagement;