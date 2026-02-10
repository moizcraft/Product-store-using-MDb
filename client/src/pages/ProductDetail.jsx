import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, Truck, ShieldCheck, Heart, ShoppingBag, Check, ArrowLeft, Package } from 'lucide-react';
import api from '../lib/axios';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';

const fetchProduct = async (id) => {
  const { data } = await api.get(`/products/getProduct/${id}`);
  return data.product;
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
  });

  // If not authenticated, show login modal
  React.useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleLoginModalClose = () => {
    if (!isAuthenticated) {
      navigate('/products');
    } else {
      setShowLoginModal(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
  
  if (isError) return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500 text-xl font-semibold">Error loading product</p>
        <Link to="/products" className="text-indigo-600 hover:underline mt-4 inline-block">
          Back to Products
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link to="/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden relative group shadow-xl">
              <img 
                src={product.imageUrl || "https://placehold.co/600x600?text=No+Image"} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              {product.stock > 0 ? (
                <div className="absolute top-6 right-6 px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-full shadow-lg">
                  In Stock
                </div>
              ) : (
                <div className="absolute top-6 right-6 px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full shadow-lg">
                  Out of Stock
                </div>
              )}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-600 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                {product.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">{product.name}</h1>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <span className="text-sm text-gray-600 font-medium">(4.8 • 24 reviews)</span>
              </div>
              <p className="text-4xl font-black text-gray-900">
                Rs. {product.price?.toLocaleString()}
              </p>
            </div>

            <div className="py-6 border-y border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700">Quantity:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-gray-300 hover:bg-gray-100 transition-colors font-bold"
                >
                  -
                </button>
                <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-gray-300 hover:bg-gray-100 transition-colors font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-6">
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={handleAddToCart}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 h-14 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 ${
                    added
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-6 h-6" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-6 h-6" />
                      Add to Cart
                    </>
                  )}
                </motion.button>
                <Button variant="outline" size="icon" className="h-14 w-14 text-gray-400 hover:text-red-500 hover:border-red-500 rounded-xl">
                  <Heart className="w-6 h-6" />
                </Button>
              </div>
              
              <Link to="/cart">
                <Button variant="outline" className="w-full h-12 rounded-xl font-semibold">
                  View Cart
                </Button>
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
              <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Free Delivery</p>
                  <p className="text-xs text-gray-600">In major cities</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Authentic</p>
                  <p className="text-xs text-gray-600">100% Guaranteed</p>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            {product.sellerStoreName && (
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {product.sellerStoreName[0]}
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Sold by</p>
                    <p className="text-lg font-bold text-gray-900">{product.sellerStoreName}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>

      <LoginModal isOpen={showLoginModal} onClose={handleLoginModalClose} />
    </>
  );
}
