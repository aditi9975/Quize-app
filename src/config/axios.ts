import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Match your server port
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // Increase timeout to 30 seconds
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error);
      if (error.code === 'ECONNABORTED') {
        return Promise.reject(new Error('Request timeout. The server is taking too long to respond. Please try again.'));
      }
      return Promise.reject(new Error('Network error. Please check your connection and try again.'));
    }

    // Handle specific error cases
    if (error.response.status === 401) {
      // Clear token and user data
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      
      // Redirect to login page if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      return Promise.reject(new Error('Session expired. Please log in again.'));
    }

    // Handle validation errors
    if (error.response.status === 400) {
      const message = error.response.data?.message || 'Invalid request';
      return Promise.reject(new Error(message));
    }

    // Handle server errors
    if (error.response.status >= 500) {
      return Promise.reject(new Error('Server error. Please try again later.'));
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

export default api; 