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

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const messagesEndRef = useRef(null);

  // Mock conversations data
  const mockConversations = [
    {
      id: 1,
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: null
      },
      product: {
        id: 101,
        title: 'iPhone 14 Pro Max 256GB Space Black',
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'
      },
      lastMessage: 'Is this phone unlocked and what warranty does it come with?',
      lastMessageTime: '2024-01-15T14:30:00Z',
      unreadCount: 2,
      status: 'active',
      messages: [
        {
          id: 1,
          sender: 'customer',
          message: 'Hi, is this iPhone available in stock?',
          timestamp: '2024-01-15T10:00:00Z',
          read: true
        },
        {
          id: 2,
          sender: 'seller',
          message: 'Yes, we have it in stock. It\'s brand new with original warranty.',
          timestamp: '2024-01-15T10:15:00Z',
          read: true
        },
        {
          id: 3,
          sender: 'customer',
          message: 'Is this phone unlocked and what warranty does it come with?',
          timestamp: '2024-01-15T14:30:00Z',
          read: false
        }
      ]
    },
    {
      id: 2,
      customer: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatar: null
      },
      product: {
        id: 102,
        title: 'Toyota Prius 2020 Hybrid',
        image: 'https://images.unsplash.com/photo-1549399163-1ba32edc4c84?w=400'
      },
      lastMessage: 'Thank you for the detailed response!',
      lastMessageTime: '2024-01-14T16:20:00Z',
      unreadCount: 0,
      status: 'completed',
      messages: [
        {
          id: 1,
          sender: 'customer',
          message: 'What is the mileage on this Prius?',
          timestamp: '2024-01-14T15:00:00Z',
          read: true
        },
        {
          id: 2,
          sender: 'seller',
          message: 'The car has 45,000km on the odometer. It has been well maintained with full service history.',
          timestamp: '2024-01-14T15:30:00Z',
          read: true
        },
        {
          id: 3,
          sender: 'customer',
          message: 'Can I see the service records? Also, are there any known issues?',
          timestamp: '2024-01-14T16:00:00Z',
          read: true
        },
        {
          id: 4,
          sender: 'seller',
          message: 'Sure! I can share the service records with you. No major issues - just regular maintenance. The hybrid battery was checked recently and is in excellent condition.',
          timestamp: '2024-01-14T16:10:00Z',
          read: true
        },
        {
          id: 5,
          sender: 'customer',
          message: 'Thank you for the detailed response!',
          timestamp: '2024-01-14T16:20:00Z',
          read: true
        }
      ]
    },
    {
      id: 3,
      customer: {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        avatar: null
      },
      product: {
        id: 103,
        title: 'MacBook Pro 16" M2 512GB',
        image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400'
      },
      lastMessage: 'Does this laptop support external monitors?',
      lastMessageTime: '2024-01-13T11:45:00Z',
      unreadCount: 1,
      status: 'pending',
      messages: [
        {
          id: 1,
          sender: 'customer',
          message: 'Does this laptop support external monitors?',
          timestamp: '2024-01-13T11:45:00Z',
          read: false
        }
      ]
    }
  ];

  const statusFilters = [
    { key: 'all', label: 'All Messages', count: 0 },
    { key: 'active', label: 'Active', count: 0 },
    { key: 'pending', label: 'Pending Reply', count: 0 },
    { key: 'completed', label: 'Completed', count: 0 }
  ];

  useEffect(() => {
    setConversations(mockConversations);

    // Update filter counts
    statusFilters.forEach(filter => {
      if (filter.key === 'all') {
        filter.count = mockConversations.length;
      } else {
        filter.count = mockConversations.filter(conv => conv.status === filter.key).length;
      }
    });

    // Auto-select first conversation
    if (mockConversations.length > 0) {
      setSelectedConversation(mockConversations[0]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg = {
      id: Date.now(),
      sender: 'seller',
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: true
    };

    // Update the conversation
    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, newMsg],
          lastMessage: newMessage.trim(),
          lastMessageTime: newMsg.timestamp,
          status: 'active'
        };
      }
      return conv;
    });

    setConversations(updatedConversations);

    // Update selected conversation
    const updatedSelected = updatedConversations.find(conv => conv.id === selectedConversation.id);
    setSelectedConversation(updatedSelected);

    setNewMessage('');
    scrollToBottom();
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
            src={conversation.product.image}
            alt={conversation.product.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Customer Info */}
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {conversation.customer.name}
            </h3>
            {conversation.unreadCount > 0 && (
              <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                {conversation.unreadCount}
              </span>
            )}
          </div>

          {/* Product Title */}
          <p className="text-sm text-gray-600 truncate mb-2">
            {conversation.product.title}
          </p>

          {/* Last Message */}
          <p className="text-sm text-gray-700 truncate mb-2">
            {conversation.lastMessage}
          </p>

          {/* Time and Status */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {formatTime(conversation.lastMessageTime)}
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
        <p className="text-sm">{message.message}</p>
        <p className={`text-xs mt-1 ${isOwn ? 'text-primary-100' : 'text-gray-500'}`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.product.title.toLowerCase().includes(searchQuery.toLowerCase());
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
                  key={conversation.id}
                  conversation={conversation}
                  isSelected={selectedConversation?.id === conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
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
                      {selectedConversation.customer.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedConversation.customer.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        About: {selectedConversation.product.title}
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
                      src={selectedConversation.product.image}
                      alt={selectedConversation.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {selectedConversation.product.title}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Package className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">Product ID: {selectedConversation.product.id}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {selectedConversation.messages.map(message => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOwn={message.sender === 'seller'}
                    />
                  ))}
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