import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import ProductCard from '../components/ProductCard/ProductCard';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const searchTerm = searchParams.get('query')?.trim() || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const productsCollection = collection(db, 'products');
        const snapshot = await getDocs(productsCollection);
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(items);
      } catch (err) {
        console.error('Search fetch error:', err);
        setError('Unable to load products right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      navigate('/', { replace: true });
    }
  }, [searchTerm, navigate]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return [];
    }
    const term = searchTerm.toLowerCase();
    return products.filter((product) => {
      const nameMatch = product.name?.toLowerCase().includes(term);
      const descMatch = product.description?.toLowerCase().includes(term);
      const categoryMatch = product.category?.toLowerCase().includes(term);
      return nameMatch || descMatch || categoryMatch;
    });
  }, [products, searchTerm]);

  if (!searchTerm) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Search results</p>
          <h1 className="text-3xl font-semibold text-gray-900 mt-2">
            Showing matches for “{searchTerm}”
          </h1>
          <p className="text-gray-500 mt-2">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} found
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          ← Go back
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Searching handcrafted pieces…</div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg font-semibold text-gray-900 mb-2">No matches yet</p>
          <p className="text-gray-500 mb-6">
            Try another keyword or explore our curated categories.
          </p>
          <button
            type="button"
            onClick={() => navigate('/category/all')}
            className="inline-flex items-center px-5 py-3 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition"
          >
            Browse all jewelry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      )}
    </section>
  );
};

export default SearchResults;

