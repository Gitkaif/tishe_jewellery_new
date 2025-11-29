import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import ProductCard from '../components/ProductCard/ProductCard';
import { db } from '../firebase/config';

const formatTitleFromSlug = (slug) =>
  slug
    .split('-')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryDetails, setCategoryDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      setError('');

      try {
        if (categoryName === 'all') {
          const productsSnapshot = await getDocs(collection(db, 'products'));
          const allProducts = productsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setProducts(allProducts);
          setCategoryDetails({
            name: 'All Products',
            description: 'Browse everything currently available in our catalog.'
          });
          return;
        }

        const categoryQuery = query(
          collection(db, 'categories'),
          where('slug', '==', categoryName),
          limit(1)
        );
        const categorySnapshot = await getDocs(categoryQuery);

        if (!categorySnapshot.empty) {
          const docSnap = categorySnapshot.docs[0];
          setCategoryDetails({ id: docSnap.id, ...docSnap.data() });
        } else {
          setCategoryDetails(null);
        }

        const productsQuery = query(
          collection(db, 'products'),
          where('categorySlug', '==', categoryName)
        );
        const productsSnapshot = await getDocs(productsQuery);
        let nextProducts = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        if (nextProducts.length === 0) {
          const legacyTitle = formatTitleFromSlug(categoryName);
          const legacyQuery = query(
            collection(db, 'products'),
            where('category', '==', legacyTitle)
          );
          const legacySnapshot = await getDocs(legacyQuery);
          nextProducts = legacySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
        }

        setProducts(nextProducts);
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError('Failed to load category data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryName]);

  const categoryTitle = useMemo(() => {
    if (categoryDetails?.name) {
      return categoryDetails.name;
    }
    if (categoryName === 'all') {
      return 'All Products';
    }
    return formatTitleFromSlug(categoryName);
  }, [categoryDetails, categoryName]);

  if (loading) {
    return <div className="text-center py-10">Loading category...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (products.length === 0 && categoryName !== 'all') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">No products found</h1>
          <p className="text-gray-600">
            We couldn&apos;t find any products for this category yet. Please check back soon.
          </p>
          <Link to="/" className="text-pink-600 hover:text-pink-800">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{categoryTitle}</h1>
            {categoryDetails?.description && (
              <p className="text-gray-600 mt-2 max-w-2xl">{categoryDetails.description}</p>
            )}
          </div>
          <Link to="/" className="text-pink-600 hover:text-pink-800 mt-4 md:mt-0">
            &larr; Back to Home
          </Link>
        </div>
        
        {products.length === 0 ? (
          <p className="text-gray-600">No products available in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
