import React, { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import { useChat } from "../../../hooks/useChat";
import ChatManager from "../../shared/chat/ChatManager";
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
} from "lucide-react";

const ProductView = () => {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reviewsContainerRef = useRef(null);

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

    try {
      await addToCart(product, 1);
      // You could add a toast notification here
    } catch (error) {
      console.error("Error adding to cart:", error);
      // You could add an error toast here
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
        const response = await publicApi.get(`/products/public/${id}`);

        if (response.data.success) {
          setProduct(response.data.data);
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
  }, [id]);

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
        originalPrice: null, // No original price field in current schema
        discount: 0, // No discount calculation without original price
        rating: 4.5, // Default rating - you can implement actual ratings later
        reviewCount: product.inquiry_count || 0, // Use inquiry count as proxy
        images:
          Array.isArray(product.images) && product.images.length > 0
            ? product.images
                .map((img) => {
                  const imageUrl = img.image_url || img;
                  // If the URL starts with /, prepend the backend base URL
                  return imageUrl.startsWith("/")
                    ? `${
                        import.meta.env.VITE_API_URL?.replace("/api", "") ||
                        "http://localhost:5001"
                      }${imageUrl}`
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

  // Mock reviews (you can implement actual reviews later)
  const reviews = [];

  // Mock similar products (you can implement actual similar products later)
  const similarProducts = [];

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
        ? product.seller_image.startsWith("http")
          ? product.seller_profile_image
          : `${
              import.meta.env.VITE_API_URL?.replace("/api", "") ||
              "http://localhost:5001"
            }${product.seller_image}`
        : null,
    };

    openChat(sellerData, processedProduct);
  };

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      await addToCart(product, 1);
      navigate('/checkout');
    } catch (error) {
      console.error("Buy Now error:", error);
      // Optionally show an error to the user
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
      : `${
          import.meta.env.VITE_API_URL?.replace("/api", "") ||
          "http://localhost:5001"
        }${product.seller_image}`
    : product.seller_profile_image; // Fallback to profile image

  const sellerName =
    `${product.seller_first_name || ""} ${
      product.seller_last_name || ""
    }`.trim() || "Unknown Seller";

  return (
    <div className="min-h-screen max-w-[85%] mx-auto bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-600">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              to={`/shop?category=${encodeURIComponent(
                processedProduct.category?.toLowerCase() || ""
              )}`}
              className="hover:text-primary-600"
            >
              {processedProduct.category}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              to={`/shop?category=${encodeURIComponent(
                processedProduct.category?.toLowerCase() || ""
              )}&subcategory=${encodeURIComponent(
                processedProduct.subCategory?.toLowerCase() || ""
              )}`}
              className="hover:text-primary-600"
            >
              {processedProduct.subCategory}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 truncate">
              {processedProduct.name}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Product Images & Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative bg-gray-50 rounded-xl overflow-hidden h-80 sm:h-96 lg:h-80 xl:h-96">
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
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentImageIndex
                          ? "bg-primary-600"
                          : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-1 overflow-x-auto pb-2">
                {processedProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-12 h-12 bg-gray-50 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${
                      index === currentImageIndex
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
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  {processedProduct.name}
                </h1>
                <p className="text-gray-600 leading-relaxed">
                  {processedProduct.shortDescription}
                </p>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(processedProduct.rating)
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
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  Rs. {processedProduct.price.toLocaleString()}
                </span>
                {processedProduct.originalPrice && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      Rs. {processedProduct.originalPrice.toLocaleString()}
                    </span>
                    <span className="bg-red-100 text-red-800 text-sm font-semibold px-2 py-1 rounded">
                      -{processedProduct.discount}%
                    </span>
                  </>
                )}
              </div>

              {/* Product Specifications */}
              {processedProduct.categoryAttributes &&
                processedProduct.categoryAttributes.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Product Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {processedProduct.categoryAttributes
                        .filter(
                          (attr) =>
                            attr.display_value &&
                            attr.display_value.trim() !== "" &&
                            attr.display_value !== "null" &&
                            attr.display_value !== "undefined"
                        )
                        .map((attr, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg"
                          >
                            <span className="text-sm font-medium text-gray-700">
                              {attr.field_label}
                            </span>
                            <span className="text-sm text-gray-900 font-semibold">
                              {attr.display_value}
                            </span>
                          </div>
                        ))}
                    </div>
                    {processedProduct.categoryAttributes.filter(
                      (attr) =>
                        attr.display_value &&
                        attr.display_value.trim() !== "" &&
                        attr.display_value !== "null" &&
                        attr.display_value !== "undefined"
                    ).length === 0 && (
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
                )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={
                    cartLoading ||
                    (processedProduct?.stock_quantity !== undefined &&
                      processedProduct.stock_quantity <= 0)
                  }
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                    inCart
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-primary-600 text-white hover:bg-primary-700"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {cartLoading
                    ? "Adding..."
                    : inCart
                    ? `In Cart (${cartQuantity})`
                    : "Add to Cart"}
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors">
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
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Seller Information
          </h3>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              {sellerImageUrl ? (
                <img
                  src={sellerImageUrl}
                  alt={`${sellerName}'s profile`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <Store className="w-8 h-8 text-white" />
                </div>
              )}
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-gray-900">
                    {processedProduct.seller.name}
                  </h4>
                  {processedProduct.seller.verified && (
                    <Award className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div className="flex items-center space-x-1 mb-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(processedProduct.seller.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    {processedProduct.seller.rating}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({processedProduct.seller.totalReviews.toLocaleString()}{" "}
                    reviews)
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Member since {processedProduct.seller.memberSince}</p>
                  <p>Response time: {processedProduct.seller.responseTime}</p>
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
                <p className="text-sm text-gray-600">
                  {processedProduct.shipping.deliveryTime}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Easy Returns</h4>
                <p className="text-sm text-gray-600">
                  {processedProduct.shipping.returnPolicy}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Buyer Protection
                </h4>
                <p className="text-sm text-gray-600">100% guaranteed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div
          id="reviews"
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Customer Reviews
          </h3>

          {/* Review Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {reviewFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedReviewFilter(filter.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedReviewFilter === filter.key
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
              <div
                key={review.id}
                className="border-b border-gray-100 pb-4 last:border-b-0"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-600">
                        {review.user.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">
                          {review.user}
                        </span>
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
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {review.date}
                        </span>
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
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Similar Products
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {similarProducts.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-white rounded-lg overflow-hidden mb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.name}
                </h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-primary-600">
                    Rs. {item.price.toLocaleString()}
                  </span>
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
