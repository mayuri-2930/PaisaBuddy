// src/pages/Profile/ProfileForm.jsx
import React, { useState } from 'react';
import Card from '../../components/Card';
import { useAuth } from '../../contexts/AuthContext';
import { addCredit } from '../../services/transactionService';
import { formatCurrency } from '../../utils/dateFormatter';
import { PlusCircle, X } from 'lucide-react';
import api from '../../services/api';

const CREDIT_CATEGORIES = [
  'Bonus', 'Freelance', 'Investment Return',
  'Gift', 'Refund', 'Side Income', 'Other Credit',
];

const ProfileForm = ({ user, onUpdate }) => {
  const { updateUser } = useAuth();

  const [name, setName]                   = useState(user?.name || '');
  const [email, setEmail]                 = useState(user?.email || '');
  const [monthlyIncome, setMonthlyIncome] = useState(user?.monthlyIncome || '');
  const [saving, setSaving]               = useState(false);
  const [saved, setSaved]                 = useState(false);

  // Credit form
  const [showCredit, setShowCredit]         = useState(false);
  const [creditAmount, setCreditAmount]     = useState('');
  const [creditCategory, setCreditCategory] = useState('Bonus');
  const [creditDesc, setCreditDesc]         = useState('');
  const [creditLoading, setCreditLoading]   = useState(false);
  const [creditDone, setCreditDone]         = useState(false);
  const [error, setError]                   = useState('');

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      // Update salary on backend
      await api.put(`/users/${user.id}/income`, parseFloat(monthlyIncome) || 0);
    } catch (e) { /* non-fatal */ }
    // Update local context
    const updated = { ...user, name: name.trim(), email, monthlyIncome: parseFloat(monthlyIncome) || 0 };
    onUpdate(updated);
    updateUser(updated);
    setTimeout(() => { setSaving(false); setSaved(true); }, 400);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAddCredit = async () => {
    setError('');
    if (!creditAmount || parseFloat(creditAmount) <= 0) return setError('Enter a valid amount.');
    setCreditLoading(true);
    try {
      await addCredit({
        amount: parseFloat(creditAmount),
        category: creditCategory,
        description: creditDesc || creditCategory,
      });
      setCreditAmount(''); setCreditDesc(''); setCreditDone(true);
      setTimeout(() => { setCreditDone(false); setShowCredit(false); }, 2000);
    } catch {
      setError('Failed to add credit.');
    } finally {
      setCreditLoading(false);
    }
  };

  const initial = (name || email || 'U').charAt(0).toUpperCase();

  return (
    <>
      <Card>
        {/* Avatar + name */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-2xl font-bold text-white">
            {initial}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{name || 'User'}</h2>
            <p className="text-slate-500 dark:text-slate-400">{email}</p>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 dark:bg-teal-950/60 dark:text-teal-300">
              PREMIUM MEMBER
            </span>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {[
            { label: 'Full Name',        val: name,          set: setName,          type: 'text' },
            { label: 'Email Address',    val: email,         set: setEmail,         type: 'email' },
            { label: 'Monthly Salary (₹)', val: monthlyIncome, set: setMonthlyIncome, type: 'number' },
          ].map(f => (
            <div key={f.label}>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">{f.label}</label>
              <input
                type={f.type}
                value={f.val}
                onChange={e => f.set(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          ))}

          <p className="text-xs text-slate-400">
            If you increase your salary, the difference will be added as a credit transaction.
            If decreased, your spendable balance adjusts automatically.
          </p>

          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 dark:bg-teal-500 transition"
          >
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Update Profile'}
          </button>
        </div>
      </Card>

      {/* Credit section */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Add Credit</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Bonus, freelance income, gifts — adds directly to your spendable balance.
            </p>
          </div>
          <button
            onClick={() => setShowCredit(v => !v)}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 dark:bg-teal-500 transition"
          >
            {showCredit ? <X size={14} /> : <PlusCircle size={14} />}
            {showCredit ? 'Cancel' : 'Add Credit'}
          </button>
        </div>

        {showCredit && (
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Amount (₹)</label>
                <input
                  type="number" min="0" placeholder="0.00"
                  value={creditAmount} onChange={e => setCreditAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Type</label>
                <select
                  value={creditCategory} onChange={e => setCreditCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  {CREDIT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Description (optional)</label>
              <input
                type="text" placeholder="e.g. Q2 performance bonus"
                value={creditDesc} onChange={e => setCreditDesc(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              onClick={handleAddCredit} disabled={creditLoading}
              className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 dark:bg-teal-500 transition"
            >
              {creditLoading ? 'Adding…' : creditDone ? '✓ Added to balance!' : 'Add to Spendable Balance'}
            </button>
          </div>
        )}
      </Card>
    </>
  );
};

export default ProfileForm;