import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const DELIVERY_OPTIONS = [
  { id: 'standard', name: 'Standard Delivery', eta: '3-5 business days', price: 0 },
  { id: 'express', name: 'Express Delivery', eta: '1-2 business days', price: 249 }
];

const Checkout = () => {
  const [delivery, setDelivery] = useState('standard');
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();

  const { shippingCost, taxEstimate, orderTotal } = useMemo(() => {
    const shippingCostCalc = delivery === 'express' ? 249 : 0;
    const taxCalc = subtotal * 0.07;
    return {
      shippingCost: shippingCostCalc,
      taxEstimate: taxCalc,
      orderTotal: subtotal + shippingCostCalc + taxCalc
    };
  }, [delivery, subtotal]);

  const handlePlaceOrder = () => {
    if (!items.length) {
      navigate('/cart');
      return;
    }
    // Placeholder: later integrate payment + order creation
    clearCart();
    navigate('/');
  };

  return (
    <div className="bg-gray-50 min-height-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-pink-300 focus:border-pink-400"
                  placeholder="Aditi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-pink-300 focus:border-pink-400"
                  placeholder="Sharma"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-pink-300 focus:border-pink-400"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-pink-300 focus:border-pink-400"
                  placeholder="+91 9xxxxxxxxx"
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Shipping Address</h2>
              <p className="text-sm text-gray-500">We currently ship across India.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Street Address</label>
                <input
                  type="text"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-pink-300 focus:border-pink-400"
                  placeholder="123 Serenity Lane"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Apartment, suite, etc.</label>
                <input
                  type="text"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-pink-300 focus:border-pink-400"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-pink-300 focus:border-pink-400"
                  placeholder="Mumbai"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-pink-300 focus:border-pink-400"
                    placeholder="Maharashtra"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                  <input
                    type="text"
                    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-pink-300 focus:border-pink-400"
                    placeholder="400001"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Delivery Speed</h2>
            <div className="space-y-3">
              {DELIVERY_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center justify-between border rounded-xl p-4 cursor-pointer transition ${
                    delivery === option.id ? 'border-pink-400 bg-pink-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="delivery"
                      value={option.id}
                      checked={delivery === option.id}
                      onChange={() => setDelivery(option.id)}
                      className="text-pink-500 focus:ring-pink-400"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{option.name}</p>
                      <p className="text-sm text-gray-500">{option.eta}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {option.price > 0 ? `₹${option.price}` : 'Free'}
                  </p>
                </label>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
            <p className="text-sm text-gray-500">We&apos;ll add payment partners soon. For now, simply review and submit your order.</p>
            <div className="border border-dashed border-gray-300 rounded-2xl p-6 text-center text-gray-500">
              <p className="text-sm">Payment gateway coming soon</p>
              <p className="text-xs mt-1">Choose your preferred service (Razorpay, Stripe, etc.) later.</p>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            {items.length === 0 ? (
              <div className="border border-dashed border-gray-200 rounded-xl p-4 text-sm text-gray-500 text-center">
                No items in cart.{' '}
                <Link to="/cart" className="text-pink-600 font-medium">
                  Go back to cart
                </Link>
                .
              </div>
            ) : (
              <div className="space-y-4 border-b border-gray-100 pb-4 max-h-64 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <div className="h-16 w-16 rounded-lg bg-gray-100 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Qty {item.quantity} · {item.category || 'Jewelry'}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="space-y-2 text-sm text-gray-600 border-b border-gray-100 py-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingCost > 0 ? `₹${shippingCost.toFixed(2)}` : 'Free'}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>₹{taxEstimate.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between text-gray-900 text-lg font-semibold mt-4">
              <span>Total</span>
              <span>₹{orderTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={!items.length}
              className={`w-full mt-6 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-semibold text-sm tracking-wide ${
                !items.length ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              Place Order
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-3">
              <span className="text-xl">🛡️</span>
              <p>Secure checkout — your personal data is encrypted end‑to‑end.</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl">🔁</span>
              <p>30-day returns on ready-to-ship pieces. Custom orders are final sale.</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl">💬</span>
              <p>Need help? Chat with our stylists or email care@tishe.com</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;

