import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../firebase/products';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(id);
        
        if (productData) {
          setProduct(productData);
          setSelectedImage(productData.image);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!currentUser) {
      toast.error('Please log in to add items to your cart');
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    // Buy now functionality will be implemented later
    console.log('Buy now:', { ...product, quantity });
    // For now, just show a message
    alert(`Proceeding to checkout with ${quantity} ${product.name}`);
  };

  const handleWishlist = () => {
    if (!currentUser) {
      toast.error('Please log in to save items to your wishlist');
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    toggleWishlist(product);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{error}</h2>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={selectedImage || product.image}
                  alt={product.name}
                  className="w-full h-96 object-contain"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[product.image, ...(product.images || [])].slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`h-20 rounded-md overflow-hidden ${
                      selectedImage === img ? 'ring-2 ring-pink-500' : 'border border-gray-200'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="mt-10 px-4 sm:px-0 sm:mt-0">
              <h1 className="text-3xl font-extrabold text-gray-900">{product.name}</h1>
              
              <div className="mt-4">
                <p className="text-3xl font-bold text-pink-600">
                  ${product.price?.toFixed(2) || '0.00'}
                </p>
                {product.originalPrice && (
                  <p className="text-sm text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </p>
                )}
              </div>

              <div className="mt-6">
                <h2 className="text-sm font-medium text-gray-900">Description</h2>
                <p className="mt-2 text-gray-600">
                  {product.description || 'No description available.'}
                </p>
              </div>

              <div className="mt-6">
                <h2 className="text-sm font-medium text-gray-900">Details</h2>
                <ul className="mt-2 space-y-2 text-gray-600">
                  <li>• Material: {product.material || 'Not specified'}</li>
                  <li>• Category: {product.category || 'Uncategorized'}</li>
                  <li>• SKU: {product.sku || 'N/A'}</li>
                  {product.inStock !== undefined && (
                    <li className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                      • {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </li>
                  )}
                </ul>
              </div>

              <div className="mt-8">
                <div className="flex items-center space-x-4 mb-6">
                  <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-12 text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-pink-600 py-3 px-8 border border-transparent rounded-md shadow-sm text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-white py-3 px-8 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={handleWishlist}
                    className={`flex-1 py-3 px-8 border rounded-md shadow-sm text-base font-medium ${
                      isInWishlist(product.id)
                        ? 'border-pink-600 text-pink-600 bg-pink-50 hover:bg-pink-100'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {isInWishlist(product.id) ? 'In Wishlist' : 'Save to Wishlist'}
                  </button>
                </div>

                {!currentUser && (
                  <p className="mt-4 text-sm text-gray-500">
                    <button
                      onClick={() => navigate('/login', { state: { from: `/product/${id}` } })}
                      className="font-medium text-pink-600 hover:text-pink-500"
                    >
                      Sign in
                    </button>{' '}
                    to save this item for later
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          
          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-6">
              {product.reviews.map((review, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                      <span className="text-pink-600 font-medium">
                        {review.userName ? review.userName.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {review.userName || 'Anonymous'}
                      </h4>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-5 w-5 ${
                              i < (review.rating || 5) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-600">{review.comment}</p>
                  <p className="mt-2 text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
          )}

          {currentUser && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900">Write a review</h3>
              <form className="mt-4 space-y-4">
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                    Rating
                  </label>
                  <select
                    id="rating"
                    name="rating"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
                    defaultValue="5"
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                    Review
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="comment"
                      name="comment"
                      rows={4}
                      className="shadow-sm focus:ring-pink-500 focus:border-pink-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                      placeholder="Share your thoughts about this product..."
                      defaultValue={''}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="group relative">
                <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                  <img
                    src={`https://source.unsplash.com/random/300x300?jewelry,${item}`}
                    alt={`Related product ${item}`}
                    className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a href="#">
                        <span aria-hidden="true" className="absolute inset-0" />
                        Related Product {item}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">Jewelry</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">$99.99</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
