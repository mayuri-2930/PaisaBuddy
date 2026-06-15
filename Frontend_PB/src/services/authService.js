// src/services/authService.js
import api from './api';

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem('user');
    return stored && stored !== 'undefined' ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

export const loginUser = async (email, password) => {
  // Clear any stale token before logging in
  localStorage.removeItem('token');

  const response = await api.post('/auth/login', { email, password });
  const token = response?.token;
  localStorage.setItem('token', token);

  const stored = getStoredUser();
  const user = (stored?.email === email) ? stored : { email };

  return { token, user };
};

export const registerUser = async (userData) => {
  localStorage.removeItem('token');

  const user = await api.post('/auth/register', userData);

  const loginResponse = await api.post('/auth/login', {
    email: userData.email,
    password: userData.password,
  });
  const token = loginResponse?.token;
  localStorage.setItem('token', token);

  return { token, user };
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};