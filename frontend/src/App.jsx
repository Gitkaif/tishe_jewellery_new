// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import Contact from './pages/Contact';
import CategoryPage from './pages/CategoryPage';
import SearchResults from './pages/SearchResults';
import ProductDetail from './pages/ProductDetail';
import AddProduct from './pages/Admin/AddProduct';
import AddCategory from './pages/Admin/AddCategory';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageCategories from './pages/Admin/ManageCategories';
import EditProduct from './pages/Admin/EditProduct';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { Toaster } from 'react-hot-toast';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/manage-categories"
                element={
                  <ProtectedRoute>
                    <ManageCategories />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/admin/add-product" 
                element={
                  <ProtectedRoute>
                    <AddProduct />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/admin/add-category"
                element={
                  <ProtectedRoute>
                    <AddCategory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/edit-product/:productId"
                element={
                  <ProtectedRoute>
                    <EditProduct />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;