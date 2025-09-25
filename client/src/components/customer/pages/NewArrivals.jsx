import React from 'react';
import { TrendingUp } from 'lucide-react';
import ProductListing from '../../shared/ProductListing';

const NewArrivals = () => {
  // Sample new arrival products
  const newArrivalProducts = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max 512GB',
      price: 450000,
      originalPrice: 485000,
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviews: 1247,
      discount: 7,
      badge: 'New',
      location: 'Colombo 07'
    },
    {
      id: 2,
      name: 'MacBook Pro M3 14-inch',
      price: 650000,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviews: 892,
      badge: 'New',
      location: 'Gampaha'
    },
    {
      id: 3,
      name: 'Samsung Galaxy S24 Ultra',
      price: 385000,
      originalPrice: 420000,
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.7,
      reviews: 2156,
      discount: 8,
      badge: 'New',
      location: 'Kandy'
    },
    {
      id: 4,
      name: 'Nike Air Max 270 React',
      price: 28500,
      originalPrice: 32000,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.6,
      reviews: 734,
      discount: 11,
      badge: 'New',
      location: 'Nugegoda'
    },
    {
      id: 5,
      name: 'Sony WH-1000XM5 Headphones',
      price: 95000,
      originalPrice: 105000,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviews: 1456,
      discount: 10,
      badge: 'New',
      location: 'Colombo 03'
    },
    {
      id: 6,
      name: 'Dell XPS 13 Plus',
      price: 420000,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.5,
      reviews: 567,
      badge: 'New',
      location: 'Colombo 05'
    },
    {
      id: 7,
      name: 'Adidas Ultraboost 22',
      price: 35000,
      originalPrice: 38500,
      image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.4,
      reviews: 923,
      discount: 9,
      badge: 'New',
      location: 'Maharagama'
    },
    {
      id: 8,
      name: 'iPad Air 5th Generation',
      price: 185000,
      originalPrice: 195000,
      image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviews: 1123,
      discount: 5,
      badge: 'New',
      location: 'Kelaniya'
    },
    {
      id: 9,
      name: 'PlayStation 5 Console',
      price: 185000,
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviews: 2847,
      badge: 'New',
      location: 'Battaramulla'
    },
    {
      id: 10,
      name: 'Canon EOS R6 Mark II',
      price: 685000,
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.7,
      reviews: 456,
      badge: 'New',
      location: 'Panadura'
    },
    {
      id: 11,
      name: 'Herman Miller Aeron Chair',
      price: 385000,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.6,
      reviews: 234,
      badge: 'New',
      location: 'Colombo 07'
    },
    {
      id: 12,
      name: 'Dyson V15 Detect Vacuum',
      price: 165000,
      originalPrice: 180000,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviews: 876,
      discount: 8,
      badge: 'New',
      location: 'Mount Lavinia'
    }
  ];

  return (
    <ProductListing
      title="New Arrivals"
      subtitle="Fresh products just added to our catalog"
      products={newArrivalProducts}
      gradient="bg-gradient-to-r from-blue-500 to-purple-600"
      icon={TrendingUp}
    />
  );
};

export default NewArrivals;