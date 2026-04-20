import React from 'react';
import Card from '../../components/Card';
import { formatCurrency, formatDate } from '../../utils/dateFormatter';

const GoalProgressCard = ({ goals, totalSavedAcrossGoals }) => {
  const topGoals = goals.slice(0, 3);

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Goal Progress</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Total saved across goals: {formatCurrency(totalSavedAcrossGoals)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {topGoals.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500">No goals created yet.</p>
        ) : (
          topGoals.map((goal) => (
            <div key={goal.id}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-100">{goal.title}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Saved {formatCurrency(goal.totalSaved || 0)}
                    {goal.targetDate ? ` • Due ${formatDate(goal.targetDate)}` : ''}
                  </p>
                </div>
                <span className="text-sm font-semibold text-emerald-700 dark:text-teal-300">
                  {Math.round(goal.progressPercent || 0)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                  style={{ width: `${Math.min(goal.progressPercent || 0, 100)}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default GoalProgressCard;
