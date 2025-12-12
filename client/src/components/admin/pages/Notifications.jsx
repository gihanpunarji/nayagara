import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  RefreshCw,
  AlertCircle,
  Info,
  CheckCircle,
  Server,
  AlertTriangle
} from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';
import api from '../../../api/axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    update: 0,
    system: 0
  });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/notifications');
      if (response.data.success) {
        const data = response.data.data;
        setNotifications(data);
        
        // Calculate stats
        setStats({
          total: data.length,
          critical: data.filter(n => n.notification_type === 'critical').length,
          update: data.filter(n => n.notification_type === 'update').length,
          system: data.filter(n => n.notification_type === 'system').length
        });
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    let filtered = [...notifications];

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(n => n.notification_type === selectedFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredNotifications(filtered);
  }, [notifications, selectedFilter, searchQuery]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-5 h-5" />;
      case 'update': return <RefreshCw className="w-5 h-5" />;
      case 'system': return <Server className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'critical': return 'bg-red-100 text-red-600 border-red-200';
      case 'update': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'system': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getTypeLabel = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filterOptions = [
    { key: 'all', label: 'All', count: stats.total, color: 'bg-gray-800 text-white' },
    { key: 'critical', label: 'Critical', count: stats.critical, color: 'bg-red-600 text-white' },
    { key: 'update', label: 'Updates', count: stats.update, color: 'bg-blue-600 text-white' },
    { key: 'system', label: 'System', count: stats.system, color: 'bg-gray-600 text-white' }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Notifications</h1>
            <p className="text-gray-500 mt-2 text-lg">Real-time alerts and system updates log</p>
            </div>
            
            <button
            onClick={fetchNotifications}
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm flex items-center space-x-2 font-medium"
            >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Log</span>
            </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {filterOptions.filter(f => f.key !== 'all').map((stat) => (
            <div key={stat.key} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                <div>
                <p className="text-gray-500 font-medium mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-gray-900">{stat.count}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    stat.key === 'critical' ? 'bg-red-50 text-red-600' :
                    stat.key === 'update' ? 'bg-blue-50 text-blue-600' : 
                    'bg-gray-50 text-gray-600'
                }`}>
                    {getTypeIcon(stat.key)}
                </div>
            </div>
            ))}
             <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-2xl shadow-lg text-white flex items-center justify-between">
                <div>
                <p className="text-green-100 font-medium mb-1">Total Logs</p>
                <h3 className="text-3xl font-bold">{stats.total}</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white bg-opacity-20 flex items-center justify-center backdrop-blur-sm">
                    <Server className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex p-1 bg-gray-100 rounded-xl">
                {filterOptions.map((filter) => (
                <button
                    key={filter.key}
                    onClick={() => setSelectedFilter(filter.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedFilter === filter.key
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    {filter.label}
                </button>
                ))}
            </div>

            <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-400"
            />
            </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No logs found</h3>
              <p className="text-gray-500 text-sm mt-1">System is running smoothly</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.notification_id}
                className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
              >
                {/* Left Border Indicator */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                     notification.notification_type === 'critical' ? 'bg-red-500' :
                     notification.notification_type === 'update' ? 'bg-blue-500' : 
                     'bg-gray-300'
                }`}></div>

                <div className="flex items-start gap-5 pl-2">
                   {/* Icon */}
                  <div className={`mt-1 w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center border ${getTypeColor(notification.notification_type)}`}>
                    {getTypeIcon(notification.notification_type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                             <div className="flex items-center gap-3 mb-1">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase ${
                                    notification.notification_type === 'critical' ? 'bg-red-50 text-red-700' :
                                    notification.notification_type === 'update' ? 'bg-blue-50 text-blue-700' : 
                                    'bg-gray-50 text-gray-700'
                                }`}>
                                    {notification.notification_type}
                                </span>
                                <span className="text-xs text-gray-400 font-medium">
                                    LOG #{notification.notification_id}
                                </span>
                             </div>
                             <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                {notification.title}
                             </h3>
                        </div>
                        <span className="text-sm text-gray-500 font-medium whitespace-nowrap bg-gray-50 px-3 py-1 rounded-lg">
                            {formatDate(notification.created_at)}
                        </span>
                    </div>
                    
                    <p className="text-gray-600 mt-2 leading-relaxed">
                        {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Notifications;
