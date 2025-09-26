import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  MoreVertical,
  Phone,
  Star,
  Store,
  Award,
  Clock,
  CheckCircle,
  Check
} from 'lucide-react';

const ChatView = () => {
  const { sellerId, productId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Sample seller data (in real app, fetch by sellerId)
  const seller = {
    id: sellerId,
    name: 'TechZone Lanka',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    rating: 4.9,
    isOnline: true,
    lastSeen: 'Active now',
    responseTime: '< 1 hour',
    verified: true
  };

  // Sample product being discussed
  const product = {
    id: productId,
    name: 'iPhone 15 Pro Max 256GB',
    price: 385000,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  };

  // Sample chat messages
  const sampleMessages = [
    {
      id: 1,
      senderId: sellerId,
      senderName: 'TechZone Lanka',
      message: 'Hi! Thank you for your interest in the iPhone 15 Pro Max. How can I help you today?',
      timestamp: '2024-01-15T10:30:00Z',
      isRead: true,
      type: 'text'
    },
    {
      id: 2,
      senderId: 'customer',
      senderName: 'You',
      message: 'Hello! I\'m interested in this iPhone. Is it still available?',
      timestamp: '2024-01-15T10:31:00Z',
      isRead: true,
      type: 'text'
    },
    {
      id: 3,
      senderId: sellerId,
      senderName: 'TechZone Lanka',
      message: 'Yes, it\'s still available! This is a brand new unit with 1 year international warranty. Would you like to know more about the specifications?',
      timestamp: '2024-01-15T10:32:00Z',
      isRead: true,
      type: 'text'
    },
    {
      id: 4,
      senderId: 'customer',
      senderName: 'You',
      message: 'That sounds great! Can you tell me about the warranty and return policy?',
      timestamp: '2024-01-15T10:33:00Z',
      isRead: true,
      type: 'text'
    },
    {
      id: 5,
      senderId: sellerId,
      senderName: 'TechZone Lanka',
      message: 'Absolutely! We offer:\n• 1 year international warranty\n• 7-day return policy\n• Free delivery within Colombo\n• Cash on delivery available\n\nIs there anything specific you\'d like to know about the device?',
      timestamp: '2024-01-15T10:35:00Z',
      isRead: false,
      type: 'text'
    }
  ];

  useEffect(() => {
    setMessages(sampleMessages);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (message.trim() === '') return;

    const newMessage = {
      id: Date.now(),
      senderId: 'customer',
      senderName: 'You',
      message: message.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Simulate seller response after 2 seconds
    setTimeout(() => {
      const sellerResponse = {
        id: Date.now() + 1,
        senderId: sellerId,
        senderName: seller.name,
        message: 'Thank you for your message! I\'ll get back to you with the details shortly.',
        timestamp: new Date().toISOString(),
        isRead: false,
        type: 'text'
      };
      setMessages(prev => [...prev, sellerResponse]);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const autoResizeTextarea = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>

            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              {seller.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-gray-900">{seller.name}</h3>
                {seller.verified && (
                  <Award className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span>{seller.rating}</span>
                </div>
                <span>•</span>
                <span className={seller.isOnline ? 'text-green-600' : 'text-gray-500'}>
                  {seller.lastSeen}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Info Bar */}
      <div className="bg-primary-50 border-b border-primary-200 px-4 py-3">
        <div className="flex items-center space-x-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm">{product.name}</h4>
            <p className="text-primary-600 font-bold">Rs. {product.price.toLocaleString()}</p>
          </div>
          <Link
            to={`/product/${product.id}`}
            className="text-primary-600 hover:bg-primary-100 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
          >
            View Product
          </Link>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === 'customer' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl relative ${
                msg.senderId === 'customer'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-line break-words">{msg.message}</p>
              <div className="flex items-center justify-end space-x-1 mt-1">
                <span
                  className={`text-xs ${
                    msg.senderId === 'customer'
                      ? 'text-primary-200'
                      : 'text-gray-500'
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </span>
                {msg.senderId === 'customer' && (
                  <div className="text-primary-200">
                    {msg.isRead ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <Check className="w-3 h-3" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Response Time Info */}
      <div className="px-4 py-2 bg-gray-100">
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
          <Clock className="w-3 h-3" />
          <span>Typical response time: {seller.responseTime}</span>
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                autoResizeTextarea(e);
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm max-h-32"
              rows="1"
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={message.trim() === ''}
            className={`p-3 rounded-full transition-colors ${
              message.trim() === ''
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            <Send className={`w-5 h-5 ${message.trim() === '' ? 'text-gray-500' : 'text-white'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;