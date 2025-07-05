// CartPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ChevronLeft, ChevronRight, ShoppingBag, CreditCard, TruckIcon } from 'lucide-react';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [shippingAmount, setShippingAmount] = useState();
  const navigate = useNavigate();

useEffect(() => {
  const fetchCart = async () => {
    try {
      const res = await fetch('http://localhost:5000/getCart', {
        method: 'GET',
        credentials: 'include',
      }); 
      const data = await res.json();
      console.log(data);
      
      setCartItems(data?.cart.Items);
      setShippingAmount(data?.cart.Shipping);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchCart();
}, []);

  // Cart calculations
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = ((item.Product.Variants[0]?.Price)*(1 - (item.Product.Discount) / 100)).toFixed(2);
      return total + price * item.Quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = shippingAmount;

  const totalAmount = () => {
    if(shipping === 'Free'){
      return (subtotal - discountAmount);
    }else{
      return (subtotal + shipping - discountAmount);
    }
  }

  const total = totalAmount();

  const incrementQuantity = (id) => {
    const updatedItems = cartItems.map(item => {
      if (item._id === id) {
        const newQuantity = item.Quantity + 1;
        updateQuantity(id, newQuantity); 
        return { ...item, Quantity: newQuantity };
      }
      return item;
    });

    setCartItems(updatedItems);
  };

  const decrementQuantity = (id) => {
    const updatedItems = cartItems.map(item => {
      if (item._id === id && item.Quantity > 1) {
        const newQuantity = item.Quantity - 1;
        updateQuantity(id, newQuantity); 
        return { ...item, Quantity: newQuantity };
      }
      return item;
    });

    setCartItems(updatedItems);
  };

  const removeItem = async (itemId, size, color) => {    
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/removeFromCart/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId, selectedSize: size, selectedColor: color }),
      });
      console.log(res);
      
      const data = await res.json();

      if (res.ok) {
        alert("Product removed from Cart!");
        setCartItems(cartItems.filter(item => item._id !== itemId));
        setCartItems(data.cart.Items);

      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Cart error:", err);
      alert("Could not remove from cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      setLoading(true);

      const res = await fetch(`http://localhost:5000/updateQuantityInCart`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity: newQuantity }),
      });

      const data = await res.json();

      if (res.ok) {
        setCartItems(cartItems.map(item =>
          item._id === itemId ? { ...item, Quantity: newQuantity } : item
        ));
        console.log("Quantity updated...");
      } else {
        alert(data.error || "Failed to update quantity");
      }

    } catch (err) {
      console.error("Quantity update error:", err);
      alert("Could not update quantity");
    } finally {
      setLoading(false);
    }
  };

  const updateCartTotal = async (newTotal) => {
    try {
      const res = await fetch('http://localhost:5000/updateCartTotal', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newTotal }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Cart total updated:", data.cart.SubTotal);
      } else {
        alert(data.error || "Failed to update cart total");
      }
    } catch (err) {
      console.error("Cart total update error:", err);
      alert("Could not update cart total");
    }
  };

  // Promo code handlers
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'save10') {
      const discount = subtotal * 0.1; 
      const newTotal = (subtotal - discount).toFixed(2);
      console.log(newTotal);
      
      updateCartTotal(newTotal);
      setDiscountAmount(discount);
      setPromoApplied(true);
    } else {
      alert('Invalid promo code');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-white mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Link to="/shop" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-slate-950 rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-slate-950 rounded-t-lg">
                <div className="flex font-medium text-white">
                  <div className="w-2/5">Product</div>
                  <div className="w-1/5 text-center">Price</div>
                  <div className="w-1/5 text-center">Quantity</div>
                  <div className="w-1/5 text-right">Total</div>
                </div>
              </div>

              {cartItems.map((item) => (
                <div key={item._id} className="p-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex flex-wrap md:flex-nowrap items-center">
                    <div className="w-full md:w-2/5 flex items-center mb-4 md:mb-0">
                      <div className="w-16 h-16 mr-4 flex-shrink-0">
                        <img 
                          src={item.Product.Images[0]?.Url} 
                          alt={item.Product.Images[0]?.Alt}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className='flex flex-col justify-center items-center'>
                        <h3 className="font-medium text-white">{item.Product.Name}</h3>
                        <p className="text-sm text-white">
                          {item.Product.brand} • {item.Color} • Size {item.Size}
                        </p>
                        <button 
                          onClick={() => removeItem(item._id, item.Size, item.Color)}
                          className="text-sm text-rose-400 cursor-pointer hover:scale-105 transition-all duration-200 flex items-center mt-2">
                          <Trash2 size={14} className="mr-1" /> Remove
                        </button>
                      </div>
                    </div>

                    <div className="w-1/3 md:w-1/5 text-center">
                      {item.onSale ? (
                        <div>
                          <span className="font-medium text-white">₹{item.salePrice.toFixed(2)}</span>
                          <span className="font-medium">₹{((item.Product.Variants[0]?.Price)*(1 - (item.Product.Discount) / 100)).toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="font-medium">₹{((item.Product.Variants[0]?.Price)*(1 - (item.Product.Discount) / 100)).toFixed(2)}</span>
                      )}
                    </div>

                    <div className="w-1/3 md:w-1/5">
                      <div className="flex border border-gray-300 rounded-md max-w-xs mx-auto">
                        <button
                          onClick={() => decrementQuantity(item._id)}
                          className="px-3 py-1 border-r border-gray-300"
                          disabled={item.Quantity <= 1}>
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.Quantity}
                          readOnly
                          className="w-12 text-center focus:outline-none py-1"
                        />
                        <button
                          onClick={() => incrementQuantity(item._id)}
                          className="px-3 py-1 border-l border-gray-300">
                          +
                        </button>
                      </div>
                    </div>

                    <div className="w-1/3 md:w-1/5 text-right font-medium">
                    ₹{((item.onSale ? item.salePrice : ((item.Product.Variants[0]?.Price)*(1 - (item.Product.Discount) / 100)).toFixed(2)) * item.Quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-center p-4 bg-slate-950 rounded-b-lg items-center text-center">
                <Link 
                  to="/shop" 
                  className="text-cyan-400 hover:text-cyan-500 flex items-center cursor-pointer hover:scale-105 transition-all duration-200"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-slate-950 rounded-lg shadow-sm border border-gray-200 sticky top-4">
              <div className="p-4 border-b border-gray-300 bg-slate-950 rounded-t-lg">
                <h2 className="font-bold text-lg">Order Summary</h2>
              </div>

              <div className="p-4">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-white">Subtotal ({cartItems.reduce((count, item) => count + item.Quantity, 0)} items)</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-white">Shipping</span>
                    {shipping === 'Free' ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      <span className="font-medium">₹{shipping.toFixed(2)}</span>
                    )}
                  </div>

                  {promoApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (10%)</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Promo Code */}
                {!promoApplied && (
                  <div className="mb-6">
                    <div className="flex mb-1">
                      <input
                        type="text"
                        placeholder="Promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        onClick={applyPromoCode}
                        className="bg-white hover:bg-gray-300 text-black px-4 py-2 rounded-r-md"
                      >
                        Apply
                      </button>
                    </div>
                    <p className="text-xs text-white">Try "SAVE10" for 10% off</p>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={ () => navigate('/checkout')}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 py-3 rounded-md font-medium mb-3">
                  Proceed to Checkout
                </button>

                <div className="text-center text-sm text-white flex justify-center space-x-4 mt-4">
                  <div className="flex items-center">
                    <CreditCard size={16} className="mr-1" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center">
                    <TruckIcon size={16} className="mr-1" />
                    <span>Fast Shipping</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;