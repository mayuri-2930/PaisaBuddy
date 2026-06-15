// src/pages/ReservedExpenses/AddReservedForm.jsx
import React, { useState } from 'react';
import { addReserved } from '../../services/reservedService';
import InputField from '../../components/InputField';
import { PlusCircle, X, ChevronDown } from 'lucide-react';

const FREQUENCY_OPTIONS = [
  { value: 'ONE_TIME',   label: 'One Time' },
  { value: 'MONTHLY',    label: 'Monthly' },
  { value: 'QUARTERLY',  label: 'Quarterly' },
  { value: 'YEARLY',     label: 'Yearly' },
];

const AddReservedForm = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle]           = useState('');
  const [amount, setAmount]         = useState('');
  const [frequency, setFrequency]   = useState('ONE_TIME');
  const [paymentDate, setPaymentDate] = useState('');   // for ONE_TIME: exact date; for recurring: preferred day anchor
  const [startDate, setStartDate]   = useState('');
  const [endDate, setEndDate]       = useState('');

  const isRecurring = frequency !== 'ONE_TIME';

  const reset = () => {
    setTitle(''); setAmount(''); setFrequency('ONE_TIME');
    setPaymentDate(''); setStartDate(''); setEndDate('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) return setError('Title is required.');
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return setError('Enter a valid amount.');
    if (isRecurring && !startDate) return setError('Start date is required for recurring expenses.');

    setLoading(true);
    try {
      const payload = {
        title: title.trim(),
        amount: parseFloat(amount),
        frequency,
        // paymentDate: used as the preferred day anchor (e.g. "pay on the 5th of each month")
        paymentDate: paymentDate || null,
        // For ONE_TIME, dueDate = paymentDate (backend handles fallback to today)
        dueDate: frequency === 'ONE_TIME' ? (paymentDate || null) : null,
        startDate: isRecurring ? startDate : null,
        endDate:   isRecurring ? (endDate || null) : null,
      };

      await addReserved(payload);
      reset();
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to add reserved expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Toggle button */}
      <button
        onClick={() => { setOpen(v => !v); reset(); }}
        className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700 dark:bg-teal-500 dark:hover:bg-teal-600 transition"
      >
        {open ? <X size={16} /> : <PlusCircle size={16} />}
        {open ? 'Cancel' : '+ Add Reserved'}
      </button>

      {/* Slide-in form panel */}
      {open && (
        <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <h3 className="mb-4 text-base font-semibold text-slate-800 dark:text-slate-100">
            New Reserved Expense
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title + Amount row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Title</label>
                <input
                  type="text"
                  placeholder="e.g., Rent, Netflix, Insurance"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Frequency selector */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Frequency</label>
              <div className="flex flex-wrap gap-2">
                {FREQUENCY_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFrequency(opt.value)}
                    className={`rounded-xl px-4 py-1.5 text-sm font-medium transition border ${
                      frequency === opt.value
                        ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-teal-500 dark:border-teal-500'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* ONE_TIME: "Date of Payment", RECURRING: "Preferred Payment Day (anchor)" */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                  {isRecurring ? 'Preferred Payment Day (anchor date)' : 'Date of Payment'}
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={e => setPaymentDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                {isRecurring && (
                  <p className="mt-1 text-xs text-slate-400">
                    The day of this date will be used each period (e.g. the 5th of every month).
                  </p>
                )}
              </div>

              {/* Recurring only: start date */}
              {isRecurring && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Start Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              )}
            </div>

            {/* End date — recurring only */}
            {isRecurring && (
              <div className="sm:w-1/2">
                <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                  End Date <span className="text-slate-400">(optional — defaults to end of year)</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            )}

            {/* Preview pill */}
            {isRecurring && startDate && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-xs text-emerald-700 dark:bg-teal-950/30 dark:border-teal-900 dark:text-teal-300">
                <strong>Preview:</strong> This will create{' '}
                {frequency === 'MONTHLY' ? 'monthly' : frequency === 'QUARTERLY' ? 'quarterly' : 'yearly'}{' '}
                entries from <strong>{startDate}</strong>
                {endDate ? ` to ${endDate}` : ' to end of year'}.{' '}
                Only the <strong>current month's</strong> entry will be deducted from your spendable balance.
                Future entries will show as upcoming.
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-60 dark:bg-teal-500 dark:hover:bg-teal-600 transition"
              >
                {loading ? 'Saving…' : 'Save Reserved Expense'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddReservedForm;