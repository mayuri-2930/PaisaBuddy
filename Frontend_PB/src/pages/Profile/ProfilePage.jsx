// src/pages/Profile/ProfilePage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import ProfileForm from './ProfileForm';
import Card from '../../components/Card';
import { Moon, Sun, Bell, Shield } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Account Settings</h1>
      <ProfileForm user={user} onUpdate={updateUser} />
      <Card>
        <h3 className="mb-4 font-semibold text-slate-800 dark:text-slate-100">Preferences</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between"><div className="flex gap-2 text-slate-700 dark:text-slate-200">{isDark ? <Moon size={18} /> : <Sun size={18} />} {isDark ? 'Dark Interface' : 'Light Interface'}</div><button onClick={toggleTheme} className={`relative h-5 w-10 rounded-full transition ${isDark ? 'bg-teal-500' : 'bg-slate-300'}`}><div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${isDark ? 'right-0.5' : 'left-0.5'}`} /></button></div>
          <div className="flex items-center justify-between"><div className="flex gap-2 text-slate-700 dark:text-slate-200"><Bell size={18} /> Smart Alerts</div><button onClick={() => setNotifications(!notifications)} className={`relative h-5 w-10 rounded-full transition ${notifications ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'}`}><div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white ${notifications ? 'right-0.5' : 'left-0.5'}`} /></button></div>
          <div className="flex justify-between text-slate-600 dark:text-slate-300"><span>Language</span><span className="text-emerald-700 dark:text-teal-300">English (US)</span></div>
          <div className="flex gap-4 pt-2 text-xs text-slate-400 dark:text-slate-500"><Shield size={14} /> Data encrypted with Ethereum Ledger Protocol</div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
