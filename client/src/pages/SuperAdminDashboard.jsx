import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Users, ShieldCheck, Store, AlertCircle, Package, Search, X, CheckCircle } from 'lucide-react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SuperAdminDashboard() {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is super admin
    if (user && user.role !== 'super-admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, adminsRes, productsRes, statsRes] = await Promise.all([
        api.get('/super-admin/users'),
        api.get('/super-admin/admins'),
        api.get('/super-admin/products'),
        api.get('/super-admin/stats')
      ]);

      setUsers(usersRes.data.users || []);
      setAdmins(adminsRes.data.admins || []);
      setProducts(productsRes.data.products || []);
      setStats(statsRes.data.stats || {});
    } catch (error) {
      console.error('Failed to fetch data:', error);
      if (error.response?.status === 403) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    try {
      setDeleting(userId);
      await api.delete(`/super-admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      showNotification(`User "${userName}" deleted successfully`, 'success');
      fetchData();
    } catch (error) {
      console.error('Failed to delete user:', error);
      showNotification('Failed to delete user', 'error');
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteAdmin = async (adminId, adminName) => {
    try {
      setDeleting(adminId);
      await api.delete(`/super-admin/admins/${adminId}`);
      setAdmins(admins.filter(a => a._id !== adminId));
      showNotification(`Admin "${adminName}" deleted successfully`, 'success');
      fetchData();
    } catch (error) {
      console.error('Failed to delete admin:', error);
      showNotification('Failed to delete admin', 'error');
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    try {
      setDeleting(productId);
      await api.delete(`/super-admin/products/${productId}`);
      setProducts(products.filter(p => p._id !== productId));
      showNotification(`Product "${productName}" deleted successfully`, 'success');
      fetchData();
    } catch (error) {
      console.error('Failed to delete product:', error);
      showNotification('Failed to delete product', 'error');
    } finally {
      setDeleting(null);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter data based on search
  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAdmins = admins.filter(a => 
    a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.storeName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Notification Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-20 right-4 z-50"
            >
              <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg ${
                notification.type === 'success' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}>
                {notification.type === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="font-medium">{notification.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
                <p className="text-gray-600 text-sm mt-1">Manage all users and administrators</p>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
              </div>
              <Users className="w-12 h-12 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Sellers</p>
                <p className="text-3xl font-bold text-gray-900">
                  {admins.filter(a => a.role === 'seller').length}
                </p>
              </div>
              <Store className="w-12 h-12 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Accounts</p>
                <p className="text-3xl font-bold text-gray-900">
                  {users.length + admins.length}
                </p>
              </div>
              <ShieldCheck className="w-12 h-12 text-purple-500" />
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'users'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Users ({filteredUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('admins')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'admins'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Store className="w-4 h-4 inline mr-2" />
              Admins/Sellers ({filteredAdmins.length})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'products'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Products ({filteredProducts.length})
            </button>
          </div>

          {/* Users Table */}
          {activeTab === 'users' && (
            <div className="p-6">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {searchQuery ? 'No users found matching your search' : 'No users found'}
                  </p>
                </div>
              ) : (
                <div className="w-full overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Age</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Gender</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <motion.tr
                          key={user._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4 text-sm text-gray-900">{user.name}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{user.age}</td>
                          <td className="py-3 px-4 text-sm text-gray-600 capitalize">{user.gender}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete user "${user.name}"?`)) {
                                  handleDeleteUser(user._id, user.name);
                                }
                              }}
                              disabled={deleting === user._id}
                              className="text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors p-2 hover:bg-red-50 rounded"
                              title="Delete user"
                            >
                              {deleting === user._id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Admins Table */}
          {activeTab === 'admins' && (
            <div className="p-6">
              {filteredAdmins.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {searchQuery ? 'No admins/sellers found matching your search' : 'No admins/sellers found'}
                  </p>
                </div>
              ) : (
                <div className="w-full overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Store Name</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAdmins.map((admin) => (
                        <motion.tr
                          key={admin._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4 text-sm text-gray-900">{admin.name}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{admin.email}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              admin.role === 'seller' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {admin.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{admin.storeName}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{admin.category}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete ${admin.role} "${admin.name}"?`)) {
                                  handleDeleteAdmin(admin._id, admin.name);
                                }
                              }}
                              disabled={deleting === admin._id}
                              className="text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors p-2 hover:bg-red-50 rounded"
                              title="Delete admin/seller"
                            >
                              {deleting === admin._id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

          {/* Products Table */}
          {activeTab === 'products' && (
            <div className="p-6">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {searchQuery ? 'No products found matching your search' : 'No products found'}
                  </p>
                </div>
              ) : (
                <div className="w-full overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Image</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Price</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Stock</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Seller</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <motion.tr
                          key={product._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <img
                              src={product.imageUrl || '/placeholder.png'}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/50?text=No+Image';
                              }}
                            />
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900 font-medium">{product.name}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{product.category}</td>
                          <td className="py-3 px-4 text-sm text-gray-900 font-semibold">Rs. {product.price}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              product.stock > 0 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {product.stock > 0 ? `${product.stock} units` : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{product.sellerStoreName || 'N/A'}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete product "${product.name}"?`)) {
                                  handleDeleteProduct(product._id, product.name);
                                }
                              }}
                              disabled={deleting === product._id}
                              className="text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors p-2 hover:bg-red-50 rounded"
                              title="Delete product"
                            >
                              {deleting === product._id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
