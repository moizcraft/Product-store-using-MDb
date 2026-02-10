import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useScrollToTop } from '../hooks/useScrollToTop';
import api from '../lib/axios';
import {
  LayoutDashboard,
  Package,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Menu,
  X,
  ShoppingBag,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  User
} from 'lucide-react';

export default function SellerDashboard() {
  useScrollToTop();
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, product: null });

  // Redirect logic: if user exists but not seller -> products. If no user and not loading -> login.
  useEffect(() => {
    if (user && user.role !== 'seller') {
      navigate('/products', { replace: true });
    }

    if (!user && !loading) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  // Fetch products
  useEffect(() => {
    if (user?.role === 'seller') {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await api.get('/products/getSellerProducts');
      setProducts(res.data.products || []);
    } catch (error) {
      console.error('Error fetching seller products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.product) return;

    try {
      await api.delete(`/products/deleteProduct/${deleteModal.product._id}`);
      setProducts(products.filter(p => p._id !== deleteModal.product._id));
      setDeleteModal({ open: false, product: null });
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const stats = {
    total: products.length,
    inStock: products.filter(p => p.stock > 0).length,
    outOfStock: products.filter(p => p.stock === 0).length,
  };

  if (loading) return null;
  if (!user || user.role !== 'seller') return null;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {(sidebarOpen || window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed lg:relative z-50 w-72 h-full bg-white/95 backdrop-blur-xl border-r border-slate-200/60 flex flex-col shadow-2xl lg:shadow-lg transition-all duration-300`}
          >
            <div className="p-6 border-b border-slate-100/60">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200/50">
                  {user.storeName?.[0]?.toUpperCase() || 'S'}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800 tracking-tight">{user.storeName || 'SellerHub'}</h2>
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Marketplace Pro</p>
                </div>
              </motion.div>
            </div>

            <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-4 px-4"
              >
                Menu
              </motion.p>

              <NavItem to="/seller/dashboard" icon={<LayoutDashboard size={20} />} active>Dashboard</NavItem>
              <NavItem to="/products" icon={<ShoppingBag size={20} />}>View Shop</NavItem>
              <NavItem to="/seller/products" icon={<Package size={20} />}>My Products</NavItem>

              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mt-8 mb-4 px-4"
              >
                Management
              </motion.p>
              <NavItem to="/seller/add-product" icon={<Plus size={20} />}>Add New Product</NavItem>
              <NavItem to="/orders" icon={<AlertCircle size={20} />}>Pending Orders</NavItem>
            </nav>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-4 mb-6 px-2">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase ring-2 ring-white">
                  {user.name?.[0]}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-slate-700 truncate">{user.name}</span>
                  <span className="text-xs text-slate-500 truncate">{user.storeName}</span>
                </div>
              </div>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-medium group"
              >
                <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-8 flex items-center justify-between sticky top-0 z-40 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200 hover:scale-105"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200/50">
                {user.storeName?.[0]?.toUpperCase() || 'S'}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="hidden sm:inline"></span> {user.storeName || 'My Store'}
                </h1>
                <p className="text-xs text-slate-500 font-medium">Seller Dashboard</p>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 px-4 py-2 bg-slate-50/80 rounded-2xl border border-slate-200/60"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-700">{user.name}</p>
                <p className="text-xs text-slate-500">Seller</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                to="/seller/add-product"
                className="hidden sm:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-sm hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-indigo-100/50 hover:shadow-xl hover:shadow-indigo-200/50 active:scale-95"
              >
                <Plus size={18} />
                Add Product
              </Link>
            </motion.div>
          </div>
        </motion.header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-8 pb-24 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-8 mb-12">
            {/* Header Section */}
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Welcome back, {user.name.split(' ')[0]}...</h2>
              <p className="text-slate-500 mt-1 font-medium">Here's what's happening with <span className="text-indigo-600 font-bold">{user.storeName}</span> today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatItem
                label="Total Inventory"
                value={stats.total}
                icon={<Package className="text-white" />}
                color="bg-gradient-to-br from-indigo-500 to-indigo-600"
                trend="+2 this week"
              />
              <StatItem
                label="Active Stock"
                value={stats.inStock}
                icon={<ShoppingBag className="text-white" />}
                color="bg-gradient-to-br from-emerald-500 to-emerald-600"
                trend="Performing well"
              />
              <StatItem
                label="Out of Stock"
                value={stats.outOfStock}
                icon={<AlertCircle className="text-white" />}
                color="bg-gradient-to-br from-rose-500 to-rose-600"
                trend="Immediate action"
              />
            </div>

            {/* Products Table Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 leading-none">Catalog</h3>
                  <p className="text-sm text-slate-400 mt-2 font-medium">Manage and update your listing</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
                    <Edit size={20} />
                  </button>
                </div>
              </div>

              {loadingProducts ? (
                <div className="py-20 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                  <p className="text-slate-400 font-bold tracking-tight">Syncing catalog...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="py-32 flex flex-col items-center justify-center text-center px-6">
                  <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                    <Plus className="text-indigo-600" size={40} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">No products in your store</h4>
                  <p className="text-slate-500 max-w-xs mx-auto mb-8 font-medium">Start building your catalog by adding your first product to the marketplace.</p>
                  <Link
                    to="/seller/add-product"
                    className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                  >
                    Add Product
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product, idx) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: idx * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="bg-white rounded-3xl border border-slate-200/60 shadow-lg hover:shadow-2xl hover:shadow-slate-200/20 transition-all duration-500 overflow-hidden group"
                    >
                      {/* Product Image */}
                      <div className="relative h-48 overflow-hidden bg-slate-100">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Stock Badge */}
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm ${
                            product.stock > 0 
                              ? 'bg-emerald-500/90 text-white' 
                              : 'bg-rose-500/90 text-white'
                          }`}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Product Info */}
                      <div className="p-6">
                        <div className="mb-4">
                          <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-slate-500 font-medium mb-3">
                            {product.category || 'Uncategorized'}
                          </p>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl font-black text-slate-800">
                              Rs. {product.price}
                            </span>
                            <div className="text-xs text-slate-400 font-medium">
                              ID: {product._id.slice(-6)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          {(String(product.sellerId) === String(user?._id)) && (
                            <>
                              <Link
                                to={`/seller/edit-product/${product._id}`}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 rounded-2xl font-semibold text-sm hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 border border-indigo-200/60 hover:border-indigo-300/80"
                              >
                                <Edit size={16} />
                                Edit
                              </Link>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setDeleteModal({ open: true, product })}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-50 to-red-50 text-rose-600 rounded-2xl font-semibold text-sm hover:from-rose-100 hover:to-red-100 transition-all duration-200 border border-rose-200/60 hover:border-rose-300/80"
                              >
                                <Trash2 size={16} />
                                Delete
                              </motion.button>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>

      {/* Modern Delete Modal */}
      <AnimatePresence>
        {deleteModal.open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteModal({ open: false, product: null })}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl relative z-10 w-full max-w-md p-10 text-center"
            >
              <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Trash2 size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Delete Product?</h3>
              <p className="text-slate-500 font-medium mb-8">This will permanently remove <span className="text-slate-800 font-bold">"{deleteModal.product?.name}"</span> from the marketplace.</p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDeleteModal({ open: false, product: null })}
                  className="py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Keep It
                </button>
                <button
                  onClick={handleDelete}
                  className="py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-100"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper Components
function NavItem({ to, icon, children, active = false }) {
  const className = "flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 group " + (
    active 
      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-100/50'
      : 'text-slate-500 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50'
  );

  const spanClassName = "transition-transform duration-300 " + (
    active ? 'scale-110' : 'group-hover:scale-110'
  );

  return (
    <motion.div
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Link to={to} className={className}>
        <span className={spanClassName}>
          {icon}
        </span>
        {children}
      </Link>
    </motion.div>
  );
}

function StatItem({ label, value, icon, color, trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={"relative overflow-hidden p-8 rounded-[2.5rem] border border-white/20 shadow-xl flex flex-col items-start gap-4 transition-all duration-500 hover:shadow-2xl hover:shadow-white/10 group " + color}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
      </div>
      <div className="relative z-10 p-4 rounded-2xl bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110 duration-500">
        {icon}
      </div>
      
      <div className="relative z-10 flex-1">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-black text-white"
        >
          {value}
        </motion.p>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm font-semibold text-white/90"
        >
          {label}
        </motion.p>
        {trend && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-1 text-xs font-medium text-white/80 mt-2"
          >
            {trend.includes('+') ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
