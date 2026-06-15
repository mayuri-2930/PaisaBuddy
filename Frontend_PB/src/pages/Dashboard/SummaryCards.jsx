// src/pages/Dashboard/SummaryCards.jsx
import React from 'react';
import { formatCurrency } from '../../utils/dateFormatter';
import { CreditCard, PiggyBank, Lock } from 'lucide-react';

const SummaryCards = ({
  totalSpent,
  totalReserved,       // current month's reserved (deducted from spendable)
  totalGoalSavings,
  spendableBalance,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      {/* Spendable Balance */}
      <div className="md:col-span-1 rounded-2xl bg-gradient-to-br from-[#372949] via-[#947901] to-[#394c93] p-6 text-white shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-widest text-purple-200">
          Spendable Balance
        </p>
        <p className="mt-3 text-4xl font-bold tracking-tight">
          {formatCurrency(spendableBalance || 0)}
        </p>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-purple-200">
          <CreditCard size={13} />
          After reserved &amp; goal deductions
        </p>
      </div>

      {/* Total Spent */}
      <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Total Spent
          </p>
          <span className="rounded-lg bg-rose-50 dark:bg-rose-900/30 p-1.5 text-rose-500">
            <CreditCard size={16} />
          </span>
        </div>
        <p className="mt-4 text-3xl font-bold text-slate-800 dark:text-slate-100">
          {formatCurrency(totalSpent || 0)}
        </p>
        <p className="mt-1 text-xs text-slate-400">Includes paid reserved expenses</p>
      </div>

      {/* Reserved This Month */}
      <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Reserved (This Month)
          </p>
          <span className="rounded-lg bg-amber-50 dark:bg-amber-900/30 p-1.5 text-amber-500">
            <Lock size={16} />
          </span>
        </div>
        <p className="mt-4 text-3xl font-bold text-slate-800 dark:text-slate-100">
          {formatCurrency(totalReserved || 0)}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Locked for current month's bills
        </p>
      </div>

    </div>
  );
};

export default SummaryCards;