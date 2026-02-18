import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, Search, LogOut, Shield, LayoutDashboard, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
    setIsProfileOpen(false);
  };

  const handleSearchClick = () => {
    setSearchOpen(!searchOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
      if (searchOpen && !event.target.closest('.search-container')) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen, searchOpen]);

  return (
    <header 
      className="fixed top-0 left-0 right-0 shadow-md z-[100] border-b border-gray-200 w-full"
      style={{ backgroundColor: '#fcfbf9' }}
    >
      <div className="container mx-auto px-4 py-3 relative z-10 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <h1 
            className="text-xl md:text-2xl font-bold font-display tracking-wider hidden sm:inline"
            style={{ color: '#6c1f2e' }}
          >
            VibeWear
          </h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-medium">
          <Link 
            to="/" 
            className="transition-colors hover:opacity-70"
            style={{ color: '#6366f1' }}
          >
            Home
          </Link>
          <Link 
            to="/products" 
            className="transition-colors hover:opacity-70"
            style={{ color: '#6366f1' }}
          >
            Shop
          </Link>
          <Link 
            to="/about" 
            className="transition-colors hover:opacity-70"
            style={{ color: '#6366f1' }}
          >
            About
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Search */}
          <div className="relative search-container">
            <button 
              className="p-2 rounded-lg transition-all hover:bg-gray-100"
              style={{ color: '#6366f1' }}
              onClick={handleSearchClick}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Search Dropdown */}
            {searchOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 p-3 z-50">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      autoFocus
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </form>
              </div>
            )}
          </div>

          <Link to="/cart">
            <button 
              className="p-2 rounded-lg transition-all hover:bg-gray-100 relative"
              style={{ color: '#6366f1' }}
            >
              <ShoppingCart className="w-5 h-5" />
              <span 
                className="absolute top-1 right-1 h-4 w-4 text-white text-[10px] flex items-center justify-center rounded-full font-bold"
                style={{ backgroundColor: '#f2b90f' }}
              >
                0
              </span>
            </button>
          </Link>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              {/* Seller Dashboard Button */}
              {user.role === 'seller' && (
                <Link to="/seller/dashboard">
                  <button 
                    className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all hover:bg-gray-100"
                    style={{ color: '#6366f1' }}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                </Link>
              )}

              {/* Admin Access Button */}
              {['admin', 'super-admin'].includes(user.role) && (
                <Link to="/dashboard">
                  <button 
                    className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all hover:bg-gray-100"
                    style={{ color: '#6366f1' }}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </button>
                </Link>
              )}

              {/* Profile Dropdown */}
              <div className="relative profile-dropdown">
                <button 
                  className="flex items-center gap-2 p-2 rounded-lg transition-all hover:bg-gray-100"
                  style={{ color: '#6366f1' }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                    {/* User Info Section */}
                    <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{user?.name || 'User'}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                          <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full mt-1">
                            {user?.role || 'user'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link 
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">My Profile</span>
                      </Link>
                      
                      <Link 
                        to="/orders"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <ShoppingCart className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">My Orders</span>
                      </Link>

                      <div className="border-t border-gray-100 my-2"></div>

                      <button 
                        className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors w-full text-left"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 text-red-600" />
                        <span className="text-red-600">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <button 
                  className="px-4 py-2 rounded-lg font-medium transition-all hover:bg-gray-100"
                  style={{ color: '#6366f1' }}
                >
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button 
                  className="px-4 py-2 rounded-lg font-medium text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}
                >
                  Sign Up
                </button>
              </Link>
            </div>
          )}

          <button 
            className="md:hidden p-2 rounded-lg transition-all hover:bg-gray-100"
            style={{ color: '#6366f1' }}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
