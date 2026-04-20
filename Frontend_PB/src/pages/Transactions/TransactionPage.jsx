// src/pages/Transactions/TransactionPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getTransactions } from '../../services/transactionService';
import { getReservedList } from '../../services/reservedService';
import { getGoals } from '../../services/goalService';
import TransactionList from './TransactionList';
import AddTransactionForm from './AddTransactionForm';
import GoalPanel from './GoalPanel';
import SpendingInsights from './SpendingInsights';
import Card from '../../components/Card';
import { Filter } from 'lucide-react';

const TransactionPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [reserved, setReserved] = useState([]);
  const [goals, setGoals] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [refresh, setRefresh] = useState(0);

  const fetchData = async () => {
    const [transactionData, reservedData, goalData] = await Promise.all([
      getTransactions(),
      getReservedList(),
      getGoals(),
    ]);

    setTransactions(Array.isArray(transactionData) ? transactionData : []);
    setReserved(Array.isArray(reservedData) ? reservedData : []);
    setGoals(Array.isArray(goalData) ? goalData : []);
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  const filtered = filterCategory ? transactions.filter(t => t.category === filterCategory) : transactions;
  const monthlyIncome = Number(user?.monthlyIncome || 0);
  const totalSpent = transactions.reduce((sum, txn) => sum + (txn.amount || 0), 0);
  const totalReserved = reserved
    .filter((item) => item.status === 'PENDING')
    .reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalGoalSavings = goals.reduce((sum, goal) => sum + (goal.totalSaved || 0), 0);
  const spendableBalance = Math.max(monthlyIncome - totalSpent - totalReserved - totalGoalSavings, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Transaction History</h1>
        <AddTransactionForm onSuccess={() => setRefresh(prev => prev + 1)} />
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <Card>
          <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-2 dark:border-slate-800">
            <Filter size={18} className="text-slate-400 dark:text-slate-500" />
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-transparent text-sm font-medium text-slate-700 outline-none dark:text-slate-200">
              <option value="">All Categories</option>
              <option>Food</option><option>Rent</option><option>Travel</option><option>Leisure</option><option>Internet</option><option>Other</option>
            </select>
          </div>
          <TransactionList transactions={filtered} />
        </Card>
        <GoalPanel
          goals={goals}
          loading={false}
          spendableBalance={spendableBalance}
          onGoalsUpdated={fetchData}
        />
      </div>

      <SpendingInsights
        transactions={transactions}
        goals={goals}
        income={monthlyIncome}
        spendableBalance={spendableBalance}
        totalGoalSavings={totalGoalSavings}
      />
    </div>
  );
};

export default TransactionPage;
