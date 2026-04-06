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
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">{name.charAt(0)}</div>
        <div><h2 className="text-xl font-semibold">{name}</h2><p className="text-gray-500">{email}</p><span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">PREMIUM MEMBER</span></div>
      </div>
      <div className="space-y-4">
        <InputField label="Full Name" value={name} onChange={e => setName(e.target.value)} />
        <InputField label="Email Address" value={email} onChange={e => setEmail(e.target.value)} />
        <InputField label="Monthly Income Strategy" type="number" value={monthlyIncome} onChange={e => setMonthlyIncome(e.target.value)} />
        <button onClick={handleSave} disabled={saving} className="bg-emerald-600 text-white px-6 py-2 rounded-xl hover:bg-emerald-700">Update Profile</button>
      </div>
    </Card>
  );
};

export default ProfileForm;