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
  ShoppingCart
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        originalPrice: parseFloat(product.cost) || 0,
        cost: parseFloat(product.cost) || 0,
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
      const itemToCheckout = { ...processedProduct, quantity: 1 };
      const subtotal = itemToCheckout.price;
      const itemCount = 1;

      // Calculate shipping based on weight (weight_kg × Rs. 200/kg)
      const SHIPPING_RATE_PER_KG = 200;
      const weight = parseFloat(product.weight_kg || 1.0);
      const shipping = weight * SHIPPING_RATE_PER_KG;

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

  const sellerName =
    `${product.seller_first_name || ""} ${
      product.seller_last_name || ""
    }`.trim() || "Unknown Seller";

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 lg:hidden">
        <div className="px-4 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-600">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 truncate">
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
                className="relative bg-gray-50 lg:rounded-xl overflow-hidden h-64 sm:h-96"
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
              <div className="flex gap-1 overflow-x-auto pb-2 px-4 lg:px-0">
                {processedProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${
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
            <div className="space-y-6 px-4 lg:px-0">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
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

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleAddToCart}
                  disabled={
                    cartLoading ||
                    (processedProduct?.stock_quantity !== undefined &&
                      processedProduct.stock_quantity <= 0)
                  }
                  className={`w-auto py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                    inCart
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
                <button className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
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
              {processedProduct.categoryAttributes &&
                processedProduct.categoryAttributes.length > 0 ? (
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
              <div className="flex items-center space-x-4 mb-4">
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
                  <h4 className="font-bold text-gray-900 text-lg">{sellerName}</h4>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{processedProduct.seller.rating}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleOpenChat}
                className="w-full md:w-48 bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat with Seller</span>
              </button>
            </div>
          </details>

          <details className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 group">
            <summary className="font-bold text-lg cursor-pointer flex justify-between items-center">
              Reviews
              <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
            </summary>
            <div className="pt-4">
              {/* Reviews will go here */}
            </div>
          </details>
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