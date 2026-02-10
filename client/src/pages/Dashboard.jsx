import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const StatCard = ({label, value, accent}) => (
  <motion.div whileHover={{ y: -6 }} className="bg-white p-5 rounded-lg shadow-sm">
    <div className="text-sm text-gray-500">{label}</div>
    <div className={`mt-2 text-2xl font-bold ${accent}`}>{value}</div>
  </motion.div>
)

export default function Dashboard(){
  const { user } = useAuth() || {};
  const role = user?.role || 'customer';

  // Mocked stats — replace with real data from API
  const stats = {
    users: 1245,
    sales: '$42,300',
    orders: 312
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-72 bg-white rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold mb-4">Admin Panel</h4>
          <nav className="space-y-2 text-sm">
            <Link to="/dashboard" className="block px-3 py-2 rounded hover:bg-gray-50">Overview</Link>
            <Link to="/products" className="block px-3 py-2 rounded hover:bg-gray-50">Products</Link>
            <Link to="/orders" className="block px-3 py-2 rounded hover:bg-gray-50">Orders</Link>
            {role === 'super' && <Link to="/manage-admins" className="block px-3 py-2 rounded hover:bg-gray-50">Manage Admins</Link>}
          </nav>
        </aside>

        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Total Users" value={stats.users} accent="text-[var(--color-primary)]" />
            <StatCard label="Total Sales" value={stats.sales} accent="text-[var(--color-accent)]" />
            <StatCard label="Orders" value={stats.orders} accent="text-[var(--color-primary-foreground)]" />
          </div>

          <section className="mt-6 bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
            <div className="text-sm text-gray-500">No real orders here — this is a UI placeholder.</div>
          </section>
        </main>
      </div>
    </div>
  )
}
