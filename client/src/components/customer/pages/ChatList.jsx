import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  Search,
  Store,
  Award,
  Clock,
  CheckCircle,
  Check,
  ArrowRight
} from 'lucide-react';

const ChatList = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample chat conversations
  const conversations = [
    {
      id: 1,
      sellerId: 'techzone-lanka',
      sellerName: 'TechZone Lanka',
      productId: 1,
      productName: 'iPhone 15 Pro Max 256GB',
      productImage: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      lastMessage: 'Thank you for your message! I\'ll get back to you with the details shortly.',
      timestamp: '2024-01-15T14:30:00Z',
      unreadCount: 2,
      isOnline: true,
      verified: true,
      isRead: false
    },
    {
      id: 2,
      sellerId: 'fashion-hub',
      sellerName: 'Fashion Hub',
      productId: 2,
      productName: 'Bridal Saree Collection',
      productImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      lastMessage: 'Yes, we have it in red color as well. Would you like to see photos?',
      timestamp: '2024-01-15T12:45:00Z',
      unreadCount: 0,
      isOnline: false,
      verified: true,
      isRead: true
    },
    {
      id: 3,
      sellerId: 'auto-dealers',
      sellerName: 'Premium Auto Dealers',
      productId: 3,
      productName: 'Toyota Prius 2022 Hybrid',
      productImage: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      lastMessage: 'The vehicle inspection report is ready. When can you visit?',
      timestamp: '2024-01-14T16:20:00Z',
      unreadCount: 1,
      isOnline: false,
      verified: false,
      isRead: false
    },
    {
      id: 4,
      sellerId: 'gadget-world',
      sellerName: 'Gadget World',
      productId: 4,
      productName: 'MacBook Pro M3 14-inch',
      productImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      lastMessage: 'Great! The price includes free delivery within Colombo.',
      timestamp: '2024-01-14T10:15:00Z',
      unreadCount: 0,
      isOnline: true,
      verified: true,
      isRead: true
    }
  ];

  const formatTime = (timestamp) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInHours = Math.floor((now - messageDate) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - messageDate) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const filteredConversations = conversations.filter((chat) =>
    chat.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="px-6 py-8">
          <div className="flex items-center space-x-3 mb-4">
            <MessageCircle className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Messages</h1>
          </div>
          <p className="text-white/90">Chat with sellers about products you're interested in</p>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="px-6 py-6">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No conversations found</h3>
            <p className="text-gray-500">Start chatting with sellers by visiting product pages</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredConversations.map((chat) => (
              <Link
                key={chat.id}
                to={`/chat/${chat.sellerId}/${chat.productId}`}
                className="block"
              >
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all">
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <img
                      src={chat.productImage}
                      alt={chat.productName}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                    />

                    {/* Chat Content */}
                    <div className="flex-1 min-w-0">
                      {/* Seller Info */}
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <Store className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold text-gray-900 truncate">{chat.sellerName}</span>
                          </div>
                          {chat.verified && (
                            <Award className="w-4 h-4 text-blue-600" />
                          )}
                          {chat.isOnline && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{formatTime(chat.timestamp)}</span>
                          {chat.unreadCount > 0 && (
                            <div className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full min-w-[1.25rem] h-5 flex items-center justify-center">
                              {chat.unreadCount}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Product Name */}
                      <h4 className="text-sm font-medium text-gray-700 mb-2 truncate">
                        About: {chat.productName}
                      </h4>

                      {/* Last Message */}
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate flex-1 mr-2">
                          {chat.lastMessage}
                        </p>
                        <div className="flex items-center space-x-1">
                          {chat.isRead ? (
                            <CheckCircle className="w-4 h-4 text-primary-600" />
                          ) : (
                            <Check className="w-4 h-4 text-gray-400" />
                          )}
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* New Chat Button */}
      <div className="fixed bottom-6 right-6">
        <Link
          to="/"
          className="bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 hover:shadow-xl transition-all"
        >
          <MessageCircle className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
};

export default ChatList;