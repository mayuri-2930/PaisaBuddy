// src/pages/Dashboard/SummaryCards.jsx
import React from 'react';
import { formatCurrency } from '../../utils/dateFormatter';

const SummaryCards = ({ totalSpent, totalReserved, totalGoalSavings, spendableBalance }) => {
  const cards = [
    { label: 'Total Spent', value: totalSpent, tone: 'text-rose-500' },
    { label: 'Total Reserved', value: totalReserved, tone: 'text-amber-500' },
    { label: 'Goal Savings', value: totalGoalSavings, tone: 'text-emerald-600' },
    { label: 'Spendable Balance', value: spendableBalance, tone: 'text-cyan-600' },
  ];

  return (
    <div className="rounded-2xl border border-emerald-100/70 bg-white/85 p-5 shadow-[0_18px_45px_-24px_rgba(15,118,110,0.35)] dark:border-slate-800 dark:bg-slate-900/75">
      <h3 className="mb-3 font-semibold text-slate-800 dark:text-slate-100">Money Snapshot</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {cards.map((card) => {
          return (
            <div key={card.label} className="rounded-xl bg-slate-50/90 p-4 dark:bg-slate-950/40">
              <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">{card.label}</p>
              <p className={`mt-2 text-lg font-bold ${card.tone}`}>{formatCurrency(card.value || 0)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SummaryCards;
