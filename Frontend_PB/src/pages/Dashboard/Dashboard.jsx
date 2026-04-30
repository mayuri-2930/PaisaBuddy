import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

import { getDashboard } from '../../services/dashboardService';
import { getTransactions } from '../../services/transactionService';
import { getReservedList } from '../../services/reservedService';
import { getGoals } from '../../services/goalService';

import DashboardHeader from './DashboardHeader';
import SummaryCards from './SummaryCards';
import RecentTransactions from './RecentTransactions';
import GoalProgressCard from './GoalProgressCard';

import Card from '../../components/Card';
import AddTransactionForm from '../Transactions/AddTransactionForm';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { Lock } from 'lucide-react';
import { formatCurrency } from '../../utils/dateFormatter';

const Dashboard = () => {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);

  const [transactions, setTransactions] = useState([]);
  const [reserved, setReserved] = useState([]);
  const [goals, setGoals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [dash, txns, reservedData, goalData] = await Promise.allSettled([
          getDashboard(),
          getTransactions(),
          getReservedList(),
          getGoals()
        ]);

        if (dash.status !== 'fulfilled') {
          throw dash.reason;
        }

        setDashboard(dash.value);
        setTransactions(txns.status === 'fulfilled' && Array.isArray(txns.value) ? txns.value : []);
        setReserved(
          reservedData.status === 'fulfilled' && Array.isArray(reservedData.value)
            ? reservedData.value
            : []
        );
        setGoals(goalData.status === 'fulfilled' && Array.isArray(goalData.value) ? goalData.value : []);

        setError(null);
      } catch (err) {
        console.error(err);
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          setError('Your session expired. Please log in again.');
        } else {
          setError('We could not load the dashboard right now.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh]);

  if (loading) return <LoadingSkeleton type="transaction" count={5} />;

  if (error) {
    return (
      <div className="p-10 text-center text-red-500 bg-white rounded-xl shadow">
        {error}
      </div>
    );
  }

  const displayName =
    user?.name ||
    user?.email?.split('@')[0] ||
    'User';

  const totalReservedAmount = dashboard?.totalReserved || 0;

  return (
    <div className="space-y-6 px-1">

      {/* Header: greeting + avatar */}
      <DashboardHeader
        userName={displayName}
        remaining={dashboard?.spendable || 0}
      />

      {/* 3-column summary cards */}
      <SummaryCards
        totalSpent={dashboard?.totalSpent || 0}
        totalReserved={dashboard?.totalReserved || 0}
        totalGoalSavings={dashboard?.goalSaved || 0}
        spendableBalance={dashboard?.spendable || 0}
      />

      {/* Main grid: left sidebar (goal + reserved) | right (quick log + transactions) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT: Goal Progress + Reserved Snapshot */}
        <div className="space-y-4">

          <GoalProgressCard
            goals={goals}
            totalSavedAcrossGoals={dashboard?.goalSaved || 0}
          />

          {/* Reserved Snapshot */}
          <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Lock size={14} className="text-slate-400" />
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Total Reserved
              </p>
            </div>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">
              {formatCurrency(totalReservedAmount)}
            </p>
            <p className="text-xs text-slate-400 mb-4">
              Reserved for upcoming bills and recurring commitments.
            </p>

            <div className="space-y-2">
              {(reserved || []).slice(0, 3).map(r => (
                <div key={r.id} className="flex justify-between py-2 text-sm border-b border-slate-100 dark:border-slate-700 last:border-0">
                  <span className="text-slate-600 dark:text-slate-300">{r.title}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    {formatCurrency(r.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT: Quick Log + Recent Transactions */}
        <div className="lg:col-span-2 space-y-6">

          <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 shadow-sm">
            <h3 className="mb-3 text-base font-semibold text-slate-800 dark:text-slate-100">
              Quick Log
            </h3>
            <AddTransactionForm
              onSuccess={() => setRefresh(prev => prev + 1)}
              compact
            />
          </div>

          <RecentTransactions
            transactions={transactions.slice(0, 5)}
          />

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
