import React, { useState } from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const userName = user?.username || user?.firstName || 'there';
  const userInitial = user?.username?.charAt(0).toUpperCase() || 
                      user?.firstName?.charAt(0).toUpperCase() || 
                      user?.emailAddresses?.[0]?.emailAddress?.charAt(0).toUpperCase() || 'U';
  const displayName = user?.username || user?.emailAddresses?.[0]?.emailAddress || 'User';

  const features = [
    {
      id: 'budget',
      icon: '💰',
      title: 'Budget Entry',
      description: 'Track your income and expenses with detailed budget entries and categories.',
      route: '/budget-entry',
      className: 'budget'
    },
    {
      id: 'inventory',
      icon: '📦',
      title: 'Inventory Logging',
      description: 'Track and manage your business inventory, stock levels, and product movements.',
      route: '/inventory-log',
      className: 'inventory'
    },
    {
      id: 'payroll',
      icon: '💼',
      title: 'Payroll Management',
      description: 'Manage employee salaries, hourly rates, and payroll processing efficiently.',
      route: '/payroll',
      className: 'payroll'
    },
    {
      id: 'visualizations',
      icon: '📊',
      title: 'Visualizations',
      description: 'Create charts and graphs to visualize your budget and financial data.',
      route: '/visualizations',
      className: 'visualizations'
    }
  ];

  return (
    <div className="dashboard-page">
      {/* Navigation Bar */}
      <nav className="dashboard-navbar">
        <div className="dashboard-brand" onClick={() => navigate('/dashboard')}>
          <img src="/Photos/FinanceITlogo.png" alt="FinanceIT Logo" />
          FinanceIT
        </div>

        <div className="user-dropdown-container">
          <button className="user-dropdown-trigger" onClick={toggleDropdown}>
            <div className="user-avatar">{userInitial}</div>
            {displayName}
            <span className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}>▼</span>
          </button>

          {showDropdown && (
            <div className="user-dropdown-menu">
              <div className="dropdown-header">
                <div className="dropdown-username">{user?.username || 'User'}</div>
                <div className="dropdown-email">{user?.emailAddresses?.[0]?.emailAddress}</div>
              </div>
              <button
                className="dropdown-item"
                onClick={() => {
                  setShowDropdown(false);
                  navigate('/settings');
                }}
              >
                ⚙️ Settings
              </button>
              <button
                className="dropdown-item"
                onClick={() => {
                  setShowDropdown(false);
                  navigate('/profile');
                }}
              >
                👤 Profile
              </button>
              <div className="dropdown-divider" />
              <button className="dropdown-item danger" onClick={handleSignOut}>
                🚪 Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-greeting">Welcome back, {userName}!</h1>
          <p className="dashboard-subtext">What would you like to manage today?</p>
        </div>

        <div className="feature-cards-grid">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`feature-card ${feature.className}`}
              onClick={() => navigate(feature.route)}
            >
              <span className="feature-card-icon">{feature.icon}</span>
              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-card-description">{feature.description}</p>
              <span className="feature-card-arrow">→</span>
            </div>
          ))}
        </div>

        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-value">4</div>
            <div className="stat-label">Active Modules</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">—</div>
            <div className="stat-label">Budget Entries</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">—</div>
            <div className="stat-label">Inventory Items</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">—</div>
            <div className="stat-label">Employees</div>
          </div>
        </div>
      </div>
    </div>
  );
}
