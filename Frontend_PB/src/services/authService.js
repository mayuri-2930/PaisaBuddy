// export const loginUser = async (email, password) => {
//   await new Promise(resolve => setTimeout(resolve, 500));
//   // Accept any email/password for testing
//   const token = 'mock-jwt-token';
//   const user = { name: email.split('@')[0], email, monthlyIncome: 125000 };
//   localStorage.setItem('token', token);
//   return { token, user };
// };

// export const registerUser = async (userData) => {
//   await new Promise(resolve => setTimeout(resolve, 500));
//   const token = 'mock-jwt-token';
//   const user = { name: userData.name, email: userData.email, monthlyIncome: userData.monthlyIncome };
//   localStorage.setItem('token', token);
//   return { token, user };
// };

// export const logoutUser = () => {
//   localStorage.removeItem('token');
// };
import api from './api';

const getStoredUser = () => {
  const storedUser = localStorage.getItem('user');

  if (!storedUser || storedUser === 'undefined') {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

// ========================
// LOGIN
// ========================
export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', {
    email,
    password,
  });

  const token = response?.token;
  const user = response?.user || getStoredUser() || { email };

  localStorage.setItem('token', token);

  return { token, user };
};

// ========================
// REGISTER
// ========================
export const registerUser = async (userData) => {
  const user = await api.post('/auth/register', userData);
  const loginResponse = await api.post('/auth/login', {
    email: userData.email,
    password: userData.password,
  });
  const token = loginResponse?.token;

  localStorage.setItem('token', token);

  return { token, user };
};

// ========================
// LOGOUT
// ========================
export const logoutUser = () => {
  localStorage.removeItem('token');
};
