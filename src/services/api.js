import axios from 'axios';

// Bypass ngrok browser warning for free URLs
axios.defaults.headers.common['ngrok-skip-browser-warning'] = '69420';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '69420',
    // Add other common headers as needed
    // 'Accept': 'application/json',
  },
});

// Request Interceptor: Add Authorization header and ngrok bypass
api.interceptors.request.use(
  (config) => {
    // Add ngrok bypass as a query parameter (safer for CORS)
    const separator = config.url.includes('?') ? '&' : '?';
    config.url = `${config.url}${separator}ngrok-skip-browser-warning=69420`;

    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout on 401
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_data');
      
      // Optional: Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
