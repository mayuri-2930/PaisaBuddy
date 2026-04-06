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
    <aside className="w-64 bg-white/60 backdrop-blur-sm border-r border-emerald-100/50 hidden md:block shrink-0 shadow-sm">
      <div className="sticky top-16 p-4 space-y-1">
        <div className="px-3 py-2 mb-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider">Main</div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-gray-600 hover:bg-emerald-50/50 hover:text-emerald-600'
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
        <div className="pt-4 mt-4 border-t border-emerald-100">
          <div className="px-3 py-2 text-xs text-gray-400">Quick add</div>
          <NavLink to="/transactions" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-emerald-50">
            <PlusCircle size={18} /> Add Transaction
          </NavLink>
          <NavLink to="/reserved" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-emerald-50">
            <Wallet size={18} /> Add Reserved
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;