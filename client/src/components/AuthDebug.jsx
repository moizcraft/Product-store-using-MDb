import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';

export default function AuthDebug() {
  const { user } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      console.log('=== AUTH DEBUG ===');
      console.log('Current User:', user);
      console.log('Cookies:', document.cookie);
      
      try {
        const response = await api.get('/auth/profile');
        console.log('Profile API Response:', response.data);
      } catch (error) {
        console.error('Profile API Error:', error.response?.data || error.message);
      }
    };

    if (user) {
      checkAuth();
    }
  }, [user]);

  return null;
}
