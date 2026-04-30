import axios from 'axios';

const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// ========================
// Axios Instance
// ========================
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========================
// Attach JWT Token
// ========================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ========================
// Response Handler
// ========================
api.interceptors.response.use(
  (response) => response.data, // IMPORTANT: return only data
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message;

    if (status === 401 || status === 403) {
      clearSession();

      if (
        typeof window !== 'undefined' &&
        !['/login', '/register'].includes(window.location.pathname)
      ) {
        window.location.replace('/login');
      }
    }

    console.error('API ERROR:', message);

    return Promise.reject(error);
  }
);

export default api;
