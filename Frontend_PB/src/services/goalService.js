import api from './api';

export const getGoals = async () => {
  return await api.get('/goals');
};

export const createGoal = async (goal) => {
  return await api.post('/goals', goal);
};

export const contributeToGoal = async (goalId, amount) => {
  return await api.post(`/goals/${goalId}/contribute`, { amount });
};
