import api from './api';

// GET DASHBOARD (single source of truth)
export const getDashboard = async () => {
  return await api.get('/dashboard');
};