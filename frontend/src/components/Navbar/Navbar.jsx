import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UserProfile from '../UserProfile/UserProfile';
import useCategories from '../../hooks/useCategories';
import logo from '../../assets/logo.jpeg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryHovered, setIsCategoryHovered] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { categories } = useCategories();
  const visibleCategories = categories.filter((category) => category.isActive !== false);
  const categoryTimeoutRef = useRef(null);
  const pastelPalettes = [
    {
      bg: 'from-[#dbeafe]/90 via-[#e0f2fe]/80 to-[#bfdbfe]/90',
      hover: 'hover:from-[#c7e2fb] hover:to-[#a5c9f7]',
      ring: 'focus-visible:ring-sky-200',
      accent: 'text-[#1d4ed8]'
    },
    {
      bg: 'from-[#d1fae5]/90 via-[#ccfbf1]/80 to-[#bbf7d0]/90',
      hover: 'hover:from-[#b4f4da] hover:to-[#91eac0]',
      ring: 'focus-visible:ring-emerald-200',
      accent: 'text-[#0f766e]'
    },
    {
      bg: 'from-[#ede9fe]/90 via-[#f5f3ff]/80 to-[#ddd6fe]/90',
      hover: 'hover:from-[#e0d8fd] hover:to-[#c7bef8]',
      ring: 'focus-visible:ring-violet-200',
      accent: 'text-[#6d28d9]'
    },
    {
      bg: 'from-[#ffe4e6]/90 via-[#ffeef2]/80 to-[#fecdd3]/90',
      hover: 'hover:from-[#ffd8df] hover:to-[#fcb8c2]',
      ring: 'focus-visible:ring-rose-200',
      accent: 'text-[#be123c]'
    },
    {
      bg: 'from-[#fef9c3]/90 via-[#fefce8]/80 to-[#fde68a]/90',
      hover: 'hover:from-[#fef3a4] hover:to-[#fcd34d]',
      ring: 'focus-visible:ring-amber-200',
      accent: 'text-[#b45309]'
    }
  ];

  const handleCategoryEnter = () => {
    if (categoryTimeoutRef.current) {
      clearTimeout(categoryTimeoutRef.current);
    }
    setIsCategoryHovered(true);
  };

  const handleCategoryLeave = () => {
    categoryTimeoutRef.current = setTimeout(() => {
      setIsCategoryHovered(false);
    }, 150);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();
    if (!query) {
      return;
    }
    navigate(`/search?query=${encodeURIComponent(query)}`);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 backdrop-blur bg-white/90 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <span className="absolute inset-0  bg-white/80 blur" aria-hidden="true" />
              <img
                src={logo}
                alt="Tishe logo"
                className="relative h-16 w-24 object-cover border-2 border-white ]"
              />
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-3">
          <div
              className="relative"
              onMouseEnter={handleCategoryEnter}
              onMouseLeave={handleCategoryLeave}
            >
              <button
                type="button"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 px-3 py-2 transition"
              >
                Categories
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ml-1 transition-transform ${isCategoryHovered ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isCategoryHovered && visibleCategories.length > 0 && (
                <div
                  className="absolute left-1/2 top-full -translate-x-1/2 mt-7 w-[min(1120px,94vw)] rounded-[22px] border border-white/20 bg-gradient-to-br from-slate-950/80 via-slate-900/60 to-slate-900/40 backdrop-blur-2xl shadow-[0_40px_120px_rgba(2,6,23,0.45)] p-8 z-50"
                  onMouseEnter={handleCategoryEnter}
                  onMouseLeave={handleCategoryLeave}
                >
                  <div className="flex items-center justify-between mb-6 px-1">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-white/60">Our Categories</p>
                      <h4 className="text-2xl font-semibold text-white mt-2">Curated edits for every occasion</h4>
                    </div>
                    <Link
                      to="/category/all"
                      className="hidden md:inline-flex items-center text-sm font-semibold text-white/80 hover:text-white transition-colors"
                      onClick={() => setIsCategoryHovered(false)}
                    >
                      View all
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleCategories.map((category, index) => {
                      const palette = pastelPalettes[index % pastelPalettes.length];
                      return (
                        <button
                          key={category.id}
                          className={`group relative overflow-hidden w-full text-left rounded-[18px] px-6 py-5 bg-gradient-to-r ${palette.bg} transition duration-200 ease-out shadow-[0_12px_30px_rgba(15,23,42,0.22)] hover:-translate-y-1 hover:shadow-[0_25px_45px_rgba(15,23,42,0.3)] border border-white/30 focus-visible:outline-none ${palette.ring} focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900`}
                          onClick={() => {
                            setIsCategoryHovered(false);
                            navigate(`/category/${category.slug}`);
                          }}
                        >
                          <div className="absolute inset-y-0 right-0 w-16 bg-white/40 blur-2xl opacity-0 group-hover:opacity-100 transition" />
                          <div className="flex items-start justify-between gap-4 relative z-10">
                            <div className="flex-1">
                              <p className="text-lg font-semibold tracking-[-0.01em] text-slate-900">
                                {category.name}
                              </p>
                              {category.description && (
                                <p className="text-sm text-slate-600 mt-1 leading-snug">{category.description}</p>
                              )}
                            </div>
                            <span
                              className={`shrink-0 rounded-full bg-white/75 p-2 shadow-inner transition duration-200 group-hover:${palette.accent}`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-slate-500 transition-colors duration-200 group-hover:text-current"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-pink-200 transition"
              role="search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                placeholder="Search jewelry..."
                className="bg-transparent focus:outline-none placeholder:text-gray-400 text-gray-800 w-44"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search products"
              />
              <button
                type="submit"
                className="ml-3 text-sm font-semibold text-pink-600 hover:text-pink-700 transition"
              >
                Search
              </button>
            </form>
            <Link to="/contact" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 transition">
              Contact
            </Link>
            {currentUser ? (
              <UserProfile />
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-pink-600 px-3 py-2 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-semibold text-white bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-full transition"
                >
                  Join
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-gray-100">
          <div className="px-4 py-3 space-y-3">
            <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 rounded-full border border-gray-200 px-4 py-2">
              <input
                type="search"
                placeholder="Search jewelry..."
                className="flex-1 bg-transparent text-sm focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search products"
              />
              <button type="submit" className="text-sm font-semibold text-pink-600">
                Go
              </button>
            </form>
            {[{ to: '/contact', label: 'Contact' }].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block text-gray-700 hover:bg-pink-50 px-3 py-2 rounded-md text-sm font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 pt-3">
              {visibleCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="block text-gray-700 hover:bg-pink-50 px-3 py-2 rounded-md text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
            {currentUser ? (
              <div className="border-t border-gray-100 pt-3">
                <UserProfile />
              </div>
            ) : (
              <div className="flex space-x-2 pt-3">
                <Link
                  to="/login"
                  className="flex-1 text-center text-gray-700 border border-gray-200 rounded-full py-2 text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex-1 text-center text-white bg-pink-600 rounded-full py-2 text-sm font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;