import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  Check,
  Loader
} from 'lucide-react';
import api from '../../../api/axios';
import { useAuth } from '../../../context/AuthContext';

const ChatView = () => {
  const { sellerId, productId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Initialize chat - get or create conversation and load messages
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    const initializeChat = async () => {
      try {
        setLoading(true);

        // Fetch product details
        const productResponse = await api.get(`/products/${productId}`);
        if (productResponse.data.success) {
          setProduct(productResponse.data.product);
        }

        // Start or get existing conversation
        const conversationResponse = await api.post('/chat/conversations', {
          productId: parseInt(productId),
          subject: `Inquiry about ${productResponse.data.product?.product_title || 'product'}`
        });

        if (conversationResponse.data.success) {
          const conv = conversationResponse.data.conversation;
          setConversation(conv);
          
          // Set seller details from conversation
          setSeller({
            id: conv.seller_id,
            name: conv.seller_business_name || `${conv.seller_first_name} ${conv.seller_last_name}`.trim(),
            email: conv.seller_email,
            isOnline: true, // We can implement this later
            lastSeen: 'Active now',
            responseTime: '< 1 hour',
            verified: true
          });

          // Load conversation messages
          const messagesResponse = await api.get(`/chat/conversations/${conv.conversation_id}/messages`);
          if (messagesResponse.data.success) {
            setMessages(messagesResponse.data.messages);
          }
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [sellerId, productId, isAuthenticated, user, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (message.trim() === '' || !conversation || sendingMessage) return;

    setSendingMessage(true);
    const messageText = message.trim();
    setMessage('');

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const response = await api.post(`/chat/conversations/${conversation.conversation_id}/messages`, {
        messageText,
        messageType: 'text'
      });

      if (response.data.success) {
        // Add the sent message to the messages list
        const newMessage = response.data.message;
        setMessages(prev => [...prev, newMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Restore the message if sending failed
      setMessage(messageText);
    } finally {
      setSendingMessage(false);
    }
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

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading chat...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if no conversation or product
  if (!conversation || !product || !seller) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Unable to load chat</p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            src={product.image_url ? 
              (product.image_url.startsWith('http') ? 
                product.image_url : 
                product.image_url
              ) : 
              'https://via.placeholder.com/150x150?text=No+Image'
            }
            alt={product.product_title}
            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
            }}
          />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm">{product.product_title}</h4>
            <p className="text-primary-600 font-bold">Rs. {parseFloat(product.price || 0).toLocaleString()}</p>
          </div>
          <Link
            to={`/product/${product.product_id}`}
            className="text-primary-600 hover:bg-primary-100 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
          >
            View Product
          </Link>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => {
          const isCustomerMessage = msg.sender_type === 'customer' || msg.sender_id === user?.user_id;
          return (
            <div
              key={msg.message_id}
              className={`flex ${isCustomerMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl relative ${
                  isCustomerMessage
                    ? 'bg-primary-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-line break-words">{msg.message_text}</p>
                <div className="flex items-center justify-end space-x-1 mt-1">
                  <span
                    className={`text-xs ${
                      isCustomerMessage
                        ? 'text-primary-200'
                        : 'text-gray-500'
                    }`}
                  >
                    {formatTime(msg.sent_at)}
                  </span>
                  {isCustomerMessage && (
                    <div className="text-primary-200">
                      {msg.is_read ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Check className="w-3 h-3" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
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
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm max-h-32"
              rows="1"
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={message.trim() === '' || sendingMessage}
            className={`p-3 rounded-full transition-colors ${
              message.trim() === '' || sendingMessage
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            {sendingMessage ? (
              <Loader className="w-5 h-5 text-gray-500 animate-spin" />
            ) : (
              <Send className={`w-5 h-5 ${message.trim() === '' ? 'text-gray-500' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;