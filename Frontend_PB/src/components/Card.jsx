import React from 'react';

const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={`rounded-2xl border border-emerald-100/70 bg-white/80 p-5 shadow-[0_18px_45px_-24px_rgba(15,118,110,0.35)] backdrop-blur-md transition-all duration-200 dark:border-teal-900/70 dark:bg-slate-900/70 dark:shadow-[0_18px_45px_-24px_rgba(8,145,178,0.45)] ${hover ? 'hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-22px_rgba(15,118,110,0.45)] dark:hover:shadow-[0_24px_55px_-24px_rgba(20,184,166,0.35)]' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
