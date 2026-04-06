import React from 'react';

const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-emerald-50/50 p-5 transition-all duration-200 ${hover ? 'hover:shadow-lg hover:-translate-y-0.5' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;