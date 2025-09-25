import React, { useState, useEffect, useRef } from 'react';
import { Star, MapPin, ShoppingCart, Heart, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductListing = ({ title, subtitle, products: initialProducts, gradient, icon: Icon }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const observerRef = useRef();

  // Initialize with first batch
  useEffect(() => {
    setProducts(initialProducts.slice(0, 6));
    setPage(1);
  }, [initialProducts]);

  // Load more products function
  const loadMoreProducts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const startIndex = page * 6;
      const endIndex = startIndex + 6;
      const nextProducts = initialProducts.slice(startIndex, endIndex);

      if (nextProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts(prev => [...prev, ...nextProducts]);
        setPage(prev => prev + 1);
      }

      setLoading(false);
    }, 800);
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [products, hasMore, loading]);

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Best Seller': return 'bg-orange-500';
      case 'Gaming': return 'bg-blue-500';
      case 'Trending': return 'bg-purple-500';
      case 'New': return 'bg-green-500';
      case 'Hot Deal': return 'bg-red-500';
      case 'Top Rated': return 'bg-yellow-500';
      default: return 'bg-primary-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`${gradient} text-white p-6`}>
        <div className="flex items-center space-x-3 mb-2">
          <Icon className="w-6 h-6" />
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        <p className="text-white/90">{subtitle}</p>
        <div className="mt-4 bg-white/20 rounded-lg p-3">
          <p className="text-sm">{products.length} products available</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          {products.map((product, index) => (
            <Link
              key={`${product.id}-${index}`}
              to={`/product/${product.id}`}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover"
                />
                {/* Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`text-white text-xs px-2 py-1 rounded-full font-bold ${getBadgeColor(product.badge)}`}>
                    {product.badge}
                  </span>
                </div>
                {/* Discount */}
                {product.discount && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      -{product.discount}%
                    </span>
                  </div>
                )}
                {/* Heart Icon - Commented out as requested */}
                {/* <div className="absolute bottom-2 right-2">
                  <button className="w-7 h-7 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div> */}
              </div>

              <div className="p-3">
                {/* Location */}
                <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                  <MapPin className="w-3 h-3" />
                  <span>{product.location}</span>
                </div>

                {/* Product Name */}
                <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                  {product.name}
                </h4>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-2">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600">{product.rating}</span>
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-primary-600">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <div className="text-xs text-gray-500 line-through">
                        Rs. {product.originalPrice.toLocaleString()}
                      </div>
                    )}
                  </div>
                  <button className="w-7 h-7 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Loading Indicator */}
        <div ref={observerRef} className="flex justify-center items-center py-8">
          {loading && (
            <div className="flex items-center space-x-2 text-primary-600">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-600 border-t-transparent"></div>
              <span className="text-sm">Loading more products...</span>
            </div>
          )}
          {!hasMore && products.length > 0 && (
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-2">You've seen all products!</p>
              <div className="flex items-center justify-center space-x-1 text-primary-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Browse other categories</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;