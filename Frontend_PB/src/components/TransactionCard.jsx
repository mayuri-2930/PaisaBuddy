// src/components/TransactionCard.jsx
import React from 'react';
import { categoryColors, getCategoryIcon } from '../utils/categoryColors';
import { formatCurrency } from '../utils/dateFormatter';

const TransactionCard = ({ transaction }) => {
  const Icon = getCategoryIcon(transaction.category);
  const color = categoryColors[transaction.category] || categoryColors.Other;
  
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 p-3 transition hover:shadow-sm dark:border-slate-800 dark:bg-slate-950/40">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color.bg} ${color.text}`}>
          <Icon size={18} />
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100">{transaction.description}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">{new Date(transaction.date).toLocaleDateString()}</p>
        </div>
      </div>
      <div className={`font-semibold ${transaction.type === 'EXPENSE' ? 'text-rose-500' : 'text-emerald-600'}`}>
        {transaction.type === 'EXPENSE' ? '-' : '+'}{formatCurrency(Math.abs(transaction.amount))}
      </div>
    </div>
  );
};

export default TransactionCard;
