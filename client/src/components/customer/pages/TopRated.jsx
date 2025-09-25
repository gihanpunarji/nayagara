import React from 'react';
import { Star } from 'lucide-react';
import ProductListing from '../../shared/ProductListing';

const TopRated = () => {
  // Sample top rated products (all with high ratings)
  const topRatedProducts = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max 256GB',
      price: 385000,
      originalPrice: 420000,
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviews: 2847,
      discount: 8,
      badge: 'Top Rated',
      location: 'Colombo 07'
    },
    {
      id: 2,
      name: 'Bridal Saree Collection',
      price: 18500,
      originalPrice: 22000,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviews: 1456,
      discount: 16,
      badge: 'Top Rated',
      location: 'Kandy'
    },
    {
      id: 3,
      name: 'Sony WH-1000XM5 Headphones',
      price: 95000,
      originalPrice: 105000,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviews: 1876,
      discount: 10,
      badge: 'Top Rated',
      location: 'Gampaha'
    },
    {
      id: 4,
      name: 'MacBook Pro M3 14-inch',
      price: 650000,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviews: 1247,
      badge: 'Top Rated',
      location: 'Nugegoda'
    },
    {
      id: 5,
      name: 'Gaming Laptop RTX 4070',
      price: 425000,
      originalPrice: 485000,
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviews: 892,
      discount: 12,
      badge: 'Top Rated',
      location: 'Maharagama'
    },
    {
      id: 6,
      name: 'iPad Air 5th Generation',
      price: 185000,
      originalPrice: 195000,
      image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviews: 1123,
      discount: 5,
      badge: 'Top Rated',
      location: 'Kelaniya'
    },
    {
      id: 7,
      name: 'Nike Air Max 270 React',
      price: 28500,
      originalPrice: 32000,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviews: 967,
      discount: 11,
      badge: 'Top Rated',
      location: 'Battaramulla'
    },
    {
      id: 8,
      name: 'Samsung 65" QLED 4K TV',
      price: 285000,
      originalPrice: 325000,
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.7,
      reviews: 1567,
      discount: 12,
      badge: 'Top Rated',
      location: 'Mount Lavinia'
    },
    {
      id: 9,
      name: 'Canon EOS R6 Mark II',
      price: 685000,
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.7,
      reviews: 456,
      badge: 'Top Rated',
      location: 'Panadura'
    },
    {
      id: 10,
      name: 'Dyson V15 Detect Vacuum',
      price: 165000,
      originalPrice: 180000,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.8,
      reviews: 876,
      discount: 8,
      badge: 'Top Rated',
      location: 'Colombo 03'
    },
    {
      id: 11,
      name: 'Herman Miller Aeron Chair',
      price: 385000,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.7,
      reviews: 334,
      badge: 'Top Rated',
      location: 'Colombo 05'
    },
    {
      id: 12,
      name: 'PlayStation 5 Console',
      price: 185000,
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviews: 2456,
      badge: 'Top Rated',
      location: 'Gampaha'
    }
  ];

  return (
    <ProductListing
      title="Top Rated"
      subtitle="Highest rated products loved by our customers"
      products={topRatedProducts}
      gradient="bg-gradient-to-r from-yellow-500 to-orange-600"
      icon={Star}
    />
  );
};

export default TopRated;