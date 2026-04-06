// src/components/ReservedCard.jsx
import React from 'react';
import { formatCurrency, formatDate } from '../utils/dateFormatter';
import { Clock, CheckCircle, Trash2 } from 'lucide-react';

const ReservedCard = ({ reserved, onPay, onDelete }) => {
  const isOverdue = new Date(reserved.dueDate) < new Date() && reserved.status !== 'PAID';
  
  return (
    <div className={`p-4 rounded-xl border transition-all ${reserved.status === 'PAID' ? 'bg-emerald-50/30 border-emerald-200' : 'bg-white border-gray-100 shadow-sm'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-800">{reserved.title}</h4>
          <p className="text-sm text-gray-500 mt-1">Due: {formatDate(reserved.dueDate)}</p>
          <p className="text-xl font-bold mt-1">{formatCurrency(reserved.amount)}</p>
        </div>
        <div className="flex gap-2">
          {reserved.status !== 'PAID' && (
            <button onClick={() => onPay(reserved.id)} className="p-2 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition">
              <CheckCircle size={18} />
            </button>
          )}
          <button onClick={() => onDelete(reserved.id)} className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 transition">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      {reserved.status === 'PENDING' && (
        <div className={`mt-2 text-xs flex items-center gap-1 ${isOverdue ? 'text-red-500' : 'text-amber-500'}`}>
          <Clock size={12} /> {isOverdue ? 'Overdue' : 'Pending payment'}
        </div>
      )}
      {reserved.status === 'PAID' && <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1"><CheckCircle size={12} /> Paid</div>}
    </div>
  );
};

export default ReservedCard;