// src/components/InputField.jsx
import React from 'react';

const InputField = ({ label, type = 'text', value, onChange, placeholder, error, icon: Icon, required = false }) => {
  return (
    <div className="mb-4">
      {label && <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">{label} {required && <span className="text-rose-500">*</span>}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-xl border px-4 py-2.5 text-slate-800 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-teal-400 ${error ? 'border-red-300 bg-red-50 dark:border-red-500/70 dark:bg-red-950/30' : 'border-slate-200 bg-white/80 dark:border-slate-700 dark:bg-slate-900/80'} ${Icon ? 'pl-10' : ''}`}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
