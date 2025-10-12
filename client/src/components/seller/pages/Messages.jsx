import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Search,
  Filter,
  Send,
  MoreVertical,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Package,
  Phone,
  Mail,
  Eye
} from 'lucide-react';
import SellerLayout from '../layout/SellerLayout';
import api from '../../../api/axios';

const Messages = () => {
  const serverUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5001';
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const statusFilters = [
    { key: 'all', label: 'All Messages', count: 0 },
    { key: 'active', label: 'Active', count: 0 },
    { key: 'pending', label: 'Pending Reply', count: 0 },
    { key: 'completed', label: 'Completed', count: 0 }
  ];

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await api.get('/chat/conversations');
        console.log("Fetched conversations:", response.data);
        if (response.data.success) {
          setConversations(response.data.conversations);
          if (response.data.conversations.length > 0) {
            handleConversationSelect(response.data.conversations[0]);
          }
        }
      } catch (err) {
        setError('Failed to fetch conversations.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    // Update filter counts
    statusFilters.forEach(filter => {
      if (filter.key === 'all') {
        filter.count = conversations.length;
      } else {
        filter.count = conversations.filter(conv => conv.status === filter.key).length;
      }
    });
  }, [conversations]);

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleConversationSelect = async (conversation) => {
    setSelectedConversation(conversation);
    setLoadingMessages(true);
    try {
      const response = await api.get(`/chat/conversations/${conversation.conversation_id}/messages`);
      if (response.data.success) {
        setCurrentMessages(response.data.messages);
      }
    } catch (err) {
      console.error('Failed to fetch messages for conversation', err);
      setCurrentMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      const response = await api.post(`/chat/conversations/${selectedConversation.conversation_id}/messages`, {
        messageText,
        messageType: 'text',
      });

      if (response.data.success) {
        const newMsg = response.data.message;
        setCurrentMessages(prevMessages => [...prevMessages, newMsg]);
        
        // Optionally update the last message in the conversation list
        const updatedConversations = conversations.map(conv => 
          conv.conversation_id === selectedConversation.conversation_id
            ? { ...conv, last_message: newMsg.message_text, last_message_at: newMsg.sent_at }
            : conv
        );
        setConversations(updatedConversations);

      }
    } catch (error) {
      console.error('Error sending message:', error);
      setNewMessage(messageText); // Restore message on error
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-600';
      case 'pending': return 'bg-orange-100 text-orange-600';
      case 'completed': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <MessageCircle className="w-3 h-3" />;
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const ConversationItem = ({ conversation, isSelected, onClick }) => (
    <div
      onClick={onClick}
      className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
        isSelected ? 'bg-primary-50 border-primary-200' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start space-x-3">
        {/* Product Image */}
        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={conversation.product_image ? `${serverUrl}${conversation.product_image}` : 'https://via.placeholder.com/150'}
            alt={conversation.product_title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Customer Info */}
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {`${conversation.customer_first_name} ${conversation.customer_last_name}`}
            </h3>
            {conversation.unread_count > 0 && (
              <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                {conversation.unread_count}
              </span>
            )}
          </div>

          {/* Product Title */}
          <p className="text-sm text-gray-600 truncate mb-2">
            {conversation.product_title}
          </p>

          {/* Last Message */}
          <p className="text-sm text-gray-700 truncate mb-2">
            {conversation.last_message}
          </p>

          {/* Time and Status */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {formatTime(conversation.last_message_at)}
            </span>
            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(conversation.status)}`}>
              {getStatusIcon(conversation.status)}
              <span className="capitalize">{conversation.status}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const MessageBubble = ({ message, isOwn }) => (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg px-4 py-2`}>
        <p className="text-sm">{message.message_text}</p>
        <p className={`text-xs mt-1 ${isOwn ? 'text-primary-100' : 'text-gray-500'}`}>
          {formatTime(message.sent_at)}
        </p>
      </div>
    </div>
  );

  const filteredConversations = conversations.filter(conv => {
    const customerName = `${conv.customer_first_name} ${conv.customer_last_name}`.toLowerCase();
    const matchesSearch = customerName.includes(searchQuery.toLowerCase()) ||
                         conv.product_title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || conv.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <SellerLayout>
      <div className="flex h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Left Sidebar - Conversations List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-semibold text-gray-900">Messages</h1>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Status Filters */}
            <div className="flex space-x-1">
              {statusFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setFilterStatus(filter.key)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filterStatus === filter.key
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
                <p className="text-gray-600">
                  {conversations.length === 0
                    ? "You don't have any customer messages yet."
                    : "No messages match your current search or filter."
                  }
                </p>
              </div>
            ) : (
              filteredConversations.map(conversation => (
                <ConversationItem
                  key={conversation.conversation_id}
                  conversation={conversation}
                  isSelected={selectedConversation?.conversation_id === conversation.conversation_id}
                  onClick={() => handleConversationSelect(conversation)}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Side - Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedConversation.customer_first_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {`${selectedConversation.customer_first_name} ${selectedConversation.customer_last_name}`}
                      </h3>
                      <p className="text-sm text-gray-600">
                        About: {selectedConversation.product_title}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Context */}
              <div className="p-4 bg-blue-50 border-b border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={selectedConversation.product_image ? `${serverUrl}${selectedConversation.product_image}` : 'https://via.placeholder.com/150'}
                      alt={selectedConversation.product_title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {selectedConversation.product_title}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Package className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">Product ID: {selectedConversation.product_id}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <p>Loading messages...</p>
                    </div>
                  ) : (
                    currentMessages.map(message => (
                      <MessageBubble
                        key={message.message_id}
                        message={message}
                        isOwn={message.sender_type === 'seller'}
                      />
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-600">
                  Choose a customer conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </SellerLayout>
  );
};

export default Messages;