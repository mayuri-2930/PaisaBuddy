// src/pages/Dashboard/RecentTransactions.jsx
import React from 'react';
import Card from '../../components/Card';
import TransactionCard from '../../components/TransactionCard';
import TransactionChart from '../Transactions/TransactionChart';

function isCurrentMonth(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

const RecentTransactions = ({ transactions, reserved = [] }) => {
  // Only current month's regular transactions go into the chart
  const currentMonthTxns = transactions.filter(t => isCurrentMonth(t.date));

  // Only paid-reserved items paid this month go into the chart
  const paidReservedAsTxns = reserved
    .filter(r => r.status === 'PAID' && r.paidDate && isCurrentMonth(r.paidDate))
    .map(r => ({
      id: `reserved-${r.id}`,
      amount: r.amount,
      category: deriveCategoryFromTitle(r.title),
      description: '[Reserved] ' + r.title,
      date: r.paidDate,
      _isReserved: true,
    }));

  const allForChart = [...currentMonthTxns, ...paidReservedAsTxns];

  return (
    <Card>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">Recent Ledger</h3>
        <a href="/transactions" className="text-sm text-emerald-600 hover:underline dark:text-teal-300">
          View all →
        </a>
      </div>

      {/* Chart — current month only */}
      <div className="mb-1">
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">
          {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </p>
        <TransactionChart transactions={allForChart} />
      </div>

      {/* Recent transaction list (all time, regular only) */}
      <div className="space-y-2 mt-4">
        {transactions.length > 0
          ? transactions.map(txn => <TransactionCard key={txn.id} transaction={txn} />)
          : (
            <p className="py-6 text-center text-slate-400 dark:text-slate-500">
              No transactions yet. Add your first expense!
            </p>
          )}
      </div>
    </Card>
  );
};

// Mirror of backend deriveCategory — keeps chart categories consistent
function deriveCategoryFromTitle(title) {
  if (!title) return 'Other';
  const t = title.toLowerCase();
  if (t.includes('rent') || t.includes('house') || t.includes('flat')) return 'Rent';
  if (t.includes('travel') || t.includes('pass') || t.includes('metro') || t.includes('bus')) return 'Travel';
  if (t.includes('laundry') || t.includes('wash')) return 'Laundry';
  if (t.includes('internet') || t.includes('broadband') || t.includes('wifi')) return 'Internet';
  if (t.includes('grocery') || t.includes('groceries')) return 'Groceries';
  if (t.includes('food') || t.includes('lunch') || t.includes('dinner') || t.includes('zomato') || t.includes('swiggy')) return 'Food';
  if (t.includes('emi') || t.includes('loan') || t.includes('mortgage')) return 'EMI';
  if (t.includes('electric') || t.includes('water') || t.includes('gas') || t.includes('bill')) return 'Utilities';
  if (t.includes('phone') || t.includes('mobile') || t.includes('recharge')) return 'Phone';
  if (t.includes('insurance')) return 'Insurance';
  if (t.includes('chore') || t.includes('maid') || t.includes('clean')) return 'Chores';
  return 'Other';
}

export default RecentTransactions;