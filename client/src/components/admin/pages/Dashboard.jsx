import React, { useState, useEffect } from 'react';
import {
  Users,
  Store,
  Package,
  ShoppingCart,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Globe,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import AdminLayout from '../layout/AdminLayout';
import api from '../../../api/axios';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [systemHealth, setSystemHealth] = useState([]);
  
  // Simulated Real-time Data (Requested to keep)
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 2847,
    serverLoad: 45,
    responseTime: 125,
    errorRate: 0.02
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashboardRes, analyticsRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/analytics') // Assuming this endpoint handles time range or defaults
        ]);

        if (dashboardRes.data.success) {
          const { activeSellers, ordersToday, totalProducts, totalRevenue, totalUsers, recentActivities, systemHealth } = dashboardRes.data.data;
          setStats({
            activeSellers,
            ordersToday,
            totalProducts,
            totalRevenue,
            totalUsers
          });
          setActivities(recentActivities || []);
          setSystemHealth(systemHealth || []);
        }

        if (analyticsRes.data.success) {
          setRevenueData(analyticsRes.data.data.revenueOverTime || []);
        }

      } catch (error) {
        console.error('Dashboard data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Real-time simulation interval
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 20) - 10,
        serverLoad: Math.max(20, Math.min(80, prev.serverLoad + Math.floor(Math.random() * 10) - 5)),
        responseTime: Math.max(80, Math.min(200, prev.responseTime + Math.floor(Math.random() * 20) - 10)),
        errorRate: Math.max(0, Math.min(0.1, prev.errorRate + (Math.random() * 0.02) - 0.01))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <Activity className="w-8 h-8 animate-spin text-green-600" />
        </div>
      </AdminLayout>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-4 text-sm">
             <span className={`flex items-center font-medium ${trend > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {trend > 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                {Math.abs(trend)}%
             </span>
             <span className="text-gray-400 ml-2">vs last month</span>
        </div>
      )}
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">System overview and analytics</p>
        </div>

        {/* Real-time Status Section */}
        <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
             {/* Background decoration */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-green-500 rounded-full opacity-10 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-blue-500 rounded-full opacity-10 blur-2xl"></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <h2 className="text-lg font-semibold flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-green-400" />
                    Real-time System Status
                </h2>
                <span className="flex items-center text-xs font-medium bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse mr-2"></span>
                    Live
                </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                <div className="text-center md:text-left">
                    <p className="text-gray-400 text-sm mb-1">Active Users</p>
                    <p className="text-3xl font-bold tracking-tight">{realTimeData.activeUsers.toLocaleString()}</p>
                </div>
                <div className="text-center md:text-left">
                    <p className="text-gray-400 text-sm mb-1">Server Load</p>
                    <div className="flex items-baseline justify-center md:justify-start">
                        <p className={`text-3xl font-bold tracking-tight ${realTimeData.serverLoad > 80 ? 'text-red-400' : 'text-white'}`}>
                            {realTimeData.serverLoad}%
                        </p>
                    </div>
                </div>
                <div className="text-center md:text-left">
                    <p className="text-gray-400 text-sm mb-1">Avg Response</p>
                    <p className="text-3xl font-bold tracking-tight">{realTimeData.responseTime}<span className="text-lg text-gray-500 ml-1">ms</span></p>
                </div>
                <div className="text-center md:text-left">
                    <p className="text-gray-400 text-sm mb-1">Error Rate</p>
                    <p className={`text-3xl font-bold tracking-tight ${realTimeData.errorRate > 0.05 ? 'text-red-400' : 'text-green-400'}`}>
                        {(realTimeData.errorRate * 100).toFixed(2)}%
                    </p>
                </div>
            </div>
        </div>

        {/* Key Stats */}
        {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <StatCard 
                    title="Total Revenue" 
                    value={`Rs. ${(stats.totalRevenue || 0).toLocaleString()}`} 
                    icon={DollarSign} 
                    color="bg-emerald-500" 
                    trend={12.5}
                 />
                 <StatCard 
                    title="Active Sellers" 
                    value={stats.activeSellers} 
                    icon={Store} 
                    color="bg-blue-500" 
                    trend={8.2}
                 />
                 <StatCard 
                    title="Total Products" 
                    value={stats.totalProducts} 
                    icon={Package} 
                    color="bg-indigo-500" 
                    trend={-2.4}
                 />
                 <StatCard 
                    title="Orders Today" 
                    value={stats.ordersToday} 
                    icon={ShoppingCart} 
                    color="bg-orange-500"
                    trend={5.0} 
                 />
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Revenue Breakdown</h2>
                    <BarChart3 className="w-5 h-5 text-gray-400" />
                 </div>
                 <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis 
                                dataKey="date" 
                                tick={{ fontSize: 12, fill: '#6b7280' }} 
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
                            />
                            <YAxis 
                                tick={{ fontSize: 12, fill: '#6b7280' }} 
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(val) => `Rs.${(val/1000).toFixed(0)}k`}
                            />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                formatter={(val) => [`Rs. ${val.toLocaleString()}`, 'Revenue']}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="#10b981" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorRev)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                 </div>
            </div>

            {/* System Health */}
            <div className="space-y-6">
                 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900">System Health</h2>
                        <Globe className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-4">
                        {systemHealth.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-2 h-2 rounded-full ${item.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        item.status === 'healthy' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                                    }`}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>

                 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {activities.map((act, idx) => (
                            <div key={idx} className="flex items-start space-x-3 text-sm">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <Users className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{act.title}</p>
                                    <p className="text-gray-500 text-xs">{act.description}</p>
                                </div>
                            </div>
                        ))}
                        {activities.length === 0 && <p className="text-gray-500 text-sm">No recent activity.</p>}
                    </div>
                 </div>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;