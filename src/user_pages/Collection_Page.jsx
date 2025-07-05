import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const CollectionsPage = () => {
  // Featured collections data
  const collections = [
    {
      id: 'avengers',
      name: 'The Avengers Collection',
      description: 'Assemble your wardrobe with our premium Avengers-inspired apparel. Features designs based on Earth\'s Mightiest Heroes.',
      image: './CollectionPage/avenger_collection.jpg',
      productCount: 24,
      featured: true
    },
    {
      id: 'spider-man',
      name: 'Spider-Man Collection',
      description: 'Swing into style with our exclusive Spider-Man merchandise. Web-slinging designs for the friendly neighborhood hero in all of us.',
      image: './CollectionPage/spiderman_collection.jpeg',
      productCount: 18,
      featured: true
    },
    {
      id: 'x-men',
      name: 'X-Men Collection',
      description: 'Unleash your mutant style with our X-Men inspired clothing line. Gear up like the extraordinary heroes.',
      image: './CollectionPage/mens_collection.avif',
      productCount: 15,
      featured: true
    },
    {
      id: 'guardians',
      name: 'Guardians of the Galaxy',
      description: 'Rock the cosmos with our Guardians-inspired collection. Perfect for fans of the galaxy\'s most unlikely heroes.',
      image: './CollectionPage/GuardiansOfGalaxy.webp',
      productCount: 12,
      featured: false
    },
    {
      id: 'captain-america',
      name: 'Captain America Legacy',
      description: 'Show your patriotic side with our Captain America collection. Shield designs and vintage Americana for true believers.',
      image: './CollectionPage/CaptainAmericaLegacy.jpg',
      productCount: 16,
      featured: false
    },
    {
      id: 'iron-man',
      name: 'Iron Man Tech',
      description: 'Suit up with our cutting-edge Iron Man designs. High-tech apparel inspired by Tony Stark\'s iconic armor.',
      image: './CollectionPage/IronManTech.jpeg',
      productCount: 14,
      featured: false
    },
    {
      id: 'black-panther',
      name: 'Wakanda Forever',
      description: 'Honor the legacy of Wakanda with our Black Panther collection. Sleek designs inspired by vibranium technology.',
      image: './CollectionPage/Wakandaforever.jpg',
      productCount: 12,
      featured: false
    },
    {
      id: 'thor',
      name: 'Thor Asgardian Legends',
      description: 'Channel the power of thunder with our Thor-inspired collection. Worthy designs for fans of the God of Thunder.',
      image: './CollectionPage/thorasgardianlegends.webp',
      productCount: 10,
      featured: false  
    }
  ];

  // Split collections into featured and regular
  const featuredCollections = collections.filter(collection => collection.featured);
  const regularCollections = collections.filter(collection => !collection.featured);

  return (
    <div className="bg-slate-950 min-h-screen pb-16 text-gray-200">
      {/* Hero Banner */}
      <div className="flex bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col py-16 md:py-24 justify-center items-center gap-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-100 via-lime-200 to-fuchsia-300 bg-clip-text text-transparent">Marvel Collections</h1>
            <p className="text-xl text-orange-100 max-w-2xl">
              Explore our exclusive Marvel-themed collections. Find the perfect outfit to showcase your favorite superhero.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Collections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Featured Collections</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
            {featuredCollections.map((collection, index) => (
              <div 
                key={collection.id}
                className={`relative overflow-hidden rounded-lg shadow-lg border border-lime-100 ${
                  index === 0 ? "lg:col-span-3" : ""
                }`}
              >
                <Link to={`/collections/${collection.id}`}>
                  <div className="relative aspect-video lg:aspect-auto lg:h-96">
                    <img 
                      src={collection.image} 
                      alt={collection.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-90"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">{collection.name}</h3>
                      <p className="text-gray-200 mb-4">{collection.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">{collection.productCount} Products</span>
                        <span className="text-red-300 flex items-center text-sm font-medium hover:text-red-400 transition-colors">
                          Explore Collection <ChevronRight size={16} className="ml-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Collections */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">All Collections</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularCollections.map((collection) => (
              <Link 
                key={collection.id}
                to={`/collections/${collection.id}`}
                className="group bg-slate-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 border border-slate-700"
              >
                <div className="relative h-56">
                  <img 
                    src={collection.image} 
                    alt={collection.name} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-rose-300 transition-colors">
                    {collection.name}
                  </h3>
                  <p className="text-gray-300 mb-4 line-clamp-2">{collection.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">{collection.productCount} Products</span>
                    <span className="text-rose-300 hover:text-rose-400 flex items-center text-sm font-medium group-hover:translate-x-1 transition-transform">
                      View Collection <ChevronRight size={16} className="ml-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CollectionsPage;