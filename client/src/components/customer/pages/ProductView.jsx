import React, { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import { useChat } from "../../../hooks/useChat";
import ChatManager from "../../shared/chat/ChatManager";
import ProductReviews from "../sections/ProductReviews";
import { publicApi } from "../../../api/axios";
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
  Award,
  ShoppingCart,
  AlertCircle
} from "lucide-react";

export const ProductView = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const {
    addToCart,
    isInCart,
    getItemQuantity,
    loading: cartLoading,
  } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedReviewFilter, setSelectedReviewFilter] = useState("all");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const reviewsContainerRef = useRef(null);
  const touchStartX = useRef(0);

  // Chat functionality
  const navigate = useNavigate();
  const {
    activeChats,
    openChat,
    closeChat,
    minimizeChat,
    maximizeChat,
    toggleMinimize,
  } = useChat();

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product) return;

    // Check if variants exist but none selected
    if (processedProduct?.variants?.length > 0 && !selectedVariant) {
      alert("Please select a variation (Size/Color) before adding to cart.");
      return;
    }

    try {
      // Pass the selected variant with the product
      const productToAdd = {
        ...processedProduct,
        selectedVariant: selectedVariant
      };

      await addToCart(productToAdd, 1);
      // You could add a toast notification here
    } catch (error) {
      console.error("Error adding to cart:", error);
      // You could add an error toast here
    }
  };

  // Handle share product
  const handleShare = async () => {
    if (!product) return;

    const shareData = {
      title: product.product_title,
      text: `Check out ${product.product_title} - Rs. ${parseFloat(product.price).toLocaleString()}`,
      url: window.location.href
    };

    try {
      // Check if Web Share API is supported (mobile devices)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Product link copied to clipboard!');
      }
    } catch (error) {
      // User cancelled share or other error
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
        // Fallback: try to copy to clipboard
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert('Product link copied to clipboard!');
        } catch (clipboardError) {
          console.error('Clipboard error:', clipboardError);
          alert('Unable to share. Please copy the URL manually.');
        }
      }
    }
  };

  // Get cart info for this product
  const productId = product?.product_id;
  const inCart = productId ? isInCart(productId) : false;
  const cartQuantity = productId ? getItemQuantity(productId) : 0;

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        setSelectedVariant(null); // Reset variant
        setAttributeSelection({}); // Reset selection
        setProduct(null); // Reset product to avoid stale data
        const response = await publicApi.get(`/products/public/${id}`);

        if (response.data.success) {
          setProduct(response.data.data);
          // Increment view count
          publicApi.post(`/products/${id}/view`).catch(err => console.error('Failed to increment view', err));
        } else {
          setError("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    // Scroll to top when product ID changes
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch similar products
  useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (!product?.category_slug) return;

      try {
        const response = await publicApi.get('/products/public', {
          params: {
            category: product.category_slug,
            limit: 4
          }
        });

        if (response.data.success) {
          const formattedSimilar = response.data.data
            .filter(p => p.product_id !== product.product_id)
            .slice(0, 3)
            .map(p => ({
              id: p.product_id,
              name: p.product_title,
              image: p.images && p.images.length > 0 ? p.images[0].image_url : null,
              price: parseFloat(p.price),
              rating: 4.5, // Placeholder
              reviews: p.inquiry_count || 0
            }));
          setSimilarProducts(formattedSimilar);
        }
      } catch (error) {
        console.error("Error fetching similar products:", error);
      }
    };

    if (product) {
      fetchSimilarProducts();
    }
  }, [product]);

  // Process product data
  const processedProduct = product
    ? {
      id: product.product_id,
      product_id: product.product_id, // For chat navigation
      seller_id: product.seller_id, // For chat navigation
      name: product.product_title || "Untitled Product",
      shortDescription:
        product.product_description || "No description available",
      price: parseFloat(product.price) || 0,
      marketPrice: parseFloat(product.market_price) || 0,
      originalPrice: parseFloat(product.market_price) || 0,
      cost: parseFloat(product.cost) || 0,
      shipping_cost: parseFloat(product.shipping_cost || 0),
      rating: parseFloat(product.average_rating) || 0,
      reviewCount: parseInt(product.review_count) || 0,
      images:
        Array.isArray(product.images) && product.images.length > 0
          ? product.images
            .map((img) => {
              const imageUrl = img.image_url || img;
              // If the URL starts with /, prepend the backend base URL
              return imageUrl.startsWith("/")
                ? imageUrl
                : imageUrl;
            })
            .filter(Boolean)
          : ["https://via.placeholder.com/800x600?text=No+Image"],
      category: product.category_name || "Unknown",
      subCategory: product.sub_category_name || "General",
      brand: product.product_attributes?.brand || "Unknown",
      condition: "New", // Default condition
      warranty: product.product_attributes?.warranty
        ? `${product.product_attributes.warranty} months`
        : "No warranty specified",
      location: product.location_city_name || "Location not specified",
      categoryAttributes: product.category_attributes || [], // Dynamic fields from backend
      // Parse variants
      variants: product.variants ? (Array.isArray(product.variants) ? product.variants : JSON.parse(product.variants)) : [],
      seller: {
        name: product.seller_name || "Unknown Seller",
        rating: 4.5, // Default seller rating
        totalReviews: 0, // Default review count
        memberSince: product.created_at
          ? new Date(product.created_at).getFullYear()
          : "2024",
        responseTime: "< 1 hour", // Default response time
        verified: true, // Default verification status
      },
      features: product.product_attributes
        ? Object.entries(product.product_attributes)
          .map(([key, value]) => `${key}: ${value}`)
          .filter((f) => f.includes(":") && !f.endsWith(": "))
        : [],
      shipping: {
        freeShipping: true,
        deliveryTime: "1-2 days",
        returnPolicy: "7 days",
      },
    }
    : null;

  // Extract unique attributes from variants
  // Extract unique attributes from variants
  const variantAttributes = React.useMemo(() => {
    if (!processedProduct?.variants?.length) return null;

    const attributesMap = {};
    processedProduct.variants.forEach(v => {
      if (!v.attributes) return;
      const attrs = typeof v.attributes === 'string' ? JSON.parse(v.attributes) : v.attributes;

      Object.entries(attrs).forEach(([key, val]) => {
        if (!attributesMap[key]) attributesMap[key] = new Set();
        if (val) attributesMap[key].add(val);
      });
    });

    return Object.entries(attributesMap).map(([key, valueInfo]) => ({
      name: key,
      values: Array.from(valueInfo)
    }));
  }, [processedProduct]);

  // Helper to get available values for an attribute based on other selections
  const getAvailableValues = (attributeName) => {
    if (!processedProduct?.variants) return [];

    // Filter variants that match ALL currently selected attributes EXCEPT the one we are checking
    const relevantVariants = processedProduct.variants.filter(v => {
      if (!v.attributes) return false;
      const content = typeof v.attributes === 'string' ? JSON.parse(v.attributes) : v.attributes;
      if (!content) return false;

      // Check if variant matches current selection for all OTHER attributes
      return Object.entries(attributeSelection).every(([key, val]) => {
        if (key === attributeName) return true; // Ignore the attribute we are currently listing values for
        return content[key] === val;
      });
    });

    // Extract unique values for the target attribute from these relevant variants
    const values = new Set();
    relevantVariants.forEach(v => {
      const content = typeof v.attributes === 'string' ? JSON.parse(v.attributes) : v.attributes;
      if (content && content[attributeName]) values.add(content[attributeName]);
    });

    return Array.from(values);
  };

  // Common colors map
  const colorMap = {
    'Red': '#FF0000', 'Blue': '#3B82F6', 'Green': '#22C55E', 'Black': '#000000',
    'White': '#FFFFFF', 'Yellow': '#EAB308', 'Purple': '#A855F7', 'Orange': '#F97316',
    'Pink': '#EC4899', 'Grey': '#6B7280', 'Brown': '#78350F', 'Beige': '#F5F5DC',
    'Multicolor': 'linear-gradient(to right, red, blue, green)'
  };

  // Helper to check if a combination is available
  const getVariantForSelection = (currentSelection) => {
    if (!processedProduct?.variants) return null;
    return processedProduct.variants.find(v => {
      const content = typeof v.attributes === 'string' ? JSON.parse(v.attributes) : v.attributes;
      // Check if all selected keys match
      return Object.entries(currentSelection).every(([key, val]) => content[key] === val);
    });
  };

  // State for attribute selection
  const [attributeSelection, setAttributeSelection] = useState({});

  // Reset selection when product changes
  useEffect(() => {
    setAttributeSelection({});
    setSelectedVariant(null);
  }, [processedProduct?.id]);

  // Update selected variant when selection changes
  useEffect(() => {
    if (!variantAttributes || variantAttributes.length === 0) {
      setSelectedVariant(null);
      return;
    }

    // Check if all needed attributes are selected
    const allSelected = variantAttributes.every(attr => attributeSelection[attr.name]);

    if (allSelected) {
      const mappedVariant = getVariantForSelection(attributeSelection);
      setSelectedVariant(mappedVariant || null);

      // Optionally update image if variant has one
      if (mappedVariant && mappedVariant.image_url && processedProduct.images) {
        const idx = processedProduct.images.indexOf(mappedVariant.image_url);
        if (idx !== -1) setCurrentImageIndex(idx);
      }
    } else {
      setSelectedVariant(null);
    }
  }, [attributeSelection, variantAttributes]);

  // Determine current display price
  const displayPrice = selectedVariant ? parseFloat(selectedVariant.price) : (processedProduct ? processedProduct.price : 0);
  const displayStock = selectedVariant ? selectedVariant.stock_quantity : (processedProduct ? processedProduct.stock_quantity : 0);

  // Mock reviews (you can implement actual reviews later)
  const reviews = [];

  // Review filters
  const reviewFilters = [
    { key: "all", label: "All Reviews", count: reviews.length },
  ];

  const nextImage = () => {
    if (processedProduct?.images) {
      setCurrentImageIndex(
        (prev) => (prev + 1) % processedProduct.images.length
      );
    }
  };

  const prevImage = () => {
    if (processedProduct?.images) {
      setCurrentImageIndex(
        (prev) =>
          (prev - 1 + processedProduct.images.length) %
          processedProduct.images.length
      );
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    if (touchStartX.current - touchEndX > 50) {
      nextImage();
    } else if (touchEndX - touchStartX.current > 50) {
      prevImage();
    }
  };

  const filteredReviews =
    selectedReviewFilter === "all"
      ? reviews
      : reviews.filter((review) => review.tags.includes(selectedReviewFilter));

  const displayedReviews = showAllReviews
    ? filteredReviews
    : filteredReviews.slice(0, 3);

  const handleOpenChat = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!product) return;

    // Load values from database
    const sellerData = {
      id: product.seller_id,
      name:
        `${product.seller_first_name} ${product.seller_last_name}`.trim() ||
        "Unknown Seller",
      email: product.seller_email || "seller@example.com",
      rating: product.seller_rating || 4.5,
      isOnline: true,
      verified: product.seller_verified || true,
      responseTime: "< 1 hour",
      image: product.seller_image
    };

    openChat(sellerData, processedProduct);
  };

  const handleBuyNow = async () => {
    if (!product) return;
    if (processedProduct?.variants?.length > 0 && !selectedVariant) {
      alert("Please select a variation (Size/Color) before buying.");
      return;
    }

    try {
      // Create checkout item with correct price/variant
      const itemToCheckout = {
        ...processedProduct,
        price: displayPrice,
        selectedVariant: selectedVariant,
        quantity: 1
      };
      const subtotal = itemToCheckout.price;
      const itemCount = 1;

      // Use shipping_cost from product table
      const shipping = parseFloat(processedProduct.shipping_cost || 0);

      const total = subtotal + shipping;

      navigate('/checkout', {
        state: {
          items: [itemToCheckout],
          subtotal,
          itemCount,
          shipping,
          total,
          isDirectBuy: true
        }
      });
    } catch (error) {
      console.error("Buy Now error:", error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !processedProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-gray-400 mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The product you are looking for does not exist."}
          </p>
          <Link
            to="/shop"
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const sellerImageUrl = product.seller_image
    ? product.seller_image.startsWith("http")
      ? product.seller_image // Assuming this is the correct full URL
      : product.seller_image
    : product.seller_profile_image; // Fallback to profile image

  const sellerName = product.seller_name || "Unknown Seller";

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50">
      {/* Breadcrumb - Mobile */}
      <div className="bg-white border-b border-gray-200 lg:hidden">
        <div className="px-4 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600 overflow-x-auto">
            <Link to="/" className="hover:text-primary-600 whitespace-nowrap">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <Link
              to={`/shop?category=${product?.category_slug || ''}`}
              className="hover:text-primary-600 whitespace-nowrap"
            >
              {processedProduct.category}
            </Link>
            {processedProduct.subCategory && processedProduct.subCategory !== 'General' && (
              <>
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
                <span className="text-gray-500 whitespace-nowrap">{processedProduct.subCategory}</span>
              </>
            )}
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            <span className="text-gray-900 truncate">
              {processedProduct.name}
            </span>
          </div>
        </div>
      </div>

      {/* Breadcrumb - Desktop */}
      <div className="hidden lg:block bg-white border-b border-gray-200">
        <div className="px-4 py-4 max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              to={`/shop?category=${product?.category_slug || ''}`}
              className="hover:text-primary-600 transition-colors"
            >
              {processedProduct.category}
            </Link>
            {processedProduct.subCategory && processedProduct.subCategory !== 'General' && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-500">{processedProduct.subCategory}</span>
              </>
            )}
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">
              {processedProduct.name}
            </span>
          </div>
        </div>
      </div>

      <div className="lg:px-4 lg:py-6 space-y-6">
        {/* Product Images & Basic Info */}
        <div className="bg-white lg:rounded-xl lg:shadow-sm lg:border lg:border-gray-100 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div
                className="relative bg-white lg:rounded-xl overflow-hidden aspect-square flex items-center justify-center p-4 border border-gray-100"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  src={processedProduct.images[currentImageIndex]}
                  alt={processedProduct.name}
                  className="w-full h-full object-contain"
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
                  {processedProduct.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${index === currentImageIndex
                        ? "bg-primary-600"
                        : "bg-white/50"
                        }`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-1 overflow-x-auto pb-2 px-4 lg:px-0">
                {processedProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${index === currentImageIndex
                      ? "border-primary-600"
                      : "border-transparent hover:border-gray-300"
                      }`}
                  >
                    <img
                      src={image}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6 px-4 lg:px-0">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {processedProduct.name}
                </h1>

              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(processedProduct.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-gray-900">
                    {processedProduct.rating}
                  </span>
                </div>
                <span className="text-gray-500">•</span>
                <Link
                  to="#reviews"
                  className="text-primary-600 hover:underline"
                >
                  {processedProduct.reviewCount.toLocaleString()} reviews
                </Link>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary-600">
                  Rs. {displayPrice.toLocaleString()}
                </span>
                {processedProduct.marketPrice > 0 && processedProduct.marketPrice > displayPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      Rs. {processedProduct.marketPrice.toLocaleString()}
                    </span>
                    <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded">
                      {Math.round(((processedProduct.marketPrice - displayPrice) / processedProduct.marketPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Variant Selection */}
              {variantAttributes && variantAttributes.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-6">
                  {variantAttributes.map(attr => {
                    // Check available values dynamically based on other selections
                    const availableValues = getAvailableValues(attr.name);
                    const isColor = attr.name.toLowerCase() === 'color';

                    return (
                      <div key={attr.name}>
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-sm font-semibold text-gray-900">{attr.name}: <span className="text-primary-600 font-normal">{attributeSelection[attr.name]}</span></h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {attr.values.map(val => {
                            const isSelected = attributeSelection[attr.name] === val;
                            const isAvailable = availableValues.includes(val);
                            // Special handling for Colors
                            if (isColor) {
                              const hexColor = colorMap[val] || val;
                              return (
                                <button
                                  key={val}
                                  onClick={() => isAvailable && setAttributeSelection(prev => ({ ...prev, [attr.name]: val }))}
                                  disabled={!isAvailable}
                                  className={`
                                        group relative w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all
                                        ${isSelected
                                      ? 'border-primary-600 ring-2 ring-primary-100 ring-offset-2 scale-110'
                                      : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                                    }
                                        ${!isAvailable ? 'opacity-30 cursor-not-allowed grayscale' : 'cursor-pointer'}
                                      `}
                                  title={val}
                                  style={{ background: hexColor === 'White' || hexColor === '#FFFFFF' ? '#FFFFFF' : hexColor }}
                                >
                                  {/* Inner dot for white colors or selected state */}
                                  {isAvailable && (isSelected || hexColor === 'White' || hexColor === '#FFFFFF') && (
                                    <span className="sr-only">{val}</span>
                                  )}
                                  {/* Checkmark for selected */}
                                  {isSelected && (
                                    <div className={`w-3 h-3 rounded-full ${hexColor === 'White' || hexColor === '#FFFFFF' ? 'bg-primary-600' : 'bg-white'}`}></div>
                                  )}
                                </button>
                              );
                            }

                            // Standard Pill
                            return (
                              <button
                                key={val}
                                onClick={() => isAvailable && setAttributeSelection(prev => ({ ...prev, [attr.name]: val }))}
                                disabled={!isAvailable}
                                className={`
                                    px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm
                                    ${isSelected
                                    ? 'bg-primary-600 text-white shadow-primary-500/30 ring-2 ring-primary-100 ring-offset-1'
                                    : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                  }
                                    ${!isAvailable
                                    ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-100 shadow-none'
                                    : 'active:scale-95'
                                  }
                                  `}
                              >
                                {val}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )
                  })}

                  {/* Selection Status */}
                  {selectedVariant ? (
                    <div className="flex items-center text-sm bg-green-50 text-green-700 p-3 rounded-lg border border-green-100 animate-fadeIn">
                      <Shield className="w-4 h-4 mr-2" />
                      <span className="font-medium">In Stock</span>
                      <span className="mx-2">•</span>
                      <span>{selectedVariant.stock_quantity} available</span>
                    </div>
                  ) : (
                    Object.keys(attributeSelection).length > 0 && (
                      <div className="flex items-center text-sm bg-orange-50 text-orange-700 p-3 rounded-lg border border-orange-100">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        <span>Please select all options to check availability.</span>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Stock Message if no variants */}
              {(!variantAttributes || variantAttributes.length === 0) && (
                <div className="text-sm text-gray-500 mb-2">
                  Stock: {processedProduct.stock_quantity || 0} available
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleAddToCart}
                  disabled={
                    cartLoading ||
                    (displayStock <= 0) ||
                    (variantAttributes && variantAttributes.length > 0 && !selectedVariant)
                  }
                  className={`w-auto py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${inCart
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-primary-600 text-white hover:bg-primary-700"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>
                    {cartLoading
                      ? "Adding..."
                      : inCart
                        ? `In Cart (${cartQuantity})`
                        : "Add to Cart"}
                  </span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-auto bg-gray-800 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center justify-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Buy Now</span>
                </button>
                <button
                  onClick={handleShare}
                  className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors hover:scale-105 active:scale-95"
                  title="Share this product"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-4 px-4 lg:px-0">
          <details className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 group" open>
            <summary className="font-bold text-lg cursor-pointer flex justify-between items-center">
              Product Details
              <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
            </summary>
            <div className="pt-4">
              {processedProduct.shortDescription ? (
                <div className="whitespace-pre-wrap text-gray-600 leading-relaxed">
                  {processedProduct.shortDescription}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📋</div>
                  <p className="text-sm">
                    No additional specifications available.
                  </p>
                  <p className="text-xs mt-1">
                    Check the product description for more details.
                  </p>
                </div>
              )}
            </div>
          </details>

          <details className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 group">
            <summary className="font-bold text-lg cursor-pointer flex justify-between items-center">
              Seller Information
              <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
            </summary>
            <div className="pt-4">
              {/* Seller Info Hidden as per request
              <div className="flex items-center space-x-4 mb-4">
                {sellerImageUrl ? (
                  <img
                    src={sellerImageUrl}
                    alt={`${sellerName}'s profile`}
                    className="w-16 h-16 rounded-full object-contain border-2 border-gray-100"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <Store className="w-8 h-8 text-white" />
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{sellerName}</h4>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{processedProduct.seller.rating}</span>
                  </div>
                </div>
              </div>
              */}
              <button
                onClick={handleOpenChat}
                className="w-full md:w-48 bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat</span>
              </button>
            </div>
          </details>

          <details className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 group">
            <summary className="font-bold text-lg cursor-pointer flex justify-between items-center">
              Reviews
              <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
            </summary>
            <div className="pt-4">
              <ProductReviews productId={processedProduct.id} />
            </div>
          </details>
        </div>

        {/* Similar Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Similar Products
          </h3>
          <div className="flex overflow-x-auto pb-4 space-x-3 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:space-x-0 sm:gap-4 scrollbar-hide">
            {similarProducts.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="bg-gray-50 rounded-xl p-3 sm:p-4 hover:shadow-md transition-shadow flex-shrink-0 w-36 sm:w-auto"
              >
                <div className="aspect-square bg-white rounded-lg overflow-hidden mb-2 sm:mb-3 p-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2 text-sm sm:text-base">
                  {item.name}
                </h4>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 sm:mb-2 gap-1">
                  <span className="font-bold text-primary-600 text-sm sm:text-base">
                    Rs. {item.price.toLocaleString()}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                    <span className="text-xs sm:text-sm text-gray-600">{item.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 hidden sm:block">{item.reviews} reviews</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Footer for Mobile */}


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