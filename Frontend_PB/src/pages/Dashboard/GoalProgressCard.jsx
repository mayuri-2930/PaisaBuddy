// src/pages/Dashboard/GoalProgressCard.jsx
// FIX: Remove "Add to Savings" button. Clicking the goal card navigates to /transactions (Goal section).
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/dateFormatter';
import { ChevronRight } from 'lucide-react';

const GoalProgressCard = ({ goals, totalSavedAcrossGoals }) => {
  const navigate = useNavigate();
  const topGoals = goals.slice(0, 3);
  const topGoal  = topGoals[0];

  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 shadow-sm cursor-pointer hover:border-purple-200 dark:hover:border-purple-700 transition"
        onClick={() => navigate('/transactions')}
        title="Go to Savings Goals"
      >
        {topGoal ? (
          <>
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-slate-800 dark:text-slate-100">{topGoal.title}</p>
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  {Math.round(topGoal.progressPercent || 0)}%
                </span>
                <ChevronRight size={14} className="text-slate-400" />
              </div>
            </div>

            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 mb-3">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#7B4DB5] to-[#9B6FD0] transition-all"
                style={{ width: `${Math.min(topGoal.progressPercent || 0, 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Target: {formatCurrency(topGoal.targetAmount || 0)}</span>
              <span>Saved: {formatCurrency(topGoal.totalSaved || 0)}</span>
            </div>

            <p className="mt-3 text-xs text-purple-500 dark:text-purple-400 flex items-center gap-1">
              <ChevronRight size={11} /> Tap to manage savings goals
            </p>
          </>
        ) : (
          <div className="text-center py-2">
            <p className="text-sm text-slate-400 mb-2">No goals created yet.</p>
            <p className="text-xs text-purple-500 dark:text-purple-400 flex items-center justify-center gap-1">
              <ChevronRight size={11} /> Tap to create a savings goal
            </p>
          </div>
        )}
      </div>

      {topGoals.slice(1).map(goal => (
        <div
          key={goal.id}
          className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 shadow-sm cursor-pointer hover:border-purple-200 dark:hover:border-purple-700 transition"
          onClick={() => navigate('/transactions')}
        >
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