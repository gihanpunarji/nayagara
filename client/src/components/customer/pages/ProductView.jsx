import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useChat from '../../../hooks/useChat';
import ChatManager from '../../shared/chat/ChatManager';
import { useAuth } from '../../../context/AuthContext';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Share2,
  MessageCircle,
  Store,
  Shield,
  Truck,
  RotateCcw,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Filter,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  Award
} from 'lucide-react';

const ProductView = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedReviewFilter, setSelectedReviewFilter] = useState('all');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const reviewsContainerRef = useRef(null);

  // Chat functionality
  const {
    activeChats,
    openChat,
    closeChat,
    minimizeChat,
    maximizeChat,
    toggleMinimize
  } = useChat();

  // Sample product data (in real app, fetch by id)
  const product = {
    id: 1,
    name: 'iPhone 15 Pro Max 256GB - Natural Titanium',
    shortDescription: 'Latest iPhone with A17 Pro chip, advanced camera system, and titanium design',
    price: 385000,
    originalPrice: 420000,
    discount: 8,
    rating: 4.8,
    reviewCount: 2847,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    category: 'Electronics',
    subCategory: 'Smartphones',
    brand: 'Apple',
    condition: 'Brand New',
    warranty: '1 Year International Warranty',
    location: 'Colombo 07',
    seller: {
      name: 'TechZone Lanka',
      rating: 4.9,
      totalReviews: 15647,
      memberSince: '2019',
      responseTime: '< 1 hour',
      verified: true
    },
    features: [
      'A17 Pro chip with 6-core GPU',
      '48MP Main camera with 5x Telephoto',
      '6.7-inch Super Retina XDR display',
      'Titanium design',
      'USB-C connectivity',
      'Face ID technology'
    ],
    shipping: {
      freeShipping: true,
      deliveryTime: '1-2 days',
      returnPolicy: '7 days'
    }
  };

  const reviews = [
    {
      id: 1,
      user: 'Kasun P.',
      rating: 5,
      date: '2024-01-15',
      comment: 'Excellent phone! Camera quality is amazing and battery life is great. Fast delivery too.',
      helpful: 45,
      verified: true,
      tags: ['good', 'fast_delivery']
    },
    {
      id: 2,
      user: 'Priya M.',
      rating: 4,
      date: '2024-01-10',
      comment: 'Great phone overall but quite expensive. Worth it for the camera system though.',
      helpful: 23,
      verified: true,
      tags: ['good']
    },
    {
      id: 3,
      user: 'Saman R.',
      rating: 5,
      date: '2024-01-08',
      comment: 'Perfect condition as described. Seller was very responsive and helpful.',
      helpful: 67,
      verified: true,
      tags: ['good', 'fast_delivery']
    },
    {
      id: 4,
      user: 'Nisha K.',
      rating: 3,
      date: '2024-01-05',
      comment: 'Phone is good but delivery was delayed by 2 days. Otherwise satisfied.',
      helpful: 12,
      verified: false,
      tags: ['bad']
    },
    {
      id: 5,
      user: 'Ranil S.',
      rating: 5,
      date: '2024-01-02',
      comment: 'Amazing upgrade from my old phone. The titanium finish looks premium!',
      helpful: 89,
      verified: true,
      tags: ['good']
    }
  ];

  const similarProducts = [
    {
      id: 2,
      name: 'iPhone 14 Pro Max',
      price: 335000,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.7,
      reviews: 1234
    },
    {
      id: 3,
      name: 'Samsung Galaxy S24 Ultra',
      price: 365000,
      image: 'https://images.unsplash.com/photo-1610792516286-524726503fb2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.6,
      reviews: 892
    },
    {
      id: 4,
      name: 'Google Pixel 8 Pro',
      price: 285000,
      image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.5,
      reviews: 567
    }
  ];

  const reviewFilters = [
    { key: 'all', label: 'All Reviews', count: reviews.length },
    { key: 'good', label: 'Positive', count: reviews.filter(r => r.tags.includes('good')).length },
    { key: 'bad', label: 'Negative', count: reviews.filter(r => r.tags.includes('bad')).length },
    { key: 'fast_delivery', label: 'Fast Delivery', count: reviews.filter(r => r.tags.includes('fast_delivery')).length }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const filteredReviews = selectedReviewFilter === 'all'
    ? reviews
    : reviews.filter(review => review.tags.includes(selectedReviewFilter));

  const displayedReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 3);

  const handleOpenChat = () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      window.location.href = `/login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    const sellerData = {
      id: product.seller.name.replace(/\s+/g, '-').toLowerCase(),
      name: product.seller.name,
      rating: product.seller.rating,
      totalReviews: product.seller.totalReviews,
      memberSince: product.seller.memberSince,
      responseTime: product.seller.responseTime,
      verified: product.seller.verified,
      isOnline: true
    };

    const productData = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]
    };

    openChat(sellerData.id, sellerData, productData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/category/electronics" className="hover:text-primary-600">{product.category}</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/category/electronics/smartphones" className="hover:text-primary-600">{product.subCategory}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Product Images & Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative bg-gray-50 rounded-xl overflow-hidden aspect-square">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-primary-600' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square bg-gray-50 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? 'border-primary-600' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-gray-600 leading-relaxed">{product.shortDescription}</p>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-gray-900">{product.rating}</span>
                </div>
                <span className="text-gray-500">•</span>
                <Link to="#reviews" className="text-primary-600 hover:underline">
                  {product.reviewCount.toLocaleString()} reviews
                </Link>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">Rs. {product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-gray-500 line-through">Rs. {product.originalPrice.toLocaleString()}</span>
                    <span className="bg-red-100 text-red-800 text-sm font-semibold px-2 py-1 rounded">
                      -{product.discount}%
                    </span>
                  </>
                )}
              </div>

              {/* Key Features */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
                <div className="grid grid-cols-1 gap-2">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                  Add to Cart
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  Buy Now
                </button>
                <button className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Seller Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Seller Information</h3>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <Store className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-gray-900">{product.seller.name}</h4>
                  {product.seller.verified && (
                    <Award className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div className="flex items-center space-x-1 mb-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.seller.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{product.seller.rating}</span>
                  <span className="text-sm text-gray-500">({product.seller.totalReviews.toLocaleString()} reviews)</span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Member since {product.seller.memberSince}</p>
                  <p>Response time: {product.seller.responseTime}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleOpenChat}
              className="bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat Now</span>
            </button>
          </div>
        </div>

        {/* Shipping & Returns */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Free Delivery</h4>
                <p className="text-sm text-gray-600">{product.shipping.deliveryTime}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Easy Returns</h4>
                <p className="text-sm text-gray-600">{product.shipping.returnPolicy}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Buyer Protection</h4>
                <p className="text-sm text-gray-600">100% guaranteed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div id="reviews" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Customer Reviews</h3>

          {/* Review Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {reviewFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedReviewFilter(filter.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedReviewFilter === filter.key
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>

          {/* Reviews List */}
          <div
            ref={reviewsContainerRef}
            className="space-y-4 max-h-96 overflow-y-auto"
          >
            {displayedReviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-600">
                        {review.user.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">{review.user}</span>
                        {review.verified && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{review.comment}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-primary-600">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{review.helpful}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Reviews Button */}
          {filteredReviews.length > 3 && !showAllReviews && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAllReviews(true)}
                className="text-primary-600 hover:underline font-medium"
              >
                Show all {filteredReviews.length} reviews
              </button>
            </div>
          )}
        </div>

        {/* Similar Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Similar Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {similarProducts.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-white rounded-lg overflow-hidden mb-3">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.name}</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-primary-600">Rs. {item.price.toLocaleString()}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{item.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{item.reviews} reviews</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Manager */}
      <ChatManager
        activeChats={activeChats}
        onCloseChat={closeChat}
        onMinimizeChat={minimizeChat}
        onMaximizeChat={maximizeChat}
        onToggleMinimize={toggleMinimize}
      />
    </div>
  );
};

export default ProductView;