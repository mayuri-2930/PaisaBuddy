// src/pages/Dashboard/DashboardHeader.jsx
import React from 'react';
import { formatCurrency } from '../../utils/dateFormatter';
import { Sparkles, TrendingUp } from 'lucide-react';

const DashboardHeader = ({ userName, remaining }) => {
  return (
    <div className="rounded-2xl bg-[linear-gradient(135deg,#0f766e_0%,#0f9f8f_48%,#2563eb_100%)] p-6 text-white shadow-[0_24px_55px_-24px_rgba(15,118,110,0.8)] dark:bg-[linear-gradient(135deg,#0f172a_0%,#134e4a_42%,#164e63_100%)]">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-emerald-50/90">Welcome back,</p>
          <h1 className="mt-1 text-2xl font-bold">{userName || 'User'} 👋</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-emerald-50/80">
            <Sparkles size={14} />
            Your financial ecosystem is breathing steady today.
          </p>
        </div>
        <div className="rounded-xl bg-white/15 px-4 py-2 text-right backdrop-blur-sm ring-1 ring-white/10">
          <p className="text-xs opacity-80">Remaining Balance</p>
          <p className="text-2xl font-bold">{formatCurrency(remaining)}</p>
          <p className="flex items-center justify-end gap-1 text-xs"><TrendingUp size={12} /> +12% this month</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
