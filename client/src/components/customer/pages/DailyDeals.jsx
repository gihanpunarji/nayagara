import React from 'react';
import { Gift } from 'lucide-react';
import ProductListing from '../../shared/ProductListing';

const DailyDeals = () => {
  // Sample daily deals products
  const dailyDealsProducts = [
    {
      id: 1,
      name: 'Premium Basmati Rice 25kg',
      price: 4750,
      originalPrice: 5200,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.6,
      reviews: 1234,
      discount: 9,
      badge: 'Best Seller',
      location: 'Kelaniya'
    },
    {
      id: 2,
      name: 'Wireless Bluetooth Speaker',
      price: 8500,
      originalPrice: 12000,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.5,
      reviews: 567,
      discount: 29,
      badge: 'Hot Deal',
      location: 'Colombo 07'
    },
    {
      id: 3,
      name: 'Office Chair Ergonomic',
      price: 25000,
      originalPrice: 35000,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.4,
      reviews: 234,
      discount: 29,
      badge: 'Trending',
      location: 'Gampaha'
    },
    {
      id: 4,
      name: 'Kitchen Knife Set 8-piece',
      price: 12500,
      originalPrice: 18000,
      image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.7,
      reviews: 445,
      discount: 31,
      badge: 'Best Seller',
      location: 'Kandy'
    },
    {
      id: 5,
      name: 'LED Desk Lamp with USB',
      price: 4500,
      originalPrice: 6500,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.3,
      reviews: 334,
      discount: 31,
      badge: 'Trending',
      location: 'Nugegoda'
    },
    {
      id: 6,
      name: 'Ceramic Non-stick Pan Set',
      price: 8500,
      originalPrice: 12500,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.5,
      reviews: 789,
      discount: 32,
      badge: 'Best Seller',
      location: 'Maharagama'
    },
    {
      id: 7,
      name: 'Cotton Bed Sheet Set',
      price: 6500,
      originalPrice: 9500,
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.6,
      reviews: 567,
      discount: 32,
      badge: 'Trending',
      location: 'Kelaniya'
    },
    {
      id: 8,
      name: 'Vacuum Flask 750ml',
      price: 2500,
      originalPrice: 3500,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.4,
      reviews: 892,
      discount: 29,
      badge: 'Best Seller',
      location: 'Battaramulla'
    },
    {
      id: 9,
      name: 'Yoga Mat Premium Quality',
      price: 3500,
      originalPrice: 5000,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.5,
      reviews: 445,
      discount: 30,
      badge: 'Trending',
      location: 'Mount Lavinia'
    },
    {
      id: 10,
      name: 'Wall Clock Modern Design',
      price: 4500,
      originalPrice: 6500,
      image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.3,
      reviews: 234,
      discount: 31,
      badge: 'Trending',
      location: 'Panadura'
    },
    {
      id: 11,
      name: 'Bathroom Scale Digital',
      price: 5500,
      originalPrice: 8000,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.2,
      reviews: 334,
      discount: 31,
      badge: 'Best Seller',
      location: 'Colombo 03'
    },
    {
      id: 12,
      name: 'Phone Car Mount Holder',
      price: 1500,
      originalPrice: 2500,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.4,
      reviews: 567,
      discount: 40,
      badge: 'Hot Deal',
      location: 'Colombo 05'
    }
  ];

  return (
    <ProductListing
      title="Daily Deals"
      subtitle="Special offers updated every day - Don't miss out!"
      products={dailyDealsProducts}
      gradient="bg-gradient-to-r from-green-500 to-teal-600"
      icon={Gift}
    />
  );
};

export default DailyDeals;