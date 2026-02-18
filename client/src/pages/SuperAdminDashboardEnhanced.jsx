import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, Users, ShieldCheck, Store, AlertCircle, Edit2, 
  Package, X, Save, Plus 
} from 'lucide-react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SuperAdminDashboardEnhanced() {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [editingUser, setEditingUser] = useState(null);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      setDeleting(userId);
      await api.delete(`/super-admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      fetchData();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user');
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm('Are you sure you want to delete this admin/seller?')) return;

    try {
      setDeleting(adminId);
      await api.delete(`/super-admin/admins/${adminId}`);
      setAdmins(admins.filter(a => a._id !== adminId));
      fetchData();
    } catch (error) {
      console.error('Failed to delete admin:', error);
      alert('Failed to delete admin');
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setDeleting(productId);
      await api.delete(`/super-admin/products/${productId}`);
      setProducts(products.filter(p => p._id !== productId));
      fetchData();
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  const handleUpdateUser = async (userId, data) => {
    try {
      const res = await api.put(`/super-admin/users/${userId}`, data);
      setUsers(users.map(u => u._id === userId ? res.data.user : u));
      setEditingUser(null);
      alert('User updated successfully');
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user');
    }
  };

  const handleUpdateAdmin = async (adminId, data) => {
    try {
      const res = await api.put(`/super-admin/admins/${adminId}`, data);
      setAdmins(admins.map(a => a._id === adminId ? res.data.admin : a));
      setEditingAdmin(null);
      alert('Admin updated successfully');
    } catch (error) {
      console.error('Failed to update admin:', error);
      alert('Failed to update admin');
    }
  };

  const handleUpdateProduct = async (productId, data) => {
    try {
      const res = await api.put(`/super-admin/products/${productId}`, data);
      setProducts(products.map(p => p._id === productId ? res.data.product : p));
      setEditingProduct(null);
      alert('Product updated successfully');
    } catch (error) {
      console.error('Failed to update product:', error);
      alert('Failed to update product');
    }
  };

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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Manage users, admins, and products</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard icon={Users} label="Total Users" value={users.length} color="blue" />
          <StatsCard icon={Store} label="Total Sellers" value={admins.filter(a => a.role === 'seller').length} color="green" />
          <StatsCard icon={Package} label="Total Products" value={products.length} color="purple" />
          <StatsCard icon={ShieldCheck} label="Total Accounts" value={users.length + admins.length} color="indigo" />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <TabButton 
              active={activeTab === 'users'} 
              onClick={() => setActiveTab('users')}
              icon={Users}
              label="Users"
              count={users.length}
            />
            <TabButton 
              active={activeTab === 'admins'} 
              onClick={() => setActiveTab('admins')}
              icon={Store}
              label="Admins/Sellers"
              count={admins.length}
            />
            <TabButton 
              active={activeTab === 'products'} 
              onClick={() => setActiveTab('products')}
              icon={Package}
              label="Products"
              count={products.length}
            />
          </div>

          {/* Users Tab */}
          {activeTab === 'users' && (
            <UsersTable 
              users={users}
              deleting={deleting}
              editingUser={editingUser}
              setEditingUser={setEditingUser}
              onDelete={handleDeleteUser}
              onUpdate={handleUpdateUser}
            />
          )}

          {/* Admins Tab */}
          {activeTab === 'admins' && (
            <AdminsTable 
              admins={admins}
              deleting={deleting}
              editingAdmin={editingAdmin}
              setEditingAdmin={setEditingAdmin}
              onDelete={handleDeleteAdmin}
              onUpdate={handleUpdateAdmin}
            />
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <ProductsTable 
              products={products}
              deleting={deleting}
              editingProduct={editingProduct}
              setEditingProduct={setEditingProduct}
              onDelete={handleDeleteProduct}
              onUpdate={handleUpdateProduct}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    indigo: 'text-indigo-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <Icon className={`w-12 h-12 ${colors[color]}`} />
      </div>
    </motion.div>
  );
}

// Tab Button Component
function TabButton({ active, onClick, icon: Icon, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
        active
          ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Icon className="w-4 h-4 inline mr-2" />
      {label} ({count})
    </button>
  );
}

// Users Table Component
function UsersTable({ users, deleting, editingUser, setEditingUser, onDelete, onUpdate }) {
  const [formData, setFormData] = useState({});

  const startEdit = (user) => {
    setEditingUser(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      role: user.role
    });
  };

  const saveEdit = () => {
    onUpdate(editingUser, formData);
  };

  if (users.length === 0) {
    return <EmptyState message="No users found" />;
  }

  return (
    <div className="p-6 w-full">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Age</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Gender</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
              {editingUser === user._id ? (
                <>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="border rounded px-2 py-1 text-sm w-full"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="border rounded px-2 py-1 text-sm w-full"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="border rounded px-2 py-1 text-sm w-full"
                    >
                      <option value="customer">Customer</option>
                      <option value="user">User</option>
                      <option value="buyer">Buyer</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      className="border rounded px-2 py-1 text-sm w-20"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      className="border rounded px-2 py-1 text-sm w-full"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={saveEdit} className="text-green-600 hover:text-green-800 mr-2">
                      <Save className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingUser(null)} className="text-gray-600 hover:text-gray-800">
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </>
              ) : (
                <>
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
                      onClick={() => startEdit(user)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(user._id)}
                      disabled={deleting === user._id}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Admins Table Component (similar structure)
function AdminsTable({ admins, deleting, editingAdmin, setEditingAdmin, onDelete, onUpdate }) {
  const [formData, setFormData] = useState({});

  const startEdit = (admin) => {
    setEditingAdmin(admin._id);
    setFormData({
      name: admin.name,
      email: admin.email,
      age: admin.age,
      gender: admin.gender,
      storeName: admin.storeName,
      category: admin.category,
      role: admin.role
    });
  };

  const saveEdit = () => {
    onUpdate(editingAdmin, formData);
  };

  if (admins.length === 0) {
    return <EmptyState message="No admins/sellers found" />;
  }

  return (
    <div className="p-6 w-full">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Store</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin._id} className="border-b border-gray-100 hover:bg-gray-50">
              {editingAdmin === admin._id ? (
                <>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="border rounded px-2 py-1 text-sm w-full"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="border rounded px-2 py-1 text-sm w-full"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="border rounded px-2 py-1 text-sm w-full"
                    >
                      <option value="seller">Seller</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={formData.storeName}
                      onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                      className="border rounded px-2 py-1 text-sm w-full"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="border rounded px-2 py-1 text-sm w-full"
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={saveEdit} className="text-green-600 hover:text-green-800 mr-2">
                      <Save className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingAdmin(null)} className="text-gray-600 hover:text-gray-800">
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </>
              ) : (
                <>
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
                      onClick={() => startEdit(admin)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(admin._id)}
                      disabled={deleting === admin._id}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Products Table Component
function ProductsTable({ products, deleting, editingProduct, setEditingProduct, onDelete, onUpdate }) {
  const [formData, setFormData] = useState({});

  const startEdit = (product) => {
    setEditingProduct(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      imageUrl: product.imageUrl
    });
  };

  const saveEdit = () => {
    onUpdate(editingProduct, formData);
  };

  if (products.length === 0) {
    return <EmptyState message="No products found" />;
  }

  return (
    <div className="p-6 w-full">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Image</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Price</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Stock</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Seller</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
              {editingProduct === product._id ? (
                <>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                      placeholder="Image URL"
                      className="border rounded px-2 py-1 text-sm w-full"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="border rounded px-2 py-1 text-sm w-full"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="border rounded px-2 py-1 text-sm w-20"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="border rounded px-2 py-1 text-sm w-full"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      className="border rounded px-2 py-1 text-sm w-20"
                    />
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {product.sellerId?.storeName || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={saveEdit} className="text-green-600 hover:text-green-800 mr-2">
                      <Save className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingProduct(null)} className="text-gray-600 hover:text-gray-800">
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="py-3 px-4">
                    <img 
                      src={product.imageUrl || '/placeholder.png'} 
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{product.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 font-semibold">
                    ${product.price}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{product.category}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{product.stock}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {product.sellerId?.storeName || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => startEdit(product)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product._id)}
                      disabled={deleting === product._id}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Empty State Component
function EmptyState({ message }) {
  return (
    <div className="text-center py-12">
      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
