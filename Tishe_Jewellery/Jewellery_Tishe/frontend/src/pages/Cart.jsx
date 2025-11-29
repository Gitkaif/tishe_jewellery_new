import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();
  const navigate = useNavigate();

  const summary = useMemo(() => {
    const shipping = items.length ? 4.99 : 0;
    const taxEstimate = subtotal * 0.05;
    const total = subtotal + shipping + taxEstimate;
    return { shipping, taxEstimate, total };
  }, [items.length, subtotal]);

  if (!items.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6 bg-white rounded-lg shadow-sm p-10">
          <h1 className="text-3xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="text-gray-600">
            Start exploring the collection and add your favorite pieces to the cart.
          </p>
          <Link
            to="/category/all"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-md bg-pink-600 text-white hover:bg-pink-700"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm uppercase tracking-wide text-pink-500 font-semibold">
                Shopping Cart
              </p>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">
                {items.length} {items.length === 1 ? 'item' : 'items'} selected
              </h1>
            </div>
            <button
              onClick={clearCart}
              className="text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Clear cart
            </button>
          </div>

          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row">
                <div className="md:w-1/4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-48 w-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                  />
                </div>
                <div className="flex-1 p-6 flex flex-col">
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                      {item.category}
                    </p>
                    <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                    <p className="mt-1 text-lg font-medium text-pink-600">
                      ₹{item.price?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Quantity</span>
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                      <p className="text-sm font-medium text-gray-900">
                        Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-sm font-medium text-gray-500 hover:text-gray-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-fit">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
          <dl className="space-y-4 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <dt>Subtotal</dt>
              <dd>₹{subtotal.toFixed(2)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Shipping estimate</dt>
              <dd>₹{summary.shipping.toFixed(2)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Tax estimate</dt>
              <dd>₹{summary.taxEstimate.toFixed(2)}</dd>
            </div>
            <div className="border-t border-gray-200 pt-4 flex items-center justify-between text-base font-medium text-gray-900">
              <dt>Order total</dt>
              <dd>₹{summary.total.toFixed(2)}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="w-full mt-6 inline-flex justify-center items-center px-4 py-3 text-base font-medium rounded-md bg-pink-600 text-white hover:bg-pink-700"
          >
            Checkout
          </button>
          <p className="mt-4 text-xs text-gray-400 text-center">
            Taxes and final shipping charges may update at checkout.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;

