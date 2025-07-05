import { useEffect, useState } from 'react';
import { Heart, Trash2, ShoppingCart, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WishlistPage() {
  const [userWishlist, setUserWishlist] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch("http://localhost:5000/wishlist", {
          credentials: "include",
        });
        console.log(res);
        
        const data = await res.json();
        setUserWishlist(data.wishlist || []);
        console.log("Wishlist fetched:", data.wishlist);
      } catch (err) {
        console.error("Failed to load wishlist", err);
      }
    };

    fetchWishlist();
  }, []);
  
  const removeFromWishlist = async (productId, selectedColor, selectedSize) => {    
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/removeFromWishlist/${productId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, selectedColor, selectedSize }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Removed From Wishlist!");
        setUserWishlist(prev =>
          prev.filter(
            item =>
              !(
                item.product._id === productId &&
                item.selectedColor === selectedColor &&
                item.selectedSize === selectedSize
              )
          )
        );
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Wishlist error:", err);
      alert("Could not remove from wishlist");
    } finally {
      setLoading(false);
    }
  };
  
  const tShirtTypes = ['All', 'Oversized', 'Acid Wash', 'Graphic Printed', 'Solid Color', 'Polo T-Shirts', 'Sleeveless', 'Long Sleeve', 'Henley', 'Hooded'];

  const handleFilterChange = (filter) => setActiveFilter(filter);

  const filteredItems = activeFilter === 'All'
    ? userWishlist
    : userWishlist.filter(item => item.product.T_Shirt_Type === activeFilter);

  const moveToCart = (id) => {
    alert(`Item ${id} moved to cart!`);
    removeFromWishlist(id);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-5">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8 justify-between">
          <h1 className="text-4xl text-center font-bold text-white">My Wishlist</h1>
          <button 
            onClick={ () => navigate('/user') }
            className="flex text-white hover:text-white mr-4">
            <ChevronLeft size={20} />
            <span>Continue Shopping</span>
          </button>
        </div>

        {/* Filter options */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-6">Filter by Type</h2>
          <div className="flex flex-wrap gap-2">
            {tShirtTypes.map((type) => (
              <button 
                key={type} 
                className={`px-4 py-2 rounded-full ${
                  activeFilter === type 
                    ? 'bg-rose-300 font-medium text-black' 
                    : 'bg-slate-950 border border-gray-300 hover:bg-black'
                } text-sm transition-colors`}
                onClick={() => handleFilterChange(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Filter results count */}
        <div className="mb-6 text-white">
          Showing {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} 
          {activeFilter !== 'All' ? ` in ${activeFilter}` : ''}
        </div>

        {/* Wishlist Items */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div key={item._id} className="bg-slate-950 rounded-lg shadow-md overflow-hidden">
                <div className="relative">
                  <img 
                    src={item.product.Images[0]?.Url} 
                    alt={item.product.Images[0]?.Alt} 
                    className="w-full h-64 object-cover"
                  />
                  <button 
                    onClick={() => removeFromWishlist(item.product._id, item.selectedColor, item.selectedSize)}
                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                  >
                    <Heart size={20} className="text-red-500 fill-red-500" />
                  </button>
                  <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white px-3 py-1 text-xs">
                    {item.product.T_Shirt_Type}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white">{item.product.Name}</h3>
                  <div className="flex items-center my-2 justify-between">
                    <div className="mr-2">
                      <span className="text-sm text-white">Color: </span>
                      <span className="font-medium">{item.selectedColor}</span>
                    </div>
                    <div>
                      <span className="text-sm text-white">Size: </span>
                      <span className="font-medium">{item.selectedSize}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <p className="font-bold text-white">₹{item.product.Variants[0]?.Price.toFixed(2)}</p>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => moveToCart(item.product._id)}
                        className="flex items-center bg-black text-white py-2 px-3 rounded-md hover:bg-red-500"
                      >
                        <ShoppingCart size={16} className="mr-1" />
                        <span className="text-sm">Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-950 rounded-lg shadow-sm">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">
              {userWishlist.length === 0 
                ? "Your wishlist is empty" 
                : `No ${activeFilter} items in your wishlist`}
            </h2>
            <p className="text-white mb-6">
              {userWishlist.length === 0 
                ? "Browse our collection and add your favorite items!" 
                : "Try selecting a different category or browse more items"}
            </p>
            <div className="flex justify-center gap-4">
              {userWishlist.length > 0 && (
                <button 
                  onClick={() => setActiveFilter('All')}
                  className="bg-slate-800 hover:bg-slate-700 hover:scale-105 cursor-pointer text-white font-bold px-6 py-3 rounded-md transition duration-300 border border-slate-600">
                  View All Items
                </button>
              )}
              <button 
                onClick={ () => navigate('/shop') }
                className="bg-lime-100 hover:bg-lime-200 hover:scale-110 cursor-pointer text-black font-bold px-6 py-3 rounded-md transition duration-300">
                Shop Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}