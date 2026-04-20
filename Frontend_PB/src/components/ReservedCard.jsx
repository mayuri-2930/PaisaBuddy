// src/components/ReservedCard.jsx
import React from 'react';
import { formatCurrency, formatDate } from '../utils/dateFormatter';
import { Clock, CheckCircle, Trash2 } from 'lucide-react';

const ReservedCard = ({ reserved, onPay, onDelete }) => {
  const isOverdue = new Date(reserved.dueDate) < new Date() && reserved.status !== 'PAID';
  
  return (
    <div className={`rounded-xl border p-4 transition-all ${reserved.status === 'PAID' ? 'border-emerald-200 bg-emerald-50/30 dark:border-teal-900 dark:bg-teal-950/20' : 'border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/75'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-slate-800 dark:text-slate-100">{reserved.title}</h4>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Due: {formatDate(reserved.dueDate)}</p>
          <p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(reserved.amount)}</p>
        </div>
        <div className="flex gap-2">
          {reserved.status !== 'PAID' && (
            <button onClick={() => onPay(reserved.id)} className="rounded-lg bg-emerald-100 p-2 text-emerald-700 transition hover:bg-emerald-200 dark:bg-teal-950/60 dark:text-teal-300 dark:hover:bg-teal-900/70">
              <CheckCircle size={18} />
            </button>
          )}
          <button onClick={() => onDelete(reserved.id)} className="rounded-lg bg-slate-100 p-2 text-slate-500 transition hover:bg-red-100 hover:text-red-600 dark:bg-slate-800 dark:text-slate-400">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      {reserved.status === 'PENDING' && (
        <div className={`mt-2 text-xs flex items-center gap-1 ${isOverdue ? 'text-red-500' : 'text-amber-500'}`}>
          <Clock size={12} /> {isOverdue ? 'Overdue' : 'Pending payment'}
        </div>
      )}
      {reserved.status === 'PAID' && <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1"><CheckCircle size={12} /> Paid</div>}
    </div>
  );
};

export default ReservedCard;
