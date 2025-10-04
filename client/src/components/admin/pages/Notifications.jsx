import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Trash2,
  MoreVertical,
  Send,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle,
  Mail,
  MessageCircle,
  ShoppingCart,
  Package
} from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  const mockNotifications = [
    {
      id: 1,
      type: 'order',
      title: 'New Order Received',
      message: 'Order #ORD-2024-5432 has been placed by John Doe',
      status: 'unread',
      priority: 'high',
      timestamp: '2024-01-15T10:30:00',
      actionUrl: '/admin/orders/ORD-2024-5432'
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Successful',
      message: 'Payment of Rs. 125,000 received for Order #ORD-2024-5433',
      status: 'read',
      priority: 'medium',
      timestamp: '2024-01-15T11:45:00',
      actionUrl: '/admin/payments/PAY-2024-001'
    },
    {
      id: 3,
      type: 'alert',
      title: 'Low Stock Alert',
      message: 'Product "iPhone 15 Pro" has only 5 units remaining in stock',
      status: 'unread',
      priority: 'high',
      timestamp: '2024-01-15T09:20:00',
      actionUrl: '/admin/inventory'
    },
    {
      id: 4,
      type: 'info',
      title: 'System Update Available',
      message: 'A new system update (v2.5.0) is available for installation',
      status: 'read',
      priority: 'low',
      timestamp: '2024-01-14T14:30:00',
      actionUrl: '/admin/settings'
    },
    {
      id: 5,
      type: 'order',
      title: 'Order Shipped',
      message: 'Order #ORD-2024-5430 has been shipped to customer',
      status: 'read',
      priority: 'medium',
      timestamp: '2024-01-14T16:15:00',
      actionUrl: '/admin/orders/ORD-2024-5430'
    },
    {
      id: 6,
      type: 'support',
      title: 'New Support Ticket',
      message: 'Support ticket #TKT-2024-001 created by Jane Smith',
      status: 'unread',
      priority: 'high',
      timestamp: '2024-01-15T13:45:00',
      actionUrl: '/admin/support/TKT-2024-001'
    },
    {
      id: 7,
      type: 'info',
      title: 'Backup Completed',
      message: 'Daily database backup completed successfully',
      status: 'read',
      priority: 'low',
      timestamp: '2024-01-15T02:00:00',
      actionUrl: null
    },
    {
      id: 8,
      type: 'alert',
      title: 'Failed Login Attempt',
      message: 'Multiple failed login attempts detected from IP 192.168.1.100',
      status: 'unread',
      priority: 'high',
      timestamp: '2024-01-15T08:30:00',
      actionUrl: '/admin/security'
    }
  ];

  const filterOptions = [
    { key: 'all', label: 'All', count: 0 },
    { key: 'unread', label: 'Unread', count: 0 },
    { key: 'read', label: 'Read', count: 0 },
    { key: 'order', label: 'Orders', count: 0 },
    { key: 'payment', label: 'Payments', count: 0 },
    { key: 'alert', label: 'Alerts', count: 0 },
    { key: 'support', label: 'Support', count: 0 }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setNotifications(mockNotifications);

      filterOptions.forEach(filter => {
        if (filter.key === 'all') {
          filter.count = mockNotifications.length;
        } else if (filter.key === 'unread' || filter.key === 'read') {
          filter.count = mockNotifications.filter(n => n.status === filter.key).length;
        } else {
          filter.count = mockNotifications.filter(n => n.type === filter.key).length;
        }
      });

      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...notifications];

    if (selectedFilter !== 'all') {
      if (selectedFilter === 'unread' || selectedFilter === 'read') {
        filtered = filtered.filter(n => n.status === selectedFilter);
      } else {
        filtered = filtered.filter(n => n.type === selectedFilter);
      }
    }

    if (searchQuery) {
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    setFilteredNotifications(filtered);
  }, [notifications, selectedFilter, searchQuery]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'order': return <ShoppingCart className="w-5 h-5" />;
      case 'payment': return <CheckCircle className="w-5 h-5" />;
      case 'alert': return <AlertCircle className="w-5 h-5" />;
      case 'info': return <Info className="w-5 h-5" />;
      case 'support': return <MessageCircle className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'order': return 'bg-blue-100 text-blue-600';
      case 'payment': return 'bg-green-100 text-green-600';
      case 'alert': return 'bg-red-100 text-red-600';
      case 'info': return 'bg-gray-100 text-gray-600';
      case 'support': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleNotificationAction = (action, notificationId) => {
    console.log(`${action} notification:`, notificationId);
    if (action === 'read') {
      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, status: 'read' } : n
      ));
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, status: 'read' })));
  };

  const NotificationCard = ({ notification }) => (
    <div className={`bg-white rounded-lg border p-4 hover:shadow-md transition-all ${
      notification.status === 'unread' ? 'border-green-300 bg-green-50' : 'border-gray-200'
    }`}>
      <div className="flex items-start space-x-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(notification.type)}`}>
          {getTypeIcon(notification.type)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                {notification.status === 'unread' && (
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
            </div>

            <div className="relative group ml-2">
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-5 h-5" />
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 invisible group-hover:visible z-10">
                <div className="py-1">
                  {notification.status === 'unread' && (
                    <button
                      onClick={() => handleNotificationAction('read', notification.id)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Mark as Read</span>
                    </button>
                  )}

                  {notification.actionUrl && (
                    <button
                      onClick={() => handleNotificationAction('view', notification.id)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleNotificationAction('delete', notification.id)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-3">
              <span className={`text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                {notification.priority.toUpperCase()}
              </span>
              <span className="text-xs text-gray-500">{formatDate(notification.timestamp)}</span>
            </div>

            {notification.actionUrl && (
              <button
                onClick={() => handleNotificationAction('view', notification.id)}
                className="text-xs text-green-600 hover:text-green-700 font-medium"
              >
                View →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => n.status === 'unread').length,
    highPriority: notifications.filter(n => n.priority === 'high').length,
    orders: notifications.filter(n => n.type === 'order').length,
    alerts: notifications.filter(n => n.type === 'alert').length
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-red-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">Stay updated with system alerts and updates</p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark All Read</span>
            </button>

            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Unread</p>
              <p className="text-xl font-bold text-green-600">{stats.unread}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-xl font-bold text-red-600">{stats.highPriority}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Orders</p>
              <p className="text-xl font-bold text-blue-600">{stats.orders}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Alerts</p>
              <p className="text-xl font-bold text-orange-600">{stats.alerts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-wrap gap-2 mb-4">
            {filterOptions.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedFilter === filter.key
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{filter.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedFilter === filter.key
                    ? 'bg-white bg-opacity-20 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notifications by title or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-600">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map(notification => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Notifications;
