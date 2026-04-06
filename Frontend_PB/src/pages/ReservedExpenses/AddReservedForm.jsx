// src/pages/ReservedExpenses/AddReservedForm.jsx
import React, { useState } from 'react';
import { addReserved } from '../../services/reservedService';
import InputField from '../../components/InputField';

const AddReservedForm = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount || !dueDate) return;
    setLoading(true);
    await addReserved({ title, amount: parseFloat(amount), dueDate });
    setTitle(''); setAmount(''); setDueDate('');
    if (onSuccess) onSuccess();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end bg-white p-4 rounded-xl shadow-sm">
      <InputField placeholder="Title (e.g., Rent)" value={title} onChange={e => setTitle(e.target.value)} />
      <InputField type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
      <InputField type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
      <button type="submit" disabled={loading} className="bg-emerald-600 text-white px-5 py-2 rounded-xl">+ Add Reserved</button>
    </form>
  );
};

export default AddReservedForm;