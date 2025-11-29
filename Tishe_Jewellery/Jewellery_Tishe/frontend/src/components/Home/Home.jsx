import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import ProductCard from '../ProductCard/ProductCard';
import useCategories from '../../hooks/useCategories';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError
  } = useCategories();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productSnapshot = await getDocs(productsCollection);
        const productsList = productSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFeaturedProducts(productsList);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProductsError('Failed to load products');
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (productsLoading || categoriesLoading) {
    return <div className="text-center py-10">Loading storefront...</div>;
  }

  if (productsError || categoriesError) {
    return (
      <div className="text-center py-10 text-red-500">
        {productsError || categoriesError}
      </div>
    );
  }

  const visibleCategories = categories.filter((category) => category.isActive !== false);

  const featurePosters = [
    {
      title: visibleCategories[0]?.name || 'New Arrivals',
      subtitle: 'Handcrafted for everyday shimmer',
      tag: 'Now Trending',
      slug: visibleCategories[0]?.slug || 'all',
      accent: {
        border: 'border-rose-100',
        bg: 'bg-rose-50/60',
        heading: 'text-rose-900',
        text: 'text-rose-600',
        tagBg: 'bg-rose-100 text-rose-800',
        icon: 'text-rose-500'
      }
    },
    {
      title: visibleCategories[1]?.name || 'Occasion Sets',
      subtitle: 'Couture pieces for special moments',
      tag: 'Limited Release',
      slug: visibleCategories[1]?.slug || 'all',
      accent: {
        border: 'border-amber-100',
        bg: 'bg-amber-50/70',
        heading: 'text-amber-900',
        text: 'text-amber-600',
        tagBg: 'bg-amber-100 text-amber-800',
        icon: 'text-amber-500'
      }
    }
  ];

  const heroPoster = {
    title: 'Curated Capsule Wardrobe',
    subtitle: 'Layerable necklaces, stackable rings, and delicate hoops designed to mix & match.',
    bulletPoints: ['Stylist approved combinations', 'Ships with polishing cloth & care card'],
    slug: visibleCategories[2]?.slug || 'all'
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-100 to-purple-100 py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Discover Timeless Beauty in Every Piece
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Handcrafted jewelry that tells your unique story. Explore our collection of exquisite pieces designed to make you shine.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/category/all"
                className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-8 rounded-md transition-colors text-center"
              >
                Shop Now
              </Link>
              <Link
                to="/about"
                className="border-2 border-gray-900 hover:bg-gray-900 hover:text-white font-semibold py-3 px-8 rounded-md transition-colors text-center"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
              alt="Elegant Jewelry"
              className="rounded-lg shadow-xl max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
        {visibleCategories.length === 0 ? (
          <p className="text-center text-gray-500">No categories have been added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleCategories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={
                      category.image ||
                      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=500&q=60'
                    }
                    alt={category.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white text-2xl font-bold mb-2">{category.name}</h3>
                  {category.description && (
                    <p className="text-white text-center px-4">{category.description}</p>
                  )}
                </div>
                <div className="p-4 bg-white">
                  <h3 className="text-lg font-semibold text-center">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
        {visibleCategories.length > 0 && (
          <div className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 w-full mx-auto">
              <div className="flex flex-col gap-4">
                {featurePosters.map((poster) => (
                  <Link
                    key={poster.title}
                    to={`/category/${poster.slug}`}
                    className={`relative h-[190px] bg-white border-2 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition ${poster.accent.border}`}
                  >
                    <div className={`absolute inset-0 ${poster.accent.bg}`} />
                    <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                      <div>
                        <h3 className={`text-2xl font-semibold mb-1 ${poster.accent.heading}`}>
                          {poster.title}
                        </h3>
                        <p className={`text-sm ${poster.accent.text}`}>{poster.subtitle}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${poster.accent.tagBg}`}>
                          {poster.tag}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-7 w-7 ${poster.accent.icon}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <Link
                to={`/category/${heroPoster.slug}`}
                className="relative h-auto md:h-[390px] bg-white border-2 border-indigo-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition"
              >
                <div className="absolute inset-0 bg-indigo-50/60" />
                <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-3xl font-semibold text-indigo-900 mb-3">
                      {heroPoster.title}
                    </h3>
                    <p className="text-indigo-700 text-base">
                      {heroPoster.subtitle}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {heroPoster.bulletPoints.map((point) => (
                      <div key={point} className="flex items-center space-x-3 text-sm text-gray-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-indigo-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs font-semibold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                      Styling Studio Edit
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-indigo-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Featured Products</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Discover our handpicked selection of premium jewelry pieces that combine quality craftsmanship with timeless design.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product.id}
                compact={true}
                product={{
                  ...product,
                  description: product.category
                }}
              />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/category/all"
              className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-md transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Perfect Piece?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Sign up for our newsletter and get 15% off your first order!
          </p>
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-l-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
            <button
              type="submit"
              className="bg-gray-900 hover:bg-black text-white font-semibold px-6 py-3 rounded-r-md transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
