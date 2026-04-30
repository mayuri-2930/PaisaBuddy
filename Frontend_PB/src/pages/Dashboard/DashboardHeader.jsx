// src/pages/Dashboard/DashboardHeader.jsx
import React from 'react';
import { formatCurrency } from '../../utils/dateFormatter';

const DashboardHeader = ({ userName, remaining }) => {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          Hello, {userName || 'User'} <span>👋</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Welcome back to your digital atelier. Here is your financial landscape for today.
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;