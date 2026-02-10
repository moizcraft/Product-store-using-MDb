import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useScrollToTop } from '../hooks/useScrollToTop';
import api from '../lib/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowLeft, Package, Save } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(5, "Product name must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  imageUrl: z.string().url("Invalid image URL"),
});

export default function EditProduct() {
  useScrollToTop();
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'seller') {
      navigate('/products', { replace: true });
    }
  }, [user, navigate]);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(productSchema),
  });

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/getProduct/${id}`);
        const product = res.data.product;

        // Set form values
        setValue('name', product.name);
        setValue('description', product.description);
        setValue('price', product.price);
        setValue('category', product.category);
        setValue('stock', product.stock ?? 0);
        setValue('imageUrl', product.imageUrl);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again.');
      } finally {
        setFetching(false);
      }
    };

    if (id && user?.role === 'seller') {
      fetchProduct();
    }
  }, [id, user, setValue]);

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);

    try {
      await api.patch(`/products/updateProduct/${id}`, {
        ...data,
        inStock: data.stock > 0,
      });

      navigate('/seller/dashboard', { replace: true });
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.response?.data?.message || 'Failed to update product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'seller') {
    return null;
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Product</h1>
            <p className="text-gray-600">Update product details</p>
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
                  className={`w-full rounded-md border ${errors.description ? "border-red-500" : "border-gray-300"
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
                  <p className="mt-1 text-xs text-gray-500">
                    Stock will automatically update status (In Stock / Out of Stock)
                  </p>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register('category')}
                  className={`w-full rounded-md border ${errors.category ? "border-red-500" : "border-gray-300"
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
                  Image URL *
                </label>
                <Input
                  {...register('imageUrl')}
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className={errors.imageUrl ? "border-red-500" : ""}
                  disabled={loading}
                />
                {errors.imageUrl && (
                  <p className="mt-1 text-xs text-red-500">{errors.imageUrl.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </span>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/seller/dashboard')}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
