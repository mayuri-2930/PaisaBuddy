// src/pages/ReservedExpenses/ReservedPage.jsx
import React, { useState, useEffect } from 'react';
import { getReservedList, addReserved, markReservedPaid, deleteReserved } from '../../services/reservedService';
import ReservedList from './ReservedList';
import AddReservedForm from './AddReservedForm';
import Card from '../../components/Card';

const ReservedPage = () => {
  const [reserved, setReserved] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const data = await getReservedList();
      setReserved(data || []);
    };
    fetch();
  }, [refresh]);

  const handlePay = async (id) => {
    await markReservedPaid(id);
    setRefresh(prev => prev + 1);
  };

  const handleDelete = async (id) => {
    await deleteReserved(id);
    setRefresh(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Reserved Expenses</h1>
        <AddReservedForm onSuccess={() => setRefresh(prev => prev + 1)} />
      </div>
      <Card>
        <ReservedList reserved={reserved} onPay={handlePay} onDelete={handleDelete} />
      </Card>
    </div>
  );
};

export default ReservedPage;
