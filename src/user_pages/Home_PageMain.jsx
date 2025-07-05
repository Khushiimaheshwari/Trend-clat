import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Home_Gradient from '../components/Home_Gradient';

const Home_PageMain = () => {
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const navigate = useNavigate(); 

  // Featured hero banners
  const heroImages = [
    {
      title: "MARVEL HEROES COLLECTION",
      subtitle: "Suit up with the latest Avengers-inspired styles",
      cta: "SHOP NOW",
      bgClass: "bg-red-00",
      image: "url(./HomePage/marvel_heros_collection.jpg)"
    },
    {
      title: "SPIDERMAN STREETWEAR",
      subtitle: "Swing into style with our exclusive Spidey collection",
      cta: "DISCOVER",
      bgClass: "bg-blue-00",
      image: "url(./HomePage/Spiderman.jpeg)"
    },
    {
      title: "IRON MAN PREMIUM LINE",
      subtitle: "Tech-inspired clothing for the modern hero",
      cta: "EXPLORE",
      bgClass: "bg-yellow-00",
      image: "url(./HomePage/Iron_man.jpg)"
    }
  ];

  // Clothing categories
  const categories = [
    { name: "Oversized", icon: "./HomePage/oversized.jpeg", count: 42 },
    { name: "Graphic Printed", icon: "./HomePage/Graphic Printed.webp", count: 28 },
    { name: "Acid Wash", icon: "./HomePage/Acid Wash.jpeg", count: 16 },
    { name: "Solid Color", icon: "./HomePage/Solid Color.webp", count: 35 }
  ];

  // Featured products
  const featuredProducts = [
    { 
      name: "Marvel Universe Oversized T-Shirts", 
      price: 329.99, 
      image: "./HomePage/OversizedTee.webp",
      tag: "Bestseller"  
    },
    { 
      name: "Custom Fan Art Hooded T-Shirts", 
      price: 1099.99, 
      image: "./HomePage/HoodedT-Shirts.jpeg",
      tag: "New"
    },
    { 
      name: "Anime Superheroes Graphic Printed Tee", 
      price: 579.99, 
      image: "./HomePage/GraphicPrintedTee.webp",
      tag: "Limited"
    },
    { 
      name: "DC Comics Acid Wash T-Shirts", 
      price: 239.99, 
      image: "./HomePage/AcidWashT-Shirts.jpeg",
      tag: "Sale"
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
 
  return (
    <div className="flex flex-col min-h-screen -mt-12 bg-slate-950 text-gray-100">
      <Home_Gradient/>

      {/* Hero Section 1 */}
      <section className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="text-center items-center max-w-5xl p-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-12">
            Shop Smart & Shine Bright
          </h1>
          <p className="text-lg md:text-xl px-30 text-lime-100 mb-12">
            <em>
              A curated marketplace where style meets savings — discover must-have trends and essentials delivered to your door.
            </em>
          </p>
          <button className="bg-lime-100 hover:bg-lime-200 hover:scale-110 cursor-pointer text-black font-bold px-6 py-3 rounded-md transition duration-300"
          onClick={() => document.getElementById('slider')?.scrollIntoView({ behavior: 'smooth' })}>
            Shop Now
          </button>
        </div>
      </section>
      
      {/* Hero Slider */}
      <div id='slider' className={`relative ${heroImages[heroImageIndex].bgClass} text-white mb-15 py-16 md:py-32 overflow-hidden transition-all duration-500 `}
      style={{ backgroundImage: heroImages[heroImageIndex].image, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        
        <div className="container mx-auto px-4">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">{heroImages[heroImageIndex].title}</h2>
            <p className="text-lg md:text-xl mb-8">{heroImages[heroImageIndex].subtitle}</p>
            <button className="bg-lime-100 hover:bg-lime-200 hover:scale-110 cursor-pointer text-black font-bold px-6 py-3 rounded-md transition duration-300">
              {heroImages[heroImageIndex].cta}
            </button>
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
      
      {/* Categories */}
      <section className="py-16 bg-slate-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-18 text-center text-white">SHOP BY CATEGORY</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <a 
                href="#" 
                key={index}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition duration-500 transform hover:scale-105">
                {/* Image Container */}
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={category.icon} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 group-hover:opacity-90 transition duration-500"></div>

                {/* Text Content */}
                <div className="absolute bottom-[-100px] left-0 right-0 p-4 text-white transition-all duration-500 group-hover:bottom-4">
                  <h3 className="font-bold text-lg">{category.name}</h3>
                  <p className="text-sm">{category.count} items</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      
      {/* Featured Products */}
      <section className="py-16  bg-slate-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-15 text-center">FEATURED PRODUCTS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <div key={index} className="bg-slate-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
                <div className="relative">
                  <img src={product.image} alt={product.name} className="w-full h-64 object-cover object-center" />
                  {product.tag && (
                    <span className="absolute top-2 left-2 bg-rose-400 text-white text-xs uppercase font-bold py-1 px-2 rounded">
                      {product.tag}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-orange-100/50 bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button 
                    onClick={ () => {
                      navigate('/product');
                      window.scrollTo(0, 0);
                    }}
                    className="bg-slate-800 text-white py-2 px-4 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      Quick View
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg text-white">{product.name}</h3>
                  <p className="text-teal-200 font-bold mt-1">₹{product.price}</p>
                  <button className="mt-3 w-full bg-rose-400 text-white py-2 px-4 rounded hover:bg-rose-500/90 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-15">
            <a href="/shop" className="inline-flex items-center text-teal-200 font-bold hover:text-teal-300 hover:scale-110 transition-all duration-300">
              View All Products <ChevronRight size={16} className="ml-1" />
            </a>
          </div>
        </div>
      </section>
      
      {/* Collection Banner */}
      <section className="py-16 bg-slate-950 text-white">
        <div className="container mx-auto px-4 bg-slate-800 rounded-2xl">
          <div className="flex flex-col md:flex-row items-center py-12 ">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">THE AVENGERS COLLECTION</h2>
              <p className="text-lg mb-6">Assemble your wardrobe with our exclusive Avengers-inspired collection. Premium quality clothing for everyday heroes.</p>
              <button 
                onClick={handleClick}
                className="bg-lime-100 hover:bg-lime-200 hover:scale-110 cursor-pointer text-black font-bold px-6 py-3 rounded-md transition duration-300">                SHOP THE COLLECTION
              </button>
            </div>
            <div className="md:w-1/2 flex justify-center p">
              <img src="./CollectionPage/avenger_collection.jpg" width={"550"} alt="Avengers Collection" className="rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-16 bg-slate-950 mb-15">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-fuchsia-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-300">Free shipping on all orders over $50</p>
            </div>
            <div className="text-center">
              <div className="bg-cyan-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
              <p className="text-gray-300">100% secure payment methods</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Returns</h3>
              <p className="text-gray-300">30-day return policy</p>
            </div>
          </div>
        </div>
      </section>
    
    </div>
  );
};

export default Home_PageMain;