import React, { useEffect, useMemo, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  image: '',
  isActive: true
};

const ManageCategories = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState('');
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, 'categories'));
        setCategories(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
      } catch (error) {
        console.error('Failed to load categories', error);
        toast.error('Unable to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const startEdit = (category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      image: category.image || '',
      isActive: category.isActive !== false
    });
  };

  const cancelEdit = () => {
    setEditingId('');
    setFormData(emptyForm);
  };

  const handleUpdateCategory = async (event) => {
    event.preventDefault();
    if (!editingId) return;
    setSaving(true);
    try {
      const payload = {
        ...formData,
        updatedAt: new Date()
      };
      await updateDoc(doc(db, 'categories', editingId), payload);
      setCategories((prev) =>
        prev.map((cat) => (cat.id === editingId ? { ...cat, ...payload } : cat))
      );
      toast.success('Category updated');
      cancelEdit();
    } catch (error) {
      console.error('Failed to update category', error);
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Delete this category? Products linked to it will remain unchanged.')) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'categories', categoryId));
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
      toast.success('Category deleted');
      if (editingId === categoryId) {
        cancelEdit();
      }
    } catch (error) {
      console.error('Failed to delete category', error);
      toast.error('Delete failed');
    }
  };

  const editorTitle = useMemo(() => {
    if (!editingId) return 'Select a category to edit';
    const active = categories.find((cat) => cat.id === editingId);
    return active ? `Editing ${active.name}` : 'Editing category';
  }, [editingId, categories]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Admin</p>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">Manage Categories</h1>
          <p className="text-gray-500 mt-2">
            Update names, descriptions, and visibility for your storefront groupings.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/add-category')}
          className="inline-flex items-center px-5 py-3 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition"
        >
          + New Category
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">All Categories</h2>
              <p className="text-sm text-gray-500">Click edit to modify details or toggle visibility.</p>
            </div>
            <span className="text-sm font-medium text-gray-400">{categories.length} total</span>
          </div>
          {loading ? (
            <p className="p-6 text-gray-500">Loading categories…</p>
          ) : categories.length === 0 ? (
            <p className="p-6 text-gray-500">No categories yet. Create one to get started.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {categories.map((category) => (
                <li key={category.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-gray-900 line-clamp-1">{category.name}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">{category.description || '—'}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                      <span>Slug: {category.slug || '—'}</span>
                      <span>•</span>
                      <span className={category.isActive === false ? 'text-red-500' : 'text-emerald-500'}>
                        {category.isActive === false ? 'Hidden' : 'Visible'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                      onClick={() => startEdit(category)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="text-sm font-medium text-gray-500 hover:text-gray-700"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-2">Category editor</p>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{editorTitle}</h2>
          {editingId ? (
            <form className="space-y-4" onSubmit={handleUpdateCategory}>
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Slug</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="url"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  value={formData.image}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                Visible on storefront
              </label>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 disabled:opacity-70"
                >
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="text-sm text-gray-500 space-y-3">
              <p>Select a category to begin editing its details.</p>
              <p>You can toggle visibility, update messaging, or replace imagery.</p>
              <p className="text-gray-400">Need a new category? Use the button above.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ManageCategories;

