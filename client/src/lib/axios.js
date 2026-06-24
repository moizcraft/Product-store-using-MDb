import axios from "axios";

const api = axios.create({
  baseURL: "https://product-store-using-mdb-production.up.railway.app/",
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.url, error.message, error.response?.data);
    
    // Enhanced error handling
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error - Backend may not be running or CORS issue');
    }
    
    if (error.response?.status === 401) {
      console.error('Unauthorized - Token may be expired');
    }
    
    return Promise.reject(error);
  }
);

export default api;
