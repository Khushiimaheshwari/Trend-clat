import React, { useState, useEffect } from 'react';
import { BarChart, Users, Package, ShoppingBag, Settings, ChevronRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const VendorHome = () => {
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const navigate = useNavigate(); 
  
  // Key performance metrics
  const heroImages = [
    {
      title: "Join Our Seller Training Webinar",
      isPositive: true,
      icon: <TrendingUp size={24} />,
      image: "url(./AdminPage/Marvel.jpg)"
    },
    {
      title: "Festival Sale is Coming — Boost Your Listings!",
      isPositive: true,
      icon: <ShoppingBag size={24} />,
     image: "url(./AdminPage/Avenger-1.webp)"
    },
    {
      title: "New Feature: Analytics Dashboard",
      isPositive: true,
      icon: <Users size={24} />,
      image: "url(./AdminPage/Spiderman.webp)"
        }
  ];

  // Vendor categories
  const adminCategories = [
    { name: "Dashboard", icon: <BarChart size={24} />, count: "Overview", to: "/vendor_dashboard" },
    { name: "Products", icon: <Package size={24} />, count: "556 items", to: "/vendor_products" },
    { name: "Orders", icon: <ShoppingBag size={24} />, count: "184 pending", to: "/vendor_orders" },
    { name: "Sales", icon: <Users size={24} />, count: "₹85,450", to: "/vendor_sales" }

  ];

  // Recent orders
  const recentOrders = [
    { 
      id: "#ORD-5983",
      customer: "Sarah Johnson", 
      amount: 1259.99, 
      date: "2025-04-30",
      status: "Delivered",
      statusClass: "bg-green-500"
    },
    { 
      id: "#ORD-5982",
      customer: "Michael Chen", 
      amount: 849.99, 
      date: "2025-04-30",
      status: "Processing",
      statusClass: "bg-blue-500"
    },
    { 
      id: "#ORD-5981",
      customer: "Emily Williams", 
      amount: 379.99, 
      date: "2025-04-29",
      status: "Shipped",
      statusClass: "bg-purple-500"
    },
    { 
      id: "#ORD-5980",
      customer: "Robert Smith", 
      amount: 1639.99, 
      date: "2025-04-29",
      status: "Pending",
      statusClass: "bg-yellow-500"
    }
  ];

  // Top selling products
  const topProducts = [
    { 
      name: "Marvel Universe Oversized T-Shirts", 
      sold: 256,
      revenue: 329.99, 
      image: "./HomePage/OversizedTee.webp",
      stock: 145,
    },
    { 
      name: "Custom Fan Art Hooded T-Shirts", 
      sold: 189,
      revenue: 1099.99, 
      image: "./HomePage/HoodedT-Shirts.jpeg",
      stock: 78,
    },
    { 
      name: "Anime Superheroes Graphic Printed Tee", 
      sold: 157,
      revenue: 579.99, 
      image: "./HomePage/GraphicPrintedTee.webp",
      stock: 92,
    },
    { 
      name: "DC Comics Acid Wash T-Shirts", 
      sold: 132,
      revenue: 239.99, 
      image: "./HomePage/AcidWashT-Shirts.jpeg",
      stock: 64,
    }
  ];

  // Auto-rotate hero images
    useEffect(() => {
      const interval = setInterval(() => {
        setHeroImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }, []);
  
    const handleClick = () => {  
      window.scrollTo(0, 0); 
      navigate('/collections');  
    };   

  // Vendor gradient component similar to Home_Gradient
  const VendorGradient = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen z-0 -mt-12 bg-slate-950 text-gray-100 relative">
      <VendorGradient />

      {/* Vendor Welcome Section */}
      <section className="flex items-center justify-center pt-32 pb-16 bg-slate-950 text-white relative z-10">
        <div className="text-center items-center max-w-5xl p-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Vendor Dashboard
          </h1>
          <p className="text-lg md:text-xl px-6 text-lime-100 mb-8">
            <em>
            "Welcome to Your Marketplace HQ — Manage, Grow, and Thrive with Every Click."
            </em>
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-lime-100 hover:bg-lime-200 hover:scale-105 cursor-pointer text-black font-bold px-6 py-3 rounded-md transition duration-300">
              My Products
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 hover:scale-105 cursor-pointer text-white font-bold px-6 py-3 rounded-md transition duration-300 border border-slate-600">
            Track Performance
            </button>
          </div>
        </div>
      </section>
      
     {/* Hero Slider */}
     <div id='slider' className={`relative ${heroImages[heroImageIndex].bgClass} text-white mb-15 py-16 md:py-32 overflow-hidden transition-all duration-500 `}
      style={{ backgroundImage: heroImages[heroImageIndex].image, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        
        <div className="container mx-auto px-4">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">{heroImages[heroImageIndex].title}</h2>
            <p className="text-lg md:text-xl mb-8">{heroImages[heroImageIndex].subtitle}</p>
          </div>
        </div>
        
        {/* Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {heroImages.map((_, index) => (
            <button 
              key={index}
              onClick={() => setHeroImageIndex(index)}
              className={`w-3 h-3 rounded-full ${index === heroImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`}
            />
          ))}
        </div>
      </div>
      
      
      {/* Vendor Categories */}
      <section className="py-16 bg-slate-950 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">VENDOR CONTROLS</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminCategories.map((category, index) => (
              <a 
                // href="#" 
                href={category.to}
                key={index}
                className="group bg-slate-800 p-6 rounded-lg hover:bg-slate-700 transition duration-300 transform hover:scale-105 hover:shadow-lg flex flex-col items-center">
                <div className="mb-4 bg-slate-700 p-4 rounded-full group-hover:bg-teal-600 transition-colors duration-300">
                  {category.icon}
                </div>
                <h3 className="font-bold text-xl mb-2">{category.name}</h3>
                <p className="text-gray-300 text-sm">{category.count}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Orders */}
      <section className="py-16 bg-slate-950 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">RECENT ORDERS</h2>
            <a href="/orders" className="inline-flex items-center text-teal-200 font-bold hover:text-teal-300 hover:scale-105 transition-all duration-300">
              View All Orders <ChevronRight size={16} className="ml-1" />
            </a>
          </div>
          
          <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-slate-800 divide-y divide-slate-700">
                  {recentOrders.map((order, index) => (
                    <tr key={index} className="hover:bg-slate-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{order.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">₹{order.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{order.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${order.statusClass}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" className="text-teal-200 hover:text-teal-300 mr-4">Details</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      
      {/* Top Selling Products */}
      <section className="py-16 bg-slate-950 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">TOP SELLING PRODUCTS</h2>
            <a href="/products" className="inline-flex items-center text-teal-200 font-bold hover:text-teal-300 hover:scale-105 transition-all duration-300">
              View All Products <ChevronRight size={16} className="ml-1" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topProducts.map((product, index) => (
              <div key={index} className="bg-slate-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover object-center" />
                  <div className="absolute top-2 right-2 bg-slate-900 bg-opacity-80 text-white text-xs py-1 px-2 rounded">
                    {product.sold} sold
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg text-white line-clamp-1">{product.name}</h3>
                  <div className="flex justify-between mt-2">
                    <p className="text-teal-200 font-bold">₹{product.revenue.toLocaleString()}</p>
                    <p className="text-gray-300">{product.stock} in stock</p>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 bg-slate-700 text-white py-2 px-3 rounded hover:bg-slate-600 transition-colors text-sm">
                      Edit
                    </button>
                    <button className="flex-1 bg-rose-400 text-white py-2 px-3 rounded hover:bg-rose-500 transition-colors text-sm">
                      Manage Stock
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Quick Stats */}
      <section className="py-16 bg-slate-950 relative z-10">
        <div className="container mx-auto px-4 bg-slate-800 rounded-2xl">
          <div className="py-12 px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">QUICK STATS</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-slate-700 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold mb-2 text-teal-200">₹85,450</div>
                <div className="text-gray-300">🛒 Sales & Orders</div>
              </div>
              <div className="bg-slate-700 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold mb-2 text-rose-400">₹3,45,600</div>
                <div className="text-gray-300">💰 Earnings</div>
              </div>
              <div className="bg-slate-700 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold mb-2 text-purple-300">556</div>
                <div className="text-gray-300">📦 Inventory</div>
              </div>
              <div className="bg-slate-700 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold mb-2 text-yellow-300">100%</div>
                <div className="text-gray-300">📈 Performance</div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <button className="bg-lime-100 hover:bg-lime-200 hover:scale-105 cursor-pointer text-black font-bold px-6 py-3 rounded-md transition duration-300">
                Generate Reports
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Vendor Features */}
      <section className="py-16 bg-slate-950 mb-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-fuchsia-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold mb-2">Store Settings</h3>
              <p className="text-gray-300">Configure your store appearance and options</p>
            </div>
            <div className="text-center">
              <div className="bg-cyan-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold mb-2">User Management</h3>
              <p className="text-gray-300">Control access and permissions</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BarChart className="w-8 h-8 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold mb-2">Analytics</h3>
              <p className="text-gray-300">Track performance and sales data</p>
            </div>
          </div>
        </div>
      </section>
    
    </div>
  );
};

export default VendorHome;