// src/components/InputField.jsx
import React from 'react';

const InputField = ({ label, type = 'text', value, onChange, placeholder, error, icon: Icon, required = false }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-rose-500">*</span>}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 rounded-xl border ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition ${Icon ? 'pl-10' : ''}`}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default InputField;