// src/pages/ReservedExpenses/ReservedPage.jsx
// Issue 6: Remove "Upcoming" summary card. Keep only "This Month" and "Paid This Month".
// When paying: remove from This Month count, add to Paid This Month count.
import React, { useState, useEffect } from 'react';
import { getReservedList, markReservedPaid, deleteReserved } from '../../services/reservedService';
import ReservedList from './ReservedList';
import AddReservedForm from './AddReservedForm';
import Card from '../../components/Card';
import { formatCurrency } from '../../utils/dateFormatter';
import { Lock, CheckCircle2 } from 'lucide-react';

const ReservedPage = () => {
  const [reserved, setReserved] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const data = await getReservedList();
      setReserved(Array.isArray(data) ? data : []);
    };
    fetch();
  }, [refresh]);

  const handlePay = async (id) => {
    await markReservedPaid(id);
    setRefresh(prev => prev + 1);
  };

  const handleDelete = async (id) => {
    await deleteReserved(id);
    setRefresh(prev => prev + 1);
  };

  // This Month = PENDING (not yet paid, due this month)
  const currentMonthTotal = reserved
    .filter(r => r.status === 'PENDING')
    .reduce((s, r) => s + (r.amount || 0), 0);

  const currentMonthCount = reserved.filter(r => r.status === 'PENDING').length;

  // Paid This Month = PAID with paidDate in current month
  const now = new Date();
  const paidThisMonthTotal = reserved
    .filter(r => {
      if (r.status !== 'PAID' || !r.paidDate) return false;
      const pd = new Date(r.paidDate);
      return pd.getMonth() === now.getMonth() && pd.getFullYear() === now.getFullYear();
    })
    .reduce((s, r) => s + (r.amount || 0), 0);

  const paidThisMonthCount = reserved.filter(r => {
    if (r.status !== 'PAID' || !r.paidDate) return false;
    const pd = new Date(r.paidDate);
    return pd.getMonth() === now.getMonth() && pd.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-6">

      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Reserved Expenses</h1>
        <AddReservedForm onSuccess={() => setRefresh(prev => prev + 1)} />
      </div>

      {/* 2-card summary: This Month + Paid This Month */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <Lock size={14} className="text-amber-500" />
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Reserved This Month</p>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{formatCurrency(currentMonthTotal)}</p>
          <p className="mt-0.5 text-xs text-slate-400">
            {currentMonthCount} pending · deducted from spendable balance
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Paid This Month</p>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{formatCurrency(paidThisMonthTotal)}</p>
          <p className="mt-0.5 text-xs text-slate-400">
            {paidThisMonthCount} paid · moved to expense transactions
          </p>
        </div>
      </div>

      <Card>
        <ReservedList reserved={reserved} onPay={handlePay} onDelete={handleDelete} />
      </Card>
    </div>
  );
};

export default ReservedPage;