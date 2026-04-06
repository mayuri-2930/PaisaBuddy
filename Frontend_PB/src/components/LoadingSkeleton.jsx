// src/components/LoadingSkeleton.jsx
import React from 'react';

const LoadingSkeleton = ({ type = 'card', count = 3 }) => {
  if (type === 'transaction') {
    return (
      <div className="space-y-3">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-100 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="w-16 h-5 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;