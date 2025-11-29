import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="relative ml-4" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="h-9 w-9 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center text-sm font-semibold shadow-sm">
          {currentUser.email ? currentUser.email[0].toUpperCase() : 'U'}
        </div>
        <svg
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl py-3 z-50 border border-gray-100">
          <div className="px-4 pb-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">{currentUser.email}</p>
            <p className="text-xs text-gray-500">Welcome back</p>
          </div>
          <div className="py-2">
            <Link
              to="/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
            >
              <span className="mr-3 text-base">📦</span>
              My Orders
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
            >
              <span className="mr-3 text-base">❤️</span>
              Wishlist
            </Link>
            <Link
              to="/cart"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
            >
              <span className="mr-3 text-base">🛒</span>
              Cart
            </Link>
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
              >
                <span className="mr-3 text-base">📊</span>
                Admin Dashboard
              </Link>
            )}
          </div>
          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
            >
              <span className="mr-3 text-base">🚪</span>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
