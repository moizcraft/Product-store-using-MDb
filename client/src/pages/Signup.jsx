import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { User, Mail, Lock, Sparkles } from 'lucide-react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';

const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
  age: z.number()
    .min(18, "Age must be at least 18")
    .max(50, "Age must be at most 50"),
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: "Gender must be male, female, or other" })
  }),
  role: z.enum(['customer', 'seller']).default('customer'),
  storeName: z.string().optional(),
  storeCategory: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.role === 'seller') {
    return data.storeName && data.storeName.trim().length >= 3;
  }
  return true;
}, {
  message: "Store Name is required and must be at least 3 characters",
  path: ["storeName"],
}).refine((data) => {
  if (data.role === 'seller') {
    return data.storeCategory && data.storeCategory.trim().length > 0 && ['Men Accessories', 'Women Accessories', 'Shoes'].includes(data.storeCategory);
  }
  return true;
}, {
  message: "Store Category is required",
  path: ["storeCategory"],
});

export default function Signup() {
  const navigate = useNavigate();
  const { handleAuthSuccess } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: 'customer',
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (formData) => {
    setError('');
    setIsLoading(true);

    try {
      // Build payload
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        age: Number(formData.age),
        gender: formData.gender.toLowerCase().trim(),
        role: formData.role === 'seller' ? 'seller' : 'customer',
      };

      // Add seller-specific fields only if role is seller
      if (formData.role === 'seller') {
        if (formData.storeName && formData.storeName.trim()) {
          payload.storeName = formData.storeName.trim();
        }
        if (formData.storeCategory && formData.storeCategory.trim()) {
          payload.category = formData.storeCategory.trim();
        }
      }

      // Use /auth/signup for both customer and seller
      const res = await api.post('/auth/signup', payload);

      const data = res.data;

      if (data.success && data.token && (data.user || data.admin)) {
        const redirectPath = handleAuthSuccess({ token: data.token, user: data.user || data.admin });
        navigate(redirectPath, { replace: true });
      } else {
        throw new Error(data.message || 'Signup failed. Invalid response from server.');
      }
    } catch (err) {
      console.error('Signup error:', err);

      let message = 'Signup failed. Please try again.';

      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.response?.data?.error) {
        message = err.response.data.error;
      } else if (err.message) {
        message = err.message;
      } else if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        message = 'Cannot connect to server. Please ensure the backend is running on http://localhost:5000';
      }

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormLoading = isSubmitting || isLoading;

  return (
    <div className="min-h-screen bg-[#fcfbf9] flex items-center justify-center p-4">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 relative z-10"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-semibold mb-4"
          >
            <Sparkles className="w-4 h-4" />
            <span>Join VibeWear</span>
          </motion.div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-gray-600 mt-2">Start your fashion journey today</p>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Account Type */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              Account Type
            </label>
            <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setValue('role', 'customer');
                }}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                  selectedRole === 'customer'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setValue('role', 'seller');
                }}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                  selectedRole === 'seller'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Seller
              </button>
            </div>
            <input {...register('role')} type="hidden" />
          </motion.div>

          {/* Name */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              Full Name
            </label>
            <Input
              {...register('name')}
              placeholder="Enter your full name"
              className={`${errors.name ? "border-red-500" : "border-gray-300"} focus:border-indigo-500 focus:ring-indigo-500`}
              disabled={isFormLoading}
            />
            {errors.name && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-red-500"
              >
                {errors.name.message}
              </motion.p>
            )}
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-600" />
              Email Address
            </label>
            <Input
              {...register('email')}
              type="email"
              placeholder="Enter your email"
              className={`${errors.email ? "border-red-500" : "border-gray-300"} focus:border-indigo-500 focus:ring-indigo-500`}
              disabled={isFormLoading}
            />
            {errors.email && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-red-500"
              >
                {errors.email.message}
              </motion.p>
            )}
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-600" />
              Password
            </label>
            <Input
              {...register('password')}
              type="password"
              placeholder="Create a strong password"
              className={`${errors.password ? "border-red-500" : "border-gray-300"} focus:border-indigo-500 focus:ring-indigo-500`}
              disabled={isFormLoading}
            />
            {errors.password && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-red-500"
              >
                {errors.password.message}
              </motion.p>
            )}
          </motion.div>

          {/* Confirm Password */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-600" />
              Confirm Password
            </label>
            <Input
              {...register('confirmPassword')}
              type="password"
              placeholder="Confirm your password"
              className={`${errors.confirmPassword ? "border-red-500" : "border-gray-300"} focus:border-indigo-500 focus:ring-indigo-500`}
              disabled={isFormLoading}
            />
            {errors.confirmPassword && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-red-500"
              >
                {errors.confirmPassword.message}
              </motion.p>
            )}
          </motion.div>

          {/* Age */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-gray-700">Age</label>
            <Input
              {...register('age', { valueAsNumber: true })}
              type="number"
              placeholder="Enter your age"
              className={`${errors.age ? "border-red-500" : "border-gray-300"} focus:border-indigo-500 focus:ring-indigo-500`}
              disabled={isFormLoading}
            />
            {errors.age && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-red-500"
              >
                {errors.age.message}
              </motion.p>
            )}
          </motion.div>

          {/* Gender */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="space-y-2"
          >
            <label className="text-sm font-medium text-gray-700">Gender</label>
            <select
              {...register('gender')}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.gender ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              }`}
              disabled={isFormLoading}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-red-500"
              >
                {errors.gender.message}
              </motion.p>
            )}
          </motion.div>

          {/* Seller Fields */}
          <AnimatePresence mode="wait">
            {selectedRole === 'seller' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-5"
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium text-gray-700">Store Name</label>
                  <Input
                    {...register('storeName')}
                    placeholder="Enter your store name"
                    className={`${errors.storeName ? "border-red-500" : "border-gray-300"} focus:border-indigo-500 focus:ring-indigo-500`}
                    disabled={isFormLoading}
                  />
                  {errors.storeName && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-red-500"
                    >
                      {errors.storeName.message}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium text-gray-700">Store Category</label>
                  <select
                    {...register('storeCategory')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.storeCategory ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    }`}
                    disabled={isFormLoading}
                  >
                    <option value="">Select Category</option>
                    <option value="Men Accessories">Men Accessories</option>
                    <option value="Women Accessories">Women Accessories</option>
                    <option value="Shoes">Shoes</option>
                  </select>
                  {errors.storeCategory && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-red-500"
                    >
                      {errors.storeCategory.message}
                    </motion.p>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={isFormLoading}
                className="w-full mt-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-600 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isFormLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </motion.div>
          </motion.div>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-6 text-center text-sm"
          >
            <span className="text-gray-600">Already have an account? </span>
            <Link
              to="/login"
              className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-purple-700"
            >
              Sign in here
            </Link>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
