import { useState } from 'react';
import { Search, Filter, Download, UserPlus, Eye, Edit, Trash2, Mail, Phone, ChevronLeft, ChevronRight } from 'lucide-react';

// Sample customer data
const customerData = [
  {
    id: "#CUS-1024",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+91 9876543210",
    location: "Mumbai, India",
    joinDate: "2024-12-15",
    status: "Active",
    orders: 8,
    totalSpent: "₹4,259.99"
  },
  {
    id: "#CUS-1023",
    name: "Michael Chen",
    email: "mchen@example.com",
    phone: "+91 8765432109",
    location: "Delhi, India",
    joinDate: "2024-11-28",
    status: "Active",
    orders: 5,
    totalSpent: "₹2,849.99"
  },
  {
    id: "#CUS-1022",
    name: "Emily Williams",
    email: "emily.w@example.com",
    phone: "+91 7654321098",
    location: "Bangalore, India",
    joinDate: "2024-10-14",
    status: "Inactive",
    orders: 2,
    totalSpent: "₹879.99"
  },
  {
    id: "#CUS-1021",
    name: "Robert Smith",
    email: "robert.s@example.com",
    phone: "+91 6543210987",
    location: "Chennai, India",
    joinDate: "2024-09-22",
    status: "Active",
    orders: 12,
    totalSpent: "₹6,639.99"
  },
  {
    id: "#CUS-1020",
    name: "Priya Sharma",
    email: "priya.s@example.com",
    phone: "+91 5432109876",
    location: "Kolkata, India",
    joinDate: "2024-08-30",
    status: "Active",
    orders: 6,
    totalSpent: "₹3,729.99"
  },
  {
    id: "#CUS-1019",
    name: "David Wilson",
    email: "david.w@example.com",
    phone: "+91 4321098765",
    location: "Hyderabad, India",
    joinDate: "2024-07-10",
    status: "Blocked",
    orders: 0,
    totalSpent: "₹0.00"
  }
];

// Status badge component
const StatusBadge = ({ status }) => {
  const statusStyles = {
    Active: "bg-green-500 text-white",
    Inactive: "bg-yellow-500 text-white",
    Blocked: "bg-red-500 text-white"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

export default function AdminCustomersPanel() {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;

  // Filter customers based on search and status
  const filteredCustomers = customerData.filter(customer => {
    const matchesSearch = 
      customer.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === "All" || customer.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto mt-10">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Customers Management</h1>
          <p className="text-gray-400">View and manage customer accounts and information</p>
        </header>

        {/* Customer stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-15 mt-15">
          <div className="bg-gray-900 rounded-lg p-6 shadow-xl">
            <p className="text-gray-400 mb-2">Total Customers</p>
            <h2 className="text-3xl font-bold">1,024</h2>
            <p className="text-green-500 text-sm mt-2">↑ 12% from last month</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 shadow-xl">
            <p className="text-gray-400 mb-2">Active Customers</p>
            <h2 className="text-3xl font-bold">892</h2>
            <p className="text-green-500 text-sm mt-2">↑ 5% from last month</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 shadow-xl">
            <p className="text-gray-400 mb-2">New Customers</p>
            <h2 className="text-3xl font-bold">48</h2>
            <p className="text-red-500 text-sm mt-2">↓ 3% from last month</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 shadow-xl">
            <p className="text-gray-400 mb-2">Blocked Accounts</p>
            <h2 className="text-3xl font-bold">17</h2>
            <p className="text-green-500 text-sm mt-2">↑ 2% from last month</p>
          </div>
        </div>

        {/* Filters and actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-15 gap-4">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search by ID, name, email, or location..."
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Blocked">Blocked</option>
              </select>
              <Filter className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 rounded-lg py-2 px-4 text-white">
              <UserPlus className="h-5 w-5" />
              <span>Add Customer</span>
            </button>
            
            <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg py-2 px-4 text-white">
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Customers table */}
        <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl mb-30">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800 text-left">
                  <th className="py-4 px-6 font-medium">CUSTOMER ID</th>
                  <th className="py-4 px-6 font-medium">NAME</th>
                  <th className="py-4 px-6 font-medium">CONTACT</th>
                  <th className="py-4 px-6 font-medium">LOCATION</th>
                  <th className="py-4 px-6 font-medium">JOIN DATE</th>
                  <th className="py-4 px-6 font-medium">ORDERS</th>
                  <th className="py-4 px-6 font-medium">STATUS</th>
                  <th className="py-4 px-6 font-medium text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {currentCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-800/50">
                    <td className="py-4 px-6 font-medium">{customer.id}</td>
                    <td className="py-4 px-6">
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-400">{customer.totalSpent} lifetime</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm mt-1">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {customer.phone}
                      </div>
                    </td>
                    <td className="py-4 px-6">{customer.location}</td>
                    <td className="py-4 px-6">{customer.joinDate}</td>
                    <td className="py-4 px-6">{customer.orders}</td>
                    <td className="py-4 px-6">
                      <StatusBadge status={customer.status} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20" title="View Customer">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" title="Edit Customer">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20" title="Delete Customer">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-between items-center bg-gray-800 px-6 py-4">
            <div className="text-sm text-gray-400">
              Showing {indexOfFirstCustomer + 1}-{Math.min(indexOfLastCustomer, filteredCustomers.length)} of {filteredCustomers.length} customers
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