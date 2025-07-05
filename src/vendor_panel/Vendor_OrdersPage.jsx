import { useEffect, useState } from 'react';
import { Search, Calendar, Filter, Download, Eye, Edit, ChevronLeft, ChevronRight, CheckCircle, Truck, Clock } from 'lucide-react';
import { useSelector } from "react-redux";

  const getStatusInfo = (status) => {
    switch (status) {
      case 'delivered':
        return {
          icon: <CheckCircle size={18} />,
          label: 'Delivered',
          color: 'text-green-500',
          bgColor: 'bg-green-900/50'
        };
      case 'dispatched':
        return {
          icon: <Truck size={18} />,
          label: 'Dispatched',
          color: 'text-blue-500',
          bgColor: 'bg-blue-900/50'
        };
      case 'processing':
        return {
          icon: <Clock size={18} />,
          label: 'Processing',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-900/50'
        };
      default:
        return {
          icon: <Package size={18} />,
          label: 'Unknown',
          color: 'text-gray-500',
          bgColor: 'bg-gray-800'
        };
    }
  };

export default function AdminOrdersPanel() {
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingItemId, setEditingItemId] = useState(null); 
  const [editingStatus, setEditingStatus] = useState(""); 
  const ordersPerPage = 5;
  const vendor = useSelector((state) => state.auth.user); 
  const currentVendorId = vendor?.id;

  useEffect(() => {
  fetchVendorOrders();
}, []);

const fetchVendorOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/vendor_orders", {
        credentials: "include"
      });
      
      const data = await res.json();      
      setOrders(data.orders);
    } catch (err) {
      console.error("Failed to fetch vendor orders:", err);
    } finally {
      setLoading(false);
    }
  };

const updateProductStatus = async (productId, newStatus) => {
  const orderID = orders[0]?.Order_ID
  
  try {
    const res = await fetch(`http://localhost:5000/vendor_orders/${orderID}/item/${productId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vendorId: currentVendorId, 
        status: newStatus,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Status updated successfully");
      setEditingItemId(null); 
      fetchVendorOrders();
    } else {
      console.log("Res not ok");
      alert(data.message);
    }
  } catch (err) {
    console.error("Error updating status", err);
    alert("Failed to update status");
  }
};

    const displayOrders = orders.map((order) => ({
      id: order.Order_ID,
      customer: order.ShippingAddress.Name,
      email: "", 
      amount: `₹${order.Total_Amount.toFixed(2)}`,
      date: new Date(order.createdAt).toLocaleDateString(),
      status: order.Order_Items[0]?.Product_Status,
      items: order.Order_Items.length,
    }));


    const filteredOrders = displayOrders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === "All" || order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto mt-10">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Orders Management</h1>
          <p className="text-gray-400 mb-15">Manage and process customer orders</p>
        </header>

        {/* Filters and actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-14 gap-4">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search orders by ID, customer, or email..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative">
              <select 
                className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 pr-10 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Processing">Processing</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
              </select>
              <Filter className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            
            <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg py-2 px-4 text-white">
              <Calendar className="h-5 w-5" />
              <span>Date Range</span>
            </button>
            
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 rounded-lg py-2 px-4 text-white">
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Orders table */}
        <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl mb-30">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800 text-left">
                  <th className="py-4 px-6 font-medium">ORDER ID</th>
                  <th className="py-4 px-6 font-medium">CUSTOMER</th>
                  <th className="py-4 px-6 font-medium">ITEMS</th>
                  <th className="py-4 px-6 font-medium">AMOUNT</th>
                  <th className="py-4 px-6 font-medium">DATE</th>
                  <th className="py-4 px-6 font-medium">STATUS</th>
                  <th className="py-4 px-6 font-medium text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {currentOrders.map((order) =>
                  orders.map((item) => (
                    <tr key={item.Product_ID} className="hover:bg-gray-800/50">
                      <td className="py-4 px-6 font-medium">{order.id}</td>
                      <td className="py-4 px-6">
                        <div>{order.customer}</div>
                        <div className="text-sm text-gray-400">{order.email}</div>
                      </td>
                      <td className="py-4 px-6">{order.items} items</td>
                      <td className="py-4 px-6 font-medium">{order.amount}</td>
                      <td className="py-4 px-6">{order.date}</td>
                      <td className="py-4 px-6">
                        {editingItemId === item.Order_Items[0]?.Product_ID._id ? (
                          <div className="flex gap-2 items-center">
                            <select
                              value={editingStatus}
                              onChange={(e) => setEditingStatus(e.target.value)}
                              className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-1"
                            >
                              <option value="Processing">Processing</option>
                              <option value="Dispatched">Dispatched</option>
                              <option value="Delivered">Delivered</option>
                            </select>

                            <button
                              onClick={() => updateProductStatus(item.Order_Items[0]?.Product_ID._id, editingStatus)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                            >
                              Save
                            </button>

                            <button
                              onClick={() => setEditingItemId(null)}
                              className="text-gray-400 hover:text-red-400 px-2"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            {(() => {
                              const { icon, label, color, bgColor } = getStatusInfo(order.status.toLowerCase());                              
                              return (
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${color} ${bgColor}`}>
                                  {icon}
                                  {label}
                                </span>
                              );
                            })()}
                          </>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                            onClick={() => {
                              setEditingItemId(item.Order_Items[0]?.Product_ID._id);
                              setEditingStatus(item.Order_Items[0]?.Product_Status);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-between items-center bg-gray-800 px-6 py-4">
            <div className="text-sm text-gray-400">
              Showing {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
            </div>
            <div className="flex gap-2 items-center">
              <button 
                className="p-1 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button 
                  key={index}
                  className={`h-8 w-8 rounded-md ${currentPage === index + 1 ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              
              <button 
                className="p-1 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}