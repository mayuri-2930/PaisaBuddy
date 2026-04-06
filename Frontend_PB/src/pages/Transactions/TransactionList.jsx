// src/pages/Transactions/TransactionList.jsx
import React from 'react';
import TransactionCard from '../../components/TransactionCard';

const TransactionList = ({ transactions }) => {
  if (transactions.length === 0) {
    return <div className="text-center py-12 text-gray-400">No transactions match the filter.</div>;
  }
  return (
    <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
      {transactions.map(txn => <TransactionCard key={txn.id} transaction={txn} />)}
    </div>
  );
};

export default TransactionList;