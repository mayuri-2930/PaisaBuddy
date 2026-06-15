// src/pages/Transactions/AddTransactionForm.jsx
import React, { useState } from 'react';
import { addTransaction } from '../../services/transactionService';
import { formatCurrency } from '../../utils/dateFormatter';

const CATEGORIES = [
  'Food & Beverages',
  'Groceries',
  'Rent',
  'Travel & Fare',
  'Leisure',
  'Internet & Phone',
  'Bills & Utilities',
  'EMI & Loans',
  'Laundry & Chores',
  'Insurance',
  'Savings',
  'Other',
];

const today = () => new Date().toISOString().split('T')[0];

/**
 * AddTransactionForm
 *
 * Single unified form used in both Dashboard (compact) and TransactionPage (full).
 * Logic is identical — only layout/sizing differs via the `compact` prop.
 *
 * Props:
 *   onSuccess        – called after a successful save
 *   compact          – compact stacked layout for dashboard Quick Log
 *   spendableBalance – when provided, blocks saving if amount > spendableBalance
 */
const AddTransactionForm = ({ onSuccess, compact = false, spendableBalance }) => {
  const [form, setForm] = useState({
    amount: '',
    description: '',
    category: 'Food & Beverages',
    date: today(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const hasSpendableCheck   = typeof spendableBalance === 'number';
  const isSpendableDepleted = hasSpendableCheck && spendableBalance <= 0;

  // ── Shared submit logic ───────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const amount = parseFloat(form.amount);

    if (!form.amount || amount <= 0) {
      setError('Enter a valid amount.');
      return;
    }

    if (hasSpendableCheck) {
      if (spendableBalance <= 0) {
        setError('Your spendable balance is ₹0. You cannot log more expenses.');
        return;
      }
      if (amount > spendableBalance) {
        setError(
          `Amount exceeds your spendable balance of ${formatCurrency(spendableBalance)}.`
        );
        return;
      }
    }

    setLoading(true);
    try {
      await addTransaction({
        amount,
        category: form.category,
        description: form.description || form.category,
        date: form.date,
      });
      setForm({ amount: '', description: '', category: 'Food & Beverages', date: today() });
      setError('');
      if (onSuccess) onSuccess();
    } catch {
      setError('Failed to add transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Spendable depleted — shown in both modes ──────────────────────────
  if (isSpendableDepleted) {
    return (
      <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 dark:bg-rose-950/40 dark:border-rose-800">
        <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">
          Spendable balance is ₹0
        </p>
        <p className="text-xs text-rose-500 dark:text-rose-500 mt-0.5">
          All your income has been allocated to expenses, reserved costs, and savings goals.
          You cannot log additional transactions until your balance is replenished.
        </p>
      </div>
    );
  }

  // ── Shared fields ─────────────────────────────────────────────────────
  const amountInput = (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
      <input
        type="number"
        placeholder="Amount"
        min="0.01"
        max={hasSpendableCheck ? spendableBalance : undefined}
        step="0.01"
        value={form.amount}
        onChange={e => set('amount', e.target.value)}
        className={`rounded-xl border border-slate-200 bg-white/80 pl-7 pr-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 ${
          compact ? 'w-full' : 'w-32'
        }`}
      />
    </div>
  );

  const categorySelect = (
    <select
      value={form.category}
      onChange={e => set('category', e.target.value)}
      className={`rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 ${
        compact ? 'w-full' : ''
      }`}
    >
      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
    </select>
  );

  const descriptionInput = (
    <input
      type="text"
      placeholder="Description (optional)"
      value={form.description}
      onChange={e => set('description', e.target.value)}
      className={`rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 ${
        compact ? 'flex-1' : 'flex-1 min-w-[140px]'
      }`}
    />
  );

  const dateInput = (
    <input
      type="date"
      value={form.date}
      onChange={e => set('date', e.target.value)}
      className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
    />
  );

  const submitButton = (
    <button
      type="submit"
      disabled={loading}
      className={`rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 dark:bg-teal-500 dark:hover:bg-teal-400 transition ${
        compact ? 'w-full py-2.5' : 'px-5 py-2'
      }`}
    >
      {loading ? 'Saving…' : compact ? 'Log Transaction' : '+ Add'}
    </button>
  );

  // ── Compact layout (Dashboard Quick Log) ─────────────────────────────
  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        {hasSpendableCheck && spendableBalance > 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Available to spend:{' '}
            <span className="font-semibold text-emerald-600 dark:text-teal-400">
              {formatCurrency(spendableBalance)}
            </span>
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-2">
          {amountInput}
          {categorySelect}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {descriptionInput}
          {dateInput}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        {submitButton}
      </form>
    );
  }

  // ── Full layout (TransactionPage) ─────────────────────────────────────
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-3 rounded-xl border border-emerald-100 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/75"
    >
      {hasSpendableCheck && spendableBalance > 0 && (
        <p className="w-full text-xs text-slate-400 dark:text-slate-500 -mb-1">
          Spendable:{' '}
          <span className="font-semibold text-emerald-600 dark:text-teal-400">
            {formatCurrency(spendableBalance)}
          </span>
        </p>
      )}
      {amountInput}
      {categorySelect}
      {descriptionInput}
      {dateInput}
      {error && <p className="w-full text-xs text-red-500">{error}</p>}
      {submitButton}
    </form>
  );
};

export default AddTransactionForm;