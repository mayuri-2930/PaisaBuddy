// src/components/TransactionCard.jsx
import React from 'react';
import { categoryColors, getCategoryIcon } from '../utils/categoryColors';
import { formatCurrency } from '../utils/dateFormatter';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

const formatDateTime = (createdAt, date) => {
  const raw = createdAt || date;
  if (!raw) return '—';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return String(raw);
  const dateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  if (createdAt) {
    const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${dateStr} · ${timeStr}`;
  }
  return dateStr;
};

const TransactionCard = ({ transaction }) => {
  const isCredit   = transaction.type === 'CREDIT';
  const Icon       = getCategoryIcon(transaction.category);
  const color      = categoryColors[transaction.category] || categoryColors.Other;
  const isReserved = transaction.description?.startsWith('[Reserved]');

  return (
    <div className={`flex items-center justify-between rounded-xl border p-3 transition hover:shadow-sm ${
      isCredit
        ? 'border-emerald-100 bg-emerald-50/40 dark:border-teal-900/40 dark:bg-teal-950/10'
        : 'border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/40'
    }`}>
      <div className="flex items-center gap-3 min-w-0">
        {/* Icon */}
        <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${
          isCredit ? 'bg-emerald-100 text-emerald-700 dark:bg-teal-950/60 dark:text-teal-300' : `${color.bg} ${color.text}`
        }`}>
          {isCredit ? <ArrowDownLeft size={18} /> : <Icon size={18} />}
        </div>

        {/* Details */}
        <div className="min-w-0">
          <p className="font-medium text-slate-800 dark:text-slate-100 truncate">
            {transaction.description}
            {isReserved && (
              <span className="ml-2 rounded-full bg-amber-100 px-1.5 py-0.5 text-xs text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                reserved
              </span>
            )}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {formatDateTime(transaction.createdAt, transaction.date)}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">{transaction.category}</p>
        </div>
      </div>

      {/* Amount */}
      <div className={`ml-3 shrink-0 font-semibold flex items-center gap-1 ${
        isCredit ? 'text-emerald-600 dark:text-teal-400' : 'text-rose-500'
      }`}>
        {isCredit ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
        {isCredit ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
      </div>
    </div>
  );
};

export default TransactionCard;