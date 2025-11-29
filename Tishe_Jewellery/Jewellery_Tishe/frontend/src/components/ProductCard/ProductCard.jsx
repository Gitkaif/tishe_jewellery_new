import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product, compact = false }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { currentUser } = useAuth();

  const imageSrc =
    product.image ||
    product.images?.[0] ||
    'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=500&q=60';

  const handleCardClick = (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button, a')) {
      return;
    }
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      toast.error('Please log in to add items to your cart');
      navigate('/login', { state: { from: `/product/${product.id}` } });
      return;
    }
    addToCart(product, 1);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      toast.error('Please log in to save items to your wishlist');
      navigate('/login', { state: { from: `/product/${product.id}` } });
      return;
    }
    toggleWishlist(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col cursor-pointer hover:ring-2 hover:ring-pink-500`}
    >
      <div className="relative h-48 w-full overflow-hidden rounded-md bg-gray-200">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          type="button"
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
          className={`absolute top-3 right-3 h-9 w-9 rounded-full flex items-center justify-center transition-colors ${
            isInWishlist(product.id)
              ? 'bg-white text-pink-600 shadow'
              : 'bg-black bg-opacity-40 text-white hover:bg-opacity-60'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.312-2.733C5.099 3.75 3 5.765 3 8.25c0 7.22 8.25 12 8.25 12s8.25-4.78 8.25-12z"
            />
          </svg>
        </button>
      </div>
      <div className="mt-3 flex-grow flex flex-col">
        <h3 className="text-base font-medium text-gray-900 line-clamp-2 group-hover:text-pink-600 transition-colors">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-2 flex justify-between items-center">
          <p className="text-lg font-bold text-gray-900">₹{product.price?.toFixed(2) || '0.00'}</p>
          <button
            className="py-2 px-4 bg-pink-600 text-white text-sm rounded-md hover:bg-pink-700 transition-colors"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
