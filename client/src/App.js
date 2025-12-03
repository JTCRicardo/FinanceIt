import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';
import BudgetEntry from './Pages/BudgetEntry';
import BudgetEntriesDisplay from './Pages/BudgetEntriesDisplay';
import Settings from './Pages/Settings';
import Profile from './Pages/Profile';
import Home from './Pages/Home';
import './App.css';
import InventoryLog from './Pages/InventoryLog';
import InventoryLogDisplay from './Pages/InventoryLogDisplay';
import PayrollEntry from './Pages/PayrollEntry';
import PayrollDisplay from './Pages/PayrollDisplay';
//so we're using react router to setup multiple homepages
//human written file
function App() {
  return (
    <Router>
      <Routes>
        {/* current homepage */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/budget-entry" element={<BudgetEntry />} />
        <Route path="/budget-entries" element={<BudgetEntriesDisplay />} />
        <Route path="/inventory-log" element={<InventoryLog />} />
        <Route path="/inventory-logs" element={<InventoryLogDisplay />} />
        <Route path="/payroll-entry" element={<PayrollEntry />} />
        <Route path="/payroll" element={<PayrollDisplay />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
