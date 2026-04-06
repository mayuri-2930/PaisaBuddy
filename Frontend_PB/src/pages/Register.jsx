// src/pages/Register.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import { User, Mail, Lock, DollarSign } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ name, email, password, monthlyIncome: parseFloat(monthlyIncome) });
      navigate('/');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
      <div className="bg-white/80 rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-3 mt-4">
          <InputField icon={User} placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
          <InputField icon={Mail} placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <InputField icon={Lock} placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <InputField icon={DollarSign} placeholder="Monthly Income (₹)" type="number" value={monthlyIncome} onChange={e => setMonthlyIncome(e.target.value)} required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-xl font-semibold">Sign Up</button>
        </form>
        <p className="text-center text-sm mt-4">Already have an account? <Link to="/login" className="text-emerald-600">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;