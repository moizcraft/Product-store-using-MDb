import api from '../lib/axios';

// Add product to cart
export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await api.post('/cart/add', {
      productId,
      quantity
    });
    return response.data;
  } catch (error) {
    console.error('Add to cart error:', error);
    throw error;
  }
};

// Get user's cart
export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    console.error('Get cart error:', error);
    throw error;
  }
};

// Update cart item quantity
export const updateCartQuantity = async (productId, quantity) => {
  try {
    const response = await api.put('/cart/update', {
      productId,
      quantity
    });
    return response.data;
  } catch (error) {
    console.error('Update cart error:', error);
    throw error;
  }
};

// Remove product from cart
export const removeFromCart = async (productId) => {
  try {
    const response = await api.delete(`/cart/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Remove from cart error:', error);
    throw error;
  }
};

// Clear entire cart
export const clearCart = async () => {
  try {
    const response = await api.delete('/cart/clear/all');
    return response.data;
  } catch (error) {
    console.error('Clear cart error:', error);
    throw error;
  }
};
