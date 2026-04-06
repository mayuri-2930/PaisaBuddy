// src/pages/Profile/ProfilePage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProfileForm from './ProfileForm';
import Card from '../../components/Card';
import { Moon, Bell, Shield } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
      <ProfileForm user={user} onUpdate={updateUser} />
      <Card>
        <h3 className="font-semibold mb-4">Preferences</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center"><div className="flex gap-2"><Moon size={18} /> Dark Interface</div><button onClick={() => setDarkMode(!darkMode)} className={`w-10 h-5 rounded-full ${darkMode ? 'bg-emerald-600' : 'bg-gray-300'} relative transition`}><div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 ${darkMode ? 'right-0.5' : 'left-0.5'} transition`} /></button></div>
          <div className="flex justify-between items-center"><div className="flex gap-2"><Bell size={18} /> Smart Alerts</div><button onClick={() => setNotifications(!notifications)} className={`w-10 h-5 rounded-full ${notifications ? 'bg-emerald-600' : 'bg-gray-300'} relative transition`}><div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 ${notifications ? 'right-0.5' : 'left-0.5'}`} /></button></div>
          <div className="flex justify-between"><span>Language</span><span className="text-emerald-700">English (US)</span></div>
          <div className="pt-2 text-xs text-gray-400 flex gap-4"><Shield size={14} /> Data encrypted with Ethereum Ledger Protocol</div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;