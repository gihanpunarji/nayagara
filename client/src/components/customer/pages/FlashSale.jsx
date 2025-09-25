import React from 'react';
import { Zap } from 'lucide-react';
import ProductListing from '../../shared/ProductListing';

const FlashSale = () => {
  // Sample flash sale products with higher discounts
  const flashSaleProducts = [
    {
      id: 1,
      name: 'iPhone 14 Pro Max 256GB',
      price: 285000,
      originalPrice: 385000,
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviews: 2847,
      discount: 26,
      badge: 'Hot Deal',
      location: 'Colombo 07'
    },
    {
      id: 2,
      name: 'Samsung 65" 4K Smart TV',
      price: 185000,
      originalPrice: 285000,
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.7,
      reviews: 1456,
      discount: 35,
      badge: 'Hot Deal',
      location: 'Gampaha'
    },
    {
      id: 3,
      name: 'Nike Air Jordan 1 Retro',
      price: 35000,
      originalPrice: 55000,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviews: 923,
      discount: 36,
      badge: 'Hot Deal',
      location: 'Kandy'
    },
    {
      id: 4,
      name: 'MacBook Air M2 256GB',
      price: 385000,
      originalPrice: 485000,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviews: 1247,
      discount: 21,
      badge: 'Hot Deal',
      location: 'Nugegoda'
    },
    {
      id: 5,
      name: 'Sony WH-1000XM4 Headphones',
      price: 65000,
      originalPrice: 95000,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviews: 1876,
      discount: 32,
      badge: 'Hot Deal',
      location: 'Colombo 03'
    },
    {
      id: 6,
      name: 'Gaming Laptop RTX 3070',
      price: 285000,
      originalPrice: 385000,
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.7,
      reviews: 567,
      discount: 26,
      badge: 'Hot Deal',
      location: 'Maharagama'
    },
    {
      id: 7,
      name: 'Bridal Saree Collection',
      price: 12500,
      originalPrice: 22000,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviews: 345,
      discount: 43,
      badge: 'Hot Deal',
      location: 'Kandy'
    },
    {
      id: 8,
      name: 'Samsung Galaxy Watch 5',
      price: 45000,
      originalPrice: 65000,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.6,
      reviews: 892,
      discount: 31,
      badge: 'Hot Deal',
      location: 'Kelaniya'
    },
    {
      id: 9,
      name: 'Instant Pot Duo 7-in-1',
      price: 25000,
      originalPrice: 38000,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.5,
      reviews: 1234,
      discount: 34,
      badge: 'Hot Deal',
      location: 'Battaramulla'
    },
    {
      id: 10,
      name: 'Adidas Yeezy Boost 350',
      price: 85000,
      originalPrice: 125000,
      image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.7,
      reviews: 756,
      discount: 32,
      badge: 'Hot Deal',
      location: 'Mount Lavinia'
    },
    {
      id: 11,
      name: 'LG 27" 4K Monitor',
      price: 95000,
      originalPrice: 135000,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.6,
      reviews: 445,
      discount: 30,
      badge: 'Hot Deal',
      location: 'Panadura'
    },
    {
      id: 12,
      name: 'Ninja Foodi Air Fryer',
      price: 35000,
      originalPrice: 55000,
      image: 'https://images.unsplash.com/photo-1585515656559-a4c0b8cd9043?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.4,
      reviews: 623,
      discount: 36,
      badge: 'Hot Deal',
      location: 'Colombo 05'
    }
  ];

  return (
    <ProductListing
      title="Flash Sale"
      subtitle="Limited time offers with massive discounts - Hurry up!"
      products={flashSaleProducts}
      gradient="bg-gradient-to-r from-red-500 to-pink-600"
      icon={Zap}
    />
  );
};

export default FlashSale;