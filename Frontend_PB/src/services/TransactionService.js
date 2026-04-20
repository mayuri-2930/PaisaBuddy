import api from './api';

export const getTransactions = async () => {
  return await api.get('/transaction');
};

export const addTransaction = async (transaction) => {
  return await api.post('/transaction', transaction);
};
