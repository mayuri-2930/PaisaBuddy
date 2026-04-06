import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import DashboardPage from "./pages/Dashboard/Dashboard";
import TransactionPage from "./pages/Transactions/TransactionPage";
import ReservedPage from "./pages/ReservedExpenses/ReservedPage";
import InvestmentPage from "./pages/Investments/InvestmentPage";
import ProfilePage from "./pages/Profile/ProfilePage";

// Context (optional)
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionPage />} />
          <Route path="/reserved" element={<ReservedPage />} />
          <Route path="/investments" element={<InvestmentPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;