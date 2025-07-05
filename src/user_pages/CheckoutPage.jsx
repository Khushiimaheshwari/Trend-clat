import { useEffect, useState } from 'react';
import { CreditCard, MapPin, Package, Shield, ChevronRight, Edit3, Plus, CheckCircle2, Trash2, Phone, User } from 'lucide-react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

function CheckoutPage() {
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [total, setTotal] = useState(0); 
  const [shipping, setShipping] = useState();
  const [selectedPayment, setSelectedPayment] = useState('razorpay');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    phone: '',
    address: {
      type: 'Home',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      isDefault: false,
    }
  });

  const stripe = useStripe();
  const elements = useElements();
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  
  useEffect(() => {

    fetch("http://localhost:5000/userData", {
      method: 'GET',
      credentials: "include",
    })
      .then(res => {
        console.log(res);
        return res.json()
      })
      .then(data => {
        // if (data) {
        if (data && data.id) {
          setUserId(data.id);
          setUserName(data.Name);
          
        } else {
          console.error("User not logged in");
        }
      })
      .catch(err => console.error("Failed to fetch user", err));
  }, []);
  
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch('http://localhost:5000/getCart', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        console.log(data);
        
        setTotal(data?.cart.SubTotal)
        setShipping(data?.cart.Shipping)
        setCartItems(data?.cart.Items);
      } catch (err) {
        console.error('Failed to fetch cart:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCart();
  }, []);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/user_address_and_number', {
          method: 'GET',
          credentials: 'include', 
        });
        console.log(res);
        if (!res.ok) throw new Error(data.error || 'Failed to load profile');

        const data = await res.json();
        console.log(data);
        
        setAddresses(data.addresses);
        setPhoneNumber(data.PhoneNumber);
          
      } catch (err) {
        console.log(err);
        console.error('Error fetching profile:', err.message);
      }
    };
  
    fetchUserProfile();
  }, []);

  const handleSaveAddress = async () => {
  const payload = {
    phone: formData.phone,
    address: {
      type: formData.address.type,
      street: formData.address.street,
      city: formData.address.city,
      zipCode: formData.address.zipCode,
      state: formData.address.state,
      isDefault: false
    }
  };

  try {
    const res = await fetch("http://localhost:5000/add_checkout_address", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to save address");

    alert("Address updated successfully!");
  } catch (err) {
    console.error(err.message);
    alert("Error: " + err.message);
  }
};

  const savedCards = [
    { id: 1, type: "Visa", last4: "4242", expiry: "12/26" },
    { id: 2, type: "Mastercard", last4: "8888", expiry: "06/27" }
  ];

const handlePayment = async () => {
  const stripe = await stripePromise;
  
  try {
    const response = await fetch('http://localhost:5000/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        Customer_ID: userId,
        Total_Amount: total,
        Order_Items: cartItems.map(item => ({
          Product_ID: item.Product._id,
          Vendor_ID: item.Vendor,
          Product_Name: item.Product.Name,
          Product_Qty: item.Quantity,
          Product_Size: item.Size,
          Product_Price: item.Price,
          Product_Color: item.Color,
          Product_Image:
            Array.isArray(item.Product.Images) && item.Product.Images.length > 0
              ? [{ Url: item.Product.Images[0].Url, Alt: item.Product.Images[0].Alt || '' }]
              : [],
        })),
        Total_Items: cartItems.length,
        ShippingAddress: {
          Name: userName,
          Phone: phoneNumber,
          ...addresses[selectedAddress],
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Failed to create checkout session');

    const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });

    if (result.error) {
      alert(result.error.message);
    }
  } catch (err) {
    console.error(err);
    alert('Something went wrong during payment.');
  }
};

  const handleProceedToPay = () => {
   
    if (selectedPayment === 'card') {
      handlePayment();
    } else if (selectedPayment === 'upi') {
      alert('UPI payment integrating...');
    } else {
      alert('Choose any mode of payment');
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'home':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'work':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white mb-20">
      {/* Header */}
      <div className="bg-slate-950 border-b border-slate-950 py-4">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex text-center justify-center items-center space-x-4">
            <Package className="w-6 h-6 text-blue-400" />
            <h1 className="text-4xl font-bold">Checkout</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Delivery Address */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-semibold">Delivery Address</h2>
                </div>
                <button 
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New</span>
                </button>
              </div>

              <div className="space-y-4">
                {addresses.map((addr, index) => (
                <div 
                    key={addr._id}
                    className={`group relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer ${
                    selectedAddress === index 
                        ? 'border-blue-500 bg-gradient-to-r from-blue-500/10 to-purple-500/5 shadow-lg shadow-blue-500/20 scale-[1.02]' 
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800/80 hover:shadow-md'
                    }`}
                    onClick={() => setSelectedAddress(index)}
                >
                    {/* Selection indicator */}
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r transition-opacity duration-300 ${
                    selectedAddress === index 
                        ? 'from-blue-500 to-purple-500 opacity-100' 
                        : 'opacity-0'
                    }`} />
                    
                    <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(addr.type)}`}>
                            {addr.type}
                        </span>
                        <h3 className="font-semibold text-white text-lg">{addr.name}</h3>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                        {selectedAddress === index && (
                            <CheckCircle2 className="w-6 h-6 text-blue-400 animate-pulse" />
                        )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="text-gray-300 leading-relaxed">
                              <p className="font-medium text-start">{userName}</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="text-gray-300 leading-relaxed">
                              <p className="font-medium text-start">{addr.street}</p>
                              <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <p className="text-gray-300 font-mono text-sm">{phoneNumber}</p>
                        </div>
                    </div>
                    </div>

                    {/* Subtle hover effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 transition-transform duration-700 ${
                    selectedAddress === index ? 'translate-x-full' : '-translate-x-full group-hover:translate-x-full'
                    }`} />
                </div>
                ))}
            </div>

            {showAddAddress && (
                <div className="mt-8 p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 shadow-2xl">
                    <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">Add New Address</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium text-gray-300">Street Address</label>
                        <input 
                        type="text" 
                        placeholder="123 Main Street, Apt 4B"
                        value={formData.address.street}
                        onChange={(e) =>
                          setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })
                        }
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">City</label>
                        <input 
                        type="text" 
                        placeholder="Mumbai" 
                        value={formData.address.city}
                        onChange={(e) =>
                          setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })
                        }
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-500"
                        />
                    </div>

                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">State</label>
                        <input 
                        type="text" 
                        placeholder="Maharashtra" 
                        value={formData.address.state}
                        onChange={(e) =>
                          setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })
                        }
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-500"
                        />
                    </div>
                                        
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">PIN Code</label>
                        <input 
                        type="text" 
                        placeholder="10001" 
                        value={formData.address.zipCode}
                        onChange={(e) =>
                          setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })
                        }
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Phone Number</label>
                        <input 
                        type="tel" 
                        placeholder="+91 1234567890" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-500"
                        />
                    </div>
                    
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium text-gray-300">Address Type</label>
                        <select 
                          value={formData.address.type}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: { ...formData.address, type: e.target.value }
                            })
                          }
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-500">
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                        </select>
                    </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
                    <button 
                      onClick={handleSaveAddress}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Save Address</span>
                    </button>
                    <button 
                        onClick={() => setShowAddAddress(false)}
                        className="flex-1 sm:flex-none bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 border border-gray-600 hover:border-gray-500"
                    >
                        Cancel
                    </button>
                    </div>
                </div>
                )}
            </div> 

            {/* Payment Method */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center space-x-3 mb-6">
                <CreditCard className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-semibold">Payment Method</h2>
              </div>

              <div className="space-y-4">
                {/* Credit/Debit Card */}
                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPayment === 'card' 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedPayment('card')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-6 h-6 text-gray-400" />
                      <div>
                        <p className="font-semibold text-start">Credit/Debit Card</p>
                        <p className="text-sm text-gray-400">Visa, Mastercard, RuPay</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* UPI */}
                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPayment === 'upi' 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedPayment('upi')}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-orange-500 rounded text-xs font-bold flex items-center justify-center">
                      ₹
                    </div>
                    <div>
                      <p className="font-semibold text-start">UPI</p>
                      <p className="text-sm text-gray-400">Pay using UPI ID</p>
                    </div>
                  </div>
                </div>

                {/* Cash on Delivery */}
                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPayment === 'cod' 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedPayment('cod')}
                >
                  <div className="flex items-center space-x-3">
                    <Package className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="font-semibold text-start">Cash On Delivery</p>
                      <p className="text-sm text-gray-400">Pay when you receive</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 sticky top-4">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
                        <img 
                          src={item.Product.Images[0]?.Url} 
                          alt={item.Product.Images[0]?.Alt}
                          className="w-full h-full object-cover rounded"
                        />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.Product.Name}</p>
                      <p className="text-gray-400 text-sm">Qty: {item.Quantity}</p>
                    </div>
                    <p className="font-semibold">₹{item.Price}</p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-700 pt-4 space-y-3">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center space-x-2 mt-6 p-3 bg-green-900/20 rounded-lg border border-green-700">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm text-green-400">Secure checkout with SSL encryption</span>
              </div>

              {/* Proceed to Pay Button */}
              <button 
                onClick={handleProceedToPay}
                disabled={!stripe || !elements || isProcessing || selectedPayment !== 'card'}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 py-3 rounded-md font-medium mb-3 mt-6 flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50">
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Proceed to Pay ₹{total}</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;