import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, MapPin, Truck } from 'lucide-react';
import { publicApi } from '../../../api/axios';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false); // Initial loading or fetching status
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Observer for infinite scroll
  const observer = useRef();
  
  const lastProductElementRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Fetch products when page changes
  useEffect(() => {
    let isMounted = true;
    
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Fetch with pagination
        const response = await publicApi.get(`/products/public?limit=8&page=${page}`);
        
        if (isMounted && response.data.success) {
          const newProducts = response.data.data.map(product => ({
            id: product.product_id,
            name: product.product_title,
            price: `Rs. ${parseFloat(product.price || 0).toLocaleString()}`,
            originalPrice: product.market_price ? `Rs. ${parseFloat(product.market_price).toLocaleString()}` : null,
            image: product.images?.length > 0 
              ? product.images[0].image_url 
              : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            rating: 0.0, // Placeholder if not in API
            reviews: Math.floor(Math.random() * 500) + 50, // Placeholder
            badge: product.is_featured ? 'Featured' : null,
            discount: product.market_price && product.market_price > product.price 
              ? Math.round(((product.market_price - product.price) / product.market_price) * 100)
              : null,
            shipping: '', // Placeholder or logic based on price
            location: product.location_city_name || 'Sri Lanka'
          }));

          setProducts(prev => {
            // Avoid duplicates just in case
            const existingIds = new Set(prev.map(p => p.id));
            const uniqueNewProducts = newProducts.filter(p => !existingIds.has(p.id));
            return [...prev, ...uniqueNewProducts];
          });
          
          setHasMore(newProducts.length > 0);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [page]);

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Best Seller': return 'bg-orange-500';
      case 'Featured': return 'bg-purple-500';
      case 'Gaming': return 'bg-blue-500';
      case 'Trending': return 'bg-yellow-500 text-gray-800';
      case 'New': return 'bg-green-500';
      default: return 'bg-primary-500';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-green">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-gray-800">Just For You</h2>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {products.map((product, index) => {
          const isLastElement = products.length === index + 1;

          return (
            <div
              ref={isLastElement ? lastProductElementRef : null}
              key={product.id}
              className="h-full"
            >
              <Link
                to={`/product/${product.id}`}
                className="group border border-gray-200 rounded-xl overflow-hidden hover:border-primary-300 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white flex flex-col h-full"
              >
                <div className="relative aspect-square overflow-hidden bg-white p-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                    {product.badge && (
                      <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-bold text-white shadow-sm ${getBadgeColor(product.badge)}`}>
                        {product.badge}
                      </span>
                    )}
                    {product.discount && (
                      <span className="bg-red-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-bold shadow-sm">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 sm:p-4 flex flex-col flex-1">
                  {/* Location & Shipping */}
                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 mb-2">
                    <div className="flex items-center space-x-1 max-w-[60%]">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{product.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Truck className="w-3 h-3" />
                      <span className="text-primary-600 font-medium truncate">{product.shipping}</span>
                    </div>
                  </div>

                  {/* Product Name */}
                  <h3 className="font-bold text-xs sm:text-sm text-gray-800 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2 h-8 sm:h-10 leading-tight">
                    {product.name}
                  </h3>

                  {/* Rating
                  <div className="flex items-center space-x-1 mb-2 sm:mb-3">
                    <div className="flex items-center space-x-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${star <= Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div> */}

                  {/* Price */}
                  <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg sm:text-2xl font-bold text-primary-600">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs sm:text-sm text-gray-400 line-through">{product.originalPrice}</span>
                      )}
                    </div>
                    <button className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg flex items-center justify-center gap-2 hover:from-primary-600 hover:to-primary-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98] font-medium text-sm">
                      <ShoppingCart className="w-4 h-4" />
                      <span className="hidden sm:inline">Add to Cart</span>
                      <span className="sm:hidden">Add</span>
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
        
        {/* Loading Skeletons for next page */}
        {loading && [1, 2, 3, 4].map((item) => (
          <div key={`loading-${item}`} className="border border-gray-200 rounded-xl overflow-hidden bg-white animate-pulse h-full">
            <div className="aspect-square bg-gray-200"></div>
            <div className="p-3 sm:p-4">
              <div className="flex justify-between mb-2">
                <div className="h-3 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {!hasMore && products.length > 0 && (
        <div className="text-center mt-8 text-gray-500 pb-4">
          <p>You've reached the end!</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;