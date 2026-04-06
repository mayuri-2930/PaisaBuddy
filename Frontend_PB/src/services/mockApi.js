// Mock data for UI testing without backend
export const mockTransactions = [
  { id: 1, amount: 450, category: 'Food', description: 'Starbucks Latte', date: '2025-04-06', type: 'EXPENSE' },
  { id: 2, amount: 320, category: 'Travel', description: 'Uber Ride', date: '2025-04-05', type: 'EXPENSE' },
  { id: 3, amount: 85000, category: 'Income', description: 'Salary Credit', date: '2025-04-01', type: 'INCOME' },
  { id: 4, amount: 649, category: 'Leisure', description: 'Netflix Premium', date: '2025-04-01', type: 'EXPENSE' },
];

export const mockReserved = [
  { id: 1, title: 'Rent', amount: 22000, dueDate: '2025-04-10', status: 'PENDING' },
  { id: 2, title: 'Electricity', amount: 1850, dueDate: '2025-04-15', status: 'PENDING' },
  { id: 3, title: 'Groceries', amount: 5000, dueDate: '2025-04-08', status: 'PENDING' },
];
