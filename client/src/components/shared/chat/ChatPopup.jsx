import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Minimize2,
  Maximize2,
  Send,
  Phone,
  Star,
  Store,
  Award,
  Clock,
  CheckCircle,
  Check,
  MoreVertical
} from 'lucide-react';

const ChatPopup = ({
  isOpen,
  onClose,
  seller,
  product,
  isMinimized,
  onToggleMinimize,
  onMaximize
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Sample chat messages
  const sampleMessages = [
    {
      id: 1,
      senderId: seller?.id,
      senderName: seller?.name,
      message: `Hi! Thank you for your interest in the ${product?.name}. How can I help you today?`,
      timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
      isRead: true,
      type: 'text'
    },
    {
      id: 2,
      senderId: 'customer',
      senderName: 'You',
      message: 'Hello! I\'m interested in this product. Is it still available?',
      timestamp: new Date(Date.now() - 240000).toISOString(), // 4 minutes ago
      isRead: true,
      type: 'text'
    },
    {
      id: 3,
      senderId: seller?.id,
      senderName: seller?.name,
      message: 'Yes, it\'s still available! This is a brand new unit with warranty. Would you like to know more about the specifications?',
      timestamp: new Date(Date.now() - 180000).toISOString(), // 3 minutes ago
      isRead: false,
      type: 'text'
    }
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages(sampleMessages);
    }
  }, [isOpen, seller, product]);

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
        senderId: seller?.id,
        senderName: seller?.name,
        message: 'Thank you for your message! Let me check the details for you.',
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
    textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
          isMinimized ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        onClick={onClose}
      />

      {/* Chat Popup */}
      <div
        className={`bg-white rounded-t-xl md:rounded-xl shadow-2xl border border-gray-200 transition-all duration-300 ${
          isMinimized
            ? 'w-80 h-16'
            : 'w-full h-full md:w-96 md:h-[600px]'
        }`}
      >
        {/* Minimized Header */}
        {isMinimized ? (
          <div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 rounded-xl"
            onClick={onMaximize}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <Store className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">{seller?.name}</p>
                <p className="text-xs text-gray-500">Click to expand</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        ) : (
          /* Full Chat Interface */
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 rounded-t-xl md:rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Store className="w-5 h-5 text-white" />
                    </div>
                    {seller?.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-white">{seller?.name}</h3>
                      {seller?.verified && (
                        <Award className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-white/80">
                      <Star className="w-3 h-3 text-yellow-300 fill-current" />
                      <span>{seller?.rating}</span>
                      <span>•</span>
                      <span className="text-green-300">Active now</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={onToggleMinimize}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Info Bar */}
            <div className="bg-primary-50 border-b border-primary-200 px-4 py-3">
              <div className="flex items-center space-x-3">
                <img
                  src={product?.image}
                  alt={product?.name}
                  className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm truncate">{product?.name}</h4>
                  <p className="text-primary-600 font-bold text-sm">Rs. {product?.price?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === 'customer' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-2xl relative ${
                      msg.senderId === 'customer'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-900'
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
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
                <Clock className="w-3 h-3" />
                <span>Typical response: {seller?.responseTime}</span>
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4 rounded-b-xl md:rounded-b-xl">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    rows="1"
                    style={{ minHeight: '36px', maxHeight: '100px' }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={message.trim() === ''}
                  className={`p-2 rounded-full transition-colors flex-shrink-0 ${
                    message.trim() === ''
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  <Send className={`w-4 h-4 ${message.trim() === '' ? 'text-gray-500' : 'text-white'}`} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatPopup;