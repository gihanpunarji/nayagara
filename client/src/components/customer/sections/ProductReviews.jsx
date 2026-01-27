import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, User, CheckCircle, Image as ImageIcon, X } from 'lucide-react';
import api from '../../../api/axios';

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const fetchReviews = async () => {
    try {
      // Assuming backend supports filtering by productId
      const response = await api.get(`/reviews?productId=${productId}&limit=50`);
      if (response.data.success) {
        setReviews(response.data.data);
        calculateStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    if (!data.length) return;
    
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    
    data.forEach(review => {
      breakdown[Math.round(review.rating)] = (breakdown[Math.round(review.rating)] || 0) + 1;
      sum += review.rating;
    });

    setStats({
      average: (sum / data.length).toFixed(1),
      total: data.length,
      breakdown
    });
  };

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="text-gray-500 mt-2">Loading reviews...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">No Reviews Yet</h3>
        <p className="text-gray-500">Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-1">{stats.average}</div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    className={`w-5 h-5 ${star <= Math.round(stats.average) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500">{stats.total} Ratings</div>
            </div>
            
            {/* Breakdown Bars */}
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center text-sm">
                  <div className="w-8 text-gray-600 font-medium">{rating} ★</div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full mx-2 overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${(stats.breakdown[rating] / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-8 text-right text-gray-400">
                    {stats.breakdown[rating]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-700 font-bold text-sm">
                    {review.customerName ? review.customerName.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                
                <div>
                  <h4 className="font-bold text-gray-900 leading-tight">
                    {review.customerName || 'Anonymous User'}
                  </h4>
                  {review.verified && (
                    <div className="flex items-center text-xs text-green-600 mt-1">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified Purchase
                    </div>
                  )}
                  
                  <div className="flex items-center mt-2 space-x-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(review.reviewDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pl-14">
              <p className="text-gray-700 leading-relaxed text-sm">
                {review.comment}
              </p>
              
              {/* Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {review.images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 hover:border-primary-500 transition-colors focus:outline-none"
                    >
                      <img 
                        src={img} 
                        alt={`Review ${idx}`} 
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-90 p-4 animate-nav-in"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img 
            src={selectedImage} 
            alt="Enlarged Review" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
