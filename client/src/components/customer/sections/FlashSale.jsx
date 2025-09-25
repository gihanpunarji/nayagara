import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Clock } from 'lucide-react';

const FlashSale = () => {
  const [currentDeal, setCurrentDeal] = useState(0);

  const flashDeals = [
    { 
      id: 1, 
      name: 'Samsung Galaxy S24', 
      originalPrice: 'Rs. 185,000', 
      salePrice: 'Rs. 149,000', 
      discount: '19%', 
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 
      timeLeft: '02:34:56', 
      sold: 87, 
      stock: 150 
    },
    { 
      id: 2, 
      name: 'MacBook Pro M3', 
      originalPrice: 'Rs. 485,000', 
      salePrice: 'Rs. 399,000', 
      discount: '18%', 
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 
      timeLeft: '01:22:18', 
      sold: 23, 
      stock: 50 
    },
    { 
      id: 3, 
      name: 'Nike Air Max 270', 
      originalPrice: 'Rs. 28,500', 
      salePrice: 'Rs. 19,999', 
      discount: '30%', 
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 
      timeLeft: '03:45:12', 
      sold: 156, 
      stock: 200 
    },
    { 
      id: 4, 
      name: 'Sony WH-1000XM5', 
      originalPrice: 'Rs. 85,000', 
      salePrice: 'Rs. 67,900', 
      discount: '20%', 
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 
      timeLeft: '00:45:33', 
      sold: 234, 
      stock: 300 
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDeal((prev) => (prev + 1) % flashDeals.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 text-white shadow-green-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-accent-yellow animate-bounce-gentle" />
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold">Flash Sale</h2>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 sm:px-4 sm:py-2 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-mono text-sm sm:text-lg font-bold">02:34:56</span>
            </div>
          </div>
        </div>
        <Link
          to="/flash-sale"
          className="bg-white text-primary-600 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-primary-50 transition-colors shadow-green text-sm sm:text-base"
        >
          View All Deals
        </Link>
      </div>

      {/* Desktop Grid */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
        {flashDeals.map((deal, idx) => (
          <Link
            key={idx}
            to={`/product/${deal.id}`}
            className="bg-white rounded-xl p-4 text-gray-800 hover:shadow-green-lg transition-all duration-300 cursor-pointer animate-fade-in"
          >
            <div className="relative mb-3">
              <img src={deal.image} alt={deal.name} className="w-full h-32 object-cover rounded-lg" />
              <div className="absolute top-2 left-2 bg-error text-white text-xs px-2 py-1 rounded-full font-bold">
                -{deal.discount}
              </div>
            </div>
            <h3 className="font-bold text-sm mb-2 truncate">{deal.name}</h3>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg font-bold text-primary-600">{deal.salePrice}</span>
              <span className="text-sm text-gray-500 line-through">{deal.originalPrice}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-primary h-2 rounded-full transition-all duration-500" 
                style={{width: `${(deal.sold / deal.stock) * 100}%`}}
              ></div>
            </div>
            <p className="text-xs text-gray-600">{deal.sold} sold</p>
          </Link>
        ))}
      </div>

      {/* Mobile Horizontal Scroll */}
      <div className="sm:hidden">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
          {flashDeals.map((deal, idx) => (
            <Link
              key={idx}
              to={`/product/${deal.id}`}
              className="bg-white rounded-xl p-4 text-gray-800 hover:shadow-green-lg transition-all duration-300 cursor-pointer animate-fade-in flex-shrink-0 w-56"
            >
              <div className="relative mb-3">
                <img src={deal.image} alt={deal.name} className="w-full h-32 object-cover rounded-lg" />
                <div className="absolute top-2 left-2 bg-error text-white text-xs px-2 py-1 rounded-full font-bold">
                  -{deal.discount}
                </div>
              </div>
              <h3 className="font-bold text-sm mb-2 truncate">{deal.name}</h3>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg font-bold text-primary-600">{deal.salePrice}</span>
                <span className="text-sm text-gray-500 line-through">{deal.originalPrice}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-primary h-2 rounded-full transition-all duration-500" 
                  style={{width: `${(deal.sold / deal.stock) * 100}%`}}
                ></div>
              </div>
              <p className="text-xs text-gray-600">{deal.sold} sold</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlashSale;