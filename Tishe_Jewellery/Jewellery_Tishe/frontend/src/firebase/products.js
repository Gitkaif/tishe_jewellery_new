import { db } from './config';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';

export const addProduct = async (product) => {
  try {
    const productRef = doc(collection(db, 'products'), product.id.toString());
    await setDoc(productRef, {
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      description: product.description || '',
      inStock: true,
      createdAt: new Date().toISOString(),
    });
    console.log('Product added with ID: ', product.id);
    return productRef.id;
  } catch (error) {
    console.error('Error adding product: ', error);
    throw error;
  }
};

export const getProductById = async (productId) => {
  try {
    const productRef = doc(db, 'products', productId);
    const productDoc = await getDoc(productRef);
    
    if (productDoc.exists()) {
      return { id: productDoc.id, ...productDoc.data() };
    } else {
      console.log('No such product!');
      return null;
    }
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

export const getAllProducts = async () => {
  try {
    // In a real app, you would fetch products with pagination
    // For now, we'll just return an empty array
    return [];
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};
