// src/pages/Transactions/TransactionChart.jsx
import React, { useMemo, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const COLORS = [
  '#7F77DD', '#1D9E75', '#D85A30', '#378ADD',
  '#D4537E', '#639922', '#BA7517', '#888780',
  '#5B8DD9', '#C06DD8', '#E0A845', '#3DBAA2',
];

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

/**
 * TransactionChart
 *
 * Shows ALL transactions grouped by category — including:
 *   • Regular expense transactions
 *   • [Reserved] transactions (marked as paid reserved expenses)
 *   • Savings / goal contributions (passed as `goalContributions`)
 *   • Quick-logged transactions from the dashboard
 *
 * Props:
 *   transactions      – raw transaction array from backend
 *   goalContributions – optional flat array of { amount, category? } for goal savings
 *   reservedPaid      – optional flat array of paid reserved items (already in transactions
 *                       as [Reserved]-prefixed entries, so usually not needed separately)
 */
const TransactionChart = ({ transactions = [], goalContributions = [] }) => {
  // Default to 'pie' as required (pie first, bar second)
  const [mode, setMode] = useState('pie');

  const { labels, data } = useMemo(() => {
    const map = {};

    // 1. All regular + [Reserved] transactions from backend
    transactions
      .filter(t => Number(t.amount) > 0)
      .forEach(t => {
        const cat = t.category || 'Other';
        map[cat] = (map[cat] || 0) + Number(t.amount);
      });

    // 2. Goal contributions — bucket them under 'Savings'
    goalContributions
      .filter(c => Number(c.amount) > 0)
      .forEach(c => {
        const cat = c.category || 'Savings';
        map[cat] = (map[cat] || 0) + Number(c.amount);
      });

    // Sort by value descending so the pie reads largest → smallest
    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
    return {
      labels: sorted.map(([k]) => k),
      data:   sorted.map(([, v]) => v),
    };
  }, [transactions, goalContributions]);

  const total = useMemo(() => data.reduce((s, v) => s + v, 0), [data]);

  const topTxn = useMemo(() => {
    const all = [
      ...transactions.filter(t => Number(t.amount) > 0),
      ...goalContributions.filter(c => Number(c.amount) > 0),
    ];
    return all.reduce((a, b) => (Number(a?.amount) > Number(b?.amount) ? a : b), null);
  }, [transactions, goalContributions]);

  if (labels.length === 0) {
    return (
      <p className="py-6 text-center text-slate-400 dark:text-slate-500 text-sm">
        No data to chart yet.
      </p>
    );
  }

  const chartData = {
    labels,
    datasets: [{
      label: 'Amount (₹)',
      data,
      backgroundColor: labels.map((_, i) => COLORS[i % COLORS.length]),
      borderRadius: mode === 'bar' ? 5 : 0,
      borderWidth: mode === 'pie' ? 2 : 0,
      borderColor: 'transparent',
      hoverOffset: 10,
    }],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ' ' + fmt(ctx.raw) } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } } },
      y: {
        grid: { color: 'rgba(148,163,184,0.15)' },
        ticks: {
          color: '#94a3b8',
          font: { size: 11 },
          callback: v => v >= 1000 ? '₹' + (v / 1000).toFixed(0) + 'k' : '₹' + v,
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => {
            const pct = total > 0 ? ((ctx.raw / total) * 100).toFixed(1) : 0;
            return ` ${fmt(ctx.raw)} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="mb-2">
      {/* Header row — Pie listed first, then Bar */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Spending by category
        </p>
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
          {['pie', 'bar'].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-0.5 text-xs rounded-md transition ${
                mode === m
                  ? 'bg-white dark:bg-slate-600 font-semibold text-slate-800 dark:text-slate-100'
                  : 'text-slate-400 dark:text-slate-400'
              }`}
            >
              {m === 'pie' ? 'Pie' : 'Bar'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: 'Total',      val: fmt(total) },
          { label: 'Categories', val: labels.length },
          { label: 'Largest',    val: topTxn ? fmt(topTxn.amount) : '—' },
        ].map(s => (
          <div key={s.label} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">{s.label}</p>
            <p className="text-base font-semibold text-slate-800 dark:text-slate-100">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ height: 220 }}>
        {mode === 'bar'
          ? <Bar     data={chartData} options={barOptions} />
          : <Doughnut data={chartData} options={pieOptions} />
        }
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3">
        {labels.map((l, i) => {
          const pct = total > 0 ? ((data[i] / total) * 100).toFixed(1) : 0;
          return (
            <span key={l} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span
                className="inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              {l}
              <span className="text-slate-400 dark:text-slate-500">({pct}%)</span>
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionChart;