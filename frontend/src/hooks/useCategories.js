import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config';

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const categoriesQuery = query(collection(db, 'categories'), orderBy('name', 'asc'));

    const unsubscribe = onSnapshot(
      categoriesQuery,
      (snapshot) => {
        const nextCategories = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(nextCategories);
        setLoading(false);
      },
      (err) => {
        console.error('Failed to fetch categories:', err);
        setError('Unable to load categories');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { categories, loading, error };
};

export default useCategories;

