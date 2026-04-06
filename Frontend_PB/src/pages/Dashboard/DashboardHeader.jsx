// src/pages/Dashboard/DashboardHeader.jsx
import React from 'react';
import { formatCurrency } from '../../utils/dateFormatter';
import { TrendingUp } from 'lucide-react';

const DashboardHeader = ({ userName, remaining }) => {
  return (
    <div className="bg-gradient-to-right from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-emerald-100 text-sm">Welcome back,</p>
          <h1 className="text-2xl font-bold mt-1">{userName || 'User'} 👋</h1>
          <p className="text-emerald-100/80 text-sm mt-2">Your financial ecosystem is breathing steady today.</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-right">
          <p className="text-xs opacity-80">Remaining Balance</p>
          <p className="text-2xl font-bold">{formatCurrency(remaining)}</p>
          <p className="text-xs flex items-center gap-1 justify-end"><TrendingUp size={12} /> +12% this month</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;