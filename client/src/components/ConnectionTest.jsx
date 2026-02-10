import React, { useState } from 'react';
import api from '../lib/axios';

export default function ConnectionTest() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult('');
    
    try {
      // Test health endpoint
      const healthRes = await api.get('/health');
      console.log('Health check:', healthRes.data);
      
      // Test signup endpoint
      const signupRes = await api.post('/auth/signup', {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'Test123!',
        age: 25,
        gender: 'male',
        role: 'user'
      });
      console.log('Signup test:', signupRes.data);
      
      setResult('✅ All tests passed! Check console for details.');
    } catch (error) {
      console.error('Connection test failed:', error);
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Backend Connection Test</h2>
      <button
        onClick={testConnection}
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>
      {result && (
        <div className="mt-4 p-4 border rounded">
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
      <div className="mt-4 text-sm text-gray-600">
        <p>Open browser console (F12) to see detailed logs.</p>
        <p>Make sure backend is running on http://localhost:5000</p>
      </div>
    </div>
  );
}
