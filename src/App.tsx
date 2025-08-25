import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Standalone Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import TermsOfService from './pages/TermsOfService';
import ForgotPassword from './pages/ForgotPassword'; // New
import ResetPassword from './pages/ResetPassword'; // New

// User Pages
import UserDashboard from './pages/UserDashboard';
import Portfolio from './pages/Portfolio';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/admin/Users';
import UserDetail from './pages/admin/UserDetail';
import AdminInvestments from './pages/admin/Investments';
import AdminReports from './pages/admin/Reports';
import AdminEmail from './pages/admin/Email';
import AdminSettings from './pages/admin/Settings';
import AddUser from './pages/admin/AddUser'; // New

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Standalone Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* New */}
          <Route path="/reset-password" element={<ResetPassword />} /> {/* New */}
          
          {/* User Routes with Layout */}
          <Route element={<UserLayout />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          
          {/* Admin Routes with Layout */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/add" element={<AddUser />} /> {/* New */}
            <Route path="/admin/users/:id" element={<UserDetail />} />
            <Route path="/admin/investments" element={<AdminInvestments />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/email" element={<AdminEmail />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
