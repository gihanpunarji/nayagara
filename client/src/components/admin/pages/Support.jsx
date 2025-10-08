import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Search,
  Filter,
  RefreshCw,
  Eye,
  MoreVertical,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Send,
  Paperclip,
  Mail
} from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState([]);

  const mockTickets = [
    {
      id: 'TKT-2024-001',
      subject: 'Order not received',
      customer: 'John Doe',
      email: 'john@example.com',
      orderId: 'ORD-2024-5432',
      priority: 'high',
      status: 'open',
      category: 'Order Issue',
      assignedTo: 'Sarah Admin',
      createdAt: '2024-01-15T10:30:00',
      lastReply: '2024-01-15T14:20:00',
      messages: 3
    },
    {
      id: 'TKT-2024-002',
      subject: 'Product damaged during delivery',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      orderId: 'ORD-2024-5433',
      priority: 'high',
      status: 'in-progress',
      category: 'Delivery Issue',
      assignedTo: 'Mike Support',
      createdAt: '2024-01-15T11:00:00',
      lastReply: '2024-01-15T15:30:00',
      messages: 5
    },
    {
      id: 'TKT-2024-003',
      subject: 'How to track my order?',
      customer: 'Bob Wilson',
      email: 'bob@example.com',
      orderId: 'ORD-2024-5434',
      priority: 'low',
      status: 'resolved',
      category: 'General Inquiry',
      assignedTo: 'Sarah Admin',
      createdAt: '2024-01-14T09:15:00',
      lastReply: '2024-01-14T10:00:00',
      messages: 2
    },
    {
      id: 'TKT-2024-004',
      subject: 'Request for refund',
      customer: 'Alice Brown',
      email: 'alice@example.com',
      orderId: 'ORD-2024-5435',
      priority: 'medium',
      status: 'open',
      category: 'Refund Request',
      assignedTo: null,
      createdAt: '2024-01-15T13:45:00',
      lastReply: '2024-01-15T13:45:00',
      messages: 1
    },
    {
      id: 'TKT-2024-005',
      subject: 'Product quality concern',
      customer: 'Charlie Davis',
      email: 'charlie@example.com',
      orderId: 'ORD-2024-5436',
      priority: 'medium',
      status: 'in-progress',
      category: 'Product Issue',
      assignedTo: 'Mike Support',
      createdAt: '2024-01-15T08:20:00',
      lastReply: '2024-01-15T16:10:00',
      messages: 7
    },
    {
      id: 'TKT-2024-006',
      subject: 'Account login issues',
      customer: 'Diana Evans',
      email: 'diana@example.com',
      orderId: null,
      priority: 'low',
      status: 'closed',
      category: 'Account Issue',
      assignedTo: 'Sarah Admin',
      createdAt: '2024-01-13T14:30:00',
      lastReply: '2024-01-13T15:00:00',
      messages: 4
    }
  ];

  const filterOptions = [
    { key: 'all', label: 'All Tickets', count: 0 },
    { key: 'open', label: 'Open', count: 0 },
    { key: 'in-progress', label: 'In Progress', count: 0 },
    { key: 'resolved', label: 'Resolved', count: 0 },
    { key: 'closed', label: 'Closed', count: 0 }
  ];

  const priorityOptions = ['low', 'medium', 'high'];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setTickets(mockTickets);

      filterOptions.forEach(filter => {
        if (filter.key === 'all') {
          filter.count = mockTickets.length;
        } else {
          filter.count = mockTickets.filter(t => t.status === filter.key).length;
        }
      });

      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...tickets];

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(t => t.status === selectedFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredTickets(filtered);
  }, [tickets, selectedFilter, searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-700 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleTicketAction = (action, ticketId) => {
    console.log(`${action} ticket:`, ticketId);
  };

  const TicketRow = ({ ticket }) => (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={selectedTickets.includes(ticket.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedTickets([...selectedTickets, ticket.id]);
            } else {
              setSelectedTickets(selectedTickets.filter(id => id !== ticket.id));
            }
          }}
          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
        />
      </td>

      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{ticket.id}</div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
              <span>{ticket.priority.toUpperCase()}</span>
            </span>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{ticket.subject}</div>
          <div className="text-xs text-gray-500">{ticket.category}</div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{ticket.customer}</div>
          <div className="text-xs text-gray-500">{ticket.email}</div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="space-y-1">
          {ticket.assignedTo ? (
            <>
              <div className="text-sm font-medium text-gray-900">{ticket.assignedTo}</div>
              <div className="text-xs text-gray-500">Assigned</div>
            </>
          ) : (
            <div className="text-sm text-gray-400">Unassigned</div>
          )}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="text-sm text-gray-900">{formatDate(ticket.createdAt)}</div>
          <div className="text-xs text-gray-500">{ticket.messages} message{ticket.messages > 1 ? 's' : ''}</div>
        </div>
      </td>

      <td className="px-6 py-4">
        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
          {getStatusIcon(ticket.status)}
          <span>{ticket.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
        </span>
      </td>

      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => handleTicketAction('view', ticket.id)}
            className="text-gray-600 hover:text-red-600 transition-colors"
            title="View Ticket"
          >
            <Eye className="w-4 h-4" />
          </button>

          <div className="relative group">
            <button className="text-gray-600 hover:text-red-600 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>

            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 invisible group-hover:visible z-10">
              <div className="py-1">
                <button
                  onClick={() => handleTicketAction('reply', ticket.id)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Reply</span>
                </button>

                <button
                  onClick={() => handleTicketAction('assign', ticket.id)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Assign</span>
                </button>

                {ticket.status !== 'resolved' && (
                  <button
                    onClick={() => handleTicketAction('resolve', ticket.id)}
                    className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark Resolved</span>
                  </button>
                )}

                {ticket.status !== 'closed' && (
                  <button
                    onClick={() => handleTicketAction('close', ticket.id)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Close Ticket</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );

  const stats = {
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.status === 'open').length,
    inProgressTickets: tickets.filter(t => t.status === 'in-progress').length,
    resolvedTickets: tickets.filter(t => t.status === 'resolved').length,
    highPriority: tickets.filter(t => t.priority === 'high').length,
    unassigned: tickets.filter(t => !t.assignedTo).length
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
            <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
            <p className="text-gray-600 mt-1">Manage customer support requests and inquiries</p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalTickets}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Open</p>
              <p className="text-xl font-bold text-blue-600">{stats.openTickets}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-xl font-bold text-yellow-600">{stats.inProgressTickets}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-xl font-bold text-green-600">{stats.resolvedTickets}</p>
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
              <p className="text-sm text-gray-600">Unassigned</p>
              <p className="text-xl font-bold text-orange-600">{stats.unassigned}</p>
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
              placeholder="Search tickets by ID, subject, customer, email, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredTickets.length === 0 ? (
            <div className="p-12 text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
              <p className="text-gray-600">No support tickets match your current filters.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedTickets.length === filteredTickets.length && filteredTickets.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTickets(filteredTickets.map(t => t.id));
                            } else {
                              setSelectedTickets([]);
                            }
                          }}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ticket ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned To
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTickets.map(ticket => (
                      <TicketRow key={ticket.id} ticket={ticket} />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Showing {filteredTickets.length} of {tickets.length} tickets
                  </p>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm">
                      Previous
                    </button>
                    <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Support;
