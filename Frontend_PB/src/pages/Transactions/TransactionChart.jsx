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
];

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN');

const TransactionChart = ({ transactions = [] }) => {
  const [mode, setMode] = useState('bar');

  // The backend currently returns transactions without a `type` field,
  // so group all transactions by category for dashboard visibility.
  const { labels, data } = useMemo(() => {
    const map = {};
    transactions
      .filter(t => Number(t.amount) > 0)
      .forEach(t => {
        const cat = t.category || 'Other';
        map[cat] = (map[cat] || 0) + Number(t.amount);
      });
    return { labels: Object.keys(map), data: Object.values(map) };
  }, [transactions]);

  const total = useMemo(
    () => data.reduce((s, v) => s + v, 0),
    [data]
  );

  const topTxn = useMemo(
    () => transactions.filter(t => Number(t.amount) > 0)
                      .reduce((a, b) => (Number(a?.amount) > Number(b?.amount) ? a : b), null),
    [transactions]
  );

  if (labels.length === 0) {
    return (
      <p className="py-6 text-center text-slate-400 dark:text-slate-500 text-sm">
        No expense data to chart yet.
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
      hoverOffset: 8,
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
      tooltip: { callbacks: { label: ctx => ' ' + fmt(ctx.raw) } },
    },
  };

  return (
    <div className="mb-2">
      {/* Header row */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Spending by category
        </p>
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
          {['bar', 'pie'].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-0.5 text-xs rounded-md transition ${
                mode === m
                  ? 'bg-white dark:bg-slate-600 font-semibold text-slate-800 dark:text-slate-100'
                  : 'text-slate-400 dark:text-slate-400'
              }`}
            >
              {m === 'bar' ? 'Bar' : 'Pie'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: 'Total spent',  val: fmt(total) },
          { label: 'Categories',   val: labels.length },
          { label: 'Largest',      val: topTxn ? fmt(topTxn.amount) : '—' },
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
          ? <Bar data={chartData} options={barOptions} />
          : <Doughnut data={chartData} options={pieOptions} />
        }
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3">
        {labels.map((l, i) => (
          <span key={l} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            {l}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TransactionChart;
