import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../../api/axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get('/products/public?sort=newest&limit=10');
        if (response.data.success) {
          setProducts(response.data.data);
        } else {
          setError('Failed to fetch new arrivals.');
        }
      } catch (err) {
        setError('An error occurred while fetching new arrivals.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      setDisplayProducts([...products, ...products.slice(0, 5)]);
    }
  }, [products]);

  const scroll = (scrollOffset) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollInterval;

    const startScrolling = () => {
      scrollInterval = setInterval(() => {
        if (scrollContainer.scrollLeft >= (products.length * 224)) { // 224 is the width of the card (w-56)
            scrollContainer.scrollTo({ left: 0, behavior: 'auto' });
        } else {
            scroll(2);
        }
      }, 100);
    };

    const stopScrolling = () => {
      clearInterval(scrollInterval);
    };

    if (!isHovering) {
      startScrolling();
    }

    return () => stopScrolling();
  }, [isHovering, products]);

  if (loading) {
    return (
      <div className="text-center p-8">
        <p className="text-lg font-semibold text-gray-700">Loading New Arrivals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-lg font-semibold text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-400 to-green-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-white">New Arrivals</h2>
      </div>

      <div 
        className="relative h-64" 
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div 
          className="absolute top-0 left-0 w-full h-full overflow-x-auto scrollbar-hide"
          ref={scrollContainerRef}
        >
          <div className="flex space-x-4 pb-4">
            {displayProducts.map((product, index) => (
              <Link
                key={`${product.product_id}-${index}`}
                to={`/product/${product.product_id}`}
                className="bg-white rounded-xl p-4 text-gray-800 hover:shadow-lg transition-all duration-300 cursor-pointer flex-shrink-0 w-56"
              >
                <div className="relative mb-3">
                  <img 
                    src={`http://localhost:5001${product.images[0]?.image_url}` || 'https://via.placeholder.com/300'} 
                    alt={product.product_title} 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                <h3 className="font-bold text-sm mb-2 truncate">{product.product_title}</h3>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg font-bold text-primary-600">LKR {parseFloat(product.price).toFixed(2)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 left-0 flex items-center">
            <button onClick={() => scroll(-300)} className="bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2">
                <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-0 flex items-center">
            <button onClick={() => scroll(300)} className="bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2">
                <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;