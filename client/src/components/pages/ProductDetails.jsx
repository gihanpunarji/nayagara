import React, { useState, useEffect } from 'react';
import {
  Heart, Share2, Flag, Star, MapPin, Truck, Shield, Clock,
  ChevronLeft, ChevronRight, Plus, Minus, ShoppingCart,
  MessageCircle, Phone, Eye, Check, AlertCircle, Store,
  Calendar, Gauge, Fuel, Users, Home, Camera, Cpu
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Mock product data with dynamic category fields
  const product = {
    id: 1,
    title: 'Toyota Prius 2020 Hybrid',
    slug: 'toyota-prius-2020-hybrid',
    description: 'Well-maintained Toyota Prius 2020 in excellent condition. This hybrid vehicle offers exceptional fuel efficiency with advanced safety features. Perfect for city driving and long journeys. All maintenance records available.',
    category: {
      id: 2,
      name: 'Vehicles',
      slug: 'vehicles'
    },
    price: 4850000,
    originalPrice: 5200000,
    currency: 'LKR',
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549399042-7c6c6f4e5c7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 1,
      name: 'AutoHub Lanka',
      rating: 4.8,
      totalRatings: 324,
      joinedDate: '2020',
      verified: true,
      responseTime: '1 hour',
      location: 'Colombo 05'
    },
    location: {
      city: 'Colombo',
      district: 'Colombo',
      province: 'Western'
    },
    status: 'active',
    stockQuantity: 1,
    viewCount: 1247,
    inquiryCount: 89,
    isFeatured: true,
    isPromoted: false,
    createdAt: '2024-01-15',

    // Dynamic category-specific attributes for vehicles
    categoryAttributes: {
      year: 2020,
      make: 'Toyota',
      model: 'Prius',
      engineCapacity: '1800cc',
      fuelType: 'Hybrid',
      transmission: 'CVT',
      mileage: '45,000 km',
      condition: 'Used',
      bodyType: 'Sedan',
      color: 'Silver',
      owners: 1,
      inspectionStatus: 'Certified',
      insuranceStatus: 'Valid until Dec 2024',
      roadTaxStatus: 'Paid',
      registrationNumber: 'CAR-1234'
    },

    // Product reviews
    reviews: [
      {
        id: 1,
        user: 'Kasun Perera',
        rating: 5,
        comment: 'Excellent condition vehicle. Very fuel efficient and smooth driving experience.',
        date: '2024-01-20',
        verified: true
      },
      {
        id: 2,
        user: 'Priya Fernando',
        rating: 5,
        comment: 'Great seller! Very responsive and honest about the vehicle condition.',
        date: '2024-01-18',
        verified: false
      }
    ],

    // Shipping/delivery info
    shipping: {
      available: true,
      cost: 'Inspection Available',
      estimatedDelivery: 'Available for viewing',
      methods: ['Self Pickup', 'Professional Inspection']
    }
  };

  // Render dynamic category fields based on category type
  const renderCategoryFields = () => {
    if (product.category.slug === 'vehicles') {
      return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-heading font-bold text-gray-900 mb-4">Vehicle Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="font-medium">{product.categoryAttributes.year}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Gauge className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-500">Mileage</p>
                <p className="font-medium">{product.categoryAttributes.mileage}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Fuel className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-500">Fuel Type</p>
                <p className="font-medium">{product.categoryAttributes.fuelType}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-500">Previous Owners</p>
                <p className="font-medium">{product.categoryAttributes.owners}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Make & Model</span>
              <span className="font-medium">{product.categoryAttributes.make} {product.categoryAttributes.model}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Engine Capacity</span>
              <span className="font-medium">{product.categoryAttributes.engineCapacity}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Transmission</span>
              <span className="font-medium">{product.categoryAttributes.transmission}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Condition</span>
              <span className="font-medium">{product.categoryAttributes.condition}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Color</span>
              <span className="font-medium">{product.categoryAttributes.color}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Inspection</span>
              <span className="font-medium text-success">{product.categoryAttributes.inspectionStatus}</span>
            </div>
          </div>
        </div>
      );
    }

    // For Electronics category
    if (product.category.slug === 'electronics') {
      return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-heading font-bold text-gray-900 mb-4">Technical Specifications</h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Brand</span>
              <span className="font-medium">Apple</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Storage</span>
              <span className="font-medium">256GB</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Display</span>
              <span className="font-medium">6.7" Super Retina XDR</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Warranty</span>
              <span className="font-medium text-success">1 Year</span>
            </div>
          </div>
        </div>
      );
    }

    // Default attributes for other categories
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-heading font-bold text-gray-900 mb-4">Product Details</h3>
        <div className="grid grid-cols-1 gap-3">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Category</span>
            <span className="font-medium">{product.category.name}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Condition</span>
            <span className="font-medium">New</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
              <img
                src={product.images[currentImageIndex]}
                alt={product.title}
                className="w-full h-96 sm:h-[500px] object-cover"
              />

              {/* Image Navigation */}
              <button
                onClick={() => setCurrentImageIndex(
                  currentImageIndex === 0 ? product.images.length - 1 : currentImageIndex - 1
                )}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentImageIndex(
                  currentImageIndex === product.images.length - 1 ? 0 : currentImageIndex + 1
                )}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-2 rounded-full transition-all ${
                    isWishlisted
                      ? 'bg-error text-white'
                      : 'bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button className="p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full text-gray-600 transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full text-gray-600 transition-all">
                  <Flag className="w-5 h-5" />
                </button>
              </div>

              {/* Badge */}
              {product.isFeatured && (
                <div className="absolute top-4 left-4">
                  <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Featured
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === index
                      ? 'border-primary-500'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-2">
                    {product.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{product.viewCount} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{product.inquiryCount} inquiries</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{product.location.city}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-3xl font-bold text-primary-600">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-lg text-gray-500 line-through">
                      Rs. {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.originalPrice > product.price && (
                  <span className="text-success font-medium">
                    You save Rs. {(product.originalPrice - product.price).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stockQuantity > 0 ? (
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-success" />
                    <span className="text-success font-medium">
                      {product.stockQuantity === 1 ? 'Available' : `${product.stockQuantity} available`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-error" />
                    <span className="text-error font-medium">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector (if applicable) */}
              {product.stockQuantity > 1 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 gap-3">
                <button
                  disabled={product.stockQuantity === 0}
                  className="w-full bg-gradient-primary text-white py-3 px-6 rounded-lg font-bold hover:shadow-green transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button className="w-full border-2 border-primary-500 text-primary-600 py-3 px-6 rounded-lg font-bold hover:bg-primary-50 transition-all duration-300 flex items-center justify-center space-x-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>Chat</span>
                  </button>
                  <button className="w-full border-2 border-secondary-500 text-secondary-600 py-3 px-6 rounded-lg font-bold hover:bg-secondary-50 transition-all duration-300 flex items-center justify-center space-x-2">
                    <Phone className="w-5 h-5" />
                    <span>Call</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Seller Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-4">Seller Information</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Store className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-gray-900">{product.seller.name}</h4>
                    {product.seller.verified && (
                      <Check className="w-4 h-4 text-success" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{product.seller.rating}</span>
                      <span>({product.seller.totalRatings} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Member since</p>
                  <p className="font-medium">{product.seller.joinedDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Response time</p>
                  <p className="font-medium">{product.seller.responseTime}</p>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-4">Delivery & Services</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="font-medium">{product.shipping.cost}</p>
                    <p className="text-sm text-gray-500">{product.shipping.estimatedDelivery}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="font-medium">Buyer Protection</p>
                    <p className="text-sm text-gray-500">Full refund if item not as described</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="font-medium">Easy Returns</p>
                    <p className="text-sm text-gray-500">Return within 7 days for full refund</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Product Description */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-4">Description</h3>
              <div className={`text-gray-700 ${showFullDescription ? '' : 'line-clamp-4'}`}>
                {product.description}
              </div>
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-primary-600 font-medium mt-2 hover:text-primary-700 transition-colors"
              >
                {showFullDescription ? 'Show Less' : 'Read More'}
              </button>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-4">Customer Reviews</h3>
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{review.user}</h4>
                        {review.verified && (
                          <span className="text-xs bg-success text-white px-2 py-1 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category-specific fields */}
          <div className="space-y-6">
            {renderCategoryFields()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;