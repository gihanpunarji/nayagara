import React, { useState } from 'react';
import { Star, X, Upload, Image as ImageIcon } from 'lucide-react';
import api from '../../../api/axios';

const ReviewModal = ({ isOpen, onClose, orderItem, onSuccess }) => {
  if (!isOpen || !orderItem) return null;

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 3) {
      alert('Maximum 3 images allowed');
      return;
    }

    const newImages = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push({
          file: file,
          preview: reader.result
        });
        
        if (newImages.length === files.length) {
          setImages(prev => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      alert('Please write a review');
      return;
    }

    const wordCount = comment.trim().split(/\s+/).length;
    if (wordCount > 150) {
      alert(`Review is too long (${wordCount}/150 words)`);
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('productId', orderItem.product_id);
      // orderItem.order_id might be directly on the item due to spread in Account.jsx
      formData.append('orderId', orderItem.order_id); 
      formData.append('rating', rating);
      formData.append('title', 'Review');
      formData.append('comment', comment);
      
      images.forEach((img) => {
        formData.append('images', img.file);
      });

      const response = await api.post('/reviews', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        alert('Review submitted successfully!');
        onSuccess();
        onClose();
      }
    } catch (error) {
      alert(error.response?.data?.error || error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl animate-scale-in">
        {/* Header */}
        <div className="bg-primary-50 px-6 py-4 flex justify-between items-center border-b border-primary-100">
          <h3 className="text-lg font-bold text-gray-900">Write a Review</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Product Info */}
          <div className="flex items-center space-x-4">
            <img 
              src={orderItem.product_image_url || '/placeholder.png'} 
              alt={orderItem.product_title} 
              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
            />
            <div>
              <p className="font-medium text-gray-900 line-clamp-1">{orderItem.product_title}</p>
              <p className="text-sm text-gray-500">Rate this product</p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star 
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating) 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-medium text-gray-600">
              {rating === 1 ? 'Poor' : 
               rating === 2 ? 'Fair' : 
               rating === 3 ? 'Good' : 
               rating === 4 ? 'Very Good' : 
               rating === 5 ? 'Excellent' : 'Select a Rating'}
            </p>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike? How was the quality?"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Max 150 words</span>
              <span className={comment.trim().split(/\s+/).length > 150 ? 'text-red-500' : ''}>
                {comment.trim() ? comment.trim().split(/\s+/).length : 0}/150
              </span>
            </div>
          </div>

          {/* Image Upload */}
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Photos (Optional)
            </label>
            <div className="flex items-center space-x-4">
              {/* Upload Button */}
              {images.length < 3 && (
                <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Add</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    disabled={uploading}
                  />
                </label>
              )}

              {/* Previews */}
              {images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 group">
                  <img 
                    src={img.preview} 
                    alt={`Preview ${idx}`} 
                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">Max 3 images.</p>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || uploading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <span>Submit Review</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
