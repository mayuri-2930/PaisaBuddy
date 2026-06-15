// src/pages/ReservedExpenses/ReservedList.jsx
import React, { useState } from 'react';
import ReservedCard from '../../components/ReservedCard';

const TABS = [
  { key: 'all',      label: 'All' },
  { key: 'active',   label: 'This Month' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'paid',     label: 'Paid' },
];

function isThisMonth(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

function filterReserved(reserved, tab) {
  switch (tab) {
    case 'active':
      // Only show items that are NOT paid, NOT upcoming, AND whose dueDate falls in the current month
      return reserved.filter(r =>
        r.status !== 'PAID' &&
        r.status !== 'UPCOMING' &&
        isThisMonth(r.dueDate)
      );
    case 'upcoming':
      return reserved.filter(r => r.status === 'UPCOMING');
    case 'paid':
      return reserved.filter(r => r.status === 'PAID');
    default:
      return reserved;
  }
}

const ReservedList = ({ reserved, onPay, onDelete }) => {
  const [tab, setTab] = useState('active');

  const filtered = filterReserved(reserved, tab);
  const countFor = (key) => filterReserved(reserved, key).length;

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map(t => {
          const count = countFor(t.key);
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-sm font-medium transition border ${
                tab === t.key
                  ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-teal-500 dark:border-teal-500'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
              }`}
            >
              {t.label}
              {count > 0 && (
                <span className={`rounded-full px-1.5 py-0.5 text-xs ${
                  tab === t.key
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center text-slate-400 dark:text-slate-500">
          {tab === 'active'   && 'No reserved expenses due this month.'}
          {tab === 'upcoming' && 'No upcoming reserved expenses.'}
          {tab === 'paid'     && 'No paid expenses yet.'}
          {tab === 'all'      && 'No reserved expenses. Add one above!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(r => (
            <ReservedCard key={r.id} reserved={r} onPay={onPay} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservedList;