import React, { useState, useEffect, useRef } from 'react';
import {
  Heart, Share2, Flag, Star, MapPin, Truck, Shield, Clock,
  ChevronLeft, ChevronRight, Plus, Minus, ShoppingCart,
  MessageCircle, Phone, Eye, Check, AlertCircle, Store,
  Calendar, Gauge, Fuel, Users, Home, Camera, Cpu, Send,
  ThumbsUp, ThumbsDown, Filter, User, Award, MoreHorizontal,
  Package, Zap, HeadphonesIcon, TrendingUp, ChevronDown, ChevronUp,
  CreditCard, ShoppingBag
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
  const [activeTab, setActiveTab] = useState('reviews');
  const [reviewFilter, setReviewFilter] = useState('all');
  const [newQuestion, setNewQuestion] = useState('');
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [reviewsExpanded, setReviewsExpanded] = useState(false);
  const [imageZoom, setImageZoom] = useState({ isZoomed: false, x: 0, y: 0 });
  const [isMagnifying, setIsMagnifying] = useState(false);

  const similarProductsRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const scrollSimilarProducts = () => {
      if (similarProductsRef.current) {
        const container = similarProductsRef.current;
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;

        if (scrollWidth > clientWidth) {
          let scrollPosition = 0;
          const scrollStep = 2;
          const delay = 50;

          const autoScroll = () => {
            scrollPosition += scrollStep;

            if (scrollPosition >= scrollWidth - clientWidth) {
              setTimeout(() => {
                container.scrollTo({ left: 0, behavior: 'smooth' });
                scrollPosition = 0;
                setTimeout(() => {
                  requestAnimationFrame(autoScroll);
                }, 2000);
              }, 1000);
            } else {
              container.scrollLeft = scrollPosition;
              setTimeout(() => {
                requestAnimationFrame(autoScroll);
              }, delay);
            }
          };

          setTimeout(() => {
            autoScroll();
          }, 2000);
        }
      }
    };

    scrollSimilarProducts();
  }, []);

  const handleImageMouseMove = (e) => {
    if (!isMagnifying || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setImageZoom({ isZoomed: true, x, y });
  };

  const handleImageMouseEnter = () => {
    setIsMagnifying(true);
  };

  const handleImageMouseLeave = () => {
    setIsMagnifying(false);
    setImageZoom({ isZoomed: false, x: 0, y: 0 });
  };

  const product = {
    id: 1,
    title: 'iPhone 15 Pro Max 256GB Natural Titanium',
    slug: 'iphone-15-pro-max-256gb',
    description: 'Brand new iPhone 15 Pro Max featuring the revolutionary A17 Pro chip, advanced camera system with 5x telephoto zoom, and aerospace-grade titanium design. Experience the pinnacle of smartphone technology with professional photography capabilities and all-day battery life.',
    category: {
      id: 1,
      name: 'Electronics',
      slug: 'electronics'
    },
    price: 385000,
    originalPrice: 420000,
    currency: 'LKR',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1695048133143-bbf36770cde6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1664299863359-3afc7aecb6d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 1,
      name: 'TechZone Lanka',
      rating: 4.9,
      totalRatings: 1247,
      totalSales: 3420,
      joinedDate: '2019',
      verified: true,
      responseTime: '2 minutes',
      location: 'Colombo 07',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      badges: ['Top Seller', 'Fast Shipper', 'Quality Products'],
      businessHours: '9:00 AM - 8:00 PM',
      languages: ['English', 'Sinhala', 'Tamil']
    },
    location: {
      city: 'Colombo',
      district: 'Colombo',
      province: 'Western'
    },
    status: 'active',
    stockQuantity: 15,
    viewCount: 2847,
    inquiryCount: 156,
    isFeatured: true,
    isPromoted: true,
    createdAt: '2024-01-15',

    categoryAttributes: {
      brand: 'Apple',
      model: 'iPhone 15 Pro Max',
      storage: '256GB',
      color: 'Natural Titanium',
      display: '6.7" Super Retina XDR',
      processor: 'A17 Pro chip',
      camera: '48MP + 12MP + 12MP',
      battery: '4422mAh',
      os: 'iOS 17',
      connectivity: '5G, Wi-Fi 6E, Bluetooth 5.3',
      warranty: '1 Year Apple International Warranty',
      condition: 'Brand New',
      boxContents: 'Phone, USB-C Cable, Documentation'
    },

    reviews: [
      {
        id: 1,
        user: 'Kasun Perera',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
        rating: 5,
        comment: 'Amazing phone! The camera quality is outstanding and the titanium build feels premium. Fast delivery and excellent packaging. Highly recommend this seller!',
        date: '2024-02-15',
        verified: true,
        helpful: 24,
        images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&h=100&fit=crop']
      },
      {
        id: 2,
        user: 'Priya Fernando',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=50&h=50&fit=crop&crop=face',
        rating: 5,
        comment: 'Perfect condition as described. Seller was very responsive and helpful. The phone works flawlessly and battery life is excellent.',
        date: '2024-02-10',
        verified: true,
        helpful: 18
      },
      {
        id: 3,
        user: 'Rajesh Silva',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50&h=50&fit=crop&crop=face',
        rating: 4,
        comment: 'Great phone overall. Only minor issue was delivery took an extra day, but seller communicated well about the delay.',
        date: '2024-02-08',
        verified: false,
        helpful: 12
      },
      {
        id: 4,
        user: 'Amara Jayasinghe',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
        rating: 5,
        comment: 'Exceeded expectations! The phone is in perfect condition and came with all original accessories. Will buy from this seller again.',
        date: '2024-02-05',
        verified: true,
        helpful: 31
      },
      {
        id: 5,
        user: 'Chaminda Silva',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
        rating: 4,
        comment: 'Good value for money. Phone works perfectly but packaging could be better.',
        date: '2024-02-03',
        verified: true,
        helpful: 8
      },
      {
        id: 6,
        user: 'Nethmi Rodrigo',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=50&h=50&fit=crop&crop=face',
        rating: 5,
        comment: 'Excellent service and genuine product. Highly recommended!',
        date: '2024-02-01',
        verified: true,
        helpful: 19
      }
    ],

    questions: [
      {
        id: 1,
        user: 'Saman Kumara',
        question: 'Is this an international model or local model?',
        date: '2024-02-14',
        answer: 'This is an international model with full Apple warranty valid in Sri Lanka.',
        answerDate: '2024-02-14',
        answered: true,
        helpful: 15
      },
      {
        id: 2,
        user: 'Nimal Perera',
        question: 'Does it support dual SIM?',
        date: '2024-02-12',
        answer: 'Yes, it supports dual SIM (nano-SIM and eSIM).',
        answerDate: '2024-02-12',
        answered: true,
        helpful: 8
      },
      {
        id: 3,
        user: 'Chathuri De Silva',
        question: 'What accessories are included in the box?',
        date: '2024-02-10',
        answer: 'Included: iPhone, USB-C to USB-C cable, and documentation. Note: Power adapter and EarPods are sold separately.',
        answerDate: '2024-02-10',
        answered: true,
        helpful: 22
      },
      {
        id: 4,
        user: 'Roshan Fernando',
        question: 'Is cash on delivery available for Kandy?',
        date: '2024-02-09',
        answer: '',
        answerDate: '',
        answered: false,
        helpful: 0
      }
    ],

    reviewStats: {
      average: 4.8,
      total: 127,
      breakdown: {
        5: 89,
        4: 28,
        3: 7,
        2: 2,
        1: 1
      }
    },

    shipping: {
      available: true,
      cost: 'Free Shipping',
      estimatedDelivery: '1-2 days',
      methods: ['Express Delivery', 'Standard Delivery', 'Same Day (Colombo)']
    }
  };

  const similarProducts = [
    {
      id: 2,
      title: 'iPhone 15 Pro 128GB Blue Titanium',
      price: 335000,
      originalPrice: 365000,
      image: 'https://images.unsplash.com/photo-1678652197336-b75de8a6f5ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.7,
      seller: 'MobileHub LK'
    },
    {
      id: 3,
      title: 'Samsung Galaxy S24 Ultra 256GB',
      price: 395000,
      originalPrice: 425000,
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.6,
      seller: 'Galaxy Store'
    },
    {
      id: 4,
      title: 'iPhone 14 Pro Max 512GB',
      price: 425000,
      originalPrice: 475000,
      image: 'https://images.unsplash.com/photo-1663781214017-04fbb37eec92?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      seller: 'Apple Store LK'
    },
    {
      id: 5,
      title: 'Google Pixel 8 Pro 256GB',
      price: 285000,
      originalPrice: 315000,
      image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.5,
      seller: 'Pixel Lanka'
    },
    {
      id: 6,
      title: 'OnePlus 12 Pro 256GB',
      price: 245000,
      originalPrice: 275000,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.4,
      seller: 'OnePlus Official'
    },
    {
      id: 7,
      title: 'Xiaomi 14 Pro 512GB',
      price: 195000,
      originalPrice: 225000,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.3,
      seller: 'Xiaomi Store'
    }
  ];

  const renderCategoryFields = () => {
    if (product.category.slug === 'electronics') {
      return (
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-heading font-bold text-gray-900 mb-3 lg:mb-4 flex items-center space-x-2">
            <Cpu className="w-4 h-4 lg:w-5 lg:h-5 text-primary-600" />
            <span>Technical Specifications</span>
          </h3>
          <div className="grid grid-cols-1 gap-2 lg:gap-3">
            <div className="flex justify-between py-2 border-b border-gray-100 text-sm lg:text-base">
              <span className="text-gray-600">Brand</span>
              <span className="font-medium">{product.categoryAttributes.brand}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 text-sm lg:text-base">
              <span className="text-gray-600">Model</span>
              <span className="font-medium">{product.categoryAttributes.model}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 text-sm lg:text-base">
              <span className="text-gray-600">Storage</span>
              <span className="font-medium">{product.categoryAttributes.storage}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 text-sm lg:text-base">
              <span className="text-gray-600">Display</span>
              <span className="font-medium">{product.categoryAttributes.display}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 text-sm lg:text-base">
              <span className="text-gray-600">Processor</span>
              <span className="font-medium">{product.categoryAttributes.processor}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 text-sm lg:text-base">
              <span className="text-gray-600">Camera</span>
              <span className="font-medium">{product.categoryAttributes.camera}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 text-sm lg:text-base">
              <span className="text-gray-600">Battery</span>
              <span className="font-medium">{product.categoryAttributes.battery}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 text-sm lg:text-base">
              <span className="text-gray-600">Operating System</span>
              <span className="font-medium">{product.categoryAttributes.os}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 text-sm lg:text-base">
              <span className="text-gray-600">Connectivity</span>
              <span className="font-medium">{product.categoryAttributes.connectivity}</span>
            </div>
            <div className="flex justify-between py-2 text-sm lg:text-base">
              <span className="text-gray-600">Warranty</span>
              <span className="font-medium text-success">{product.categoryAttributes.warranty}</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
        <h3 className="text-base lg:text-lg font-heading font-bold text-gray-900 mb-3 lg:mb-4">Product Details</h3>
        <div className="grid grid-cols-1 gap-2 lg:gap-3">
          <div className="flex justify-between py-2 border-b border-gray-100 text-sm lg:text-base">
            <span className="text-gray-600">Category</span>
            <span className="font-medium">{product.category.name}</span>
          </div>
          <div className="flex justify-between py-2 text-sm lg:text-base">
            <span className="text-gray-600">Condition</span>
            <span className="font-medium">New</span>
          </div>
        </div>
      </div>
    );
  };

  const renderReviewsSection = () => {
    const filteredReviews = reviewFilter === 'all'
      ? product.reviews
      : product.reviews.filter(review => review.rating === parseInt(reviewFilter));

    return (
      <div className="space-y-4 lg:space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="text-center sm:text-left">
              <div className="text-2xl lg:text-3xl font-bold text-gray-900">{product.reviewStats.average}</div>
              <div className="flex items-center justify-center sm:justify-start space-x-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 lg:w-4 lg:h-4 ${
                      i < Math.floor(product.reviewStats.average) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs lg:text-sm text-gray-500">{product.reviewStats.total} reviews</div>
            </div>

            <div className="space-y-1 lg:space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-2 h-2 lg:w-3 lg:h-3 text-yellow-400 fill-current" />
                    <span className="text-xs lg:text-sm">{rating}</span>
                  </div>
                  <div className="w-16 lg:w-24 h-1.5 lg:h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-1.5 lg:h-2 bg-yellow-400 rounded-full"
                      style={{ width: `${(product.reviewStats.breakdown[rating] / product.reviewStats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs lg:text-sm text-gray-500">{product.reviewStats.breakdown[rating]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={reviewFilter}
              onChange={(e) => setReviewFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Reviews</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        <div className="bg-primary-50 border border-primary-200 rounded-lg lg:rounded-xl p-3 lg:p-4">
          <h4 className="font-medium text-gray-900 mb-2 lg:mb-3 text-sm lg:text-base">Write a Review</h4>
          <div className="space-y-3 lg:space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs lg:text-sm text-gray-700">Rating:</span>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setNewReview({...newReview, rating})}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-4 h-4 lg:w-5 lg:h-5 ${
                          rating <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
              placeholder="Share your experience with this product..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-sm lg:text-base"
              rows="3"
            />
            <button className="bg-gradient-primary text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg font-medium hover:shadow-green transition-all duration-300 flex items-center space-x-2 text-sm lg:text-base">
              <Send className="w-3 h-3 lg:w-4 lg:h-4" />
              <span>Submit Review</span>
            </button>
          </div>
        </div>

        <div
          className={`transition-all duration-300 overflow-hidden ${
            reviewsExpanded ? 'max-h-screen' : 'max-h-96 lg:max-h-80'
          }`}
        >
          <div className="space-y-3 lg:space-y-4">
            {filteredReviews.map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-3 lg:p-4">
                <div className="flex items-start space-x-3 lg:space-x-4">
                  <img
                    src={review.avatar}
                    alt={review.user}
                    className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900 text-sm lg:text-base">{review.user}</h4>
                        {review.verified && (
                          <span className="text-xs bg-success text-white px-1.5 py-0.5 rounded-full flex items-center space-x-1">
                            <Check className="w-2 h-2 lg:w-3 lg:h-3" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 lg:w-4 lg:h-4 ${
                              i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2 lg:mb-3 text-sm lg:text-base leading-relaxed">{review.comment}</p>
                    {review.images && (
                      <div className="flex space-x-2 mb-2 lg:mb-3">
                        {review.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt="Review"
                            className="w-12 h-12 lg:w-16 lg:h-16 object-cover rounded-lg border"
                          />
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-xs lg:text-sm text-gray-500">{review.date}</p>
                      <button className="flex items-center space-x-1 text-xs lg:text-sm text-gray-500 hover:text-primary-600">
                        <ThumbsUp className="w-3 h-3 lg:w-4 lg:h-4" />
                        <span>Helpful ({review.helpful})</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredReviews.length > 3 && (
          <div className="flex justify-center">
            <button
              onClick={() => setReviewsExpanded(!reviewsExpanded)}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium transition-colors text-sm lg:text-base"
            >
              <span>{reviewsExpanded ? 'Show Less Reviews' : 'Show More Reviews'}</span>
              {reviewsExpanded ? (
                <ChevronUp className="w-4 h-4 lg:w-5 lg:h-5" />
              ) : (
                <ChevronDown className="w-4 h-4 lg:w-5 lg:h-5" />
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderQuestionsSection = () => {
    return (
      <div className="space-y-4 lg:space-y-6">
        <div className="bg-primary-50 border border-primary-200 rounded-lg lg:rounded-xl p-3 lg:p-4">
          <h4 className="font-medium text-gray-900 mb-2 lg:mb-3 text-sm lg:text-base">Ask a Question</h4>
          <div className="space-y-3 lg:space-y-4">
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Ask anything about this product..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-sm lg:text-base"
              rows="3"
            />
            <button className="bg-gradient-primary text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg font-medium hover:shadow-green transition-all duration-300 flex items-center space-x-2 text-sm lg:text-base">
              <MessageCircle className="w-3 h-3 lg:w-4 lg:h-4" />
              <span>Ask Question</span>
            </button>
          </div>
        </div>

        <div className="space-y-3 lg:space-y-4">
          {product.questions.map((qa) => (
            <div key={qa.id} className="border border-gray-200 rounded-lg p-3 lg:p-4">
              <div className="flex items-start space-x-3 lg:space-x-4 mb-3 lg:mb-4">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-3 h-3 lg:w-4 lg:h-4 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2">
                    <h4 className="font-medium text-gray-900 text-sm lg:text-base">{qa.user}</h4>
                    <span className="text-xs lg:text-sm text-gray-500">{qa.date}</span>
                  </div>
                  <p className="text-gray-700 text-sm lg:text-base">{qa.question}</p>
                </div>
              </div>

              {qa.answered ? (
                <div className="ml-9 lg:ml-12 bg-gray-50 border-l-4 border-primary-500 p-3 lg:p-4 rounded-lg">
                  <div className="flex items-start space-x-2 lg:space-x-3">
                    <div className="w-4 h-4 lg:w-6 lg:h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Store className="w-2 h-2 lg:w-3 lg:h-3 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                        <span className="font-medium text-primary-600 text-sm lg:text-base">{product.seller.name}</span>
                        <span className="text-xs text-gray-500">{qa.answerDate}</span>
                      </div>
                      <p className="text-gray-700 mb-2 text-sm lg:text-base">{qa.answer}</p>
                      <button className="flex items-center space-x-1 text-xs lg:text-sm text-gray-500 hover:text-primary-600">
                        <ThumbsUp className="w-3 h-3 lg:w-4 lg:h-4" />
                        <span>Helpful ({qa.helpful})</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="ml-9 lg:ml-12 text-xs lg:text-sm text-gray-500 italic">
                  Waiting for seller's answer...
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="max-w-[85%] mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          <div className="space-y-3 lg:space-y-4">
            <div className="relative bg-white rounded-xl lg:rounded-2xl overflow-hidden shadow-sm border border-gray-200">
              <div
                ref={imageRef}
                className="relative overflow-hidden cursor-zoom-in"
                onMouseMove={handleImageMouseMove}
                onMouseEnter={handleImageMouseEnter}
                onMouseLeave={handleImageMouseLeave}
              >
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.title}
                  className={`w-full h-64 sm:h-80 lg:h-96 xl:h-[500px] object-cover transition-transform duration-300 ${
                    isMagnifying ? 'scale-150' : 'scale-100'
                  }`}
                  style={{
                    transformOrigin: isMagnifying ? `${imageZoom.x}% ${imageZoom.y}%` : 'center'
                  }}
                />
              </div>

              <button
                onClick={() => setCurrentImageIndex(
                  currentImageIndex === 0 ? product.images.length - 1 : currentImageIndex - 1
                )}
                className="absolute left-2 lg:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1.5 lg:p-2 transition-all"
              >
                <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
              <button
                onClick={() => setCurrentImageIndex(
                  currentImageIndex === product.images.length - 1 ? 0 : currentImageIndex + 1
                )}
                className="absolute right-2 lg:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1.5 lg:p-2 transition-all"
              >
                <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>

              <div className="absolute top-2 lg:top-4 right-2 lg:right-4 flex space-x-1 lg:space-x-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-1.5 lg:p-2 rounded-full transition-all ${
                    isWishlisted
                      ? 'bg-error text-white'
                      : 'bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 lg:w-5 lg:h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button className="p-1.5 lg:p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full text-gray-600 transition-all">
                  <Share2 className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
                <button className="p-1.5 lg:p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full text-gray-600 transition-all">
                  <Flag className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
              </div>

              {product.isPromoted && (
                <div className="absolute top-2 lg:top-4 left-2 lg:left-4">
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-bold flex items-center space-x-1">
                    <Zap className="w-2 h-2 lg:w-3 lg:h-3" />
                    <span>Promoted</span>
                  </span>
                </div>
              )}
            </div>

            <div className="flex space-x-1 lg:space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-all ${
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

          <div className="space-y-4 lg:space-y-6">
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-gray-900 mb-2 leading-tight">
                    {product.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-xs lg:text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span>{product.viewCount} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span>{product.inquiryCount} inquiries</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span>{product.location.city}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4 lg:mb-6">
                <div className="flex items-center space-x-2 lg:space-x-3 mb-2">
                  <span className="text-2xl lg:text-3xl font-bold text-primary-600">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-base lg:text-lg text-gray-500 line-through">
                      Rs. {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.originalPrice > product.price && (
                  <span className="text-success font-medium text-sm lg:text-base">
                    You save Rs. {(product.originalPrice - product.price).toLocaleString()} ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%)
                  </span>
                )}
              </div>

              <div className="mb-4 lg:mb-6">
                {product.stockQuantity > 0 ? (
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 lg:w-5 lg:h-5 text-success" />
                    <span className="text-success font-medium text-sm lg:text-base">
                      {product.stockQuantity === 1 ? 'Available' : `${product.stockQuantity} in stock`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 lg:w-5 lg:h-5 text-error" />
                    <span className="text-error font-medium text-sm lg:text-base">Out of Stock</span>
                  </div>
                )}
              </div>

              {product.stockQuantity > 1 && (
                <div className="mb-4 lg:mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-3 h-3 lg:w-4 lg:h-4" />
                    </button>
                    <span className="px-3 lg:px-4 py-2 font-medium text-sm lg:text-base">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-3 h-3 lg:w-4 lg:h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-2 lg:gap-3">
                <button
                  disabled={product.stockQuantity === 0}
                  className="w-full bg-gradient-primary text-white py-2.5 lg:py-3 px-4 lg:px-6 rounded-lg font-bold hover:shadow-green transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm lg:text-base"
                >
                  <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span>Add to Cart</span>
                </button>

                <button
                  disabled={product.stockQuantity === 0}
                  className="w-full bg-gradient-to-r from-secondary-500 to-secondary-600 text-white py-2.5 lg:py-3 px-4 lg:px-6 rounded-lg font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm lg:text-base"
                >
                  <CreditCard className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
              <h3 className="text-base lg:text-lg font-heading font-bold text-gray-900 mb-3 lg:mb-4 flex items-center space-x-2">
                <Store className="w-4 h-4 lg:w-5 lg:h-5 text-primary-600" />
                <span>Seller Information</span>
              </h3>
              <div className="flex items-center space-x-3 lg:space-x-4 mb-3 lg:mb-4">
                <img
                  src={product.seller.avatar}
                  alt={product.seller.name}
                  className="w-12 h-12 lg:w-16 lg:h-16 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-bold text-gray-900 text-sm lg:text-base">{product.seller.name}</h4>
                    {product.seller.verified && (
                      <div className="bg-success text-white rounded-full p-0.5 lg:p-1">
                        <Check className="w-2 h-2 lg:w-3 lg:h-3" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-1 lg:gap-2 text-xs lg:text-sm text-gray-500 mb-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400 fill-current" />
                      <span>{product.seller.rating}</span>
                      <span>({product.seller.totalRatings} reviews)</span>
                    </div>
                    <span>•</span>
                    <span>{product.seller.totalSales} sales</span>
                  </div>
                  <div className="flex flex-wrap gap-1 lg:gap-2">
                    {product.seller.badges.map((badge, idx) => (
                      <span key={idx} className="text-xs bg-primary-100 text-primary-600 px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:gap-4 text-xs lg:text-sm mb-3 lg:mb-4">
                <div>
                  <p className="text-gray-500">Member since</p>
                  <p className="font-medium">{product.seller.joinedDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Response time</p>
                  <p className="font-medium">{product.seller.responseTime}</p>
                </div>
                <div>
                  <p className="text-gray-500">Business hours</p>
                  <p className="font-medium">{product.seller.businessHours}</p>
                </div>
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="font-medium">{product.seller.location}</p>
                </div>
              </div>

              <button className="w-full border-2 border-primary-500 text-primary-600 py-1.5 lg:py-2 px-3 lg:px-4 rounded-lg font-medium hover:bg-primary-50 transition-all duration-300 text-sm lg:text-base">
                View Store
              </button>
            </div>

            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
              <h3 className="text-base lg:text-lg font-heading font-bold text-gray-900 mb-3 lg:mb-4 flex items-center space-x-2">
                <Truck className="w-4 h-4 lg:w-5 lg:h-5 text-primary-600" />
                <span>Delivery & Services</span>
              </h3>
              <div className="space-y-2 lg:space-y-3">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <Package className="w-4 h-4 lg:w-5 lg:h-5 text-primary-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm lg:text-base">{product.shipping.cost}</p>
                    <p className="text-xs lg:text-sm text-gray-500">{product.shipping.estimatedDelivery}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-primary-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm lg:text-base">Buyer Protection</p>
                    <p className="text-xs lg:text-sm text-gray-500">Full refund if item not as described</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-primary-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm lg:text-base">Easy Returns</p>
                    <p className="text-xs lg:text-sm text-gray-500">Return within 7 days for full refund</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <HeadphonesIcon className="w-4 h-4 lg:w-5 lg:h-5 text-primary-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm lg:text-base">24/7 Support</p>
                    <p className="text-xs lg:text-sm text-gray-500">Customer support available anytime</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 mt-6 lg:mt-8">
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
              <h3 className="text-base lg:text-lg font-heading font-bold text-gray-900 mb-3 lg:mb-4">Description</h3>
              <div className={`text-gray-700 leading-relaxed text-sm lg:text-base ${showFullDescription ? '' : 'line-clamp-4'}`}>
                {product.description}
              </div>
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-primary-600 font-medium mt-2 hover:text-primary-700 transition-colors text-sm lg:text-base"
              >
                {showFullDescription ? 'Show Less' : 'Read More'}
              </button>
            </div>

            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
              <div className="flex items-center space-x-4 lg:space-x-6 mb-4 lg:mb-6">
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2 border-b-2 font-medium transition-colors text-sm lg:text-base ${
                    activeTab === 'reviews'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Reviews ({product.reviewStats.total})
                </button>
                <button
                  onClick={() => setActiveTab('questions')}
                  className={`pb-2 border-b-2 font-medium transition-colors text-sm lg:text-base ${
                    activeTab === 'questions'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Questions ({product.questions.length})
                </button>
              </div>

              {activeTab === 'reviews' ? renderReviewsSection() : renderQuestionsSection()}
            </div>
          </div>

          <div className="space-y-4 lg:space-y-6">
            {renderCategoryFields()}
          </div>
        </div>

        <div className="mt-8 lg:mt-12">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-xl lg:text-2xl font-heading font-bold text-gray-900 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-primary-600" />
              <span>Similar Products</span>
            </h2>
            <button className="text-primary-600 font-medium hover:text-primary-700 transition-colors text-sm lg:text-base">
              View All
            </button>
          </div>

          <div className="relative">
            <div
              ref={similarProductsRef}
              className="flex space-x-3 lg:space-x-6 overflow-x-auto scrollbar-hide pb-4"
              style={{ scrollBehavior: 'smooth' }}
            >
              {similarProducts.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-48 sm:w-56 lg:w-72 bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-32 sm:h-36 lg:h-48 object-cover"
                    />
                    <div className="absolute top-2 lg:top-3 right-2 lg:right-3">
                      <button className="p-1.5 lg:p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full text-gray-600 transition-all">
                        <Heart className="w-3 h-3 lg:w-4 lg:h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3 lg:p-4">
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm lg:text-base">{item.title}</h3>
                    <div className="flex items-center space-x-1 lg:space-x-2 mb-2">
                      <span className="text-base lg:text-lg font-bold text-primary-600">
                        Rs. {item.price.toLocaleString()}
                      </span>
                      {item.originalPrice > item.price && (
                        <span className="text-xs lg:text-sm text-gray-500 line-through">
                          Rs. {item.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400 fill-current" />
                        <span className="text-xs lg:text-sm text-gray-600">{item.rating}</span>
                      </div>
                      <span className="text-xs lg:text-sm text-gray-500 truncate">{item.seller}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;