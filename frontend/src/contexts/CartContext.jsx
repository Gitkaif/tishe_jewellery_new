import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);
const STORAGE_KEY = 'tishe_cart_v1';

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value) || fallback;
  } catch {
    return fallback;
  }
};

const buildCartItem = (product, quantity) => ({
  id:
    product?.id ||
    product?.sku ||
    (typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `tmp-${Date.now()}`),
  name: product?.name || 'Untitled Product',
  price: Number(product?.price) || 0,
  image:
    product?.image ||
    product?.images?.[0] ||
    'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=500&q=60',
  category: product?.categoryName || product?.category || 'Jewelry',
  quantity: quantity > 0 ? quantity : 1
});

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    if (typeof window === 'undefined') return [];
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? safeParse(stored, []) : [];
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    let message = '';
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        message = `${product?.name || 'Item'} quantity updated in cart`;
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      message = `${product?.name || 'Item'} added to cart`;
      return [...prev, buildCartItem(product, quantity)];
    });
    if (message) {
      toast.success(message);
    }
  };

  const updateQuantity = (productId, quantity) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => setItems([]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, totalItems };
  }, [items]);

  const value = {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    ...totals
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

