// src/pages/Transactions/AddTransactionForm.jsx
import React, { useState } from 'react';
import { addTransaction } from '../../services/transactionService';
import InputField from '../../components/InputField';
import { DollarSign, Tag, Calendar, Coffee } from 'lucide-react';

const AddTransactionForm = ({ onSuccess, compact = false }) => {
  const [form, setForm] = useState({ amount: '', description: '', category: 'Food', date: new Date().toISOString().split('T')[0] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const detectCategory = (desc) => {
    const kw = desc.toLowerCase();
    if (kw.includes('food') || kw.includes('grocery') || kw.includes('lunch')) return 'Food';
    if (kw.includes('uber') || kw.includes('flight') || kw.includes('train')) return 'Travel';
    if (kw.includes('netflix') || kw.includes('movie')) return 'Leisure';
    if (kw.includes('rent')) return 'Rent';
    if (kw.includes('wifi') || kw.includes('broadband')) return 'Internet';
    return 'Other';
  };

  const handleDescChange = (e) => {
    const val = e.target.value;
    setForm({ ...form, description: val, category: detectCategory(val) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.description) return setError('Amount and description required');
    setLoading(true);
    try {
      await addTransaction({ amount: parseFloat(form.amount), category: form.category, description: form.description, date: form.date, type: 'EXPENSE' });
      setForm({ amount: '', description: '', category: 'Food', date: new Date().toISOString().split('T')[0] });
      if (onSuccess) onSuccess();
      setError('');
    } catch (err) {
      setError('Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input type="text" placeholder="I spent 200 on food" value={form.description} onChange={handleDescChange} className="flex-1 rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-300 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100" />
        <input type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-28 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-slate-800 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100" />
        <button type="submit" disabled={loading} className="rounded-xl bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700 dark:bg-teal-500 dark:hover:bg-teal-400">Add</button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-emerald-100 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/75">
      <h3 className="font-medium text-slate-800 dark:text-slate-100">➕ New Transaction</h3>
      <InputField placeholder="Description" value={form.description} onChange={handleDescChange} icon={Coffee} />
      <InputField type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} icon={DollarSign} />
      <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-slate-800 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100">
        {['Food','Rent','Travel','Leisure','Internet','Other'].map(c => <option key={c}>{c}</option>)}
      </select>
      <InputField type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} icon={Calendar} />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" className="w-full rounded-xl bg-emerald-600 py-2 font-medium text-white dark:bg-teal-500">Save Transaction</button>
    </form>
  );
};

export default AddTransactionForm;
