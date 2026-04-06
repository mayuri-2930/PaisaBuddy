// src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getTransactions } from '../../services/transactionService';
import { getReservedList } from '../../services/reservedService';
import DashboardHeader from './DashboardHeader';
import SummaryCards from './SummaryCards';
import RecentTransactions from './RecentTransactions';
import Card from '../../components/Card';
import AddTransactionForm from '../Transactions/AddTransactionForm';
import LoadingSkeleton from '../../components/LoadingSkeleton';

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [reserved, setReserved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txns, reservedData] = await Promise.all([getTransactions(), getReservedList()]);
        setTransactions(txns || []);
        setReserved(reservedData || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load data. Make sure the backend is running on http://localhost:8080');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refresh]);

  if (loading) return <LoadingSkeleton type="transaction" count={5} />;
  if (error) return <div className="text-center text-red-500 p-10 bg-white rounded-xl shadow">{error}</div>;

  const totalExpenses = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
  const monthlyIncome = user?.monthlyIncome || 125000;
  const remaining = monthlyIncome - totalExpenses;

  const categoryTotals = transactions.reduce((acc, t) => {
    if (t.type === 'EXPENSE') {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
    }
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <DashboardHeader userName={user?.name} remaining={remaining} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Quick Log</h3>
            <AddTransactionForm onSuccess={() => setRefresh(prev => prev + 1)} compact />
          </Card>
          <RecentTransactions transactions={transactions.slice(0, 5)} />
        </div>
        
        <div className="space-y-6">
          <SummaryCards categoryTotals={categoryTotals} totalExpenses={totalExpenses} />
          <Card>
            <h3 className="font-semibold text-gray-800 mb-3">Reserved Snapshot</h3>
            <div className="space-y-2">
              {reserved.slice(0, 3).map(r => (
                <div key={r.id} className="flex justify-between text-sm border-b border-gray-100 py-2">
                  <span>{r.title}</span>
                  <span className="font-medium">₹{r.amount}</span>
                </div>
              ))}
              {reserved.length === 0 && <p className="text-gray-400 text-sm">No reserved expenses</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;