// src/pages/Dashboard/Dashboard.jsx
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

import AddTransactionForm from '../Transactions/AddTransactionForm';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { Lock } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/dateFormatter';

const STATUS_STYLES = {
  PAID:      'text-emerald-600 dark:text-teal-400',
  UPCOMING:  'text-indigo-400',
  OVERDUE:   'text-red-500',
  DUE_TODAY: 'text-amber-500',
  PENDING:   'text-slate-400',
};

function getDerivedStatus(r) {
  if (r.status === 'PAID')     return 'PAID';
  if (r.status === 'UPCOMING') return 'UPCOMING';
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const due   = new Date(r.dueDate); due.setHours(0, 0, 0, 0);
  const diff  = Math.floor((due - today) / 86400000);
  if (diff < 0)   return 'OVERDUE';
  if (diff === 0) return 'DUE_TODAY';
  return 'PENDING';
}

function isCurrentMonth(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

const Dashboard = () => {
  const { user } = useAuth();

  const [dashboard, setDashboard]       = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [reserved, setReserved]         = useState([]);
  const [goals, setGoals]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [refresh, setRefresh]           = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [dash, txns, reservedData, goalData] = await Promise.allSettled([
          getDashboard(), getTransactions(), getReservedList(), getGoals()
        ]);

        if (dash.status !== 'fulfilled') throw dash.reason;

        setDashboard(dash.value);
        setTransactions(txns.status === 'fulfilled' && Array.isArray(txns.value) ? txns.value : []);
        setReserved(reservedData.status === 'fulfilled' && Array.isArray(reservedData.value) ? reservedData.value : []);
        setGoals(goalData.status === 'fulfilled' && Array.isArray(goalData.value) ? goalData.value : []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err?.response?.status === 401 || err?.response?.status === 403
          ? 'Your session expired. Please log in again.'
          : 'We could not load the dashboard right now.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refresh]);

  if (loading) return <LoadingSkeleton type="transaction" count={5} />;
  if (error)   return <div className="p-10 text-center text-red-500 bg-white rounded-xl shadow">{error}</div>;

  const displayName    = user?.name || user?.email?.split('@')[0] || 'User';
  const spendableBalance = Math.max(Number(dashboard?.spendable || 0), 0);

  // Reserved snapshot: PENDING items due this month only
  const currentMonthReserved = reserved.filter(
    r => r.status === 'PENDING' && isCurrentMonth(r.dueDate)
  );
  const upcomingReserved = reserved.filter(r => r.status === 'UPCOMING');
  const previewItems     = [...currentMonthReserved, ...upcomingReserved].slice(0, 4);

  return (
    <div className="space-y-6 px-1">

      <DashboardHeader userName={displayName} remaining={spendableBalance} />

      <SummaryCards
        totalSpent={dashboard?.totalSpent || 0}
        totalReserved={dashboard?.totalReserved || 0}
        totalGoalSavings={dashboard?.goalSaved || 0}
        spendableBalance={spendableBalance}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="space-y-4">
          <GoalProgressCard goals={goals} totalSavedAcrossGoals={dashboard?.goalSaved || 0} />

          {/* Reserved snapshot — this month only */}
          <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Lock size={14} className="text-slate-400" />
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Reserved This Month</p>
            </div>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-0.5">
              {formatCurrency(dashboard?.totalReserved || 0)}
            </p>
            <p className="text-xs text-slate-400 mb-4">
              Deducted from your spendable balance.
              {upcomingReserved.length > 0 && (
                <span className="ml-1 text-indigo-400">
                  +{formatCurrency(upcomingReserved.reduce((s, r) => s + r.amount, 0))} upcoming.
                </span>
              )}
            </p>

            <div className="space-y-0">
              {previewItems.map(r => {
                const derived = getDerivedStatus(r);
                return (
                  <div key={r.id} className="flex items-center justify-between py-2.5 text-sm border-b border-slate-100 dark:border-slate-700 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-700 dark:text-slate-200 truncate font-medium">{r.title}</p>
                      <p className="text-xs text-slate-400">
                        {r.status === 'PAID' && r.paidDate
                          ? `Paid ${formatDate(r.paidDate)}`
                          : r.dueDate ? `Due ${formatDate(r.dueDate)}` : ''}
                      </p>
                    </div>
                    <div className="ml-3 text-right shrink-0">
                      <p className="font-semibold text-slate-800 dark:text-slate-100">{formatCurrency(r.amount)}</p>
                      <p className={`text-xs font-medium ${STATUS_STYLES[derived] || 'text-slate-400'}`}>
                        {derived === 'PAID'      && 'Paid'}
                        {derived === 'UPCOMING'  && 'Upcoming'}
                        {derived === 'OVERDUE'   && 'Overdue'}
                        {derived === 'DUE_TODAY' && 'Due Today'}
                        {derived === 'PENDING'   && 'Pending'}
                      </p>
                    </div>
                  </div>
                );
              })}
              {previewItems.length === 0 && (
                <p className="text-xs text-slate-400 py-2">No reserved expenses this month.</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Log — same logic as TransactionPage, spendable enforced */}
          <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 shadow-sm">
            <h3 className="mb-3 text-base font-semibold text-slate-800 dark:text-slate-100">Quick Log</h3>
            <AddTransactionForm
              onSuccess={() => setRefresh(prev => prev + 1)}
              compact
              spendableBalance={spendableBalance}
            />
          </div>

          <RecentTransactions transactions={transactions.slice(0, 5)} reserved={reserved} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;