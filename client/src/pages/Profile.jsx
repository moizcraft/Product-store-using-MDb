import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  return (
    <motion.div
      className="max-w-4xl mx-auto p-4 lg:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        {user && (
          <>
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-lg font-semibold">{user.name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-lg">{user.email || 'N/A'}</p>
            </div>
            {user.role && (
              <div>
                <label className="text-sm font-medium text-gray-500">Role</label>
                <p className="text-lg capitalize">{user.role.replace('-', ' ')}</p>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
