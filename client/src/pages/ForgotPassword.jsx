import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import api from '../lib/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      // If backend doesn't have this route yet, this will gracefully fail
      const res = await api.post('/auth/forgot-password', { email });
      setStatus({ type: 'success', message: res.data?.message || 'If this email exists, a reset link will be sent.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Unable to process request.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h3 className="text-xl font-semibold mb-2">Forgot Password</h3>
      <p className="text-sm text-gray-500 mb-4">Enter your account email and we'll send reset instructions.</p>

      {status && (
        <div className={`mb-4 p-3 rounded text-sm ${status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
        </div>

        <div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</Button>
        </div>
      </form>
    </motion.div>
  );
}
