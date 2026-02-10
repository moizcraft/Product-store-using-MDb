import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useScrollToTop } from '../hooks/useScrollToTop';
import api from '../lib/axios';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  Plus,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  Users
} from 'lucide-react';

export default function AdminDashboard() {
  useScrollToTop();
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, orders: 0, totalRevenue: 0 });
  const [products, setProducts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [storeName, setStoreName] = useState('VibeWear');

  useEffect(() => {
    if (!user || !['admin', 'super-admin'].includes(user.role)) {
      navigate('/products', { replace: true });
      return;
    }

    // Set store name from user data if available, otherwise use default
    if (user?.storeName) {
      setStoreName(user.storeName);
    } else if (user?.businessName) {
      setStoreName(user.businessName);
    } else if (user?.name) {
      setStoreName(`${user.name}'s Store`);
    }

    if (!loading) {
      fetchDashboardData();
    }
  }, [user, loading, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoadingData(true);
      const res = await api.get('/products/getAllProducts');
      const allProducts = res.data.products || [];

      // Calculate stats
      const totalProducts = allProducts.length;
      const totalRevenue = allProducts.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);

      setStats({
        products: totalProducts,
        orders: Math.floor(Math.random() * 100) + 10, // Mocked for demo
        totalRevenue: totalRevenue.toLocaleString(),
      });

      // Show recent products
      setProducts(allProducts.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (loading) return null;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : (window.innerWidth >= 1024 ? 0 : -280) }}
        className={`fixed lg:relative z-50 w-72 h-full bg-white border-r border-gray-200 flex flex-col transition-all`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              ◆
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">{storeName}</h2>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavLink
            to="/dashboard"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active
          />
          <NavLink
            to="/admin/products"
            icon={<Package size={20} />}
            label="All Products"
          />
          <NavLink
            to="/orders"
            icon={<ShoppingCart size={20} />}
            label="Orders"
          />
          <NavLink
            to="/manage-admins"
            icon={<Settings size={20} />}
            label="Manage Admins"
            disabled={user?.role !== 'super-admin'}
          />
          <NavLink
            to="/manage-users"
            icon={<Users size={20} />}
            label="Manage Users"
            disabled={user?.role !== 'super-admin'}
          />
        </nav>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('-', ' ')}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg p-8 text-white shadow-lg"
            >
              <h2 className="text-3xl font-bold mb-2">Welcome to {storeName} Admin..</h2>
              <p className="opacity-90">Here's your marketplace analytics and product management dashboard.</p>
            </motion.div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AnalyticsCard
                icon={<Package className="w-8 h-8 text-indigo-600" />}
                label="Total Products"
                value={stats.products}
                trend="+5 this month"
                color="indigo"
              />
              <AnalyticsCard
                icon={<ShoppingCart className="w-8 h-8 text-emerald-600" />}
                label="Total Orders"
                value={stats.orders}
                trend="+12 today"
                color="emerald"
              />
              <AnalyticsCard
                icon={<TrendingUp className="w-8 h-8 text-amber-600" />}
                label="Revenue Generated"
                value={`Rs. ${stats.totalRevenue}`}
                trend="YTD performance"
                color="amber"
              />
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <Link to="/admin/add-product" className="block">
                <motion.button
                  whileHover={{ y: -4 }}
                  className="w-full h-32 bg-white rounded-lg border-2 border-indigo-200 hover:border-indigo-600 hover:shadow-lg transition-all flex items-center justify-center gap-4 group"
                >
                  <Plus className="w-8 h-8 text-indigo-600 group-hover:scale-125 transition-transform" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-800">Add New Product</p>
                    <p className="text-sm text-gray-500">Create and list a new product</p>
                  </div>
                </motion.button>
              </Link>

              <Link to="/admin/products" className="block">
                <motion.button
                  whileHover={{ y: -4 }}
                  className="w-full h-32 bg-white rounded-lg border-2 border-emerald-200 hover:border-emerald-600 hover:shadow-lg transition-all flex items-center justify-center gap-4 group"
                >
                  <BarChart3 className="w-8 h-8 text-emerald-600 group-hover:scale-125 transition-transform" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-800">Manage Products</p>
                    <p className="text-sm text-gray-500">Edit or delete products</p>
                  </div>
                </motion.button>
              </Link>
            </motion.div>

            {/* Recent Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Recent Products</h3>
              </div>

              {loadingData ? (
                <div className="p-8 text-center text-gray-500">Loading...</div>
              ) : products.length === 0 ? (
                <div className="p-8 text-center">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No products yet. Start by adding one!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Seller</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-10 h-10 rounded object-cover"
                              />
                              <p className="font-medium text-gray-800 truncate max-w-xs">{product.name}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">Rs. {product.price}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              product.stock > 0
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {product.stock} units
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600 text-sm">{product.sellerStoreName || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavLink({ to, icon, label, active = false, disabled = false }) {
  return (
    <Link to={to}>
      <motion.button
        disabled={disabled}
        whileHover={disabled ? {} : { x: 4 }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
          active
            ? 'bg-indigo-600 text-white'
            : disabled
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        {icon}
        <span className="font-medium">{label}</span>
      </motion.button>
    </Link>
  );
}

function AnalyticsCard({ icon, label, value, trend, color }) {
  const colorClasses = {
    indigo: 'bg-indigo-50 border-indigo-200',
    emerald: 'bg-emerald-50 border-emerald-200',
    amber: 'bg-amber-50 border-amber-200',
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`${colorClasses[color]} border rounded-lg p-6 shadow-sm transition-all`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-white">{icon}</div>
      </div>
      <p className="text-gray-600 text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-800 my-2">{value}</p>
      <p className="text-xs text-gray-500">{trend}</p>
    </motion.div>
  );
}
