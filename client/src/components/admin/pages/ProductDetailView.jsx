import React, { useState, useEffect } from 'react';
import { X, Package, Star, Store, Calendar, DollarSign, Tag, Layers, Archive, Info } from 'lucide-react';
import api from '../../../api/axios';

const ProductDetailView = ({ productId, initialData, onClose }) => {
  const [product, setProduct] = useState(initialData || null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        
        let response;
        try {
           response = await api.get(`/products/${productId}`);
        } catch (e) {
           // If 403, it means it's restricted to seller. Admin might need a specific route.
           // If we can't fetch, we stick to initialData
           console.warn("Could not fetch full details, using summary", e);
           setLoading(false);
           return;
        }

        if (response.data && response.data.success) {
            const p = response.data.data.product;
            const images = response.data.data.images;
            
            // Standardize structure
            setProduct({
                ...p,
                images: images || [],
                dynamicFields: p.product_attributes || {}
            });
        }
      } catch (error) {
        console.error('Failed to fetch product details', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId && (!initialData || !initialData.product_attributes)) {
        fetchProductDetails();
    } else {
        setLoading(false);
    }
  }, [productId, initialData]);

  if (loading && !product) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!product) return null;

  const formatPrice = (amount) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return 'N/A';
    return `Rs. ${num.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Helper to safely access images
  const getImages = () => {
      if (product.images && Array.isArray(product.images)) return product.images;
      return [];
  };
  
  const productImages = getImages();
  // Ensure activeImage is within bounds
  const currentImage = productImages[activeImage] || (productImages.length > 0 ? productImages[0] : null);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-100">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-50 rounded-lg">
                    <Package className="w-6 h-6 text-green-600" />
                </div>
                <div>
                   <h3 className="text-xl font-bold leading-6 text-gray-900" id="modal-title">
                     Product Details
                   </h3>
                   <p className="text-sm text-gray-500 mt-1">
                      SKU: {product.sku || 'N/A'} • Created on {formatDate(product.created_at)}
                   </p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors focus:outline-none"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-4 py-5 sm:p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Images */}
                <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center">
                        {currentImage ? (
                            <img 
                                src={currentImage.image_url || currentImage.url} 
                                alt={product.product_title} 
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="text-gray-400 flex flex-col items-center">
                                <Package className="w-16 h-16 mb-2" />
                                <span>No Image Available</span>
                            </div>
                        )}
                    </div>
                    
                    {productImages.length > 1 && (
                        <div className="grid grid-cols-5 gap-2">
                            {productImages.map((img, idx) => (
                                <button
                                    key={img.image_id || idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-green-600 ring-2 ring-green-100' : 'border-gray-200 opacity-60 hover:opacity-100'}`}
                                >
                                    <img 
                                        src={img.image_url || img.url} 
                                        alt={`Thumbnail ${idx}`} 
                                        className="w-full h-full object-cover" 
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Details */}
                <div className="space-y-6">
                    {/* Basic Info */}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.product_title}</h1>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                            <span className="flex items-center space-x-1"><Store className="w-4 h-4" /> <span>{product.seller_name || 'N/A'}</span></span>
                            <span className="flex items-center space-x-1"><Star className="w-4 h-4 text-yellow-400 fill-current" /> <span>{product.rating || 0} ({product.review_count || 0} reviews)</span></span>
                        </div>
                        <div className="flex items-baseline space-x-3 mb-4">
                            <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                            {product.market_price && parseFloat(product.market_price) > parseFloat(product.price) && (
                                <span className="text-lg text-gray-500 line-through">{formatPrice(product.market_price)}</span>
                            )}
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                             <div className="flex justify-between text-sm">
                                 <span className="text-gray-500">Status</span>
                                 <span className={`font-medium px-2 py-0.5 rounded-full text-xs uppercase ${
                                     product.product_status === 'active' ? 'bg-green-100 text-green-700' :
                                     product.product_status === 'pending_approval' ? 'bg-yellow-100 text-yellow-700' :
                                     'bg-red-100 text-red-700'
                                 }`}>
                                     {product.product_status}
                                 </span>
                             </div>
                             <div className="flex justify-between text-sm">
                                 <span className="text-gray-500">Stock Status</span>
                                 <span className={`font-medium ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                     {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of Stock'}
                                 </span>
                             </div>
                             <div className="flex justify-between text-sm">
                                 <span className="text-gray-500">Category</span>
                                 <span>{product.category_name} &gt; {product.sub_category_name}</span>
                             </div>
                        </div>
                    </div>

                    {/* Tabs / Sections */}
                    <div className="space-y-4">
                        <div className="border-t border-gray-100 pt-4">
                            <h4 className="font-semibold text-gray-900 flex items-center space-x-2 mb-2">
                                <Info className="w-4 h-4 text-green-600" />
                                <span>Description</span>
                            </h4>
                            <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                                {product.product_description || product.description || 'No description available.'}
                            </div>
                        </div>
                        
                        {/* Financials (Admin Only) */}
                        <div className="border-t border-gray-100 pt-4">
                             <h4 className="font-semibold text-gray-900 flex items-center space-x-2 mb-2">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <span>Financial Details</span>
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex justify-between p-2 bg-gray-50 rounded">
                                    <span className="text-gray-500">Cost Price</span>
                                    <span className="font-medium font-mono">{formatPrice(product.cost)}</span>
                                </div>
                                <div className="flex justify-between p-2 bg-gray-50 rounded">
                                    <span className="text-gray-500">Margin</span>
                                    <span className="font-medium font-mono text-green-600">
                                        {product.price && product.cost ? 
                                            `${((parseFloat(product.price) - parseFloat(product.cost)) / parseFloat(product.price) * 100).toFixed(1)}%` 
                                            : 'N/A'
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
          </div>

          {/* Footer actions */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;
