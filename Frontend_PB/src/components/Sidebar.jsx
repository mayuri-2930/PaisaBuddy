// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History, CalendarClock, TrendingUp, Settings, Receipt, Wallet } from 'lucide-react';

const Sidebar = ({ sidebarOpen }) => {
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/transactions', icon: Receipt, label: 'Transactions' },
    { path: '/reserved', icon: CalendarClock, label: 'Reserved Expenses' },
    { path: '/investments', icon: TrendingUp, label: 'Investments' },
    { path: '/profile', icon: Settings, label: 'Profile' },
  ];

  if (!sidebarOpen) return null;

  return (
    <aside className="hidden w-64 shrink-0 border-r border-emerald-100/60 bg-white/55 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/45 md:block">
      <div className="sticky top-16 p-4 space-y-1">
        <div className="mb-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-teal-300">Main</div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive ? 'bg-emerald-50 text-emerald-700 shadow-sm dark:bg-slate-800 dark:text-teal-200' : 'text-slate-600 hover:bg-emerald-50/50 hover:text-emerald-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-teal-200'
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
        <div className="mt-4 border-t border-emerald-100 pt-4 dark:border-slate-800">
          <div className="px-3 py-2 text-xs text-slate-400 dark:text-slate-500">Quick add</div>
          <NavLink to="/transactions" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-emerald-50 dark:text-slate-300 dark:hover:bg-slate-800">
            <PlusCircle size={18} /> Add Transaction
          </NavLink>
          <NavLink to="/reserved" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-emerald-50 dark:text-slate-300 dark:hover:bg-slate-800">
            <Wallet size={18} /> Add Reserved
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
