import React, { useState, useEffect } from 'react';
import {
  Star,
  Search,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Flag,
  RefreshCw,
  Download,
  MoreVertical,
  User,
  Package,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';

const ReviewsRatings = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState([]);

  // Mock review data
  const mockReviews = [
    {
      id: 1,
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      productName: 'iPhone 15 Pro Max 256GB',
      productId: 1,
      seller: 'TechZone Electronics',
      rating: 5,
      title: 'Excellent product, highly recommended!',
      comment: 'The phone exceeded my expectations. Fast delivery, genuine product, and great customer service. The camera quality is outstanding and battery life is impressive.',
      images: ['review1.jpg', 'review2.jpg'],
      helpful: 24,
      notHelpful: 2,
      status: 'approved',
      flagged: false,
      verified: true,
      reviewDate: '2024-01-15',
      orderDate: '2024-01-10'
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      productName: 'Designer Silk Saree',
      productId: 3,
      seller: 'Fashion Hub',
      rating: 4,
      title: 'Beautiful saree, minor color difference',
      comment: 'The saree quality is excellent and the design is beautiful. However, the color was slightly different from the website photos. Overall satisfied with the purchase.',
      images: [],
      helpful: 12,
      notHelpful: 1,
      status: 'approved',
      flagged: false,
      verified: true,
      reviewDate: '2024-01-14',
      orderDate: '2024-01-08'
    },
    {
      id: 3,
      customerName: 'Mike Johnson',
      customerEmail: 'mike@example.com',
      productName: 'Car Engine Oil 5W-30',
      productId: 5,
      seller: 'AutoParts Pro',
      rating: 5,
      title: 'Great quality oil at good price',
      comment: 'Using this for my car for the past 3 months. Engine runs smoothly and the price is very competitive compared to other brands.',
      images: [],
      helpful: 8,
      notHelpful: 0,
      status: 'approved',
      flagged: false,
      verified: true,
      reviewDate: '2024-01-13',
      orderDate: '2024-01-05'
    },
    {
      id: 4,
      customerName: 'Sarah Wilson',
      customerEmail: 'sarah@example.com',
      productName: 'Organic Rose Plants Set',
      productId: 4,
      seller: 'Green Gardens',
      rating: 2,
      title: 'Plants arrived in poor condition',
      comment: 'Very disappointed. The plants arrived with damaged leaves and one plant was completely dead. The packaging was inadequate for shipping live plants.',
      images: ['review3.jpg'],
      helpful: 15,
      notHelpful: 3,
      status: 'approved',
      flagged: true,
      verified: true,
      reviewDate: '2024-01-12',
      orderDate: '2024-01-08'
    },
    {
      id: 5,
      customerName: 'David Brown',
      customerEmail: 'david@example.com',
      productName: 'Samsung Galaxy S24 Ultra',
      productId: 2,
      seller: 'TechZone Electronics',
      rating: 1,
      title: 'FAKE PRODUCT! DO NOT BUY!',
      comment: 'This is clearly a counterfeit product. The IMEI doesn\'t match Samsung\'s database. Seller is a scammer. I want a full refund immediately!',
      images: [],
      helpful: 45,
      notHelpful: 2,
      status: 'pending',
      flagged: true,
      verified: true,
      reviewDate: '2024-01-15',
      orderDate: '2024-01-12'
    },
    {
      id: 6,
      customerName: 'Emily Chen',
      customerEmail: 'emily@example.com',
      productName: 'Premium Yoga Mat',
      productId: 6,
      seller: 'Sports World',
      rating: 5,
      title: 'Best yoga mat I\'ve ever used',
      comment: 'Excellent grip, perfect thickness, and very durable. Great for both hot yoga and regular practice. Worth every penny!',
      images: [],
      helpful: 18,
      notHelpful: 0,
      status: 'approved',
      flagged: false,
      verified: true,
      reviewDate: '2024-01-14',
      orderDate: '2024-01-09'
    },
    {
      id: 7,
      customerName: 'Anonymous User',
      customerEmail: 'fake@test.com',
      productName: 'iPhone 15 Pro Max 256GB',
      productId: 1,
      seller: 'TechZone Electronics',
      rating: 5,
      title: 'Amazing phone best price',
      comment: 'Good phone very nice quality fast shipping recommend to all my friends thank you seller',
      images: [],
      helpful: 0,
      notHelpful: 8,
      status: 'pending',
      flagged: true,
      verified: false,
      reviewDate: '2024-01-15',
      orderDate: null
    },
    {
      id: 8,
      customerName: 'Lisa Anderson',
      customerEmail: 'lisa@example.com',
      productName: 'LED Smart TV 55 inch',
      productId: 7,
      seller: 'TechZone Electronics',
      rating: 4,
      title: 'Good TV but could be better',
      comment: 'Picture quality is good and smart features work well. However, the remote control feels cheap and the sound quality could be better. Consider adding a soundbar.',
      images: ['review4.jpg', 'review5.jpg'],
      helpful: 22,
      notHelpful: 1,
      status: 'approved',
      flagged: false,
      verified: true,
      reviewDate: '2024-01-13',
      orderDate: '2024-01-07'
    }
  ];

  const filterOptions = [
    { key: 'all', label: 'All Reviews', count: 0, color: 'gray' },
    { key: 'pending', label: 'Pending', count: 0, color: 'yellow' },
    { key: 'approved', label: 'Approved', count: 0, color: 'green' },
    { key: 'rejected', label: 'Rejected', count: 0, color: 'red' },
    { key: 'flagged', label: 'Flagged', count: 0, color: 'orange' },
    { key: 'verified', label: 'Verified Purchase', count: 0, color: 'blue' }
  ];

  const ratingOptions = [
    { key: 'all', label: 'All Ratings' },
    { key: '5', label: '5 Stars' },
    { key: '4', label: '4 Stars' },
    { key: '3', label: '3 Stars' },
    { key: '2', label: '2 Stars' },
    { key: '1', label: '1 Star' }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setReviews(mockReviews);

      // Update filter counts
      filterOptions.forEach(filter => {
        if (filter.key === 'all') {
          filter.count = mockReviews.length;
        } else if (filter.key === 'flagged') {
          filter.count = mockReviews.filter(review => review.flagged).length;
        } else if (filter.key === 'verified') {
          filter.count = mockReviews.filter(review => review.verified).length;
        } else {
          filter.count = mockReviews.filter(review => review.status === filter.key).length;
        }
      });

      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...reviews];

    // Apply status filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'flagged') {
        filtered = filtered.filter(review => review.flagged);
      } else if (selectedFilter === 'verified') {
        filtered = filtered.filter(review => review.verified);
      } else {
        filtered = filtered.filter(review => review.status === selectedFilter);
      }
    }

    // Apply rating filter
    if (selectedRating !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(selectedRating));
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(review =>
        review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate));

    setFilteredReviews(filtered);
  }, [reviews, selectedFilter, selectedRating, searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleReviewAction = (action, reviewId) => {
    console.log(`${action} review:`, reviewId);
    // Handle review actions here
  };

  const handleBulkAction = (action) => {
    console.log(`${action} reviews:`, selectedReviews);
    // Handle bulk actions here
  };

  const ReviewRow = ({ review }) => (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={selectedReviews.includes(review.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedReviews([...selectedReviews, review.id]);
            } else {
              setSelectedReviews(selectedReviews.filter(id => id !== review.id));
            }
          }}
          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
        />
      </td>

      <td className="px-6 py-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            {renderStars(review.rating)}
            <span className="text-sm font-bold text-gray-900">{review.rating}.0</span>
          </div>

          <div className="font-medium text-gray-900">{review.title}</div>

          <div className="text-sm text-gray-600 line-clamp-2">{review.comment}</div>

          {review.images.length > 0 && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Package className="w-3 h-3" />
              <span>{review.images.length} image{review.images.length > 1 ? 's' : ''}</span>
            </div>
          )}

          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <ThumbsUp className="w-3 h-3" />
              <span>{review.helpful}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ThumbsDown className="w-3 h-3" />
              <span>{review.notHelpful}</span>
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-sm">
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{review.customerName}</div>
          <div className="text-gray-500">{review.customerEmail}</div>
          {review.verified && (
            <div className="flex items-center space-x-1 text-green-600 text-xs">
              <CheckCircle className="w-3 h-3" />
              <span>Verified Purchase</span>
            </div>
          )}
        </div>
      </td>

      <td className="px-6 py-4 text-sm">
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{review.productName}</div>
          <div className="text-gray-500 text-xs">{review.seller}</div>
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-gray-500">
        <div className="space-y-1">
          <div>Review: {formatDate(review.reviewDate)}</div>
          {review.orderDate && (
            <div className="text-xs">Order: {formatDate(review.orderDate)}</div>
          )}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="space-y-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(review.status)}`}>
            {review.status.toUpperCase()}
          </span>

          {review.flagged && (
            <div className="flex items-center space-x-1 text-orange-600">
              <Flag className="w-3 h-3" />
              <span className="text-xs">Flagged</span>
            </div>
          )}
        </div>
      </td>

      <td className="px-6 py-4 text-right">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleReviewAction('view', review.id)}
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
                  onClick={() => handleReviewAction('view_product', review.id)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Package className="w-4 h-4" />
                  <span>View Product</span>
                </button>

                <button
                  onClick={() => handleReviewAction('view_customer', review.id)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>View Customer</span>
                </button>

                {review.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleReviewAction('approve', review.id)}
                      className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve Review</span>
                    </button>
                    <button
                      onClick={() => handleReviewAction('reject', review.id)}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Review</span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => handleReviewAction(review.flagged ? 'unflag' : 'flag', review.id)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 flex items-center space-x-2 ${
                    review.flagged ? 'text-green-600' : 'text-orange-600'
                  }`}
                >
                  <Flag className="w-4 h-4" />
                  <span>{review.flagged ? 'Remove Flag' : 'Flag Review'}</span>
                </button>

                <button
                  onClick={() => handleReviewAction('contact_customer', review.id)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Contact Customer</span>
                </button>

                {review.status === 'approved' && (
                  <button
                    onClick={() => handleReviewAction('hide', review.id)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Hide Review</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );

  const stats = {
    totalReviews: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
    flagged: reviews.filter(r => r.flagged).length,
    avgRating: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0,
    fiveStars: reviews.filter(r => r.rating === 5).length,
    fourStars: reviews.filter(r => r.rating === 4).length,
    threeStars: reviews.filter(r => r.rating === 3).length,
    twoStars: reviews.filter(r => r.rating === 2).length,
    oneStar: reviews.filter(r => r.rating === 1).length
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
            <h1 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h1>
            <p className="text-gray-600 mt-1">
              Moderate customer reviews and manage product ratings
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalReviews}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-xl font-bold text-yellow-600">{stats.avgRating} ⭐</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-xl font-bold text-green-600">{stats.approved}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Flagged</p>
              <p className="text-xl font-bold text-orange-600">{stats.flagged}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">5 Stars</p>
              <p className="text-xl font-bold text-green-600">{stats.fiveStars}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">1 Star</p>
              <p className="text-xl font-bold text-red-600">{stats.oneStar}</p>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h2>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter(r => r.rating === rating).length;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;

              return (
                <div key={rating} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-16">
                    <span className="text-sm font-medium text-gray-700">{rating}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 w-16 text-right">{count} ({percentage.toFixed(0)}%)</span>
                </div>
              );
            })}
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

          {/* Rating Filter */}
          <div className="mb-4">
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {ratingOptions.map(option => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by customer, product, seller, or review content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Bulk Actions */}
          {selectedReviews.length > 0 && (
            <div className="mt-4 flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <span className="text-sm text-red-700">
                {selectedReviews.length} review{selectedReviews.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('approve')}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleBulkAction('reject')}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleBulkAction('flag')}
                  className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition-colors"
                >
                  Flag
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reviews Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredReviews.length === 0 ? (
            <div className="p-12 text-center">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No reviews found
              </h3>
              <p className="text-gray-600">
                {reviews.length === 0
                  ? "No reviews have been submitted yet."
                  : "No reviews match your current filters."}
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
                          checked={selectedReviews.length === filteredReviews.length && filteredReviews.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedReviews(filteredReviews.map(r => r.id));
                            } else {
                              setSelectedReviews([]);
                            }
                          }}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Review & Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product & Seller
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
                    {filteredReviews.map(review => (
                      <ReviewRow key={review.id} review={review} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Showing {filteredReviews.length} of {reviews.length} reviews
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

export default ReviewsRatings;
