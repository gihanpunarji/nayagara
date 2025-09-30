import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Phone, MapPin, Calendar, Eye, Share2, Flag, ArrowLeft,
  Car, Home, Gauge, Fuel, Users, CheckCircle, AlertTriangle,
  Clock, Star, ChevronLeft, ChevronRight
} from 'lucide-react';

const AdDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    fetchAdDetails();
  }, [id]);

  const fetchAdDetails = async () => {
    try {
      const response = await fetch(`/api/advertisements/${id}`);
      const data = await response.json();

      if (data.success) {
        setAd(data.data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch advertisement details');
    } finally {
      setLoading(false);
    }
  };

  const handleCallNow = () => {
    if (ad?.contact_number) {
      // For mobile devices, this will open the dialer
      window.location.href = `tel:${ad.contact_number}`;
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: ad.title,
          text: ad.description,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const nextImage = () => {
    if (ad?.images?.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === ad.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (ad?.images?.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? ad.images.length - 1 : prev - 1
      );
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderVehicleDetails = () => {
    if (ad.ad_type !== 'vehicle' || !ad.vehicle_data) return null;

    const data = ad.vehicle_data;

    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Car className="w-5 h-5 mr-2" />
          Vehicle Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.make && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Make:</span>
              <span className="font-medium">{data.make}</span>
            </div>
          )}
          {data.model && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Model:</span>
              <span className="font-medium">{data.model}</span>
            </div>
          )}
          {data.year && (
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Year:</span>
              <span className="font-medium">{data.year}</span>
            </div>
          )}
          {data.mileage && (
            <div className="flex items-center space-x-2">
              <Gauge className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Mileage:</span>
              <span className="font-medium">{data.mileage} km</span>
            </div>
          )}
          {data.fuelType && (
            <div className="flex items-center space-x-2">
              <Fuel className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Fuel:</span>
              <span className="font-medium">{data.fuelType}</span>
            </div>
          )}
          {data.transmission && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Transmission:</span>
              <span className="font-medium">{data.transmission}</span>
            </div>
          )}
          {data.engineCapacity && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Engine:</span>
              <span className="font-medium">{data.engineCapacity} cc</span>
            </div>
          )}
          {data.color && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Color:</span>
              <span className="font-medium">{data.color}</span>
            </div>
          )}
          {data.condition && (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-gray-600">Condition:</span>
              <span className="font-medium">{data.condition}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPropertyDetails = () => {
    if (ad.ad_type !== 'property' || !ad.property_data) return null;

    const data = ad.property_data;

    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Home className="w-5 h-5 mr-2" />
          Property Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.propertyType && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium">{data.propertyType}</span>
            </div>
          )}
          {data.bedrooms && (
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Bedrooms:</span>
              <span className="font-medium">{data.bedrooms}</span>
            </div>
          )}
          {data.bathrooms && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Bathrooms:</span>
              <span className="font-medium">{data.bathrooms}</span>
            </div>
          )}
          {data.floorArea && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Floor Area:</span>
              <span className="font-medium">{data.floorArea} sq ft</span>
            </div>
          )}
          {data.landSize && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Land Size:</span>
              <span className="font-medium">{data.landSize} perches</span>
            </div>
          )}
          {data.parking && (
            <div className="flex items-center space-x-2">
              <Car className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Parking:</span>
              <span className="font-medium">{data.parking}</span>
            </div>
          )}
          {data.furnished && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Furnished:</span>
              <span className="font-medium">{data.furnished}</span>
            </div>
          )}
          {data.condition && (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-gray-600">Condition:</span>
              <span className="font-medium">{data.condition}</span>
            </div>
          )}
          {data.amenities && data.amenities.length > 0 && (
            <div className="md:col-span-2 lg:col-span-3">
              <span className="text-gray-600">Amenities:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {data.amenities.map((amenity, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {data.address && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-gray-500 mt-1" />
              <div>
                <span className="text-gray-600">Address:</span>
                <p className="font-medium text-gray-900 mt-1">{data.address}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading advertisement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="text-red-600 mt-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>

              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                <Flag className="w-5 h-5" />
                <span>Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              {ad.images && ad.images.length > 0 ? (
                <div className="relative">
                  <img
                    src={ad.images[currentImageIndex]}
                    alt={ad.title}
                    className="w-full h-96 object-cover"
                  />

                  {ad.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {ad.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Package Badge */}
                  {ad.package_type !== 'standard' && (
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                        ad.package_type === 'urgent' ? 'bg-orange-500' : 'bg-purple-500'
                      }`}>
                        {ad.package_type === 'urgent' ? 'URGENT' : 'FEATURED'}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-96 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No images available</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{ad.title}</h1>

              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{ad.views} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Posted {new Date(ad.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{ad.location_city}</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {showFullDescription ? ad.description : `${ad.description.substring(0, 300)}...`}
                </p>
                {ad.description.length > 300 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-blue-600 hover:text-blue-700 font-medium mt-2"
                  >
                    {showFullDescription ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>
            </div>

            {/* Vehicle/Property Details */}
            {renderVehicleDetails()}
            {renderPropertyDetails()}

            {/* Safety Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">Safety First</p>
                  <p className="text-yellow-700 mt-1">
                    We do not take any responsibility for payments done online. Don't share any OTPs.
                    Always verify the item and person before making any payment. Meet in safe, public places.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price and Contact */}
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatPrice(ad.price)}
                  {ad.is_negotiable && (
                    <span className="text-sm text-gray-500 font-normal ml-2">(Negotiable)</span>
                  )}
                </div>

                <button
                  onClick={handleCallNow}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 text-lg font-medium"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call Now</span>
                </button>

                <p className="text-gray-500 text-sm mt-2">{ad.contact_number}</p>
              </div>

              {/* Seller Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Seller Information</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {ad.user_info?.first_name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {ad.user_info?.first_name} {ad.user_info?.last_name}
                    </p>
                    <p className="text-sm text-gray-600">Private Seller</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Location</h3>
                <div className="flex items-center space-x-2 text-gray-700">
                  <MapPin className="w-4 h-4" />
                  <span>{ad.location_city}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDetails;