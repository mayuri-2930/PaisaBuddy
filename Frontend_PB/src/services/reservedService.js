import { mockReserved } from './mockApi';

export const getReservedList = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...mockReserved];
};

export const addReserved = async (reserved) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newReserved = { id: Date.now(), ...reserved, status: 'PENDING' };
  mockReserved.push(newReserved);
  return newReserved;
};

export const markReservedPaid = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const item = mockReserved.find(r => r.id === id);
  if (item) item.status = 'PAID';
  return item;
};

export const deleteReserved = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockReserved.findIndex(r => r.id === id);
  if (index !== -1) mockReserved.splice(index, 1);
};
