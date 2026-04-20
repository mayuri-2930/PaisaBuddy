import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser, logoutUser } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
  if (token) {
    const storedUser = localStorage.getItem('user');

    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.log("Invalid user in storage");
        localStorage.removeItem('user');
      }
    }
  }
}, [token]);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    setToken(data.token);
    setUser(data.user || null);

    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
  };

  const register = async (userData) => {
    const data = await registerUser(userData);
    setToken(data.token);
    setUser(data.user || null);

    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
  };

  const logout = () => {
    logoutUser();
    setToken(null);
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
