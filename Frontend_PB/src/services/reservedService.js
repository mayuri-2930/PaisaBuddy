import api from './api';

export const getReservedList = async () => {
  return await api.get('/reserved');
};

export const addReserved = async (reserved) => {
  return await api.post('/reserved', reserved);
};

export const markReservedPaid = async (id) => {
  return await api.put(`/reserved/${id}/pay`);
};

export const deleteReserved = async (id) => {
  return await api.delete(`/reserved/${id}`);
};