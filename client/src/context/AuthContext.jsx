import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/axios';

const AuthContext = createContext(null);

// Helper function to get redirect path based on role
const getRedirectPathByRole = (role) => {
  switch (role) {
    case 'admin':
    case 'super-admin':
      return '/dashboard';
    case 'seller':
    case 'buyer':
    case 'customer':
    case 'user':
    default:
      return '/'; // Redirect to home page for all users after signup
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage or fetch current user via cookie token
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          if (!mounted) return;
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setLoading(false);
          return;
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }

      // If no stored user, attempt to fetch current user via cookie (httpOnly token)
      try {
        const res = await (await import('../lib/axios')).default.get('/auth/me');
        if (!mounted) return;
        if (res.data && res.data.success && res.data.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        // ignore, user will remain null
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    return () => { mounted = false; };
  }, []);

  // Save to localStorage whenever user or token changes
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else if (user && !token) {
      // If we have a user (from /auth/me via cookie) but no token string, still persist user
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [user, token]);

  const handleAuthSuccess = (authData) => {
    const { token: jwtToken, user: userData } = authData;

    setToken(jwtToken);
    setUser(userData);

    // Return redirect path so components can navigate
    return getRedirectPathByRole(userData.role);
  };

  const login = async (loginData) => {
    const { token: jwtToken, user: userData } = loginData;
    return handleAuthSuccess({ token: jwtToken, user: userData });
  };

  const signup = async (signupData) => {
    // After signup, if backend returns user data, set it
    // Token will be set after auto-login
    if (signupData.user) {
      setUser(signupData.user);
    }
    return signupData.user;
  };

  const logout = () => {
    // Call backend logout to clear cookie if present, then clear local state
    api.post('/auth/logout').catch((err) => {
      console.warn('Logout request failed', err);
    }).finally(() => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    });
  };

  const updateRole = (role) => {
    setUser((u) => (u ? { ...u, role } : u));
  };

  const value = {
    user,
    token,
    loading,
    // Consider user presence (or cookie) as authenticated for UI purposes
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateRole,
    handleAuthSuccess,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
