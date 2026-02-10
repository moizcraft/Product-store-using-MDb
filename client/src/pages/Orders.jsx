import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useScrollToTop } from '../hooks/useScrollToTop';

export default function Orders() {
  useScrollToTop();
  const { user } = useAuth();

  return (
    <motion.div
      className="max-w-7xl mx-auto p-4 lg:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-500">
          {user?.name ? `Hello ${user.name}, ` : ''}Your orders will appear here.
        </p>
      </div>
    </motion.div>
  );
}
