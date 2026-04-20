// src/pages/Dashboard/RecentTransactions.jsx
import React from 'react';
import Card from '../../components/Card';
import TransactionCard from '../../components/TransactionCard';

const RecentTransactions = ({ transactions }) => {
  return (
    <Card>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">Recent Ledger</h3>
        <a href="/transactions" className="text-sm text-emerald-600 hover:underline dark:text-teal-300">View all →</a>
      </div>
      <div className="space-y-2">
        {transactions.length > 0 ? transactions.map(txn => (
          <TransactionCard key={txn.id} transaction={txn} />
        )) : (
          <p className="py-6 text-center text-slate-400 dark:text-slate-500">No transactions yet. Add your first expense!</p>
        )}
      </div>
    </Card>
  );
};

export default RecentTransactions;
