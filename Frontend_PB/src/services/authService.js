export const loginUser = async (email, password) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  // Accept any email/password for testing
  const token = 'mock-jwt-token';
  const user = { name: email.split('@')[0], email, monthlyIncome: 125000 };
  localStorage.setItem('token', token);
  return { token, user };
};

export const registerUser = async (userData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const token = 'mock-jwt-token';
  const user = { name: userData.name, email: userData.email, monthlyIncome: userData.monthlyIncome };
  localStorage.setItem('token', token);
  return { token, user };
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};
