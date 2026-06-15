// src/components/ReservedCard.jsx
import React from 'react';
import { formatCurrency, formatDate } from '../utils/dateFormatter';
import { Clock, CheckCircle, Trash2, AlertCircle, CalendarClock, RefreshCw } from 'lucide-react';

const FREQ_LABELS = {
  ONE_TIME:  'One-time',
  MONTHLY:   'Monthly',
  QUARTERLY: 'Quarterly',
  YEARLY:    'Yearly',
};

/**
 * Derives a display status from the Reserved object.
 * Returns one of: 'PAID' | 'OVERDUE' | 'DUE_TODAY' | 'DUE_SOON' | 'PENDING' | 'UPCOMING'
 */
function deriveStatus(reserved) {
  if (reserved.status === 'PAID') return 'PAID';
  if (reserved.status === 'UPCOMING') return 'UPCOMING';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(reserved.dueDate);
  due.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((due - today) / 86400000);

  if (diffDays < 0)  return 'OVERDUE';
  if (diffDays === 0) return 'DUE_TODAY';
  if (diffDays <= 7) return 'DUE_SOON';
  return 'PENDING';
}

const STATUS_CONFIG = {
  PAID:      { label: 'Paid',       color: 'text-emerald-600 dark:text-teal-400',   bg: 'bg-emerald-50 dark:bg-teal-950/30',   icon: CheckCircle },
  OVERDUE:   { label: 'Overdue',    color: 'text-red-600 dark:text-red-400',         bg: 'bg-red-50 dark:bg-red-950/20',         icon: AlertCircle },
  DUE_TODAY: { label: 'Due Today',  color: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-50 dark:bg-amber-950/20',     icon: Clock },
  DUE_SOON:  { label: 'Due Soon',   color: 'text-orange-500 dark:text-orange-400',   bg: 'bg-orange-50 dark:bg-orange-950/20',   icon: Clock },
  PENDING:   { label: 'Pending',    color: 'text-slate-500 dark:text-slate-400',     bg: 'bg-slate-50 dark:bg-slate-800',        icon: Clock },
  UPCOMING:  { label: 'Upcoming',   color: 'text-indigo-500 dark:text-indigo-400',   bg: 'bg-indigo-50 dark:bg-indigo-950/20',   icon: CalendarClock },
};

const ReservedCard = ({ reserved, onPay, onDelete }) => {
  const derived   = deriveStatus(reserved);
  const cfg       = STATUS_CONFIG[derived];
  const StatusIcon = cfg.icon;
  const isPaid     = derived === 'PAID';
  const isUpcoming = derived === 'UPCOMING';
  const freq       = reserved.frequency || 'ONE_TIME';

  return (
    <div className={`rounded-xl border p-4 transition-all ${
      isPaid
        ? 'border-emerald-200 bg-emerald-50/30 dark:border-teal-900 dark:bg-teal-950/20'
        : isUpcoming
          ? 'border-indigo-100 bg-indigo-50/20 dark:border-indigo-900/40 dark:bg-indigo-950/10'
          : 'border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/75'
    }`}>

      {/* Top row: title + actions */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-slate-800 dark:text-slate-100 truncate">{reserved.title}</h4>

            {/* Frequency badge */}
            {freq !== 'ONE_TIME' && (
              <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <RefreshCw size={10} />
                {FREQ_LABELS[freq]}
              </span>
            )}
          </div>

          {/* Amount */}
          <p className="mt-1.5 text-xl font-bold text-slate-900 dark:text-slate-100">
            {formatCurrency(reserved.amount)}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 shrink-0">
          {!isPaid && !isUpcoming && (
            <button
              onClick={() => onPay(reserved.id)}
              title="Mark as Paid"
              className="rounded-lg bg-emerald-100 p-2 text-emerald-700 transition hover:bg-emerald-200 dark:bg-teal-950/60 dark:text-teal-300 dark:hover:bg-teal-900/70"
            >
              <CheckCircle size={16} />
            </button>
          )}
          <button
            onClick={() => onDelete(reserved.id)}
            title="Delete"
            className="rounded-lg bg-slate-100 p-2 text-slate-400 transition hover:bg-red-100 hover:text-red-600 dark:bg-slate-800 dark:text-slate-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Date info row */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
        {reserved.dueDate && (
          <span>
            <span className="font-medium text-slate-600 dark:text-slate-300">Due: </span>
            {formatDate(reserved.dueDate)}
          </span>
        )}
        {reserved.paidDate && (
          <span>
            <span className="font-medium text-emerald-600 dark:text-teal-400">Paid: </span>
            {formatDate(reserved.paidDate)}
          </span>
        )}
        {reserved.startDate && (
          <span>
            <span className="font-medium text-slate-600 dark:text-slate-300">From: </span>
            {formatDate(reserved.startDate)}
            {reserved.endDate ? ` → ${formatDate(reserved.endDate)}` : ''}
          </span>
        )}
      </div>

      {/* Status badge */}
      <div className={`mt-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.color} ${cfg.bg}`}>
        <StatusIcon size={11} />
        {cfg.label}
        {derived === 'OVERDUE' && reserved.dueDate && (
          <span className="ml-0.5 opacity-75">
            · {Math.abs(Math.floor((new Date(reserved.dueDate) - new Date()) / 86400000))} days ago
          </span>
        )}
        {derived === 'DUE_SOON' && reserved.dueDate && (
          <span className="ml-0.5 opacity-75">
            · in {Math.floor((new Date(reserved.dueDate) - new Date()) / 86400000)} days
          </span>
        )}
      </div>
    </div>
  );
};

export default ReservedCard;