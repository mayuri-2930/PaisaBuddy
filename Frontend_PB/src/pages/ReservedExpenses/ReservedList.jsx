// src/pages/ReservedExpenses/ReservedList.jsx
import React from 'react';
import ReservedCard from '../../components/ReservedCard';

const ReservedList = ({ reserved, onPay, onDelete }) => {
  if (reserved.length === 0) return <div className="py-12 text-center text-slate-400 dark:text-slate-500">No reserved expenses. Add a new one!</div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {reserved.map(r => <ReservedCard key={r.id} reserved={r} onPay={onPay} onDelete={onDelete} />)}
    </div>
  );
};

export default ReservedList;
