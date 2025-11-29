import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'tishe_wishlist_v1';

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value) || fallback;
  } catch {
    return fallback;
  }
};

const normalizeWishlistItem = (product) => ({
  id: product?.id || product?.sku || `wish-${Date.now()}`,
  name: product?.name || 'Untitled Product',
  price: Number(product?.price) || 0,
  image:
    product?.image ||
    product?.images?.[0] ||
    'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=500&q=60',
  category: product?.categoryName || product?.category || 'Jewelry'
});

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    if (typeof window === 'undefined') return [];
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? safeParse(stored, []) : [];
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    let added = false;
    setWishlist((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev;
      }
      added = true;
      return [...prev, normalizeWishlistItem(product)];
    });
    if (added) {
      toast.success(`${product?.name || 'Item'} saved to wishlist`);
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const toggleWishlist = (product) => {
    let message = '';
    setWishlist((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        message = `${product?.name || 'Item'} removed from wishlist`;
        return prev.filter((item) => item.id !== product.id);
      }
      message = `${product?.name || 'Item'} saved to wishlist`;
      return [...prev, normalizeWishlistItem(product)];
    });
    if (message) {
      toast.success(message);
    }
  };

  const isInWishlist = (productId) => wishlist.some((item) => item.id === productId);

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

