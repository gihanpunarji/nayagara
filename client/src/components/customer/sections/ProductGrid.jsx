import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, MapPin, Truck, Grid, List, Filter } from 'lucide-react';
import { publicApi } from '../../../api/axios';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simple one-time fetch on component mount
  useEffect(() => {
    let isMounted = true;
    
    const fetchProducts = async () => {
      try {
        const response = await publicApi.get('/products/public?limit=6');
        if (isMounted && response.data.success) {
          const transformedProducts = response.data.data.map(product => ({
            id: product.product_id,
            name: product.product_title,
            price: `Rs. ${product.price?.toLocaleString()}`,
            originalPrice: null,
            image: product.images?.length > 0 
              ? `http://localhost:5001${product.images[0].image_url}` 
              : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            rating: 4.5,
            reviews: Math.floor(Math.random() * 500) + 50,
            badge: product.is_featured ? 'Featured' : 'New',
            shipping: 'Free Shipping',
            location: product.location_city_name || 'Sri Lanka'
          }));
          setProducts(transformedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Set fallback static data if API fails
        if (isMounted) {
          setProducts([
            {
              id: 1,
              name: 'Sample Product 1',
              price: 'Rs. 10,000',
              originalPrice: null,
              image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              rating: 4.5,
              reviews: 123,
              badge: 'Featured',
              shipping: 'Free Shipping',
              location: 'Colombo'
            },
            {
              id: 2,
              name: 'Sample Product 2',
              price: 'Rs. 25,000',
              originalPrice: null,
              image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
              rating: 4.2,
              reviews: 89,
              badge: 'New',
              shipping: 'Free Shipping',
              location: 'Kandy'
            }
          ]);
        }
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
  }, []); // Empty dependency - runs only once

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
    <div className="bg-white rounded-2xl p-6 shadow-green">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-heading font-bold text-gray-800">Just For You</h2>
        <div className="flex items-center space-x-2">
          <button className="p-2 border border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <Grid className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 border border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <List className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 border border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          // Loading skeleton
          [1, 2, 3].map((item) => (
            <div key={item} className="border border-gray-200 rounded-xl overflow-hidden bg-white animate-pulse">
              <div className="w-full h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="flex justify-between mb-2">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group border border-gray-200 rounded-xl overflow-hidden hover:border-primary-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-500 cursor-pointer bg-white"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-500 bg-gray-50"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col space-y-1">
                  {product.badge && (
                    <span className={`text-xs px-2 py-1 rounded-full font-bold text-white ${getBadgeColor(product.badge)}`}>
                      {product.badge}
                    </span>
                  )}
                  {product.discount && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      -{product.discount}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4">
                {/* Location & Shipping */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{product.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Truck className="w-3 h-3" />
                    <span className="text-primary-600 font-medium">{product.shipping}</span>
                  </div>
                </div>

                {/* Product Name */}
                <h3 className="font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-4 h-4 ${star <= Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-primary-600">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                    )}
                  </div>
                  <button className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-all">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Mobile Horizontal Scroll */}
      <div className="md:hidden">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
          {loading ? (
            // Loading skeleton for mobile
            [1, 2, 3].map((item) => (
              <div key={item} className="border border-gray-200 rounded-xl overflow-hidden bg-white flex-shrink-0 w-64 animate-pulse">
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="flex justify-between mb-2">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            products.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group border border-gray-200 rounded-xl overflow-hidden hover:border-primary-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-500 cursor-pointer bg-white flex-shrink-0 w-64"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-500 bg-gray-50"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col space-y-1">
                    {product.badge && (
                      <span className={`text-xs px-2 py-1 rounded-full font-bold text-white ${getBadgeColor(product.badge)}`}>
                        {product.badge}
                      </span>
                    )}
                    {product.discount && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        -{product.discount}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  {/* Location & Shipping */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{product.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Truck className="w-3 h-3" />
                      <span className="text-primary-600 font-medium">{product.shipping}</span>
                    </div>
                  </div>

                  {/* Product Name */}
                  <h3 className="font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-4 h-4 ${star <= Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-primary-600">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                      )}
                    </div>
                    <button className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-all">
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;