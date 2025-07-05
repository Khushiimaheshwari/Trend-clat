import React, { useState, useEffect } from 'react';
import { Check, Package, Truck, CreditCard, ArrowRight, Download, Share2 } from 'lucide-react';

export default function OrderSuccessPage() {
  const sessionId = new URLSearchParams(window.location.search).get("session_id");
  const [showConfetti, setShowConfetti] = useState(false);
  const [orderData] = useState({
    orderNumber: '#ORD-2025-' + Math.floor(Math.random() * 10000),
    total: '$129.97',
    estimatedDelivery: 'June 18, 2025',
    items: [
      { name: 'Premium Wireless Headphones', price: '$89.99', qty: 1 },
      { name: 'Phone Case - Black', price: '$19.99', qty: 2 }
    ],
    email: 'customer@example.com'
  });

  useEffect(() => {
    if (sessionId) {
      fetch(`http://localhost:5000/confirm-order?session_id=${sessionId}`, {
        method: 'POST',
        credentials: 'include'
      }).then(res => res.json())
        .then(data => console.log(" Order confirmed", data))
        .catch(err => console.error(" Order confirmation failed", err));
    }
  }, []);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[20%] bg-slate-950 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Confetti animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-emerald-400 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
      )}

      <div className="relative z-0 container mx-auto px-4 py-12 mb-20">
        {/* Success header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/20 rounded-full mb-6 animate-scale-in">
            <Check className="w-10 h-10 text-emerald-400 animate-bounce" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-300 mb-2">Thank you for your purchase</p>
          <p className="text-gray-400">Your order has been successfully placed</p>
        </div>

        
      </div>
    </div>
  );
}

// {/* Main content grid */}
//         <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
//           {/* Order details card */}
//           <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
//             <h2 className="text-2xl font-semibold mb-6 flex items-center">
//               <Package className="w-6 h-6 mr-2 text-emerald-400" />
//               Order Details
//             </h2>
            
//             <div className="space-y-4 mb-6">
//               {orderData.items.map((item, index) => (
//                 <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700/50">
//                   <div>
//                     <p className="font-medium">{item.name}</p>
//                     <p className="text-sm text-gray-400">Qty: {item.qty}</p>
//                   </div>
//                   <p className="font-semibold text-emerald-400">{item.price}</p>
//                 </div>
//               ))}
//             </div>
            
//             <div className="pt-4 border-t border-gray-700/50">
//               <div className="flex justify-between items-center text-xl font-bold">
//                 <span>Total</span>
//                 <span className="text-emerald-400">{orderData.total}</span>
//               </div>
//             </div>
//           </div>

//           {/* Status and delivery card */}
//           <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
//             <h2 className="text-2xl font-semibold mb-6 flex items-center">
//               <Truck className="w-6 h-6 mr-2 text-blue-400" />
//               Delivery Info
//             </h2>
            
//             <div className="space-y-4">
//               <div className="flex items-center space-x-3">
//                 <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
//                   <Check className="w-4 h-4 text-white" />
//                 </div>
//                 <div>
//                   <p className="font-medium">Order Confirmed</p>
//                   <p className="text-sm text-gray-400">We've received your order</p>
//                 </div>
//               </div>
              
//               <div className="flex items-center space-x-3">
//                 <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
//                   <Package className="w-4 h-4 text-gray-300" />
//                 </div>
//                 <div>
//                   <p className="font-medium">Processing</p>
//                   <p className="text-sm text-gray-400">Preparing your items</p>
//                 </div>
//               </div>
              
//               <div className="flex items-center space-x-3">
//                 <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
//                   <Truck className="w-4 h-4 text-gray-300" />
//                 </div>
//                 <div>
//                   <p className="font-medium">Shipped</p>
//                   <p className="text-sm text-gray-400">On the way to you</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
//               <p className="text-sm text-gray-300">Estimated delivery</p>
//               <p className="text-xl font-semibold text-blue-400">{orderData.estimatedDelivery}</p>
//             </div>
//           </div>
//         </div>

//         {/* Action buttons */}
//         <div className="max-w-4xl mx-auto mt-8 flex flex-wrap gap-4 justify-center">
//           <button className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25">
//             <Download className="w-5 h-5" />
//             <span>Download Receipt</span>
//           </button>
          
//           <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg">
//             <Package className="w-5 h-5" />
//             <span>Track Order</span>
//           </button>
          
//           <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg">
//             <Share2 className="w-5 h-5" />
//             <span>Share</span>
//           </button>
//         </div>

//         {/* What's next section */}
//         <div className="max-w-2xl mx-auto mt-12 text-center">
//           <h3 className="text-2xl font-semibold mb-4">What happens next?</h3>
//           <div className="grid md:grid-cols-3 gap-6">
//             <div className="p-4">
//               <CreditCard className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
//               <p className="font-medium mb-1">Payment Processed</p>
//               <p className="text-sm text-gray-400">Your payment has been securely processed</p>
//             </div>
//             <div className="p-4">
//               <Package className="w-8 h-8 text-blue-400 mx-auto mb-2" />
//               <p className="font-medium mb-1">Order Preparation</p>
//               <p className="text-sm text-gray-400">We'll prepare and pack your items</p>
//             </div>
//             <div className="p-4">
//               <Truck className="w-8 h-8 text-purple-400 mx-auto mb-2" />
//               <p className="font-medium mb-1">Fast Delivery</p>
//               <p className="text-sm text-gray-400">Your order will be shipped soon</p>
//             </div>
//           </div>
//         </div>

//         {/* Footer CTA */}
//         <div className="text-center mt-12">
//           <p className="text-gray-400 mb-4">Want to continue shopping?</p>
//           <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25">
//             <span>Continue Shopping</span>
//             <ArrowRight className="w-5 h-5" />
//           </button>
//         </div>