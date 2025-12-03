import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './Visualizations.css';

export default function Visualizations() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    avgMonthlyIncome: 0,
    avgMonthlyExpenses: 0
  });

  const COLORS = ['#10b981', '#ef4444', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        // Fetch BOTH Budget Entries and Inventory Sales Transactions
        const [budgetRes, salesRes] = await Promise.all([
          fetch('http://localhost:5001/api/budget-entries', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('http://localhost:5001/api/transactions?type=sale', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const budgetData = await budgetRes.json();
        const salesData = await salesRes.json();

        if (budgetData.success) {
          // Pass both datasets to the processor
          processData(
            budgetData.data || [], 
            salesData.success ? (salesData.data || []) : []
          );
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getToken]);

  const processData = (budgetEntries, salesTransactions) => {
    const monthlyMap = {};
    const categoryMap = {};
    let totalIncome = 0;
    let totalExpenses = 0;

    // Helper to init month object
    const initMonth = (key, name) => {
      if (!monthlyMap[key]) {
        monthlyMap[key] = { month: name, income: 0, expenses: 0, profit: 0 };
      }
    };

    // 1. Process Budget Entries
    budgetEntries.forEach(entry => {
      const date = new Date(entry.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      initMonth(monthKey, monthName);

      const amount = entry.cost * entry.amount;
      const isIncome = entry.entryType === 'income' || entry.category === 'Income';

      if (isIncome) {
        monthlyMap[monthKey].income += amount;
        totalIncome += amount;
      } else {
        monthlyMap[monthKey].expenses += amount;
        totalExpenses += amount;
        
        // Track expense categories
        if (!categoryMap[entry.category]) {
          categoryMap[entry.category] = 0;
        }
        categoryMap[entry.category] += amount;
      }
    });

    // 2. Process Sales Transactions (From Inventory)
    // These are ALWAYS Income
    salesTransactions.forEach(sale => {
      const date = new Date(sale.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

      initMonth(monthKey, monthName);

      // Inventory transaction structure: unitPrice * quantity
      // Adjust property names based on your actual transaction object if they differ
      const amount = (sale.totalRevenue) ? sale.totalRevenue : (sale.unitPrice * sale.quantity);
      
      monthlyMap[monthKey].income += amount;
      totalIncome += amount;
    });

    // 3. Final Calculations
    Object.values(monthlyMap).forEach(month => {
      month.profit = month.income - month.expenses;
    });

    // Sort by date (last 6 months)
    const sortedMonthly = Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([_, data]) => data);

    const categoryArray = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value
    }));

    const monthCount = sortedMonthly.length || 1;

    setMonthlyData(sortedMonthly);
    setCategoryData(categoryArray);
    setSummaryStats({
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
      avgMonthlyIncome: totalIncome / monthCount,
      avgMonthlyExpenses: totalExpenses / monthCount
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="visualizations-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="visualizations-page">
      <div className="visualizations-container">
        {/* Header */}
        <div className="viz-header">
          <div>
            <h1>📊 Financial Visualizations</h1>
            <p>Combined insights from Budget & Inventory Sales</p>
          </div>
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card income">
            <span className="summary-icon">💵</span>
            <div className="summary-content">
              <p className="summary-label">Total Income</p>
              <h3 className="summary-value">{formatCurrency(summaryStats.totalIncome)}</h3>
              <span className="summary-sub">Avg: {formatCurrency(summaryStats.avgMonthlyIncome)}/mo</span>
            </div>
          </div>
          <div className="summary-card expenses">
            <span className="summary-icon">💸</span>
            <div className="summary-content">
              <p className="summary-label">Total Expenses</p>
              <h3 className="summary-value">{formatCurrency(summaryStats.totalExpenses)}</h3>
              <span className="summary-sub">Avg: {formatCurrency(summaryStats.avgMonthlyExpenses)}/mo</span>
            </div>
          </div>
          <div className="summary-card profit">
            <span className="summary-icon">📈</span>
            <div className="summary-content">
              <p className="summary-label">Net Profit</p>
              <h3 className={`summary-value ${summaryStats.netProfit >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(summaryStats.netProfit)}
              </h3>
              <span className="summary-sub">
                {summaryStats.totalIncome > 0 
                  ? `${((summaryStats.netProfit / summaryStats.totalIncome) * 100).toFixed(1)}% margin`
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Monthly Trend Chart */}
          <div className="chart-card full-width">
            <h3 className="chart-title">Monthly Income vs Expenses</h3>
            <div className="chart-container">
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                    <XAxis dataKey="month" stroke="#8b949e" />
                    <YAxis stroke="#8b949e" tickFormatter={(v) => `$${v}`} />
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#c9d1d9' }}
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data">No data available. Add budget entries or sales to see trends.</div>
              )}
            </div>
          </div>

          {/* Profit Trend Line Chart */}
          <div className="chart-card">
            <h3 className="chart-title">Profit Trend</h3>
            <div className="chart-container">
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                    <XAxis dataKey="month" stroke="#8b949e" />
                    <YAxis stroke="#8b949e" tickFormatter={(v) => `$${v}`} />
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#c9d1d9' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="#f59e0b" 
                      strokeWidth={3}
                      dot={{ fill: '#f59e0b', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data">No data available</div>
              )}
            </div>
          </div>

          {/* Expense Breakdown Pie Chart */}
          <div className="chart-card">
            <h3 className="chart-title">Expense Breakdown</h3>
            <div className="chart-container">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ backgroundColor: '#161b22', borderColor: '#30363d', color: '#c9d1d9' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data">No expense data available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}