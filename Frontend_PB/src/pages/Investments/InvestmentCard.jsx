import React from 'react';
import Card from '../../components/Card';

const InvestmentCard = ({ name, desc, amount, risk, icon: Icon, color }) => {
  const colorMap = { emerald: 'bg-emerald-50 text-emerald-700', blue: 'bg-blue-50 text-blue-700', amber: 'bg-amber-50 text-amber-700' };
  return (
    <Card hover className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-xl ${colorMap[color]}`}><Icon size={20} /></div>
        <h3 className="font-bold text-gray-800">{name}</h3>
      </div>
      <p className="text-sm text-gray-500 flex-1">{desc}</p>
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
        <span className="text-emerald-700 font-semibold">{amount}</span>
        <button className="px-4 py-1.5 bg-gray-900 text-white text-sm rounded-full hover:bg-emerald-700 transition">Invest →</button>
      </div>
      <span className="text-xs text-gray-400 mt-2">Risk: {risk}</span>
    </Card>
  );
};

export default InvestmentCard;
