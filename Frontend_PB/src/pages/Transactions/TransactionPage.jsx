// src/pages/Transactions/TransactionPage.jsx
import React, { useState, useEffect } from 'react';
import { getTransactions } from '../../services/transactionService';
import TransactionList from './TransactionList';
import AddTransactionForm from './AddTransactionForm';
import Card from '../../components/Card';
import { Filter } from 'lucide-react';

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const data = await getTransactions();
      setTransactions(data || []);
    };
    fetch();
  }, [refresh]);

  const filtered = filterCategory ? transactions.filter(t => t.category === filterCategory) : transactions;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Transaction History</h1>
        <AddTransactionForm onSuccess={() => setRefresh(prev => prev + 1)} />
      </div>
      <Card>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
          <Filter size={18} className="text-gray-400" />
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-transparent text-sm font-medium outline-none">
            <option value="">All Categories</option>
            <option>Food</option><option>Rent</option><option>Travel</option><option>Leisure</option><option>Internet</option><option>Other</option>
          </select>
        </div>
        <TransactionList transactions={filtered} />
      </Card>
    </div>
  );
};

export default TransactionPage;