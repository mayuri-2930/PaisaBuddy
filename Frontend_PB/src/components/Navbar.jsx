// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, LogOut, User, ChevronDown } from 'lucide-react';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-30 shadow-sm">
      <div className="px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-emerald-50 transition lg:hidden"
          >
            {sidebarOpen ? <X size={20} className="text-emerald-700" /> : <Menu size={20} className="text-emerald-700" />}
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-bottom-right from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-right from-emerald-800 to-teal-700 bg-clip-text text-transparent">PAISABUDDY</span>
          </Link>
          <div className="hidden md:flex ml-6 space-x-1">
            {['Dashboard', 'Transactions', 'Reserved', 'Investments', 'Profile'].map((item) => (
              <Link key={item} to={item === 'Dashboard' ? '/' : `/${item.toLowerCase()}`} className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 transition">
                {item}
              </Link>
            ))}
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2 p-1.5 rounded-full hover:bg-emerald-50 transition">
            <div className="w-8 h-8 rounded-full bg-gradient-to-bottomright from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <ChevronDown size={16} className="text-gray-500 hidden sm:block" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
              <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50" onClick={() => setShowDropdown(false)}>
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