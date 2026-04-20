import React, { useEffect, useState } from 'react';
import { Target, CalendarDays, PiggyBank, Wallet } from 'lucide-react';
import Card from '../../components/Card';
import InputField from '../../components/InputField';
import { contributeToGoal, createGoal, getGoals } from '../../services/goalService';
import { formatCurrency, formatDate } from '../../utils/dateFormatter';

const GoalPanel = ({ goals, loading, spendableBalance, onGoalsUpdated }) => {
  const [submittingGoal, setSubmittingGoal] = useState(false);
  const [savingGoalId, setSavingGoalId] = useState(null);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({
    title: '',
    targetAmount: '',
    targetDate: '',
  });
  const [contributionInputs, setContributionInputs] = useState({});

  useEffect(() => {
    const initialInputs = {};
    goals.forEach((goal) => {
      initialInputs[goal.id] = contributionInputs[goal.id] || '';
    });
    setContributionInputs(initialInputs);
  }, [goals]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.targetAmount || !form.targetDate) {
      setFormError('Please fill in all goal details.');
      return;
    }

    try {
      setSubmittingGoal(true);
      await createGoal({
        title: form.title,
        targetAmount: Number(form.targetAmount),
        targetDate: form.targetDate,
      });

      setForm({
        title: '',
        targetAmount: '',
        targetDate: '',
      });
      setFormError('');
      await onGoalsUpdated();
    } catch (err) {
      console.error(err);
      setFormError('Failed to create goal.');
    } finally {
      setSubmittingGoal(false);
    }
  };

  const handleSaveToGoal = async (goalId) => {
    const amount = Number(contributionInputs[goalId]);

    if (!amount || amount <= 0) {
      setFormError('Enter a valid amount to save into the goal.');
      return;
    }

    if (amount > spendableBalance) {
      setFormError('You can only save from your remaining spendable balance.');
      return;
    }

    try {
      setSavingGoalId(goalId);
      await contributeToGoal(goalId, amount);
      setContributionInputs((current) => ({ ...current, [goalId]: '' }));
      setFormError('');
      await onGoalsUpdated();
    } catch (err) {
      console.error(err);
      setFormError('Failed to save money to this goal.');
    } finally {
      setSavingGoalId(null);
    }
  };

  return (
    <Card className="p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-teal-950/60 dark:text-teal-300">
            <Target size={14} />
            Goal Planner
          </div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            Savings Goals
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Create goals and move money from your remaining spendable balance.
          </p>
        </div>
        <div className="hidden rounded-2xl bg-[linear-gradient(135deg,#d1fae5_0%,#ccfbf1_100%)] p-3 text-emerald-800 shadow-sm dark:bg-[linear-gradient(135deg,#134e4a_0%,#0f172a_100%)] dark:text-teal-200 sm:block">
          <PiggyBank size={22} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <InputField
          label="Goal Name"
          placeholder="Emergency Fund"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <InputField
          label="Target Amount"
          type="number"
          placeholder="50000"
          value={form.targetAmount}
          onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
        />
        <InputField
          label="Target Date"
          type="date"
          value={form.targetDate}
          onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
        />
        <div className="md:col-span-3 flex flex-wrap items-center justify-between gap-3">
          {formError ? (
            <p className="text-sm text-red-500">{formError}</p>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Spendable balance available to save: {formatCurrency(spendableBalance)}
            </p>
          )}
          <button
            type="submit"
            disabled={submittingGoal}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-teal-500 dark:hover:bg-teal-400"
          >
            {submittingGoal ? 'Creating Goal...' : 'Add Goal'}
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:text-slate-500">
            Loading goals...
          </div>
        ) : goals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:text-slate-500">
            No goals yet. Add your first savings target.
          </div>
        ) : (
          goals.map((goal) => (
            <div
              key={goal.id}
              className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/40"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                    {goal.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Target size={14} />
                      {formatCurrency(goal.targetAmount || 0)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Wallet size={14} />
                      Saved {formatCurrency(goal.totalSaved || 0)}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays size={14} />
                      {goal.targetDate ? formatDate(goal.targetDate) : 'No date'}
                    </span>
                  </div>
                </div>
                <div className="rounded-xl bg-white px-3 py-2 text-right shadow-sm dark:bg-slate-900">
                  <p className="text-xs text-slate-400 dark:text-slate-500">Progress</p>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-teal-300">
                    {Math.round(goal.progressPercent || 0)}%
                  </p>
                </div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                  style={{ width: `${Math.min(goal.progressPercent || 0, 100)}%` }}
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Save amount"
                  value={contributionInputs[goal.id] || ''}
                  onChange={(e) => setContributionInputs((current) => ({ ...current, [goal.id]: e.target.value }))}
                  className="w-36 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => handleSaveToGoal(goal.id)}
                  disabled={savingGoalId === goal.id}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-70 dark:bg-teal-500 dark:hover:bg-teal-400"
                >
                  {savingGoalId === goal.id ? 'Saving...' : 'Add from Spendable'}
                </button>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Remaining to target: {formatCurrency(goal.remainingAmount || 0)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default GoalPanel;
