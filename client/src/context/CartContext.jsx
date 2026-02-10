import { createContext, useContext, useState, useEffect } from 'react';
import * as cartService from '../services/cart';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  // Fetch cart from database when user is authenticated
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (isAuthenticated && user) {
          const res = await cartService.getCart();
          setCartItems(res.cart?.items || []);
        } else {
          // Load from localStorage if not authenticated
          try {
            const savedCart = localStorage.getItem('cart');
            setCartItems(savedCart ? JSON.parse(savedCart) : []);
          } catch (err) {
            console.error('Error loading cart from localStorage:', err);
            setCartItems([]);
          }
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        // Fallback to localStorage if API fails
        try {
          const savedCart = localStorage.getItem('cart');
          setCartItems(savedCart ? JSON.parse(savedCart) : []);
        } catch (err) {
          console.error('Error loading cart from localStorage:', err);
          setCartItems([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isAuthenticated, user]);

  // Save to localStorage as backup
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = async (product) => {
    try {
      setLoading(true);
      const res = await cartService.addToCart(product._id, 1);
      setCartItems(res.cart?.items || []);
      return res;
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Fallback: add to local state
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.productId?._id === product._id || item._id === product._id);
        
        if (existingItem) {
          return prevItems.map((item) =>
            (item.productId?._id === product._id || item._id === product._id)
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prevItems, { productId: product, quantity: 1 }];
        }
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      const res = await cartService.removeFromCart(productId);
      setCartItems(res.cart?.items || []);
      return res;
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Fallback: remove from local state
      setCartItems((prevItems) => prevItems.filter((item) => item.productId?._id !== productId && item._id !== productId));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    try {
      setLoading(true);
      const res = await cartService.updateCartQuantity(productId, quantity);
      setCartItems(res.cart?.items || []);
      return res;
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Fallback: update in local state
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          (item.productId?._id === productId || item._id === productId) ? { ...item, quantity } : item
        )
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const res = await cartService.clearCart();
      setCartItems(res.cart?.items || []);
      return res;
    } catch (error) {
      console.error('Error clearing cart:', error);
      // Fallback: clear local state
      setCartItems([]);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.productId?.price || item.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    loading
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
