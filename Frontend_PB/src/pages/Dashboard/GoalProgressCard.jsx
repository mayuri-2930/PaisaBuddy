import React from 'react';
import Card from '../../components/Card';
import { formatCurrency, formatDate } from '../../utils/dateFormatter';
import { Plus, Lock } from 'lucide-react';

const GoalProgressCard = ({ goals, totalSavedAcrossGoals }) => {
  const topGoals = goals.slice(0, 3);
  const topGoal = topGoals[0];

  return (
    <div className="space-y-4">
      {/* Primary Goal Card */}
      <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 shadow-sm">
        {topGoal ? (
          <>
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-slate-800 dark:text-slate-100">{topGoal.title}</p>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                {Math.round(topGoal.progressPercent || 0)}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 mb-3">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#7B4DB5] to-[#9B6FD0]"
                style={{ width: `${Math.min(topGoal.progressPercent || 0, 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
              <span>Target: {formatCurrency(topGoal.targetAmount || 0)}</span>
              <span>{formatCurrency(topGoal.totalSaved || 0)}</span>
            </div>

            <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#9B3FC8] to-[#C45FE8] py-2.5 text-sm font-semibold text-white shadow hover:opacity-90 transition-opacity">
              <Plus size={15} />
              Add to Savings
            </button>
          </>
        ) : (
          <p className="text-sm text-slate-400">No goals created yet.</p>
        )}
      </div>

      {/* Additional goals if any */}
      {topGoals.slice(1).map(goal => (
        <div key={goal.id} className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{goal.title}</p>
            <span className="text-xs font-semibold text-slate-500">{Math.round(goal.progressPercent || 0)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#7B4DB5] to-[#9B6FD0]"
              style={{ width: `${Math.min(goal.progressPercent || 0, 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default GoalProgressCard;