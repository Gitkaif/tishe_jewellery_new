import { db } from './config';
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where
} from 'firebase/firestore';

const categoriesCollection = collection(db, 'categories');

const normalizeSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
    
export const slugifyCategory = (value) => normalizeSlug(value || '');

export const createCategory = async (category, userId) => {
  const { name, slug, description, image, isActive = true, isFeatured = false } = category;

  const payload = {
    name: name.trim(),
    slug: slug ? normalizeSlug(slug) : normalizeSlug(name),
    description: description?.trim() || '',
    image: image?.trim() || '',
    isActive,
    isFeatured,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: userId || null
  };

  return addDoc(categoriesCollection, payload);
};

export const fetchCategories = async () => {
  const q = query(categoriesCollection, orderBy('name', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const findCategoryBySlug = async (slug) => {
  const normalizedSlug = normalizeSlug(slug);
  const q = query(categoriesCollection, where('slug', '==', normalizedSlug), limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const categoryDoc = snapshot.docs[0];
  return { id: categoryDoc.id, ...categoryDoc.data() };
};

