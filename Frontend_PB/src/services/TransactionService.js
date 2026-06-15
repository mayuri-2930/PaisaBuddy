// src/services/transactionService.js
import api from './api';

export const getTransactions = async () => api.get('/transaction');

export const addTransaction  = async (transaction) => api.post('/transaction', transaction);

export const addCredit = async (credit) => api.post('/transaction/credit', credit);