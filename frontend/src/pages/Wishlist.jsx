import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (item) => {
    addToCart(item, 1);
    removeFromWishlist(item.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <p className="text-sm uppercase tracking-wide text-pink-500 font-semibold">
              My Wishlist
            </p>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">
              {wishlist.length ? 'Saved treasures awaiting checkout' : 'Your wishlist is empty'}
            </h1>
            <p className="text-gray-600 mt-2 max-w-2xl">
              Keep track of favorite designs and move them to the cart whenever you&apos;re ready.
            </p>
          </div>
          <Link
            to="/category/all"
            className="inline-flex items-center justify-center px-5 py-3 mt-6 md:mt-0 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Continue shopping
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-10 text-center">
            <p className="text-gray-600 mb-6">
              Tap the heart icon on any product to add it here for quick access later.
            </p>
            <Link
              to="/category/all"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-md bg-pink-600 text-white hover:bg-pink-700"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row"
              >
                <div className="sm:w-1/3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-48 w-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none"
                  />
                </div>
                <div className="flex-1 p-6 flex flex-col">
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                      {item.category}
                    </p>
                    <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                    <p className="mt-2 text-lg font-medium text-pink-600">
                      ₹{item.price?.toFixed(2) || '0.00'}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 text-sm font-medium rounded-md bg-pink-600 text-white hover:bg-pink-700"
                    >
                      Move to cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

