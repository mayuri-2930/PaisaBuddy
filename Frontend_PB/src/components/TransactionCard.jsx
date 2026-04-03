import React from "react";

const categoryColors = {
  Food: "bg-yellow-600",
  Transport: "bg-blue-600",
  Entertainment: "bg-pink-600",
  Default: "bg-gray-600",
};

export function TransactionCard({ transaction, onDelete }) {
  const catColor = categoryColors[transaction.category] || categoryColors.Default;

  return (
    <div className="bg-purple-200 hover:bg-purple-400 p-4 rounded-lg mb-3 shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-white">{transaction.title}</h3>
          <span className={`px-2 py-0.5 rounded text-white text-sm ${catColor}`}>
            {transaction.category}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold text-white">${transaction.amount}</span>
          <button
            onClick={() => onDelete(transaction.id)}
            className="bg-red-50 hover:bg-red-300 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}