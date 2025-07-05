import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PlusCircle, Search, ChevronLeft, ChevronRight, Edit, Trash2, CheckCircle, XCircle, Clock, Package } from 'lucide-react';
import Loader from '../components/Loader';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const tShirtTypes = [
    'Oversized', 'Acid Wash', 'Graphic Printed', 'Solid Color', 
    'Polo T-Shirts', 'Sleeveless', 'Long Sleeve', 'Henley', 
    'Hooded', 'Crop Tops'
  ];

  const comicThemes = [
    'Marvel Universe', 'DC Comics', 'Anime Superheroes', 
    'Classic Comics', 'Sci-Fi & Fantasy', 'Video Game Characters', 
    'Custom Fan Art'
  ];

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, selectedCategory, selectedType]);

  const fetchProducts = async () => {
  try {
    setLoading(true);

    const params = new URLSearchParams({
      page: currentPage,
      limit: 10,
      search: searchTerm,
    });

    if (selectedCategory) {
      params.append('category', selectedCategory);
    }

    if (selectedType) {
      params.append('type', selectedType);
    }

    const response = await fetch(`http://localhost:5000/all_products_vendor?${params.toString()}`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    console.log(data);
    
    setProducts(data.products);    
    setTotalPages(data.totalPages);
    setLoading(false);
  } catch (err) {
    console.error('Error fetching products:', err);
    setError('Failed to load products. Please try again.');
    setLoading(false);
  }
};

const getStatusInfo = (status) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return {
        icon: <CheckCircle size={18} />,
        label: 'Approved',
        color: 'text-green-500',
        bgColor: 'bg-green-900/50'
      };
    case 'pending':
      return {
        icon: <Clock size={18} />,
        label: 'Pending Review',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-900/50'
      };
    case 'rejected':
      return {
        icon: <XCircle size={18} />,
        label: 'Rejected',
        color: 'text-red-500',
        bgColor: 'bg-red-900/50'
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

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); 
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
      const response = await fetch(`http://localhost:5000/delete_product/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Delete request failed');
      }
      console.log("Product Deleted!");

      setProducts(products.filter(product => product._id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product. Please try again.');
    }
    }
  };

  const displayProducts = Array.isArray(products) && products.length > 0 ? products : products;

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
       <Loader/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 max-w-lg">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Products</h2>
          <p className="text-gray-300">{error}</p>
          <button 
            onClick={() => fetchProducts()}
            className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 transition-colors text-white rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-gray-200 p-6">
      <div className="max-w-full mx-auto mt-10 mb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <Link 
            to="/vendor_products/new" 
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 transition-colors rounded-md text-white font-medium"
          >
            <PlusCircle size={18} />
            <span>Add New Product</span>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800 rounded-lg p-4 mb-12 mt-12">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-4 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
              </div>
            </form>

            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All T-Shirt Types</option>
                {tShirtTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Comic Themes</option>
                {comicThemes.map(theme => (
                  <option key={theme} value={theme}>{theme}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {!Array.isArray(products) || displayProducts.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
              <Search size={24} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-medium text-gray-300 mb-2">No products found</h2>
            <p className="text-gray-400 mb-6">Add your first product or try a different search.</p>
            <Link 
              to="/vendor_products/new" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 transition-colors rounded-md text-white font-medium"
            >
              <PlusCircle size={18} />
              <span>Add New Product</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="border-b border-gray-700 bg-gray-800/80 items-center text-center">
                    <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Theme</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {displayProducts.map(product => {
                    const statusInfo = getStatusInfo(product.Status);
                    return (
                      <tr key={product._id} className="hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-10 h-10 rounded overflow-hidden bg-gray-700 flex items-center justify-center">
                          {Array.isArray(product?.Images) && product.Images.length > 0 ? (
                              <img 
                                  src={product.Images[0].Url} 
                                  alt={product.Images[0].Alt || 'Product'} 
                                  className="w-full h-full object-cover" 
                              />
                              ) : (
                              <span className="text-xs text-gray-400">No image</span>
                              )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{product.Name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.T_Shirt_Type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.Comic_Theme}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-400">${product.Variants[0].Price.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`${product.Variants.reduce((acc, v) => acc + v.Stock, 0) === 0 ? 'text-red-400' : 'text-gray-300'}`}>
                          {product.Variants.reduce((acc, v) => acc + v.Stock, 0)}
                        </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color} flex items-center gap-1`}>
                            {statusInfo.icon}
                            {statusInfo.label}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Link 
                              to={`/vendor_products/edit/${product._id}`}  
                              className="p-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 rounded transition-colors"
                              title="Edit product"
                            >
                              <Edit size={16} />
                            </Link>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="p-1.5 bg-red-600/20 text-red-400 hover:bg-red-600/40 rounded transition-colors"
                              title="Delete product"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="bg-gray-800 py-3 px-6 border-t border-gray-700 flex items-center justify-between">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-400">
                    Showing page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
              </div>
              <div className="flex justify-between sm:justify-end flex-1 gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-200 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/30 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-200 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/30 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div> 
    </div>
  );
};

export default ProductList;