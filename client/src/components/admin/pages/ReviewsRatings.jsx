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
import api from '../../../../api/axios';

const ReviewsRatings = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState([]);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const filterOptions = [
    { key: 'all', label: 'All Reviews', count: 0, color: 'gray' },
    { key: 'pending', label: 'Pending', count: 0, color: 'yellow' },
    { key: 'approved', label: 'Approved', count: 0, color: 'green' },
    { key: 'rejected', label: 'Rejected', count: 0, color: 'red' },
    // { key: 'flagged', label: 'Flagged', count: 0, color: 'orange' }, // Backend doesn't support flagged filter yet explicitly in query param unless status='flagged' which is not the case usually
    // We will stick to status filters supported by backend: approved, pending, rejected.
  ];

  const ratingOptions = [
    { key: 'all', label: 'All Ratings' },
    { key: '5', label: '5 Stars' },
    { key: '4', label: '4 Stars' },
    { key: '3', label: '3 Stars' },
    { key: '2', label: '2 Stars' },
    { key: '1', label: '1 Star' }
  ];

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery,
        status: selectedFilter,
        rating: selectedRating
      };
      
      const response = await api.get('/admin/reviews', { params });
      
      if (response.data.success) {
        setReviews(response.data.reviews);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages
        }));
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [pagination.page, searchQuery, selectedFilter, selectedRating]);

  // Debounced search (optional, relying on useEffect for now)

  const handleReviewAction = async (action, reviewId) => {
    try {
      let status = null;
      if (action === 'approve') status = 'approved';
      if (action === 'reject') status = 'rejected';
      
      if (status) {
        const response = await api.patch(`/admin/reviews/${reviewId}/status`, { status });
        if (response.data.success) {
          // Refresh list
          fetchReviews();
        }
      }
      
      if (action === 'view') {
        const review = reviews.find(r => r.id === reviewId);
        if (review) {
          alert(`Review Details:\n\nTitle: ${review.title}\nComment: ${review.comment}`);
        }
      }
      
      // Other actions like flag/unflag/delete can be implemented here
      if (action === 'delete') {
         if(window.confirm("Are you sure you want to delete this review?")) {
            await api.delete(`/admin/reviews/${reviewId}`);
            fetchReviews();
         }
      }

    } catch (error) {
      console.error(`Error performing action ${action}:`, error);
      alert("Failed to update review status");
    }
  };

  const handleBulkAction = async (action) => {
    // Implement bulk actions if backend supports it, looping for now
    if (selectedReviews.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to ${action} ${selectedReviews.length} reviews?`)) return;

    try {
        for (const id of selectedReviews) {
            await handleReviewAction(action, id);
        }
        setSelectedReviews([]);
        fetchReviews();
    } catch (error) {
        console.error("Error in bulk action:", error);
    }
  };

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
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
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

          {review.images && review.images.length > 0 && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Package className="w-3 h-3" />
              <span>{review.images.length} image{review.images.length > 1 ? 's' : ''}</span>
            </div>
          )}

          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <ThumbsUp className="w-3 h-3" />
              <span>{review.helpful || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ThumbsDown className="w-3 h-3" />
              <span>{review.notHelpful || 0}</span>
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-sm">
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{review.customerName}</div>
          <div className="text-gray-500">{review.customerEmail}</div>
          {review.verified === 1 && (
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
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="space-y-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(review.status)}`}>
            {review.status ? review.status.toUpperCase() : 'PENDING'}
          </span>
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
                      onClick={() => handleReviewAction('delete', review.id)}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Delete Review</span>
                    </button>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );

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
              onClick={fetchReviews}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
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
        </div>

        {/* Reviews Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
             <div className="p-12 text-center">
                 <RefreshCw className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
                 <p className="text-gray-600">Loading reviews...</p>
             </div>
          ) : reviews.length === 0 ? (
            <div className="p-12 text-center">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No reviews found
              </h3>
              <p className="text-gray-600">
                No reviews match your current filters.
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
                          checked={selectedReviews.length === reviews.length && reviews.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedReviews(reviews.map(r => r.id));
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
                    {reviews.map(review => (
                      <ReviewRow key={review.id} review={review} />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Showing {reviews.length} of {pagination.total} reviews
                  </p>
                  <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => setPagination(p => ({...p, page: p.page - 1}))}
                        disabled={pagination.page <= 1}
                        className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm disabled:opacity-50">
                      Previous
                    </button>
                    <button 
                        onClick={() => setPagination(p => ({...p, page: p.page + 1}))}
                        disabled={pagination.page >= pagination.totalPages}
                        className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm disabled:opacity-50">
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
