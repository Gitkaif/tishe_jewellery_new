import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const productsSnapshot = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')));
        const ordersSnapshot = await getDocs(query(collection(db, 'orders')));
        const usersSnapshot = await getDocs(query(collection(db, 'users')));

        setProducts(productsSnapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() })));
        setOrders(ordersSnapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() })));
        setUsers(usersSnapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() })));
      } catch (error) {
        console.error('Failed to load dashboard data', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Products', value: products.length, accent: 'bg-pink-100 text-pink-700' },
      { label: 'Orders', value: orders.length, accent: 'bg-purple-100 text-purple-700' },
      { label: 'Users', value: users.length, accent: 'bg-blue-100 text-blue-700' }
    ],
    [products.length, orders.length, users.length]
  );

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', productId));
      setProducts((prev) => prev.filter((product) => product.id !== productId));
      toast.success('Product deleted');
    } catch (error) {
      console.error('Failed to delete product', error);
      toast.error('Failed to delete product');
    }
  };

  const handleEditProduct = (productId) => {
    navigate(`/admin/edit-product/${productId}`);
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage products, orders, and users from a single place.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow p-5 border border-gray-100">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
            <span className={`inline-flex mt-3 px-3 py-1 text-xs font-medium rounded-full ${stat.accent}`}>
              Updated live
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Link
          to="/admin/add-product"
          className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl shadow-lg p-6 flex flex-col justify-between"
        >
          <div>
            <p className="text-sm uppercase tracking-wide text-white/80">Quick Action</p>
            <h2 className="text-2xl font-semibold mt-2">Add Product</h2>
            <p className="text-white/90 mt-2">
              Launch new catalog items in just a few clicks. Keep your storefront fresh.
            </p>
          </div>
          <span className="mt-4 inline-flex items-center text-sm font-medium">
            Go to form
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Link>

        <Link
          to="/admin/add-category"
          className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl shadow-lg p-6 flex flex-col justify-between"
        >
          <div>
            <p className="text-sm uppercase tracking-wide text-white/80">Quick Action</p>
            <h2 className="text-2xl font-semibold mt-2">Add Category</h2>
            <p className="text-white/90 mt-2">
              Organize inventory into curated groups to improve discovery and merchandising.
            </p>
          </div>
          <span className="mt-4 inline-flex items-center text-sm font-medium">
            Go to form
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Link>

        <Link
          to="/admin/manage-categories"
          className="bg-white border border-gray-200 rounded-xl shadow p-6 flex flex-col justify-between hover:border-indigo-200 hover:shadow-md transition"
        >
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-400">Collections</p>
            <h2 className="text-2xl font-semibold mt-2 text-gray-900">Manage Categories</h2>
            <p className="text-gray-500 mt-2">
              Edit names, descriptions, and visibility or remove outdated groupings.
            </p>
          </div>
          <span className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600">
            Open manager
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Link>

        <Link
          to="/"
          className="bg-white border border-gray-200 rounded-xl shadow p-6 flex flex-col justify-between hover:border-gray-300 hover:shadow-md transition"
        >
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-400">Storefront</p>
            <h2 className="text-2xl font-semibold mt-2 text-gray-900">View Site</h2>
            <p className="text-gray-500 mt-2">
              Open the customer experience to verify updates or QA recent changes.
            </p>
          </div>
          <span className="mt-4 inline-flex items-center text-sm font-medium text-pink-600">
            Open storefront
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Link>
      </div>

      <section className="bg-white rounded-xl shadow border border-gray-100">
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Manage Products</h2>
            <p className="text-sm text-gray-500">Edit or remove catalog items.</p>
          </div>
          <button
            onClick={() => navigate('/admin/add-product')}
            className="px-4 py-2 bg-pink-600 text-white rounded-md text-sm font-medium hover:bg-pink-700"
          >
            Add Product
          </button>
        </header>

        {loading ? (
          <p className="p-6 text-gray-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="p-6 text-gray-500">No products found. Add your first product to get started.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 rounded-md object-cover mr-3"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.description?.slice(0, 50)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                        {product.categoryName || product.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">₹{product.price?.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-3">
                      <button
                        className="text-pink-600 hover:text-pink-800 font-medium"
                        onClick={() => handleEditProduct(product.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-gray-500 hover:text-gray-700 font-medium"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="bg-white rounded-xl shadow border border-gray-100">
        <header className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
          <p className="text-sm text-gray-500">Track customer purchases and fulfillment status.</p>
        </header>
        {orders.length === 0 ? (
          <p className="p-6 text-gray-500">No orders have been placed yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {orders.slice(0, 5).map((order) => (
              <li key={order.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{order.customerName || order.email || 'Customer'}</p>
                  <p className="text-sm text-gray-500">
                    {order.items?.length || 0} items • ₹{order.total?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <span className="text-sm font-medium text-pink-600">{order.status || 'Pending'}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white rounded-xl shadow border border-gray-100">
        <header className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Users</h2>
          <p className="text-sm text-gray-500">Recently registered customers and admins.</p>
        </header>
        {users.length === 0 ? (
          <p className="p-6 text-gray-500">No users available yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id || user.uid}>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{user.displayName || user.email}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.provider || 'email/password'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;

