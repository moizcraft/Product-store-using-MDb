import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, loading } = useCart();
  const [removingId, setRemovingId] = useState(null);

  const handleRemove = async (productId) => {
    setRemovingId(productId);
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setRemovingId(null);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-20 text-center space-y-6"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ShoppingBag className="w-20 h-20 mx-auto text-gray-400 mb-4" />
        </motion.div>
        <h2 className="text-3xl font-display font-bold">Your cart is empty</h2>
        <p className="text-gray-500 text-lg">Looks like you haven't added any treasures yet.</p>
        <Link to="/products">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
            Start Shopping
          </Button>
        </Link>
      </motion.div>
    );
  }

  const total = getCartTotal();
  const tax = total * 0.1; // 10% tax
  const finalTotal = total + tax;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12"
    >
      <h1 className="text-4xl font-display font-bold mb-2">Shopping Cart</h1>
      <p className="text-gray-500 mb-8">You have {cartItems.length} item(s) in your cart</p>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <motion.div className="space-y-4">
            {cartItems.map((item, index) => {
              const product = item.productId || item;
              const price = product.price || 0;
              const itemTotal = price * item.quantity;

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                    <img
                      src={product.imageUrl || '/placeholder.png'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-grow min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                    <p className="text-2xl font-black text-indigo-600">
                      Rs. {price.toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity Control */}
                  <div className="flex items-center justify-center bg-gray-100 rounded-lg p-1 gap-2">
                    <button
                      onClick={() => handleQuantityChange(product._id, item.quantity - 1)}
                      disabled={loading}
                      className="p-1 hover:bg-white rounded transition-colors disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(product._id, item.quantity + 1)}
                      disabled={loading}
                      className="p-1 hover:bg-white rounded transition-colors disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Total Price */}
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-2">Total</p>
                    <p className="text-2xl font-black text-gray-900">
                      Rs. {itemTotal.toLocaleString()}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(product._id)}
                    disabled={removingId === product._id || loading}
                    className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-1 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl h-fit border border-indigo-100 sticky top-4"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold">Rs. {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (10%)</span>
              <span className="font-semibold">Rs. {tax.toLocaleString()}</span>
            </div>
            <div className="border-t-2 border-indigo-200 pt-4 flex justify-between text-lg font-black text-gray-900">
              <span>Total</span>
              <span className="text-indigo-600">Rs. {finalTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all duration-300 hover:shadow-lg">
              Proceed to Checkout
            </button>
            <Link to="/products" className="block">
              <button className="w-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold py-3 rounded-lg transition-all duration-300">
                Continue Shopping
              </button>
            </Link>
          </div>

          {/* Items Count */}
          <div className="mt-6 p-3 bg-white rounded-lg text-center">
            <p className="text-sm text-gray-600">
              <span className="font-bold text-indigo-600">{cartItems.length}</span> items in cart
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
