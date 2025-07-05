import { useState } from 'react';
import { Search, Calendar, Filter, Download, ArrowUp, ArrowDown, TrendingUp, ShoppingBag, DollarSign, Users, LineChart } from 'lucide-react';

// Sample data for sales stats
const salesStats = {
  totalSales: "₹28,759.85",
  salesGrowth: 12.8,
  totalOrders: 142,
  ordersGrowth: 8.5,
  averageOrder: "₹202.53",
  avgOrderGrowth: 3.2,
  customers: 87,
  customersGrowth: 5.9
};

// Sample data for top products
const topProducts = [
  { id: "PRD-3452", name: "Marvel Universe Oversized T-Shirts", price: "₹899.99", sold: 26, revenue: "₹23,399.74", inStock: 42 },
  { id: "PRD-2967", name: "DC Comics Acid Wash T-Shirts", price: "₹1,299.99", sold: 21, revenue: "₹27,299.79", inStock: 13 },
  { id: "PRD-5128", name: "Classic Comics Hooded Tees", price: "₹549.99", sold: 19, revenue: "₹10,449.81", inStock: 37 },
  { id: "PRD-4791", name: "Classic Comics Sleeveless Tees", price: "₹399.99", sold: 18, revenue: "₹7,199.82", inStock: 25 },
  { id: "PRD-6104", name: "Custom Fan Art Hooded T-Shirts", price: "₹1,799.99", sold: 14, revenue: "₹25,199.86", inStock: 8 }
];

// Sample data for recent sales
const recentSales = [
  { id: "#SL-8742", date: "2025-05-12", customer: "Rahul Patel", items: 3, amount: "₹2,599.97", payment: "Credit Card" },
  { id: "#SL-8741", date: "2025-05-12", customer: "Ananya Desai", items: 1, amount: "₹899.99", payment: "UPI" },
  { id: "#SL-8740", date: "2025-05-11", customer: "Vikram Singh", items: 2, amount: "₹1,849.98", payment: "PayPal" },
  { id: "#SL-8739", date: "2025-05-11", customer: "Meera Kapoor", items: 4, amount: "₹3,199.96", payment: "Credit Card" }
];

// Stats Card Component
const StatsCard = ({ title, value, growth, icon: Icon, color }) => {
  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 mb-1 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mb-2">{value}</h3>
          <div className={`flex items-center text-sm ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {growth >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
            <span>{Math.abs(growth)}% from last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg bg-opacity-10 ${color}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );
};

// VendorSalesPage Component
export default function VendorSalesPage() {
  const [dateRange, setDateRange] = useState("This Month");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter products based on search
  const filteredProducts = topProducts.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto mt-10">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Vendor Sales Dashboard</h1>
          <p className="text-gray-400 mb-6">Monitor your product performance and sales metrics</p>
        </header>

        {/* Filters and actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="relative">
            <select
              className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 pr-10 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="Last 3 Months">Last 3 Months</option>
              <option value="Last 6 Months">Last 6 Months</option>
              <option value="This Year">This Year</option>
            </select>
            <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg py-2 px-4 text-white">
              <Filter className="h-5 w-5" />
              <span>Filter</span>
            </button>

            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 rounded-lg py-2 px-4 text-white">
              <Download className="h-5 w-5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Sales" value={salesStats.totalSales} growth={salesStats.salesGrowth} icon={DollarSign} color="text-green-500" />
          <StatsCard title="Total Orders" value={salesStats.totalOrders} growth={salesStats.ordersGrowth} icon={ShoppingBag} color="text-blue-500" />
          <StatsCard title="Average Order Value" value={salesStats.averageOrder} growth={salesStats.avgOrderGrowth} icon={TrendingUp} color="text-purple-500" />
          <StatsCard title="Customers" value={salesStats.customers} growth={salesStats.customersGrowth} icon={Users} color="text-amber-500" />
        </div>

        {/* Top Selling Products */}
        <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg mb-8">
          <div className="flex justify-between items-center p-6 border-b border-gray-800">
            <h3 className="text-lg font-semibold">Top Selling Products</h3>
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800 text-left">
                  <th className="py-4 px-6 font-medium">ID</th>
                  <th className="py-4 px-6 font-medium">PRODUCT</th>
                  <th className="py-4 px-6 font-medium">PRICE</th>
                  <th className="py-4 px-6 font-medium">SOLD</th>
                  <th className="py-4 px-6 font-medium">REVENUE</th>
                  <th className="py-4 px-6 font-medium">STOCK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-800/50">
                    <td className="py-4 px-6 font-medium">{product.id}</td>
                    <td className="py-4 px-6">
                      <div>{product.name}</div>
                      <div className="text-sm text-gray-400">{product.sku}</div>
                    </td>
                    <td className="py-4 px-6">{product.price}</td>
                    <td className="py-4 px-6 font-medium">{product.sold} units</td>
                    <td className="py-4 px-6 font-medium">{product.revenue}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.inStock > 20 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {product.inStock} in stock
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
