import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Support single role or array of roles
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const isSuperAdminRoute = roles.includes('super-admin');
    
    // Super admin can access admin routes too
    if (isSuperAdminRoute) {
      if (user?.role !== 'super-admin' && !roles.includes(user?.role)) {
        return <Navigate to="/products" replace />;
      }
    } else if (!roles.includes(user?.role)) {
      return <Navigate to="/products" replace />;
    }
  }

  return children;
}
