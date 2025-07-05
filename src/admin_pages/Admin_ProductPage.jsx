import React, { useEffect, useState } from 'react';
import { Package, Eye, CheckCircle, XCircle, Clock, AlertTriangle, ChevronDown, ChevronUp, Search, Edit, Star, Calendar, User, Truck, RotateCcw } from 'lucide-react';

const AdminProductsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [products, setProducts] = useState([]);
  const [feedbackText, setFeedbackText] = useState('');
  const [deliveryCondition, setDeliveryCondition] = useState('');
  const [conditionValue, setConditionValue] = useState('');
  const [returnPolicy, setReturnPolicy] = useState('');
  const [returnDays, setReturnDays] = useState('');


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: 1,
        limit: 50,
        search: searchQuery,
        category: '', 
        type: '' 
      });

      const response = await fetch(`http://localhost:5000/all_products?${queryParams.toString()}`, {
        method: 'GET',
        credentials: 'include', 
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      console.log(data);
      
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchProducts();
}, [searchQuery]); 

  const filteredProducts = products.filter(product => {
    if (activeTab !== 'all' && product.Status.toLowerCase() !== activeTab.toLowerCase()) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        product.Product_ID.includes(query) ||
        product.Name.toLowerCase().includes(query) ||
        product.Comic_Theme.toLowerCase().includes(query) ||
        product.Vendor?.Name.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const toggleProductDetails = (productId) => {
    setExpandedProductId(expandedProductId === productId ? null : productId);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleProductAction = async (product, action) => {
  const productId = product._id;

  try {
    if (action === 'edit') {
      setSelectedProduct(product);
      setShowEditModal(true);
    } else if (action === 'approve') {
      const res = await fetch(`http://localhost:5000/approve_product/${productId}`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Approve failed');
      alert("Product Approved!");
      fetchProducts(); 
    } else if (action === 'reject') {
      const res = await fetch(`http://localhost:5000/reject_product/${productId}`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reject failed');
      alert("Product Rejected!");
      fetchProducts();
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

  const handleSaveChanges = async () => {
  if (!selectedProduct) return;

  const updates = {
  ReviewFeedback: feedbackText,
  Delivery: [
    {
      Condition: deliveryCondition,
      ConditionValue: parseFloat(conditionValue),
      Days_Required: selectedProduct?.Delivery?.[0]?.Days_Required || 0, 
      Locations: selectedProduct?.Delivery?.[0]?.Locations || [], 
    }
  ],
  ReturnPolicy: [
    {
      Available: returnPolicy !== "No returns available",
      ValidTill: returnPolicy,
      returnDays: parseInt(returnDays),
    }
  ]
};

  try {
    const res = await fetch(`http://localhost:5000/edit_product/${selectedProduct._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updates),
    });

    console.log(res);

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Edit failed');

    alert('Product updated successfully!');
    setShowEditModal(false);
    fetchProducts();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

useEffect(() => {
    if (showEditModal && selectedProduct) {
      setFeedbackText(selectedProduct.ReviewFeedback || '');
      setDeliveryCondition(selectedProduct.DeliveryCondition || '');
      setConditionValue(selectedProduct.ConditionValue || '');
      setReturnPolicy(selectedProduct.ReturnPolicy || '');
      setReturnDays(selectedProduct.ReturnDays || '');
    }
  }, [showEditModal, selectedProduct]);

  return (
    <div className="min-h-screen bg-slate-900 text-white transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Product Management</h1>
            <p className="text-gray-300">
              Review and manage vendor-submitted products
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-lime-200 bg-slate-800 border-gray-700 text-white"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'bg-slate-950 text-white'
                    : 'bg-slate-800 text-white border-gray-700 hover:bg-slate-700'
                }`}
              >
                All Products
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  activeTab === 'pending'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-slate-800 text-white border-gray-700 hover:bg-slate-700'
                }`}
              >
                Pending Review
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  activeTab === 'approved'
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-800 text-white border-gray-700 hover:bg-slate-700'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  activeTab === 'rejected'
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-800 text-white border-gray-700 hover:bg-slate-700'
                }`}
              >
                Rejected
              </button>
            </div>
          </div>

          {/* Products List */}
          {filteredProducts.length > 0 ? (
            <div className="space-y-4">
              {filteredProducts.map((product) => {
                const statusInfo = getStatusInfo(product.Status);
                const isExpanded = expandedProductId === product.Product_ID;
                const totalStock = product.Variants.reduce((sum, variant) => sum + variant.Stock, 0);

                return (
                  <div
                    key={product.Product_ID}
                    className="bg-slate-800 rounded-lg shadow-sm border-1 border-lime-200 overflow-hidden transition-all duration-300"
                  >
                    {/* Product Header */}
                    <div
                      className="p-4 cursor-pointer hover:bg-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      onClick={() => toggleProductDetails(product.Product_ID)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-4 flex-grow">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-slate-700 rounded overflow-hidden">
                            <img src={product.Images[0]?.Url} alt={product.Images[0]?.Alt} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h3 className="font-medium text-white">{product.Name}</h3>
                            <p className="text-sm text-gray-400">{product.Product_ID}</p>
                            <p className="text-sm text-gray-400">by <span className=' text-gray-300'>{product.Vendor?.Name}</span></p>
                          </div>
                        </div>

                        <div className="md:ml-auto flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium text-white">₹{product.Variants[0]?.Price}</p>
                            <p className="text-sm text-gray-400">Stock: {totalStock}</p>
                          </div>

                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color} flex items-center gap-1`}>
                            {statusInfo.icon}
                            {statusInfo.label}
                          </div>
                        </div>
                      </div>

                      <button className="text-gray-400">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>

                    {/* Product Details (Expanded) */}
                    {isExpanded && (
                      <div className="border-t border-gray-600 p-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                          {/* Product Info */}
                          <div className="bg-slate-700 p-4 rounded-lg">
                            <h4 className="font-medium text-white mb-3">Product Information</h4>
                            <div className="space-y-2">
                              <p className="text-sm"><span className="text-gray-400">Name:</span> <span className="text-white">{product.Name}</span></p>
                              <p className="text-sm"><span className="text-gray-400">Type:</span> <span className="text-white">{product.T_Shirt_Type}</span></p>
                              <p className="text-sm"><span className="text-gray-400">Theme:</span> <span className="text-white">{product.Comic_Theme}</span></p>
                              <p className="text-sm"><span className="text-gray-400">Description:</span> <span className="text-white">{product.Description}</span></p>
                              <p className="text-sm"><span className="text-gray-400">Discount:</span> <span className="text-white">{product.Discount}%</span></p>
                              <p className="text-sm"><span className="text-gray-400">Created:</span> <span className="text-white">{formatDate(product.createdAt)}</span></p>
                            </div>
                          </div>

                          {/* Variants */}
                          <div className="bg-slate-700 p-4 rounded-lg">
                            <h4 className="font-medium text-white mb-3">Product Variants</h4>
                            <div className="space-y-3">
                              {product.Variants.map((variant, index) => (
                                <div key={index} className="bg-slate-600 p-3 rounded">
                                  <p className="text-sm"><span className="text-gray-400">Color:</span> <span className="text-white">{variant.Color}</span></p>
                                  <p className="text-sm"><span className="text-gray-400">Sizes:</span> <span className="text-white">{variant.Size.join(', ')}</span></p>
                                  <p className="text-sm"><span className="text-gray-400">Price:</span> <span className="text-white">₹{variant.Price}</span></p>
                                  <p className="text-sm"><span className="text-gray-400">Stock:</span> <span className="text-white">{variant.Stock}</span></p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Delivery Settings */}
                          <div className="bg-slate-700 p-4 rounded-lg">
                            <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                              <Truck size={16} />
                              Delivery Information
                            </h4>
                            <div className="space-y-2">
                              {product.Delivery.map((delivery, index) => (
                                <div key={index} className="bg-slate-600 p-3 rounded">
                                  <p className="text-sm"><span className="text-gray-400">Days Required:</span> <span className="text-white">{delivery.Days_Required} days</span></p>
                                  <p className="text-sm"><span className="text-gray-400">Locations:</span> <span className="text-white">{delivery.Locations.join(', ')}</span></p>
                                  <p className="text-sm"><span className="text-gray-400">Condition:</span> <span className="text-white">{delivery.Condition}</span></p>
                                  {delivery.ConditionValue != 0 && (
                                    <p className="text-sm"><span className="text-gray-400">Value:</span> <span className="text-white">₹{delivery.ConditionValue}</span></p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Return Policy */}
                            <div className="bg-slate-700 p-4 rounded-lg">
                                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                                    <RotateCcw size={16} />
                                    Return Policy
                                </h4>
                                <div className="space-y-2">
                                    {Array.isArray(product.ReturnPolicy) && product.ReturnPolicy.length > 0 ? (
                                    product.ReturnPolicy.map((policy, index) => (
                                        <div key={index} className="bg-slate-600 p-3 rounded">
                                        <p className="text-sm">
                                            <span className="text-gray-400">Available:</span>{' '}
                                            <span className="text-white">{policy.Available ? 'Yes' : 'No'}</span>
                                        </p>
                                        <p className="text-sm">
                                            <span className="text-gray-400">Policy:</span>{' '}
                                            <span className="text-white">{policy.ValidTill}</span>
                                        </p>
                                        {policy.returnDays > 0 && (
                                            <p className="text-sm">
                                            <span className="text-gray-400">Return Days:</span>{' '}
                                            <span className="text-white">{policy.returnDays} days</span>
                                            </p>
                                        )}
                                        </div>
                                    ))
                                    ) : (
                                    <p className="text-sm text-gray-400">No return policy added yet.</p>
                                    )}
                                </div>
                            </div>
                        </div> 

                        {/* Review Status */}
                        {(product.ReviewFeedback || product.ReviewedBy) && (
                          <div className="bg-slate-700 p-4 rounded-lg mb-4">
                            <h4 className="font-medium text-white mb-3">Review Information</h4>
                            {product.ReviewedBy && (
                              <p className="text-sm mb-2"><span className="text-gray-400">Reviewed by:</span> <span className="text-white">{product.ReviewedBy}</span></p>
                            )}
                            {product.ReviewedAt && (
                              <p className="text-sm mb-2"><span className="text-gray-400">Reviewed at:</span> <span className="text-white">{formatDate(product.ReviewedAt)}</span></p>
                            )}
                            {product.ReviewFeedback && (
                              <p className="text-sm"><span className="text-gray-400">Feedback:</span> <span className="text-white">{product.ReviewFeedback}</span></p>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 justify-end">
                          <button
                            onClick={() => handleProductAction(product, 'edit')}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                          >
                            <Edit size={16} />
                            Edit Details
                          </button>

                          {product.Status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleProductAction(product, 'approve')}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                              >
                                <CheckCircle size={16} />
                                Approve
                              </button>
                              <button
                                onClick={() => handleProductAction(product, 'reject')}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                              >
                                <XCircle size={16} />
                                Reject
                              </button>
                            </>
                          )}

                          {product.Status === 'Rejected' && (
                            <button
                              onClick={() => handleProductAction(product, 'request_changes')}
                              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
                            >
                              <AlertTriangle size={16} />
                              Request Changes
                            </button>
                          )}

                          <button className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors flex items-center gap-2">
                            <Eye size={16} />
                            Preview
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-800 rounded-lg shadow-sm border border-gray-700 p-8 text-center">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No products found</h3>
              <p className="text-gray-300 mb-6">
                {searchQuery
                  ? "No products match your search criteria. Try a different search term."
                  : activeTab !== 'all'
                    ? `No ${activeTab} products found.`
                    : "No products have been submitted yet."}
              </p>
              {(searchQuery || activeTab !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveTab('all');
                  }}
                  className="px-4 py-2 bg-slate-950 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  View All Products
                </button>
              )}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {showEditModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border-1 border-lime-200 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Edit Product: {selectedProduct.Name}</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Review Feedback</label>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white"
                      rows="3"
                      placeholder="Enter feedback for vendor..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Delivery Condition</label>
                      <select 
                        value={deliveryCondition}
                        onChange={(e) => setDeliveryCondition(e.target.value)}
                        className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white">
                          <option value="">-- Select condition --</option>
                          <option value="Free delivery">Free delivery</option>
                          <option value="$price delivery charge">$price delivery charge</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Condition Value (₹)</label>
                      <input
                        type="number"
                        value={conditionValue}
                        onChange={(e) => setConditionValue(e.target.value)}
                        className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white"
                        placeholder="Enter amount"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Return Policy</label>
                      <select 
                        value={returnPolicy}
                        onChange={(e) => setReturnPolicy(e.target.value)}
                        className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white">
                        <option value="">-- Select condition --</option>
                        <option value="No returns available">No returns available</option>
                        <option value="$day easy returns">$day easy returns</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Return Days</label>
                      <input
                        type="number"
                        value={returnDays}
                        onChange={(e) => setReturnDays(e.target.value)}
                        className="w-full p-3 bg-slate-700 border border-gray-600 rounded-lg text-white"
                        placeholder="Enter days"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;