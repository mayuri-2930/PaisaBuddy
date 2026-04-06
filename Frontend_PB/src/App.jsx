import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard/Dashboard';
import TransactionPage from './pages/Transactions';
import ReservedPage from './pages/ReservedExpenses';
import InvestmentPage from './pages/Investments';
import ProfilePage from './pages/Profile';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1">
        <Sidebar sidebarOpen={sidebarOpen} />
        <main className="flex-1 transition-all duration-300 p-4 md:p-6 lg:p-8 overflow-x-auto">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

function AppRoutes() {
  const { token } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
      <Route path="/" element={
        <ProtectedRoute>
          <AppLayout><Dashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/transactions" element={
        <ProtectedRoute>
          <AppLayout><TransactionPage /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/reserved" element={
        <ProtectedRoute>
          <AppLayout><ReservedPage /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/investments" element={
        <ProtectedRoute>
          <AppLayout><InvestmentPage /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <AppLayout><ProfilePage /></AppLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;