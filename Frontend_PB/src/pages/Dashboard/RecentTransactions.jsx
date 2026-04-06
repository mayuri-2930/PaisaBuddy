// src/pages/Dashboard/RecentTransactions.jsx
import React from 'react';
import Card from '../../components/Card';
import TransactionCard from '../../components/TransactionCard';

const RecentTransactions = ({ transactions }) => {
  return (
    <Card>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Recent Ledger</h3>
        <a href="/transactions" className="text-sm text-emerald-600 hover:underline">View all →</a>
      </div>
      <div className="space-y-2">
        {transactions.length > 0 ? transactions.map(txn => (
          <TransactionCard key={txn.id} transaction={txn} />
        )) : (
          <p className="text-gray-400 text-center py-6">No transactions yet. Add your first expense!</p>
        )}
      </div>
    </Card>
  );
};

export default RecentTransactions;