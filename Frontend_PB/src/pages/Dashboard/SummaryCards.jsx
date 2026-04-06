// src/pages/Dashboard/SummaryCards.jsx
import React from 'react';
import { categoryColors, getCategoryIcon } from '../../utils/categoryColors';
import { formatCurrency } from '../../utils/dateFormatter';

const SummaryCards = ({ categoryTotals, totalExpenses }) => {
  const categories = ['Food', 'Rent', 'Travel', 'Leisure', 'Internet', 'Other'];
  
  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <h3 className="font-semibold text-gray-800 mb-3">Expense Breakdown</h3>
      <div className="space-y-3">
        {categories.map(cat => {
          const Icon = getCategoryIcon(cat);
          const color = categoryColors[cat] || categoryColors.Other;
          const amount = categoryTotals[cat] || 0;
          const percent = totalExpenses ? (amount / totalExpenses * 100).toFixed(0) : 0;
          return (
            <div key={cat} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color.bg} ${color.text}`}>
                  <Icon size={14} />
                </div>
                <span className="text-sm font-medium">{cat}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{formatCurrency(amount)}</p>
                <p className="text-xs text-gray-400">{percent}%</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SummaryCards;