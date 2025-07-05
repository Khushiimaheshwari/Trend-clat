import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee } from 'lucide-react';
import { BarChart, LineChart, PieChart, ArrowUp, ArrowDown, Package, ShoppingBag, Clock, DollarSign, ChevronRight, Users } from 'lucide-react';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('weekly');
  
  // Dummy data for stats
  const [stats, setStats] = useState({
    totalProducts: 416,
    totalOrders: 2587,
    pendingOrders: 184,
    revenue: 345897.50
  });
  
  // Dummy data for sales chart
  const [salesData, setSalesData] = useState([
    { date: 'Jan', amount: 28450 },
    { date: 'Feb', amount: 31200 },
    { date: 'Mar', amount: 26800 },
    { date: 'Apr', amount: 35400 },
    { date: 'May', amount: 42100 },
    { date: 'Jun', amount: 38600 },
    { date: 'Jul', amount: 45200 }
  ]);
  
  // Dummy data for top products
  const [topProducts, setTopProducts] = useState([
    { 
      _id: '1',
      name: 'Marvel Universe Oversized T-Shirts',
      totalSold: 256,
      revenue: 40959.99,
      images: ['./HomePage/OversizedTee.webp'],
      stock: 145,
      trend: 'up'
    },
    { 
      _id: '2',
      name: 'Custom Fan Art Hooded T-Shirts',
      totalSold: 189,
      revenue: 30158.99,
      images: ['./HomePage/HoodedT-Shirts.jpeg'],
      stock: 78,
      trend: 'up'
    },
    { 
      _id: '3',
      name: 'Anime Superheroes Graphic Printed Tee',
      totalSold: 154,
      revenue: 24897.99,
      images: ['./HomePage/GraphicPrintedTee.webp'],
      stock: 92,
      trend: 'down'
    },
    { 
      _id: '4',
      name: 'DC Comics Acid Wash T-Shirts',
      totalSold: 132,
      revenue: 19879.99,
      images: ['./HomePage/AcidWashT-Shirts.jpeg'],
      stock: 64,
      trend: 'up'
    }
  ]);
  
  // Dummy data for recent orders
  const [recentOrders, setRecentOrders] = useState([
    { 
      _id: '#ORD-5983',
      customer: 'Sarah Johnson',
      total: 1259.99,
      date: '2025-04-30',
      status: 'Delivered',
      statusClass: 'bg-green-500'
    },
    { 
      _id: '#ORD-5982',
      customer: 'Michael Chen',
      total: 849.99,
      date: '2025-04-30',
      status: 'Processing',
      statusClass: 'bg-blue-500'
    },
    { 
      _id: '#ORD-5981',
      customer: 'Emily Williams',
      total: 379.99,
      date: '2025-04-29',
      status: 'Shipped',
      statusClass: 'bg-purple-500'
    },
    { 
      _id: '#ORD-5980',
      customer: 'Robert Smith',
      total: 1639.99,
      date: '2025-04-29',
      status: 'Pending',
      statusClass: 'bg-yellow-500'
    },
    { 
      _id: '#ORD-5979',
      customer: 'Jessica Davis',
      total: 745.50,
      date: '2025-04-28',
      status: 'Delivered',
      statusClass: 'bg-green-500'
    }
  ]);

  // Simulated data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Dashboard gradient component
  const DashboardGradient = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
    </div>
  );

  // Chart data for display
  const chartData = {
    weekly: [42, 56, 78, 65, 89, 95, 86],
    monthly: [1250, 1800, 2100, 1950, 2400, 2800, 3100],
    yearly: [125000, 168000, 204000, 245000, 305000, 345000, 395000]
  };

  // Simulated chart component
  const SalesChart = ({ data, type }) => {
    return (
      <div className="h-64 w-full relative">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-teal-500/10 to-transparent rounded-lg"></div>
        <div className="h-full w-full flex items-end justify-around px-4">
          {data.map((amount, index) => {
            const height = `${(amount / Math.max(...data)) * 90}%`;
            return (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="w-8 bg-teal-500 rounded-t-md mb-2 transition-all duration-500 hover:bg-teal-400"
                  style={{ height }}
                ></div>
                <span className="text-xs text-gray-300">{salesData[index].date}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-slate-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      <span className="ml-3 text-lg text-teal-100">Loading dashboard data...</span>
    </div>
  );

  return (
    <div className="bg-slate-950 min-h-screen p-6 text-gray-100 relative">
      <DashboardGradient />
      
      <div className="relative z-10 mt-10">
        <h1 className="text-3xl font-bold text-white mb-14">Dashboard Overview</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Products Card */}
          <div className="bg-slate-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 border border-slate-700">
            <div className="flex p-6">
              <div className="rounded-full bg-blue-500/20 p-3 mr-4">
                <Package className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Total Products</p>
                <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
                <Link to="/products" className="text-sm text-blue-400 hover:text-blue-300 hover:underline mt-2 inline-block">
                  View all products
                </Link>
              </div>
            </div>
          </div>
          
          {/* Total Orders Card */}
          <div className="bg-slate-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 border border-slate-700">
            <div className="flex p-6">
              <div className="rounded-full bg-green-500/20 p-3 mr-4">
                <ShoppingBag className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
                <Link to="/orders" className="text-sm text-green-400 hover:text-green-300 hover:underline mt-2 inline-block">
                  View all orders
                </Link>
              </div>
            </div>
          </div>
          
          {/* Pending Orders Card */}
          <div className="bg-slate-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 border border-slate-700">
            <div className="flex p-6">
              <div className="rounded-full bg-yellow-500/20 p-3 mr-4">
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Pending Orders</p>
                <p className="text-2xl font-bold text-white">{stats.pendingOrders}</p>
                <Link to="/orders?status=pending" className="text-sm text-yellow-400 hover:text-yellow-300 hover:underline mt-2 inline-block">
                  View pending orders
                </Link>
              </div>
            </div>
          </div>
          
          {/* Revenue Card */}
          <div className="bg-slate-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 border border-slate-700">
            <div className="flex p-6">
              <div className="rounded-full bg-purple-500/20 p-3 mr-4">
              <IndianRupee className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-white">₹{stats.revenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                <Link to="/reports" className="text-sm text-purple-400 hover:text-purple-300 hover:underline mt-2 inline-block">
                  View reports
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Sales Trend Chart */}
          <div className="bg-slate-800 rounded-lg shadow-md p-6 lg:col-span-2 border border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Sales Trend</h2>
              <div className="flex space-x-2">
                <button 
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${activeChart === 'weekly' ? 'bg-teal-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
                  onClick={() => setActiveChart('weekly')}
                >
                  Weekly
                </button>
                <button 
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${activeChart === 'monthly' ? 'bg-teal-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
                  onClick={() => setActiveChart('monthly')}
                >
                  Monthly
                </button>
                <button 
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${activeChart === 'yearly' ? 'bg-teal-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
                  onClick={() => setActiveChart('yearly')}
                >
                  Yearly
                </button>
              </div>
            </div>
            <SalesChart data={chartData[activeChart]} type={activeChart} />
          </div>
          
          {/* Customer Distribution */}
          <div className="bg-slate-800 rounded-lg shadow-md p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-6">Buyer Analytics</h2>
            <div className="h-64 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border-8 border-slate-700 relative">
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="absolute top-0 right-0 left-0 bottom-0 bg-blue-500 opacity-80" style={{ clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 0 100%, 0 0, 15% 0)' }}></div>
                  <div className="absolute top-0 right-0 left-0 bottom-0 bg-green-500 opacity-80" style={{ clipPath: 'polygon(50% 50%, 15% 0, 50% 0)' }}></div>
                  <div className="absolute top-0 right-0 left-0 bottom-0 bg-yellow-500 opacity-80" style={{ clipPath: 'polygon(50% 50%, 0 0, 0 60%)' }}></div>
                  <div className="absolute top-0 right-0 left-0 bottom-0 bg-purple-500 opacity-80" style={{ clipPath: 'polygon(50% 50%, 0 60%, 0 100%, 50% 100%)' }}></div>
                  <div className="absolute top-0 right-0 left-0 bottom-0 bg-rose-500 opacity-80" style={{ clipPath: 'polygon(50% 50%, 50% 100%, 100% 100%)' }}></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-xs text-gray-300">Buyer Insights (45%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs text-gray-300">Market Stats (25%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-xs text-gray-300">Sales Demographics (15%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-xs text-gray-300">Buyer Analytics (10%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-rose-500 rounded-full mr-2"></div>
                <span className="text-xs text-gray-300">Buyer Profile (5%)</span>
              </div>
            </div>
          </div>
        </div>
      
        {/* Top Selling Products */}
        <div className="bg-slate-800 rounded-lg shadow-md p-6 mb-12 border border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Top Selling Products</h2>
            <Link to="/products" className="inline-flex items-center text-teal-300 font-medium hover:text-teal-200 hover:scale-105 transition-all duration-300">
              View All Products <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topProducts.map(product => (
              <div key={product._id} className="bg-slate-700 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
                <div className="relative">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium flex items-center bg-slate-800 bg-opacity-80 text-white">
                    {product.trend === 'up' ? (
                      <ArrowUp size={12} className="mr-1 text-green-400" />
                    ) : (
                      <ArrowDown size={12} className="mr-1 text-red-400" />
                    )}
                    {product.totalSold} sold
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-white truncate">{product.name}</h3>
                  <div className="flex justify-between mt-2">
                    <p className="text-teal-300 font-bold">₹{product.revenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    <p className="text-gray-400">{product.stock} in stock</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-600 flex justify-between items-center">
                    <span className="text-xs text-gray-400">Conversion rate: 65%</span>
                    <Link to={`/products/${product._id}`} className="text-xs text-teal-300 hover:text-teal-200">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recent Orders */}
        <div className="bg-slate-800 rounded-lg shadow-md p-6 mb-12 border border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
            <Link to="/orders" className="inline-flex items-center text-teal-300 font-medium hover:text-teal-200 hover:scale-105 transition-all duration-300">
              View All Orders <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {recentOrders.map((order, index) => (
                  <tr key={index} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{order._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">₹{order.total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${order.statusClass}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/orders/${order._id}`} className="text-teal-300 hover:text-teal-200 mr-4">Details</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* User Activity */}
        <div className="bg-slate-800 rounded-lg shadow-md p-6 border border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Vendor's Activity</h2>
            <Link to="/users" className="inline-flex items-center text-teal-300 font-medium hover:text-teal-200 hover:scale-105 transition-all duration-300">
              View All <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="flex space-x-4 mb-6">
            <div className="flex-1 bg-slate-700 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <Users className="w-5 h-5 text-blue-400 mr-2" />
                <h3 className="text-lg font-medium text-white">Sales Events</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">2,716</div>
              <p className="text-xs text-blue-400 flex items-center">
                <ArrowUp size={12} className="mr-1" />
                12.4% from last month
              </p>
            </div>
            <div className="flex-1 bg-slate-700 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <ShoppingBag className="w-5 h-5 text-green-400 mr-2" />
                <h3 className="text-lg font-medium text-white">Customer Engagement</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">1,170</div>
              <p className="text-xs text-green-400 flex items-center">
                <ArrowUp size={12} className="mr-1" />
                8.7% from last month
              </p>
            </div>
            <div className="flex-1 bg-slate-700 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <BarChart className="w-5 h-5 text-rose-400 mr-2" />
                <h3 className="text-lg font-medium text-white">Buyer Behavior</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-2">3.2%</div>
              <p className="text-xs text-rose-400 flex items-center">
                <ArrowDown size={12} className="mr-1" />
                0.5% from last month
              </p>
            </div>
          </div>
          
          {/* Activity timeline */}
          <div className="pl-4 border-l border-slate-700">
            <div className="mb-4 relative">
              <div className="absolute -left-6 mt-1 w-3 h-3 rounded-full bg-blue-500"></div>
              <div className="flex justify-between mb-1">
                <h4 className="text-sm font-medium text-white">New buyer registered</h4>
                <span className="text-xs text-gray-400">10 minutes ago</span>
              </div>
              <p className="text-xs text-gray-400">Buyer Sarah Johnson created account for your products</p>
            </div>
            <div className="mb-4 relative">
              <div className="absolute -left-6 mt-1 w-3 h-3 rounded-full bg-green-500"></div>
              <div className="flex justify-between mb-1">
                <h4 className="text-sm font-medium text-white">New order received</h4>
                <span className="text-xs text-gray-400">42 minutes ago</span>
              </div>
              <p className="text-xs text-gray-400">Sale completed: 3 items totaling ₹1,259.99</p>
            </div>
            <div className="mb-4 relative">
              <div className="absolute -left-6 mt-1 w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="flex justify-between mb-1">
                <h4 className="text-sm font-medium text-white">Inventory alert</h4>
                <span className="text-xs text-gray-400">1 hour ago</span>
              </div>
              <p className="text-xs text-gray-400">Your DC Comics Acid Wash T-Shirts running low (64 remaining)</p>
            </div>
            <div className="mb-4 relative">
              <div className="absolute -left-6 mt-1 w-3 h-3 rounded-full bg-purple-500"></div>
              <div className="flex justify-between mb-1">
                <h4 className="text-sm font-medium text-white">New feedback received</h4>
                <span className="text-xs text-gray-400">3 hours ago</span>
              </div>
              <p className="text-xs text-gray-400">5-star review posted for your "Marvel Universe Oversized T-Shirts""</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;