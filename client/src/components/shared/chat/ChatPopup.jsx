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
  MoreVertical,
  Loader
} from 'lucide-react';
import api from '../../../api/axios';
import { useAuth } from '../../../context/AuthContext';

const ChatPopup = ({

  isOpen,

  onClose,

  seller,

  product,

  isMinimized,

  onToggleMinimize,

  onMaximize

}) => {

  const { user, isAuthenticated } = useAuth();

  const [message, setMessage] = useState('');

  const [messages, setMessages] = useState([]);

  const [conversation, setConversation] = useState(null);

  const [loading, setLoading] = useState(false);

  const [sendingMessage, setSendingMessage] = useState(false);

  const [chatSeller, setChatSeller] = useState(seller);

  const messagesEndRef = useRef(null);

  const textareaRef = useRef(null);



  useEffect(() => {

    setChatSeller(seller);

  }, [seller]);



  // Initialize chat - get or create conversation and load messages

  useEffect(() => {

    if (!isOpen || !isAuthenticated || !user || !product?.id || !chatSeller?.id) {

      return;

    }



    const initializeChat = async () => {

      try {

        setLoading(true);



        // Ensure a token exists before making a request

        const token = localStorage.getItem('token');

        if (!token) {

          console.error('No token found, user is not authenticated.');

          setLoading(false);

          return;

        }



        // Start or get existing conversation

        const conversationResponse = await api.post('/chat/conversations', {

          productId: parseInt(product.id),

          subject: `Inquiry about ${product.name || 'product'}`

        });



        console.log('Conversation Response:', conversationResponse.data);



        if (conversationResponse.data.success) {

          const { conversation: conv, seller: sellerDetails } = conversationResponse.data;

          setConversation(conv);

          if (sellerDetails) {

            setChatSeller(prevSeller => ({ ...prevSeller, ...sellerDetails }));

          }



          // Load conversation messages

          const messagesResponse = await api.get(`/chat/conversations/${conv.conversation_id}/messages`);

          if (messagesResponse.data.success) {

            setMessages(messagesResponse.data.messages);

          }

        }

      } catch (error) {

        console.error('Error initializing chat:', error);

      } finally {

        setLoading(false);

      }

    };



    initializeChat();

  }, [isOpen, isAuthenticated, user, product?.id, chatSeller?.id]);

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
              {chatSeller?.image ? (
                <img
                  src={chatSeller.image}
                  alt={chatSeller.name}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center" style={{display: chatSeller?.image ? 'none' : 'flex'}}>
                <Store className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">{chatSeller?.name}</p>
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
                    {chatSeller?.image ? (
                      <img
                        src={chatSeller.image}
                        alt={chatSeller.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center" style={{display: chatSeller?.image ? 'none' : 'flex'}}>
                      <Store className="w-5 h-5 text-white" />
                    </div>
                    {chatSeller?.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-white">{chatSeller?.name}</h3>
                      {chatSeller?.verified && (
                        <Award className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-white/80">
                      <Star className="w-3 h-3 text-yellow-300 fill-current" />
                      <span>{chatSeller?.rating}</span>
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
                  src={product?.images?.[0] || product?.image || 'https://via.placeholder.com/150x150?text=No+Image'}
                  alt={product?.name}
                  className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm truncate">{product?.name}</h4>
                  <p className="text-primary-600 font-bold text-sm">Rs. {product?.price?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader className="w-6 h-6 animate-spin text-primary-600" />
                  <span className="ml-2 text-gray-600">Loading messages...</span>
                </div>
              ) : (
                messages.map((msg) => {
                  const isCustomerMessage = msg.sender_type === 'customer' || msg.sender_id === user?.user_id;
                  return (
                    <div
                      key={msg.message_id || msg.id}
                      className={`flex ${isCustomerMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-2xl relative ${
                          isCustomerMessage
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line break-words">{msg.message_text || msg.message}</p>
                        <div className="flex items-center justify-end space-x-1 mt-1">
                          <span
                            className={`text-xs ${
                              isCustomerMessage
                                ? 'text-primary-200'
                                : 'text-gray-500'
                            }`}
                          >
                            {formatTime(msg.sent_at || msg.timestamp)}
                          </span>
                          {isCustomerMessage && (
                            <div className="text-primary-200">
                              {msg.is_read || msg.isRead ? (
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
                })
              )}
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
                  disabled={message.trim() === '' || sendingMessage}
                  className={`p-2 rounded-full transition-colors flex-shrink-0 ${
                    message.trim() === '' || sendingMessage
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  {sendingMessage ? (
                    <Loader className="w-4 h-4 text-gray-500 animate-spin" />
                  ) : (
                    <Send className={`w-4 h-4 ${message.trim() === '' ? 'text-gray-500' : 'text-white'}`} />
                  )}
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