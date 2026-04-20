// src/pages/Profile/ProfileForm.jsx
import React, { useState } from 'react';
import Card from '../../components/Card';
import InputField from '../../components/InputField';

const ProfileForm = ({ user, onUpdate }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [monthlyIncome, setMonthlyIncome] = useState(user?.monthlyIncome || 125000);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // simulate update
    onUpdate({ name, email, monthlyIncome });
    setTimeout(() => setSaving(false), 500);
  };

  return (
    <Card>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-2xl font-bold text-white">{(name || 'U').charAt(0).toUpperCase()}</div>
        <div><h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{name || 'User'}</h2><p className="text-slate-500 dark:text-slate-400">{email}</p><span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 dark:bg-teal-950/60 dark:text-teal-300">PREMIUM MEMBER</span></div>
      </div>
      <div className="space-y-4">
        <InputField label="Full Name" value={name} onChange={e => setName(e.target.value)} />
        <InputField label="Email Address" value={email} onChange={e => setEmail(e.target.value)} />
        <InputField label="Monthly Income Strategy" type="number" value={monthlyIncome} onChange={e => setMonthlyIncome(e.target.value)} />
        <button onClick={handleSave} disabled={saving} className="rounded-xl bg-emerald-600 px-6 py-2 text-white hover:bg-emerald-700 dark:bg-teal-500 dark:hover:bg-teal-400">Update Profile</button>
      </div>
    </Card>
  );
};

export default ProfileForm;
