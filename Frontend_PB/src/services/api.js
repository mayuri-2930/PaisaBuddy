import axios from 'axios';

const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

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
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message;

    console.error('API ERROR:', message);

    return Promise.reject(error);
  }
);

export default api;