import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import useCategories from '../../hooks/useCategories';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { categories, loading: categoriesLoading } = useCategories();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categoryId: '',
    description: '',
    image: '',
    inStock: true
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, 'products', productId);
        const productSnap = await getDoc(productRef);
        if (!productSnap.exists()) {
          setError('Product not found');
          return;
        }
        const productData = productSnap.data();
        setFormData({
          name: productData.name || '',
          price: productData.price || '',
          categoryId: productData.categoryId || '',
          description: productData.description || '',
          image: productData.image || '',
          inStock: productData.inStock ?? true
        });
      } catch (err) {
        console.error('Failed to load product', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.name || !formData.price || !formData.categoryId) {
      setError('Please fill all required fields');
      return;
    }
    try {
      setSaving(true);
      const selectedCategory = categories.find((category) => category.id === formData.categoryId);
      const payload = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        image: formData.image.trim(),
        inStock: formData.inStock,
        categoryId: selectedCategory?.id || '',
        categoryName: selectedCategory?.name || '',
        categorySlug: selectedCategory?.slug || '',
        categoryImage: selectedCategory?.image || '',
        updatedAt: serverTimestamp(),
        updatedBy: currentUser?.uid || null
      };
      await updateDoc(doc(db, 'products', productId), payload);
      toast.success('Product updated');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Failed to update product', err);
      toast.error('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading product...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        {error}
        <div className="mt-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="px-4 py-2 bg-pink-600 text-white rounded-md"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              disabled={categoriesLoading}
            >
              <option value="">{categoriesLoading ? 'Loading categories...' : 'Select category'}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="inStock"
            checked={formData.inStock}
            onChange={handleChange}
            className="h-4 w-4 text-pink-600 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">In Stock</span>
        </label>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${
              saving ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;

