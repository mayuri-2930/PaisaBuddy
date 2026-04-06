// src/pages/ReservedExpenses/ReservedList.jsx
import React from 'react';
import ReservedCard from '../../components/ReservedCard';

const ReservedList = ({ reserved, onPay, onDelete }) => {
  if (reserved.length === 0) return <div className="text-center py-12 text-gray-400">No reserved expenses. Add a new one!</div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {reserved.map(r => <ReservedCard key={r.id} reserved={r} onPay={onPay} onDelete={onDelete} />)}
    </div>
  );
};

export default ReservedList;