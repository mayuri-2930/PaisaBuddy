// src/pages/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import { Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full max-w-md border border-emerald-100">
        <div className="text-center mb-6"><div className="w-12 h-12 bg-emerald-600 rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-xl">P</div><h2 className="text-2xl font-bold mt-3">Welcome back</h2><p className="text-gray-500 text-sm">Sign in to PAISABUDDY</p></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField icon={Mail} placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <InputField icon={Lock} placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-xl font-semibold hover:bg-emerald-700">Login</button>
        </form>
        <p className="text-center text-sm mt-6">Don't have an account? <Link to="/register" className="text-emerald-600 font-medium">Sign up</Link></p>
      </div>
    </div>
  );
};

export default Login;