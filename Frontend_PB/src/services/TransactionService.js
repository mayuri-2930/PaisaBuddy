import { mockTransactions } from './mockApi';

export const getTransactions = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockTransactions;
};

export const addTransaction = async (transaction) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newTransaction = { id: Date.now(), ...transaction };
  mockTransactions.unshift(newTransaction);
  return newTransaction;
};
