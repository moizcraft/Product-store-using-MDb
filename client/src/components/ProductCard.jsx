import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LoginModal from './LoginModal';
import { Check, ShoppingCart } from 'lucide-react';

export default function ProductCard({ product = {}, onAdd }) {
  const { isAuthenticated } = useAuth();
  const { addToCart, loading } = useCart();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddClick = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    try {
      await addToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
      
      // Call onAdd callback if provided
      onAdd && onAdd(product);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  return (
    <>
      <motion.article 
        whileHover={{ scale: 1.02 }} 
        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      >
        <img 
          src={product.imageUrl || product.image || '/placeholder.png'} 
          alt={product.name || product.title} 
          className="h-48 w-full object-cover" 
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {product.name || product.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {product.description || product.subtitle}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-lg font-bold text-indigo-600">
              ${product.price || '0.00'}
            </div>
            <Button 
              size="sm" 
              onClick={handleAddClick}
              disabled={loading}
              className={`transition-all ${
                added 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.article>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
}
