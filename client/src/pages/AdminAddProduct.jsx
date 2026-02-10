import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useScrollToTop } from '../hooks/useScrollToTop';
import api from '../lib/axios';
import { ArrowLeft, Upload, AlertCircle } from 'lucide-react';

export default function AdminAddProduct() {
  useScrollToTop();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    imageUrl: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Books',
    'Toys',
    'Beauty',
    'Food & Beverages',
  ];

  if (loading) return null;

  if (!user || !['admin', 'super-admin'].includes(user.role)) {
    navigate('/products', { replace: true });
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      const response = await api.post('/files/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.imageUrl) {
        setFormData((prev) => ({ ...prev, imageUrl: response.data.imageUrl }));
      }
    } catch (err) {
      console.error('Image upload error:', err);
      setError(err.response?.data?.error || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim() || formData.name.length < 5) {
      setError('Product name must be at least 5 characters');
      return;
    }
    if (!formData.description.trim() || formData.description.length < 20) {
      setError('Description must be at least 20 characters');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      setError('Price must be greater than 0');
      return;
    }
    if (!formData.category) {
      setError('Please select a category');
      return;
    }
    if (!formData.stock || formData.stock < 0) {
      setError('Stock must be a valid number');
      return;
    }
    if (!formData.imageUrl.trim()) {
      setError('Image URL is required');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('=== ADMIN ADD PRODUCT ===');
      console.log('Form data:', formData);
      console.log('User:', user);
      console.log('Cookies:', document.cookie);
      
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        imageUrl: formData.imageUrl.trim(),
        inStock: parseInt(formData.stock) > 0,
      };
      console.log('Payload being sent:', payload);
      
      const res = await api.post('/products/addProduct', payload);

      console.log('Response:', res.data);
      if (res.data.success || res.data.product) {
        navigate('/admin/products', {
          state: { message: 'Product added successfully!' },
        });
      } else {
        setError(res.data.message || 'Failed to add product');
      }
    } catch (err) {
      console.error('=== ERROR DETAILS ===');
      console.error('Full error:', err);
      console.error('Error response:', err.response);
      console.error('Error response data:', err.response?.data);
      console.error('Error response status:', err.response?.status);
      
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Error adding product. Please try again.';
      setError(errorMsg);
      
      // Show detailed error
      if (err.response?.data) {
        console.log('SERVER ERROR:', JSON.stringify(err.response.data, null, 2));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6 py-6 flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Add New Product</h1>
            <p className="text-gray-600 text-sm mt-1">Fill in the details to add a new product to your inventory</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow border border-gray-200 p-8 space-y-6"
        >
          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg"
            >
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </motion.div>
          )}

          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Premium Wireless Headphones"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 5 characters</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed product description..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 20 characters</p>
          </div>

          {/* Price and Stock Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Price (Rs.) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Product Image *</label>
            
            {/* File Upload Button */}
            <div className="mb-3">
              <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                <div className="text-center">
                  <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 font-medium">
                    {uploadingImage ? 'Uploading...' : 'Click to upload image'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 5MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage || isSubmitting}
                />
              </label>
            </div>

            {/* Or Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or enter image URL</span>
              </div>
            </div>

            {/* URL Input */}
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={uploadingImage || isSubmitting}
            />
            
            {/* Image Preview */}
            {formData.imageUrl && (
              <div className="mt-3">
                <p className="text-xs text-gray-600 mb-2">Preview:</p>
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full sm:w-48 h-48 object-cover border border-gray-200 rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150?text=Invalid+Image';
                  }}
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-800 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
