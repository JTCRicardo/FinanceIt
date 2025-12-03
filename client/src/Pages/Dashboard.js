import React, { useState, useEffect } from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const { signOut, session } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    growthRate: 0,
    revenueChange: 0,
    expenseChange: 0,
    profitChange: 0,
    budgetEntryCount: 0,
    inventoryItemCount: 0,
    employeeCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = await session?.getToken();
        if (!token) return;

        // Fetch all data in parallel
        const [budgetRes, inventoryRes, employeesRes, transactionsRes] = await Promise.all([
          fetch('http://localhost:5001/api/budget-entries', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('http://localhost:5001/api/inventory-log', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('http://localhost:5001/api/employees', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('http://localhost:5001/api/transactions', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const budgetData = await budgetRes.json();
        const inventoryData = await inventoryRes.json();
        const employeesData = await employeesRes.json();
        const transactionsData = await transactionsRes.json();

        console.log('Dashboard data loaded:', {
          transactions: transactionsData,
          budget: budgetData,
          inventory: inventoryData,
          employees: employeesData,
          employeeCount: employeesData.count
        });

        // Calculate statistics
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        // Calculate revenue from transactions (sold items)
        let currentRevenue = 0;
        let lastMonthRevenue = 0;
        
        if (transactionsData.success) {
          const transactions = transactionsData.data;
          
          // Current month transactions
          const currentMonthTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate.getMonth() === currentMonth && 
                   transactionDate.getFullYear() === currentYear &&
                   transaction.transactionType === 'sale';
          });

          // Last month transactions
          const lastMonthTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate.getMonth() === lastMonth && 
                   transactionDate.getFullYear() === lastMonthYear &&
                   transaction.transactionType === 'sale';
          });

          currentRevenue = currentMonthTransactions.reduce((sum, transaction) => sum + transaction.totalRevenue, 0);
          lastMonthRevenue = lastMonthTransactions.reduce((sum, transaction) => sum + transaction.totalRevenue, 0);
          
          console.log('Revenue calculation:', {
            currentMonthTransactions: currentMonthTransactions.length,
            lastMonthTransactions: lastMonthTransactions.length,
            currentRevenue,
            lastMonthRevenue
          });
        }

        // Calculate expenses from budget entries
        let currentExpenses = 0;
        let lastMonthExpenses = 0;
        
        if (budgetData.success) {
          const entries = budgetData.data;
          
          // Current month entries
          const currentMonthEntries = entries.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
          });

          // Last month entries
          const lastMonthEntries = entries.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.getMonth() === lastMonth && entryDate.getFullYear() === lastMonthYear;
          });

          // For expenses, consider specific categories as expenses
          const expenseCategories = ['Transportation', 'Rent', 'Utilities', 'Other'];
          currentExpenses = currentMonthEntries
            .filter(entry => expenseCategories.includes(entry.category))
            .reduce((sum, entry) => sum + (entry.cost * entry.amount), 0);
          
          lastMonthExpenses = lastMonthEntries
            .filter(entry => expenseCategories.includes(entry.category))
            .reduce((sum, entry) => sum + (entry.cost * entry.amount), 0);
        }

        const netProfit = currentRevenue - currentExpenses;
        const lastMonthProfit = lastMonthRevenue - lastMonthExpenses;

        // Calculate percentage changes
        const revenueChange = lastMonthRevenue > 0 
          ? ((currentRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
          : 0;
        
        const expenseChange = lastMonthExpenses > 0
          ? ((currentExpenses - lastMonthExpenses) / lastMonthExpenses * 100).toFixed(1)
          : 0;
        
        const profitChange = lastMonthProfit > 0
          ? ((netProfit - lastMonthProfit) / lastMonthProfit * 100).toFixed(1)
          : 0;

        const growthRate = lastMonthRevenue > 0
          ? ((currentRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
          : 0;

        setStats({
          totalRevenue: currentRevenue,
          totalExpenses: currentExpenses,
          netProfit: netProfit,
          growthRate: growthRate,
          revenueChange: revenueChange,
          expenseChange: expenseChange,
          profitChange: profitChange,
          budgetEntryCount: budgetData.success ? budgetData.data.length : 0,
          inventoryItemCount: inventoryData.success ? inventoryData.data.length : 0,
          employeeCount: employeesData.success ? employeesData.count : 0
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session]);

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // User display information (teammate's approach)
  const userName = user?.username || user?.firstName || 'there';
  const userInitial = user?.username?.charAt(0).toUpperCase() || 
                      user?.firstName?.charAt(0).toUpperCase() || 
                      user?.emailAddresses?.[0]?.emailAddress?.charAt(0).toUpperCase() || 'U';
  const displayName = user?.username || user?.emailAddresses?.[0]?.emailAddress || 'User';

  // Feature cards with real stats (merged both approaches)
  const features = [
    {
      id: 'budget',
      icon: '💰',
      title: 'Budget Entry',
      description: 'Track your income and expenses with detailed budget entries and categories.',
      route: '/budget-entry',
      className: 'budget',
      statLabel: 'Budget Entries',
      statValue: stats.budgetEntryCount
    },
    {
      id: 'inventory',
      icon: '📦',
      title: 'Inventory Logging',
      description: 'Track and manage your business inventory, stock levels, and product movements.',
      route: '/inventory-log',
      className: 'inventory',
      statLabel: 'Items in Stock',
      statValue: stats.inventoryItemCount
    },
    {
      id: 'payroll',
      icon: '💼',
      title: 'Payroll Management',
      description: 'Manage employee salaries, hourly rates, and payroll processing efficiently.',
      route: '/payroll',
      className: 'payroll',
      statLabel: 'Employees',
      statValue: stats.employeeCount
    },
    {
      id: 'visualizations',
      icon: '📊',
      title: 'Visualizations',
      description: 'Create charts and graphs to visualize your budget and financial data.',
      route: '/visualizations',
      className: 'visualizations',
      statLabel: 'Reports',
      statValue: '12'
    }
  ];

  return (
    <div className="dashboard-page">
      {/* Navigation Bar - Teammate's cleaner layout */}
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

      {/* Main Content - Original layout restored */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Welcome Section */}
          <div className="welcome-section">
            <div>
              <h1 className="welcome-title">
                Welcome back, {userName}! 👋
              </h1>
              <p className="welcome-subtitle">
                Here's what's happening with your finances today
              </p>
            </div>
            <button className="btn-primary" onClick={() => navigate('/budget-entry')}>
              <span>➕</span> Quick Entry
            </button>
          </div>

          {/* Stats Overview - Large cards with icons */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                💵
              </div>
              <div className="stat-content">
                <p className="stat-label">Total Revenue</p>
                <h3 className="stat-value">
                  {loading ? '...' : `$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </h3>
                <span className={`stat-change ${stats.revenueChange >= 0 ? 'stat-positive' : 'stat-negative'}`}>
                  {stats.revenueChange >= 0 ? '↑' : '↓'} {Math.abs(stats.revenueChange)}% from last month
                </span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                💸
              </div>
              <div className="stat-content">
                <p className="stat-label">Total Expenses</p>
                <h3 className="stat-value">
                  {loading ? '...' : `$${stats.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </h3>
                <span className={`stat-change ${stats.expenseChange >= 0 ? 'stat-negative' : 'stat-positive'}`}>
                  {stats.expenseChange >= 0 ? '↑' : '↓'} {Math.abs(stats.expenseChange)}% from last month
                </span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}>
                💰
              </div>
              <div className="stat-content">
                <p className="stat-label">Net Profit</p>
                <h3 className="stat-value">
                  {loading ? '...' : `$${stats.netProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </h3>
                <span className={`stat-change ${stats.profitChange >= 0 ? 'stat-positive' : 'stat-negative'}`}>
                  {stats.profitChange >= 0 ? '↑' : '↓'} {Math.abs(stats.profitChange)}% from last month
                </span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                📈
              </div>
              <div className="stat-content">
                <p className="stat-label">Growth Rate</p>
                <h3 className="stat-value">
                  {loading ? '...' : `${stats.growthRate}%`}
                </h3>
                <span className={`stat-change ${stats.growthRate >= 0 ? 'stat-positive' : 'stat-negative'}`}>
                  {stats.growthRate >= 0 ? '↑' : '↓'} Revenue growth rate
                </span>
              </div>
            </div>
          </div>

          {/* Feature Cards - Quick Access */}
          <div className="section-header">
            <h2 className="section-title">Quick Access</h2>
            <p className="section-subtitle">Navigate to your most-used features</p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="feature-card"
                onClick={() => navigate(feature.route)}
                onMouseEnter={() => setHoveredCard(feature.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ '--card-color': feature.id === 'budget' ? '#10b981' : feature.id === 'inventory' ? '#f59e0b' : feature.id === 'payroll' ? '#6366f1' : '#ec4899' }}
              >
                <div className="feature-card-header">
                  <div className="feature-icon" style={{ 
                    background: `linear-gradient(135deg, ${feature.id === 'budget' ? '#10b981' : feature.id === 'inventory' ? '#f59e0b' : feature.id === 'payroll' ? '#6366f1' : '#ec4899'}, ${feature.id === 'budget' ? '#059669' : feature.id === 'inventory' ? '#d97706' : feature.id === 'payroll' ? '#4f46e5' : '#db2777'})` 
                  }}>
                    <span>{feature.icon}</span>
                  </div>
                  <div className="feature-badge" style={{ 
                    background: `${feature.id === 'budget' ? '#10b981' : feature.id === 'inventory' ? '#f59e0b' : feature.id === 'payroll' ? '#6366f1' : '#ec4899'}22`, 
                    color: feature.id === 'budget' ? '#10b981' : feature.id === 'inventory' ? '#f59e0b' : feature.id === 'payroll' ? '#6366f1' : '#ec4899' 
                  }}>
                    {feature.statValue}
                  </div>
                </div>
                
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                
                <div className="feature-footer">
                  <span className="feature-stat-label">{feature.statLabel}</span>
                  <span className="feature-arrow">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
