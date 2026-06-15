// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { loginUser, registerUser, logoutUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored && stored !== 'undefined' ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const login = async (email, password) => {
    const { user: u } = await loginUser(email, password);
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  const register = async (payload) => {
    const { user: u } = await registerUser(payload);
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  // Issue 2: updateUser saves name/profile changes back to state + localStorage
  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);