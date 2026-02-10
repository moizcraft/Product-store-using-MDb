import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';

export default function TestAddProduct() {
  const { user } = useAuth();
  const [result, setResult] = useState(null);

  const testAuth = async () => {
    try {
      console.log('Testing authentication...');
      console.log('Current user:', user);
      console.log('Cookies:', document.cookie);
      
      const response = await api.get('/auth/profile');
      setResult({ success: true, data: response.data });
      console.log('Auth test successful:', response.data);
    } catch (error) {
      setResult({ success: false, error: error.response?.data || error.message });
      console.error('Auth test failed:', error);
    }
  };

  const testAddProduct = async () => {
    try {
      console.log('Testing add product...');
      const testProduct = {
        name: 'Test Product Name',
        description: 'This is a test product description with more than 20 characters',
        price: 99.99,
        category: 'Electronics',
        stock: 10,
        imageUrl: 'https://via.placeholder.com/300',
        inStock: true
      };
      
      console.log('Sending product data:', testProduct);
      const response = await api.post('/products/addProduct', testProduct);
      setResult({ success: true, data: response.data });
      console.log('Product added successfully:', response.data);
    } catch (error) {
      setResult({ success: false, error: error.response?.data || error.message });
      console.error('Add product failed:', error.response?.data || error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Debug Add Product</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded">
            <h2 className="font-semibold mb-2">Current User:</h2>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>

          <div className="flex gap-4">
            <button
              onClick={testAuth}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test Authentication
            </button>
            
            <button
              onClick={testAddProduct}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Test Add Product
            </button>
          </div>

          {result && (
            <div className={`p-4 rounded ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
              <h2 className="font-semibold mb-2">
                {result.success ? 'Success ✓' : 'Error ✗'}
              </h2>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
