import React from 'react';
import InvestmentCard from './InvestmentCard';
import { TrendingUp, Shield, AlertCircle } from 'lucide-react';

const InvestmentPage = () => {
  const suggestions = [
    { name: 'Index Fund SIP', desc: 'Nifty 50 Equal Weight Index Fund for long-term compounding.', amount: '₹15,000/mo', risk: 'Moderate', icon: TrendingUp, color: 'emerald' },
    { name: 'Corporate FD', desc: 'Stable returns with HDFC Senior Citizen Special Tenure.', amount: '₹1,00,000 once', risk: 'Low', icon: Shield, color: 'blue' },
    { name: 'Emergency Fund', desc: 'Liquid funds to cover 6 months of expenses.', amount: '₹25,000/mo', risk: 'Very Low', icon: AlertCircle, color: 'amber' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Investments</h1>
        <div className="rounded-xl bg-white/80 px-4 py-2 shadow-sm dark:bg-slate-900/75">
          <p className="text-xs text-slate-500 dark:text-slate-400">Total Portfolio</p>
          <p className="text-xl font-bold text-emerald-700 dark:text-teal-300">₹4,82,900</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suggestions.map((inv, idx) => <InvestmentCard key={idx} {...inv} />)}
      </div>
      <div className="rounded-2xl bg-white/80 p-5 shadow-md dark:bg-slate-900/75">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">Suggested Portfolio Mix</h3>
        <div className="flex gap-4 mt-3 text-sm">
          <span className="px-3 py-1 bg-emerald-100 rounded-full text-emerald-700">Equity 60%</span>
          <span className="px-3 py-1 bg-blue-100 rounded-full text-blue-700">Debt 30%</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-200">Others 10%</span>
        </div>
      </div>
    </div>
  );
};

export default InvestmentPage;
