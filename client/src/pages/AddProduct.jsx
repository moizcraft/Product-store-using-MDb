import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowLeft } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(5, "Product name must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  imageUrl: z.string().min(1, "Image is required").refine(
    (val) => val.startsWith('data:image/') || val.startsWith('http://') || val.startsWith('https://'),
    { message: "Image must be a valid URL or base64 encoded image" }
  ),
});

export default function AddProduct() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (user && user.role !== 'seller') {
      navigate('/products', { replace: true });
    }
  }, [user, navigate]);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(productSchema),
  });

  const imageUrl = watch('imageUrl');

  useEffect(() => {
    if (imageUrl) {
      setImagePreview(imageUrl);
    }
  }, [imageUrl]);

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
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.imageUrl) {
        setValue('imageUrl', response.data.imageUrl);
        setImagePreview(response.data.imageUrl);
      }
    } catch (err) {
      console.error('Image upload error:', err);
      setError(err.response?.data?.error || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);

    try {
      console.log('=== SUBMITTING PRODUCT ===');
      console.log('Form data:', data);
      console.log('User:', user);
      console.log('Cookies:', document.cookie);
      
      const payload = {
        ...data,
        inStock: data.stock > 0,
      };
      console.log('Payload being sent:', payload);
      
      const response = await api.post('/products/addProduct', payload);
      
      console.log('Product added successfully:', response.data);
      navigate('/seller/dashboard', { replace: true });
    } catch (err) {
      console.error('=== ERROR DETAILS ===');
      console.error('Full error:', err);
      console.error('Error message:', err.message);
      console.error('Error response:', err.response);
      console.error('Error response data:', err.response?.data);
      console.error('Error response status:', err.response?.status);
      
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to add product';
      setError(errorMsg);
      
      // Show detailed error in UI
      if (err.response?.data) {
        console.log('SERVER ERROR:', JSON.stringify(err.response.data, null, 2));
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'seller') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/seller/dashboard"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Product</h1>
            <p className="text-gray-600">Fill in the details to add a new product to your store</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <Input
                  {...register('name')}
                  placeholder="e.g., Wireless Bluetooth Headphones"
                  className={errors.name ? "border-red-500" : ""}
                  disabled={loading}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder="Describe your product in detail..."
                  className={`w-full rounded-md border ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50`}
                  disabled={loading}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
                )}
              </div>

              {/* Price and Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register('price', { valueAsNumber: true })}
                    placeholder="0.00"
                    className={errors.price ? "border-red-500" : ""}
                    disabled={loading}
                  />
                  {errors.price && (
                    <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <Input
                    type="number"
                    {...register('stock', { valueAsNumber: true })}
                    placeholder="0"
                    className={errors.stock ? "border-red-500" : ""}
                    disabled={loading}
                  />
                  {errors.stock && (
                    <p className="mt-1 text-xs text-red-500">{errors.stock.message}</p>
                  )}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register('category')}
                  className={`w-full rounded-md border ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50`}
                  disabled={loading}
                >
                  <option value="">Select Category</option>
                  <option value="Men Accessories">Men Accessories</option>
                  <option value="Women Accessories">Women Accessories</option>
                  <option value="Shoes">Shoes</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
                )}
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image *
                </label>
                
                {/* File Upload */}
                <div className="mb-3">
                  <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-1 text-sm text-gray-600">
                        {uploadingImage ? 'Uploading...' : 'Click to upload image'}
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage || loading}
                    />
                  </label>
                </div>

                {/* Or URL Input */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-50 text-gray-500">Or enter URL</span>
                  </div>
                </div>

                <Input
                  {...register('imageUrl')}
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  className={`mt-3 ${errors.imageUrl ? "border-red-500" : ""}`}
                  disabled={loading || uploadingImage}
                />
                {errors.imageUrl && (
                  <p className="mt-1 text-xs text-red-500">{errors.imageUrl.message}</p>
                )}

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-2">Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      onError={() => setImagePreview('')}
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/seller/dashboard')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="px-8"
                >
                  {loading ? 'Adding Product...' : 'Add Product'}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
