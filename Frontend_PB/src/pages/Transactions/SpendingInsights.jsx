import React from 'react';
import Card from '../../components/Card';
import { formatCurrency } from '../../utils/dateFormatter';

const HEALTH_STYLES = {
  GREEN: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
  YELLOW: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
  RED: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300',
};

const getBudgetHealth = (income, spendableBalance) => {
  if (!income || income <= 0) return 'RED';

  const ratio = spendableBalance / income;
  if (ratio > 0.4) return 'GREEN';
  if (ratio > 0.15) return 'YELLOW';
  return 'RED';
};

const groupByMonth = (items, getAmount) => {
  const map = new Map();

  items.forEach((item) => {
    const value = getAmount(item);
    const date = new Date(item.date || item.createdAt || item.targetDate);

    if (Number.isNaN(date.getTime()) || !value) {
      return;
    }

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    map.set(key, (map.get(key) || 0) + value);
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, amount]) => {
      const [year, month] = key.split('-');
      const label = new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('en-IN', {
        month: 'short',
      });
      return { key, label, amount };
    });
};

const categoryBreakdown = (transactions) => {
  const totals = transactions.reduce((acc, txn) => {
    acc[txn.category] = (acc[txn.category] || 0) + (txn.amount || 0);
    return acc;
  }, {});

  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
};

const SpendingInsights = ({ transactions, goals, income, spendableBalance, totalGoalSavings }) => {
  const health = getBudgetHealth(income, spendableBalance);
  const healthLabel = health === 'GREEN' ? 'Healthy' : health === 'YELLOW' ? 'Watchlist' : 'Critical';
  const monthlySpending = groupByMonth(transactions, (txn) => txn.amount || 0);
  const goalContributions = goals.flatMap((goal) =>
    (goal.contributions || []).map((contribution) => ({
      ...contribution,
      date: contribution.contributedAt,
    }))
  );
  const monthlyGoalSavings = groupByMonth(goalContributions, (contribution) => contribution.amount || 0);
  const categories = categoryBreakdown(transactions);
  const maxSpend = Math.max(...monthlySpending.map((item) => item.amount), 1);
  const maxSaved = Math.max(...monthlyGoalSavings.map((item) => item.amount), 1);

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Monthly Spending</h3>
          <span className="text-xs text-slate-400 dark:text-slate-500">Last 6 months</span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-3">
            {monthlySpending.length === 0 ? (
              <p className="py-6 text-sm text-slate-400 dark:text-slate-500">No spending data yet.</p>
            ) : (
              monthlySpending.map((item) => (
                <div key={item.key}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">{formatCurrency(item.amount)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-400 to-orange-400"
                      style={{ width: `${(item.amount / maxSpend) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200">By Category</h4>
            {categories.length === 0 ? (
              <p className="py-6 text-sm text-slate-400 dark:text-slate-500">No category data yet.</p>
            ) : (
              categories.map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-950/40">
                  <span className="text-sm text-slate-600 dark:text-slate-300">{category}</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{formatCurrency(amount)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Budget Health</h3>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${HEALTH_STYLES[health]}`}>
            {healthLabel}
          </span>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/40">
            <p className="text-xs text-slate-400 dark:text-slate-500">Spendable Balance</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(spendableBalance)}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/40">
            <p className="text-xs text-slate-400 dark:text-slate-500">Monthly Savings</p>
            <p className="mt-1 text-xl font-semibold text-emerald-700 dark:text-teal-300">
              {formatCurrency(totalGoalSavings)}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Saved into goals so far
            </p>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">Monthly Goal Savings</p>
            <div className="space-y-2">
              {monthlyGoalSavings.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-slate-500">No goal savings yet.</p>
              ) : (
                monthlyGoalSavings.map((item) => (
                  <div key={item.key}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">{item.label}</span>
                      <span className="font-medium text-slate-700 dark:text-slate-200">{formatCurrency(item.amount)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                        style={{ width: `${(item.amount / maxSaved) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SpendingInsights;
