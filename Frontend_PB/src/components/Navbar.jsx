// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Menu, X, LogOut, User, ChevronDown, Moon, Sun } from 'lucide-react';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const displayName = user?.name || user?.email?.split('@')[0] || 'User';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-30 border-b border-emerald-100/80 bg-white/75 shadow-sm backdrop-blur-md dark:border-teal-900/60 dark:bg-slate-950/70">
      <div className="px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 transition hover:bg-emerald-50 dark:hover:bg-slate-800 lg:hidden"
          >
            {sidebarOpen ? <X size={20} className="text-emerald-700 dark:text-teal-300" /> : <Menu size={20} className="text-emerald-700 dark:text-teal-300" />}
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-bottom-right from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="bg-gradient-to-r from-emerald-800 via-teal-700 to-cyan-700 bg-clip-text text-xl font-bold tracking-tight text-transparent dark:from-emerald-300 dark:via-teal-200 dark:to-cyan-300">PAISABUDDY</span>
          </Link>
          <div className="hidden md:flex ml-6 space-x-1">
            {['Dashboard', 'Transactions', 'Reserved', 'Investments', 'Profile'].map((item) => (
              <Link key={item} to={item === 'Dashboard' ? '/' : `/${item.toLowerCase()}`} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-teal-200">
                {item}
              </Link>
            ))}
          </div>
        </div>
        <div className="relative flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="rounded-full border border-emerald-100 bg-white/80 p-2 text-emerald-700 transition hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-900/90 dark:text-teal-200 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2 rounded-full p-1.5 transition hover:bg-emerald-50 dark:hover:bg-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-bottomright from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <ChevronDown size={16} className="hidden text-slate-500 dark:text-slate-400 sm:block" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-xl border border-emerald-100 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
              <div className="px-4 py-2 text-sm">
                <p className="font-medium text-slate-800 dark:text-slate-100">{displayName}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email || 'Signed in'}</p>
              </div>
              <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 dark:text-slate-200 dark:hover:bg-slate-800" onClick={() => setShowDropdown(false)}>
                <User size={16} /> Profile
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
